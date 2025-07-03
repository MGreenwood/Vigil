package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"

	"vigil/internal/database"
)

// GetAlerts returns all alerts for the current user's organizations
func GetAlerts(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)

		var alerts []database.Alert
		if err := db.Joins("JOIN monitors ON alerts.monitor_id = monitors.id").
			Joins("JOIN organizations ON monitors.organization_id = organizations.id").
			Where("organizations.owner_id = ?", userID).
			Order("alerts.created_at DESC").
			Limit(100).
			Find(&alerts).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to fetch alerts",
			})
		}

		return c.JSON(alerts)
	}
}

// GetAlert returns a specific alert
func GetAlert(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)
		alertID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid alert ID",
			})
		}

		var alert database.Alert
		if err := db.Joins("JOIN monitors ON alerts.monitor_id = monitors.id").
			Joins("JOIN organizations ON monitors.organization_id = organizations.id").
			Where("alerts.id = ? AND organizations.owner_id = ?", alertID, userID).
			First(&alert).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{
				"error": "Alert not found",
			})
		}

		return c.JSON(alert)
	}
}

// ResolveAlert resolves an alert
func ResolveAlert(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)
		alertID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid alert ID",
			})
		}

		var alert database.Alert
		if err := db.Joins("JOIN monitors ON alerts.monitor_id = monitors.id").
			Joins("JOIN organizations ON monitors.organization_id = organizations.id").
			Where("alerts.id = ? AND organizations.owner_id = ?", alertID, userID).
			First(&alert).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{
				"error": "Alert not found",
			})
		}

		// Mark alert as resolved
		if err := db.Model(&alert).Update("resolved_at", "NOW()").Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to resolve alert",
			})
		}

		return c.JSON(alert)
	}
}
