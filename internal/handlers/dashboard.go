package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"

	"vigil/internal/database"
)

// GetDashboardStats returns dashboard statistics
func GetDashboardStats(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)

		// Get total monitors
		var totalMonitors int64
		if err := db.Joins("JOIN organizations ON monitors.organization_id = organizations.id").
			Where("organizations.owner_id = ?", userID).
			Model(&database.Monitor{}).Count(&totalMonitors).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to get monitor count",
			})
		}

		// Get active monitors
		var activeMonitors int64
		if err := db.Joins("JOIN organizations ON monitors.organization_id = organizations.id").
			Where("organizations.owner_id = ? AND monitors.is_active = ?", userID, true).
			Model(&database.Monitor{}).Count(&activeMonitors).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to get active monitor count",
			})
		}

		// Get active alerts
		var activeAlerts int64
		if err := db.Joins("JOIN monitors ON alerts.monitor_id = monitors.id").
			Joins("JOIN organizations ON monitors.organization_id = organizations.id").
			Where("organizations.owner_id = ? AND alerts.resolved_at IS NULL", userID).
			Model(&database.Alert{}).Count(&activeAlerts).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to get active alert count",
			})
		}

		// Get total organizations
		var totalOrganizations int64
		if err := db.Where("owner_id = ?", userID).
			Model(&database.Organization{}).Count(&totalOrganizations).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to get organization count",
			})
		}

		return c.JSON(fiber.Map{
			"total_monitors":      totalMonitors,
			"active_monitors":     activeMonitors,
			"active_alerts":       activeAlerts,
			"total_organizations": totalOrganizations,
		})
	}
}

// GetUptimeStats returns uptime statistics
func GetUptimeStats(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)
		days := c.Query("days", "7")

		// Parse days parameter
		var daysInt int
		switch days {
		case "1":
			daysInt = 1
		case "7":
			daysInt = 7
		case "30":
			daysInt = 30
		default:
			daysInt = 7
		}

		// Get monitors with their uptime
		var monitors []database.Monitor
		if err := db.Joins("JOIN organizations ON monitors.organization_id = organizations.id").
			Where("organizations.owner_id = ?", userID).
			Find(&monitors).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to fetch monitors",
			})
		}

		var uptimeStats []fiber.Map
		for _, monitor := range monitors {
			// Calculate uptime for this monitor
			var totalChecks int64
			var successfulChecks int64

			startDate := time.Now().AddDate(0, 0, -daysInt)

			if err := db.Model(&database.MonitorCheck{}).
				Where("monitor_id = ? AND checked_at >= ?", monitor.ID, startDate).
				Count(&totalChecks).Error; err != nil {
				continue
			}

			if err := db.Model(&database.MonitorCheck{}).
				Where("monitor_id = ? AND status = 'up' AND checked_at >= ?", monitor.ID, startDate).
				Count(&successfulChecks).Error; err != nil {
				continue
			}

			var uptimePercentage float64
			if totalChecks > 0 {
				uptimePercentage = float64(successfulChecks) / float64(totalChecks) * 100
			}

			uptimeStats = append(uptimeStats, fiber.Map{
				"monitor_id":        monitor.ID,
				"monitor_name":      monitor.Name,
				"monitor_type":      monitor.Type,
				"uptime_percentage": uptimePercentage,
				"total_checks":      totalChecks,
				"successful_checks": successfulChecks,
				"period_days":       daysInt,
			})
		}

		return c.JSON(fiber.Map{
			"uptime_stats": uptimeStats,
			"period_days":  daysInt,
		})
	}
}
