package monitoring

import (
	"context"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/redis/go-redis/v9"
	"github.com/robfig/cron/v3"
	"github.com/sirupsen/logrus"

	"vigil/internal/database"
)

// Service handles all monitoring operations
type Service struct {
	db    *database.DB
	redis *redis.Client
	cron  *cron.Cron
	log   *logrus.Logger
}

// NewService creates a new monitoring service
func NewService(db *database.DB, redis *redis.Client) *Service {
	return &Service{
		db:    db,
		redis: redis,
		cron:  cron.New(cron.WithSeconds()),
		log:   logrus.New(),
	}
}

// StartScheduler starts the monitoring scheduler
func (s *Service) StartScheduler() {
	s.log.Info("Starting monitoring scheduler")
	s.cron.Start()

	// Schedule existing monitors
	s.scheduleExistingMonitors()
}

// StopScheduler stops the monitoring scheduler
func (s *Service) StopScheduler() {
	s.log.Info("Stopping monitoring scheduler")
	s.cron.Stop()
}

// scheduleExistingMonitors schedules all active monitors
func (s *Service) scheduleExistingMonitors() {
	var monitors []database.Monitor
	if err := s.db.Where("is_active = ?", true).Find(&monitors).Error; err != nil {
		s.log.Errorf("Failed to load monitors: %v", err)
		return
	}

	for _, monitor := range monitors {
		s.scheduleMonitor(&monitor)
	}
}

// scheduleMonitor schedules a single monitor
func (s *Service) scheduleMonitor(monitor *database.Monitor) {
	// Remove existing schedule if any
	s.cron.Remove(cron.EntryID(monitor.ID))

	// Calculate cron expression based on interval
	cronExpr := s.intervalToCron(monitor.IntervalSeconds)

	_, err := s.cron.AddFunc(cronExpr, func() {
		s.checkMonitor(monitor)
	})

	if err != nil {
		s.log.Errorf("Failed to schedule monitor %d: %v", monitor.ID, err)
		return
	}

	s.log.Infof("Scheduled monitor %d (%s) with interval %ds", monitor.ID, monitor.Name, monitor.IntervalSeconds)
}

// ScheduleMonitor is a public method to schedule a monitor
func (s *Service) ScheduleMonitor(monitor *database.Monitor) {
	s.scheduleMonitor(monitor)
}

// intervalToCron converts interval seconds to cron expression
func (s *Service) intervalToCron(intervalSeconds int) string {
	if intervalSeconds < 60 {
		// Less than 1 minute, run every X seconds
		return fmt.Sprintf("*/%d * * * * *", intervalSeconds)
	} else if intervalSeconds < 3600 {
		// Less than 1 hour, run every X minutes
		minutes := intervalSeconds / 60
		return fmt.Sprintf("0 */%d * * * *", minutes)
	} else {
		// 1 hour or more, run every X hours
		hours := intervalSeconds / 3600
		return fmt.Sprintf("0 0 */%d * * *", hours)
	}
}

// checkMonitor performs a single check on a monitor
func (s *Service) checkMonitor(monitor *database.Monitor) {
	// Check if monitor is still active
	if !monitor.IsActive {
		return
	}

	start := time.Now()
	var status string
	var statusCode int
	var errorMessage string
	var responseBody string

	switch monitor.Type {
	case "http":
		status, statusCode, errorMessage, responseBody = s.checkHTTP(monitor)
	case "ssl":
		status, errorMessage = s.checkSSL(monitor)
		statusCode = 0 // SSL checks don't have HTTP status codes
	case "webhook":
		status, statusCode, errorMessage = s.checkWebhook(monitor)
		responseBody = "" // Webhook checks don't have response body
	default:
		status = "unknown"
		statusCode = 0
		errorMessage = fmt.Sprintf("Unknown monitor type: %s", monitor.Type)
		responseBody = ""
	}

	responseTime := int(time.Since(start).Milliseconds())

	// Create monitor check record
	check := database.MonitorCheck{
		MonitorID:    monitor.ID,
		Status:       status,
		ResponseTime: responseTime,
		StatusCode:   statusCode,
		ErrorMessage: errorMessage,
		ResponseBody: responseBody,
		CheckedAt:    time.Now(),
	}

	if err := s.db.Create(&check).Error; err != nil {
		s.log.Errorf("Failed to save monitor check: %v", err)
		return
	}

	// Check if we need to create an alert
	if status == "down" {
		s.createAlert(monitor, "down", fmt.Sprintf("Monitor %s is down", monitor.Name), "high")
	} else if status == "up" {
		// Resolve any existing down alerts
		s.resolveAlerts(monitor.ID, "down")
	}

	// Cache the latest status
	s.cacheMonitorStatus(monitor.ID, status, responseTime)
}

