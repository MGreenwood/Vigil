package database

import (
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// DB wraps the GORM database instance
type DB struct {
	*gorm.DB
}

// New creates a new database connection
func New(databaseURL string) (*DB, error) {
	db, err := gorm.Open(postgres.Open(databaseURL), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, err
	}

	// Auto migrate models
	if err := db.AutoMigrate(
		&User{},
		&Organization{},
		&OrganizationMember{},
		&Monitor{},
		&MonitorCheck{},
		&Alert{},
		&NotificationChannel{},
		&AlertNotification{},
		&Webhook{},
		&WebhookDelivery{},
	); err != nil {
		return nil, err
	}

	return &DB{db}, nil
}

// User represents a user in the system
type User struct {
	ID               uint      `json:"id" gorm:"primaryKey"`
	Email            string    `json:"email" gorm:"uniqueIndex;not null"`
	Name             string    `json:"name"`
	PasswordHash     string    `json:"-" gorm:"not null"`
	SubscriptionTier string    `json:"subscription_tier" gorm:"default:'free'"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

// Organization represents an organization/team
type Organization struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name" gorm:"not null"`
	OwnerID   uint      `json:"owner_id" gorm:"not null"`
	Owner     User      `json:"owner" gorm:"foreignKey:OwnerID"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// OrganizationMember represents a member of an organization
type OrganizationMember struct {
	ID             uint         `json:"id" gorm:"primaryKey"`
	OrganizationID uint         `json:"organization_id" gorm:"not null"`
	Organization   Organization `json:"organization" gorm:"foreignKey:OrganizationID"`
	UserID         uint         `json:"user_id" gorm:"not null"`
	User           User         `json:"user" gorm:"foreignKey:UserID"`
	Role           string       `json:"role" gorm:"default:'member'"`
	CreatedAt      time.Time    `json:"created_at"`
}

// Monitor represents a monitoring target
type Monitor struct {
	ID              uint         `json:"id" gorm:"primaryKey"`
	OrganizationID  uint         `json:"organization_id" gorm:"not null"`
	Organization    Organization `json:"organization" gorm:"foreignKey:OrganizationID"`
	Name            string       `json:"name" gorm:"not null"`
	Type            string       `json:"type" gorm:"not null"` // http, ssl, webhook
	URL             string       `json:"url" gorm:"not null"`
	IntervalSeconds int          `json:"interval_seconds" gorm:"default:300"` // 5 minutes
	TimeoutSeconds  int          `json:"timeout_seconds" gorm:"default:30"`
	ExpectedStatus  int          `json:"expected_status" gorm:"default:200"`
	CustomHeaders   string       `json:"custom_headers"` // JSON string
	IsActive        bool         `json:"is_active" gorm:"default:true"`
	CreatedAt       time.Time    `json:"created_at"`
	UpdatedAt       time.Time    `json:"updated_at"`
}

// MonitorCheck represents a single monitoring check result
type MonitorCheck struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	MonitorID    uint      `json:"monitor_id" gorm:"not null"`
	Monitor      Monitor   `json:"monitor" gorm:"foreignKey:MonitorID"`
	Status       string    `json:"status" gorm:"not null"` // up, down, warning
	ResponseTime int       `json:"response_time"`          // milliseconds
	StatusCode   int       `json:"status_code"`
	ErrorMessage string    `json:"error_message"`
	ResponseBody string    `json:"response_body"`
	CheckedAt    time.Time `json:"checked_at" gorm:"not null"`
}

// Alert represents an alert triggered by a monitor
type Alert struct {
	ID         uint       `json:"id" gorm:"primaryKey"`
	MonitorID  uint       `json:"monitor_id" gorm:"not null"`
	Monitor    Monitor    `json:"monitor" gorm:"foreignKey:MonitorID"`
	Type       string     `json:"type" gorm:"not null"` // down, ssl_expiring, webhook_failed
	Message    string     `json:"message" gorm:"not null"`
	Severity   string     `json:"severity" gorm:"default:'medium'"` // low, medium, high, critical
	CreatedAt  time.Time  `json:"created_at"`
	ResolvedAt *time.Time `json:"resolved_at"`
}

// NotificationChannel represents a notification channel
type NotificationChannel struct {
	ID             uint         `json:"id" gorm:"primaryKey"`
	OrganizationID uint         `json:"organization_id" gorm:"not null"`
	Organization   Organization `json:"organization" gorm:"foreignKey:OrganizationID"`
	Type           string       `json:"type" gorm:"not null"` // email, slack, discord, webhook
	Config         string       `json:"config"`               // JSON string
	IsActive       bool         `json:"is_active" gorm:"default:true"`
	CreatedAt      time.Time    `json:"created_at"`
	UpdatedAt      time.Time    `json:"updated_at"`
}

// AlertNotification represents a notification sent for an alert
type AlertNotification struct {
	ID                    uint                `json:"id" gorm:"primaryKey"`
	AlertID               uint                `json:"alert_id" gorm:"not null"`
	Alert                 Alert               `json:"alert" gorm:"foreignKey:AlertID"`
	NotificationChannelID uint                `json:"notification_channel_id" gorm:"not null"`
	NotificationChannel   NotificationChannel `json:"notification_channel" gorm:"foreignKey:NotificationChannelID"`
	SentAt                time.Time           `json:"sent_at"`
	Status                string              `json:"status" gorm:"default:'pending'"` // pending, sent, failed
	ErrorMessage          string              `json:"error_message"`
}

// Webhook represents an incoming webhook to monitor
type Webhook struct {
	ID             uint         `json:"id" gorm:"primaryKey"`
	OrganizationID uint         `json:"organization_id" gorm:"not null"`
	Organization   Organization `json:"organization" gorm:"foreignKey:OrganizationID"`
	Name           string       `json:"name" gorm:"not null"`
	URL            string       `json:"url" gorm:"not null"`
	Secret         string       `json:"secret"`
	RetryCount     int          `json:"retry_count" gorm:"default:3"`
	TimeoutSeconds int          `json:"timeout_seconds" gorm:"default:30"`
	IsActive       bool         `json:"is_active" gorm:"default:true"`
	CreatedAt      time.Time    `json:"created_at"`
	UpdatedAt      time.Time    `json:"updated_at"`
}

// WebhookDelivery represents a webhook delivery attempt
type WebhookDelivery struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	WebhookID    uint      `json:"webhook_id" gorm:"not null"`
	Webhook      Webhook   `json:"webhook" gorm:"foreignKey:WebhookID"`
	Payload      string    `json:"payload"`                // JSON string
	Status       string    `json:"status" gorm:"not null"` // pending, success, failed
	ResponseCode int       `json:"response_code"`
	DeliveredAt  time.Time `json:"delivered_at"`
	RetryCount   int       `json:"retry_count" gorm:"default:0"`
}
