package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"

	"vigil/internal/database"
	"vigil/internal/monitoring"
)

// GetMonitors returns all monitors for the current user's organizations
func GetMonitors(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)

		var monitors []database.Monitor
		if err := db.Joins("JOIN organizations ON monitors.organization_id = organizations.id").
			Where("organizations.owner_id = ?", userID).
			Find(&monitors).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to fetch monitors",
			})
		}

		return c.JSON(monitors)
	}
}

// CreateMonitor creates a new monitor
func CreateMonitor(db *database.DB, monitorService *monitoring.Service) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)

		var req struct {
			OrganizationID  uint   `json:"organization_id" validate:"required"`
			Name            string `json:"name" validate:"required"`
			Type            string `json:"type" validate:"required,oneof=http ssl webhook"`
			URL             string `json:"url" validate:"required"`
			IntervalSeconds int    `json:"interval_seconds" validate:"required,min=30"`
			TimeoutSeconds  int    `json:"timeout_seconds" validate:"required,min=5"`
			ExpectedStatus  int    `json:"expected_status" validate:"required,min=100,max=599"`
			CustomHeaders   string `json:"custom_headers"`
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

		monitor := database.Monitor{
			OrganizationID:  req.OrganizationID,
			Name:            req.Name,
			Type:            req.Type,
			URL:             req.URL,
			IntervalSeconds: req.IntervalSeconds,
			TimeoutSeconds:  req.TimeoutSeconds,
			ExpectedStatus:  req.ExpectedStatus,
			CustomHeaders:   req.CustomHeaders,
			IsActive:        true,
		}

		if err := db.Create(&monitor).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to create monitor",
			})
		}

		// Schedule the monitor
		monitorService.ScheduleMonitor(&monitor)

		return c.Status(201).JSON(monitor)
	}
}

// GetMonitor returns a specific monitor
func GetMonitor(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)
		monitorID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid monitor ID",
			})
		}

		var monitor database.Monitor
		if err := db.Joins("JOIN organizations ON monitors.organization_id = organizations.id").
			Where("monitors.id = ? AND organizations.owner_id = ?", monitorID, userID).
			First(&monitor).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{
				"error": "Monitor not found",
			})
		}

		return c.JSON(monitor)
	}
}

// UpdateMonitor updates a monitor
func UpdateMonitor(db *database.DB, monitorService *monitoring.Service) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)
		monitorID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid monitor ID",
			})
		}

		var req struct {
			Name            string `json:"name" validate:"required"`
			Type            string `json:"type" validate:"required,oneof=http ssl webhook"`
			URL             string `json:"url" validate:"required"`
			IntervalSeconds int    `json:"interval_seconds" validate:"required,min=30"`
			TimeoutSeconds  int    `json:"timeout_seconds" validate:"required,min=5"`
			ExpectedStatus  int    `json:"expected_status" validate:"required,min=100,max=599"`
			CustomHeaders   string `json:"custom_headers"`
			IsActive        bool   `json:"is_active"`
		}

		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		var monitor database.Monitor
		if err := db.Joins("JOIN organizations ON monitors.organization_id = organizations.id").
			Where("monitors.id = ? AND organizations.owner_id = ?", monitorID, userID).
			First(&monitor).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{
				"error": "Monitor not found",
			})
		}

		monitor.Name = req.Name
		monitor.Type = req.Type
		monitor.URL = req.URL
		monitor.IntervalSeconds = req.IntervalSeconds
		monitor.TimeoutSeconds = req.TimeoutSeconds
		monitor.ExpectedStatus = req.ExpectedStatus
		monitor.CustomHeaders = req.CustomHeaders
		monitor.IsActive = req.IsActive

		if err := db.Save(&monitor).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to update monitor",
			})
		}

		// Reschedule the monitor
		monitorService.ScheduleMonitor(&monitor)

		return c.JSON(monitor)
	}
}

// DeleteMonitor deletes a monitor
func DeleteMonitor(db *database.DB, monitorService *monitoring.Service) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)
		monitorID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid monitor ID",
			})
		}

		var monitor database.Monitor
		if err := db.Joins("JOIN organizations ON monitors.organization_id = organizations.id").
			Where("monitors.id = ? AND organizations.owner_id = ?", monitorID, userID).
			First(&monitor).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{
				"error": "Monitor not found",
			})
		}

		if err := db.Delete(&monitor).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to delete monitor",
			})
		}

		return c.SendStatus(204)
	}
}

// GetMonitorChecks returns check history for a monitor
func GetMonitorChecks(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)
		monitorID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid monitor ID",
			})
		}

		// Verify user has access to this monitor
		var monitor database.Monitor
		if err := db.Joins("JOIN organizations ON monitors.organization_id = organizations.id").
			Where("monitors.id = ? AND organizations.owner_id = ?", monitorID, userID).
			First(&monitor).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{
				"error": "Monitor not found",
			})
		}

		var checks []database.MonitorCheck
		if err := db.Where("monitor_id = ?", monitorID).
			Order("checked_at DESC").
			Limit(100).
			Find(&checks).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to fetch monitor checks",
			})
		}

		return c.JSON(checks)
	}
}

// GetMonitorStatus returns the current status of a monitor
func GetMonitorStatus(monitorService *monitoring.Service) fiber.Handler {
	return func(c *fiber.Ctx) error {
		monitorID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid monitor ID",
			})
		}

		status, err := monitorService.GetMonitorStatus(uint(monitorID))
		if err != nil {
			return c.Status(404).JSON(fiber.Map{
				"error": "Monitor status not found",
			})
		}

		return c.JSON(status)
	}
}