// checkHTTP performs an HTTP check
func (s *Service) checkHTTP(monitor *database.Monitor) (status string, statusCode int, errorMessage string, responseBody string) {
	client := &http.Client{
		Timeout: time.Duration(monitor.TimeoutSeconds) * time.Second,
	}

	req, err := http.NewRequest("GET", monitor.URL, nil)
	if err != nil {
		return "down", 0, err.Error(), ""
	}

	// Add custom headers if specified
	if monitor.CustomHeaders != "" {
		var headers map[string]string
		if err := json.Unmarshal([]byte(monitor.CustomHeaders), &headers); err == nil {
			for key, value := range headers {
				req.Header.Set(key, value)
			}
		}
	}

	resp, err := client.Do(req)
	if err != nil {
		return "down", 0, err.Error(), ""
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	responseBody = string(body)

	if resp.StatusCode == monitor.ExpectedStatus {
		return "up", resp.StatusCode, "", responseBody
	} else {
		return "down", resp.StatusCode, fmt.Sprintf("Expected status %d, got %d", monitor.ExpectedStatus, resp.StatusCode), responseBody
	}
}

// checkSSL performs an SSL certificate check
func (s *Service) checkSSL(monitor *database.Monitor) (status, errorMessage string) {
	conn, err := tls.Dial("tcp", monitor.URL, nil)
	if err != nil {
		return "down", err.Error()
	}
	defer conn.Close()

	cert := conn.ConnectionState().PeerCertificates[0]
	expiry := cert.NotAfter
	now := time.Now()

	// Check if certificate expires within 30 days
	if expiry.Sub(now) < 30*24*time.Hour {
		return "warning", fmt.Sprintf("SSL certificate expires in %v", expiry.Sub(now))
	}

	return "up", ""
}

// checkWebhook performs a webhook delivery check
func (s *Service) checkWebhook(monitor *database.Monitor) (status string, statusCode int, errorMessage string) {
	// This would typically involve checking webhook delivery status
	// For now, we'll do a simple HTTP check
	status, statusCode, errorMessage, _ = s.checkHTTP(monitor)
	return status, statusCode, errorMessage
}

// createAlert creates a new alert
func (s *Service) createAlert(monitor *database.Monitor, alertType, message, severity string) {
	// Check if there's already an active alert for this monitor and type
	var existingAlert database.Alert
	err := s.db.Where("monitor_id = ? AND type = ? AND resolved_at IS NULL", monitor.ID, alertType).First(&existingAlert).Error

	if err == nil {
		// Alert already exists, don't create duplicate
		return
	}

	alert := database.Alert{
		MonitorID: monitor.ID,
		Type:      alertType,
		Message:   message,
		Severity:  severity,
		CreatedAt: time.Now(),
	}

	if err := s.db.Create(&alert).Error; err != nil {
		s.log.Errorf("Failed to create alert: %v", err)
		return
	}

	// Send notifications
	s.sendNotifications(&alert)
}

// resolveAlerts resolves alerts for a monitor
func (s *Service) resolveAlerts(monitorID uint, alertType string) {
	now := time.Now()
	if err := s.db.Model(&database.Alert{}).
		Where("monitor_id = ? AND type = ? AND resolved_at IS NULL", monitorID, alertType).
		Update("resolved_at", now).Error; err != nil {
		s.log.Errorf("Failed to resolve alerts: %v", err)
	}
}

// sendNotifications sends notifications for an alert
func (s *Service) sendNotifications(alert *database.Alert) {
	// Get notification channels for the organization
	var channels []database.NotificationChannel
	if err := s.db.Where("organization_id = ? AND is_active = ?", alert.Monitor.OrganizationID, true).Find(&channels).Error; err != nil {
		s.log.Errorf("Failed to get notification channels: %v", err)
		return
	}

	for _, channel := range channels {
		notification := database.AlertNotification{
			AlertID:               alert.ID,
			NotificationChannelID: channel.ID,
			SentAt:                time.Now(),
			Status:                "pending",
		}

		if err := s.db.Create(&notification).Error; err != nil {
			s.log.Errorf("Failed to create notification: %v", err)
			continue
		}

		// Send notification asynchronously
		go s.sendNotification(&notification, &channel, alert)
	}
}

// sendNotification sends a single notification
func (s *Service) sendNotification(notification *database.AlertNotification, channel *database.NotificationChannel, alert *database.Alert) {
	// This would implement the actual notification sending logic
	// For now, we'll just mark it as sent
	notification.Status = "sent"
	notification.SentAt = time.Now()

	if err := s.db.Save(notification).Error; err != nil {
		s.log.Errorf("Failed to update notification status: %v", err)
	}
}

// cacheMonitorStatus caches the latest monitor status
func (s *Service) cacheMonitorStatus(monitorID uint, status string, responseTime int) {
	ctx := context.Background()
	key := fmt.Sprintf("monitor:%d:status", monitorID)

	data := map[string]interface{}{
		"status":        status,
		"response_time": responseTime,
		"updated_at":    time.Now().Unix(),
	}

	jsonData, _ := json.Marshal(data)
	s.redis.Set(ctx, key, jsonData, time.Hour)
}

// GetMonitorStatus gets the cached status of a monitor
func (s *Service) GetMonitorStatus(monitorID uint) (map[string]interface{}, error) {
	ctx := context.Background()
	key := fmt.Sprintf("monitor:%d:status", monitorID)

	data, err := s.redis.Get(ctx, key).Result()
	if err != nil {
		return nil, err
	}

	var result map[string]interface{}
	if err := json.Unmarshal([]byte(data), &result); err != nil {
		return nil, err
	}

	return result, nil
}
