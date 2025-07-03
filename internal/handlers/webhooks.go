package handlers

import (
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"

	"vigil/internal/database"
)

// GetWebhooks returns all webhooks for the current user's organizations
func GetWebhooks(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)

		var webhooks []database.Webhook
		if err := db.Joins("JOIN organizations ON webhooks.organization_id = organizations.id").
			Where("organizations.owner_id = ?", userID).
			Find(&webhooks).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to fetch webhooks",
			})
		}

		return c.JSON(webhooks)
	}
}

// CreateWebhook creates a new webhook
func CreateWebhook(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)

		var req struct {
			OrganizationID uint   `json:"organization_id" validate:"required"`
			Name           string `json:"name" validate:"required"`
			URL            string `json:"url" validate:"required"`
			Secret         string `json:"secret"`
			RetryCount     int    `json:"retry_count" validate:"min=0,max=10"`
			TimeoutSeconds int    `json:"timeout_seconds" validate:"min=5,max=300"`
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

		webhook := database.Webhook{
			OrganizationID: req.OrganizationID,
			Name:           req.Name,
			URL:            req.URL,
			Secret:         req.Secret,
			RetryCount:     req.RetryCount,
			TimeoutSeconds: req.TimeoutSeconds,
			IsActive:       true,
		}

		if err := db.Create(&webhook).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to create webhook",
			})
		}

		return c.Status(201).JSON(webhook)
	}
}

// GetWebhook returns a specific webhook
func GetWebhook(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)
		webhookID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid webhook ID",
			})
		}

		var webhook database.Webhook
		if err := db.Joins("JOIN organizations ON webhooks.organization_id = organizations.id").
			Where("webhooks.id = ? AND organizations.owner_id = ?", webhookID, userID).
			First(&webhook).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{
				"error": "Webhook not found",
			})
		}

		return c.JSON(webhook)
	}
}

// UpdateWebhook updates a webhook
func UpdateWebhook(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)
		webhookID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid webhook ID",
			})
		}

		var req struct {
			Name           string `json:"name" validate:"required"`
			URL            string `json:"url" validate:"required"`
			Secret         string `json:"secret"`
			RetryCount     int    `json:"retry_count" validate:"min=0,max=10"`
			TimeoutSeconds int    `json:"timeout_seconds" validate:"min=5,max=300"`
			IsActive       bool   `json:"is_active"`
		}

		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		var webhook database.Webhook
		if err := db.Joins("JOIN organizations ON webhooks.organization_id = organizations.id").
			Where("webhooks.id = ? AND organizations.owner_id = ?", webhookID, userID).
			First(&webhook).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{
				"error": "Webhook not found",
			})
		}

		webhook.Name = req.Name
		webhook.URL = req.URL
		webhook.Secret = req.Secret
		webhook.RetryCount = req.RetryCount
		webhook.TimeoutSeconds = req.TimeoutSeconds
		webhook.IsActive = req.IsActive

		if err := db.Save(&webhook).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to update webhook",
			})
		}

		return c.JSON(webhook)
	}
}

// DeleteWebhook deletes a webhook
func DeleteWebhook(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)
		webhookID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid webhook ID",
			})
		}

		var webhook database.Webhook
		if err := db.Joins("JOIN organizations ON webhooks.organization_id = organizations.id").
			Where("webhooks.id = ? AND organizations.owner_id = ?", webhookID, userID).
			First(&webhook).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{
				"error": "Webhook not found",
			})
		}

		if err := db.Delete(&webhook).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to delete webhook",
			})
		}

		return c.SendStatus(204)
	}
}

// GetWebhookDeliveries returns delivery history for a webhook
func GetWebhookDeliveries(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)
		webhookID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid webhook ID",
			})
		}

		// Verify user has access to this webhook
		var webhook database.Webhook
		if err := db.Joins("JOIN organizations ON webhooks.organization_id = organizations.id").
			Where("webhooks.id = ? AND organizations.owner_id = ?", webhookID, userID).
			First(&webhook).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{
				"error": "Webhook not found",
			})
		}

		var deliveries []database.WebhookDelivery
		if err := db.Where("webhook_id = ?", webhookID).
			Order("delivered_at DESC").
			Limit(100).
			Find(&deliveries).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to fetch webhook deliveries",
			})
		}

		return c.JSON(deliveries)
	}
}

// ReceiveWebhook handles incoming webhook deliveries
func ReceiveWebhook(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		webhookID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid webhook ID",
			})
		}

		var webhook database.Webhook
		if err := db.Where("id = ? AND is_active = ?", webhookID, true).First(&webhook).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{
				"error": "Webhook not found",
			})
		}

		// Get the request body
		payload := string(c.Body())

		// Create webhook delivery record
		delivery := database.WebhookDelivery{
			WebhookID:   uint(webhookID),
			Payload:     payload,
			Status:      "pending",
			DeliveredAt: time.Now(),
			RetryCount:  0,
		}

		if err := db.Create(&delivery).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to record webhook delivery",
			})
		}

		// TODO: Process webhook delivery asynchronously
		// This would involve sending the webhook to the target URL and updating the delivery status

		return c.JSON(fiber.Map{
			"message":     "Webhook received",
			"delivery_id": delivery.ID,
		})
	}
}
