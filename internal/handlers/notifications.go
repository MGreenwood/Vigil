package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"

	"vigil/internal/database"
)

// GetNotificationChannels returns all notification channels for the current user's organizations
func GetNotificationChannels(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)

		var channels []database.NotificationChannel
		if err := db.Joins("JOIN organizations ON notification_channels.organization_id = organizations.id").
			Where("organizations.owner_id = ?", userID).
			Find(&channels).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to fetch notification channels",
			})
		}

		return c.JSON(channels)
	}
}

// CreateNotificationChannel creates a new notification channel
func CreateNotificationChannel(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)

		var req struct {
			OrganizationID uint   `json:"organization_id" validate:"required"`
			Type           string `json:"type" validate:"required,oneof=email slack discord webhook"`
			Config         string `json:"config" validate:"required"`
		}

		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		// Verify user owns the organization
		var organization database.Organization
		if err := db.Where("id = ? AND owner_id = ?", req.OrganizationID, userID).First(&organization).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{
				"error": "Organization not found",
			})
		}

		channel := database.NotificationChannel{
			OrganizationID: req.OrganizationID,
			Type:           req.Type,
			Config:         req.Config,
			IsActive:       true,
		}

		if err := db.Create(&channel).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to create notification channel",
			})
		}

		return c.Status(201).JSON(channel)
	}
}

// GetNotificationChannel returns a specific notification channel
func GetNotificationChannel(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)
		channelID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid channel ID",
			})
		}

		var channel database.NotificationChannel
		if err := db.Joins("JOIN organizations ON notification_channels.organization_id = organizations.id").
			Where("notification_channels.id = ? AND organizations.owner_id = ?", channelID, userID).
			First(&channel).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{
				"error": "Notification channel not found",
			})
		}

		return c.JSON(channel)
	}
}

// UpdateNotificationChannel updates a notification channel
func UpdateNotificationChannel(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)
		channelID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid channel ID",
			})
		}

		var req struct {
			Type     string `json:"type" validate:"required,oneof=email slack discord webhook"`
			Config   string `json:"config" validate:"required"`
			IsActive bool   `json:"is_active"`
		}

		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		var channel database.NotificationChannel
		if err := db.Joins("JOIN organizations ON notification_channels.organization_id = organizations.id").
			Where("notification_channels.id = ? AND organizations.owner_id = ?", channelID, userID).
			First(&channel).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{
				"error": "Notification channel not found",
			})
		}

		channel.Type = req.Type
		channel.Config = req.Config
		channel.IsActive = req.IsActive

		if err := db.Save(&channel).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to update notification channel",
			})
		}

		return c.JSON(channel)
	}
}

// DeleteNotificationChannel deletes a notification channel
func DeleteNotificationChannel(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)
		channelID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid channel ID",
			})
		}

		var channel database.NotificationChannel
		if err := db.Joins("JOIN organizations ON notification_channels.organization_id = organizations.id").
			Where("notification_channels.id = ? AND organizations.owner_id = ?", channelID, userID).
			First(&channel).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{
				"error": "Notification channel not found",
			})
		}

		if err := db.Delete(&channel).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to delete notification channel",
			})
		}

		return c.SendStatus(204)
	}
}
