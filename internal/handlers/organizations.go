package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"

	"vigil/internal/database"
)

// GetOrganizations returns all organizations for the current user
func GetOrganizations(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)

		var organizations []database.Organization
		if err := db.Where("owner_id = ?", userID).Find(&organizations).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to fetch organizations",
			})
		}

		return c.JSON(organizations)
	}
}

// CreateOrganization creates a new organization
func CreateOrganization(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)

		var req struct {
			Name string `json:"name" validate:"required"`
		}

		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		organization := database.Organization{
			Name:    req.Name,
			OwnerID: userID,
		}

		if err := db.Create(&organization).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to create organization",
			})
		}

		return c.Status(201).JSON(organization)
	}
}

// GetOrganization returns a specific organization
func GetOrganization(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)
		orgID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid organization ID",
			})
		}

		var organization database.Organization
		if err := db.Where("id = ? AND owner_id = ?", orgID, userID).First(&organization).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{
				"error": "Organization not found",
			})
		}

		return c.JSON(organization)
	}
}

// UpdateOrganization updates an organization
func UpdateOrganization(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)
		orgID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid organization ID",
			})
		}

		var req struct {
			Name string `json:"name" validate:"required"`
		}

		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		var organization database.Organization
		if err := db.Where("id = ? AND owner_id = ?", orgID, userID).First(&organization).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{
				"error": "Organization not found",
			})
		}

		organization.Name = req.Name
		if err := db.Save(&organization).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to update organization",
			})
		}

		return c.JSON(organization)
	}
}

// DeleteOrganization deletes an organization
func DeleteOrganization(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user_id").(uint)
		orgID, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid organization ID",
			})
		}

		var organization database.Organization
		if err := db.Where("id = ? AND owner_id = ?", orgID, userID).First(&organization).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{
				"error": "Organization not found",
			})
		}

		if err := db.Delete(&organization).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to delete organization",
			})
		}

		return c.SendStatus(204)
	}
}
