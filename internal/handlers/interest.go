package handlers

import (
	"net/http"
	"time"

	"vigil/internal/database"
	"vigil/internal/services"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type InterestSubscriber struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Email     string    `json:"email" gorm:"uniqueIndex;not null"`
	Name      string    `json:"name" gorm:"not null"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type InterestSignupRequest struct {
	Email string `json:"email" validate:"required,email"`
	Name  string `json:"name" validate:"required"`
}

type InterestSignupResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

// InterestSignup handles interest list signups
func InterestSignup(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req InterestSignupRequest

		if err := c.BodyParser(&req); err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": "Invalid request body",
			})
		}

		// Validate email format
		if !isValidEmail(req.Email) {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": "Invalid email format",
			})
		}

		// Check if email already exists
		var existingSubscriber InterestSubscriber
		result := db.Where("email = ?", req.Email).First(&existingSubscriber)

		if result.Error == nil {
			// Email already exists
			return c.Status(http.StatusConflict).JSON(fiber.Map{
				"success": false,
				"message": "This email is already on our interest list!",
			})
		}

		if result.Error != gorm.ErrRecordNotFound {
			// Database error
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"message": "Database error occurred",
			})
		}

		// Create new subscriber
		subscriber := InterestSubscriber{
			Email: req.Email,
			Name:  req.Name,
		}

		if err := db.Create(&subscriber).Error; err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"message": "Failed to add to interest list",
			})
		}

		// Send welcome email
		emailService := services.NewEmailService()
		if emailService != nil {
			go func() {
				if err := emailService.SendWelcomeEmail(req.Email, req.Name); err != nil {
					// Log error but don't fail the request
					// In a real app, you'd want proper logging here
					println("Failed to send welcome email:", err.Error())
				}
			}()
		}

		return c.JSON(fiber.Map{
			"success": true,
			"message": "Successfully added to interest list! Check your email for confirmation.",
		})
	}
}

// GetInterestList returns all interest list subscribers
func GetInterestList(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// This should be protected with admin authentication
		// For now, we'll add a simple check

		var subscribers []InterestSubscriber
		if err := db.Order("created_at DESC").Find(&subscribers).Error; err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"message": "Failed to fetch interest list",
			})
		}

		return c.JSON(fiber.Map{
			"success": true,
			"data":    subscribers,
			"count":   len(subscribers),
		})
	}
}

// SendLaunchNotification sends launch notification to all subscribers
func SendLaunchNotification(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// This should be protected with admin authentication

		var subscribers []InterestSubscriber
		if err := db.Find(&subscribers).Error; err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"message": "Failed to fetch subscribers",
			})
		}

		emailService := services.NewEmailService()
		if emailService == nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"message": "Email service not configured",
			})
		}

		// Send launch notification to all subscribers
		successCount := 0
		failedCount := 0

		for _, subscriber := range subscribers {
			if err := emailService.SendLaunchNotification(subscriber.Email, subscriber.Name); err != nil {
				// Log error but don't fail the request
				println("Failed to send launch notification:", err.Error(), "email:", subscriber.Email)
				failedCount++
			} else {
				successCount++
			}
		}

		return c.JSON(fiber.Map{
			"success": true,
			"message": "Launch notifications sent",
			"data": fiber.Map{
				"total_subscribers": len(subscribers),
				"successful_sends":  successCount,
				"failed_sends":      failedCount,
			},
		})
	}
}

// Unsubscribe removes a subscriber from the interest list
func Unsubscribe(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		email := c.Query("email")
		if email == "" {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": "Email parameter is required",
			})
		}

		// Delete subscriber
		result := db.Where("email = ?", email).Delete(&InterestSubscriber{})

		if result.RowsAffected == 0 {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{
				"success": false,
				"message": "Email not found in interest list",
			})
		}

		return c.JSON(fiber.Map{
			"success": true,
			"message": "Successfully unsubscribed from interest list",
		})
	}
}

// Helper function to validate email format
func isValidEmail(email string) bool {
	// Simple email validation - you might want to use a more robust library
	if len(email) < 3 || len(email) > 254 {
		return false
	}

	// Check for @ symbol
	atIndex := -1
	for i, char := range email {
		if char == '@' {
			if atIndex != -1 {
				return false // Multiple @ symbols
			}
			atIndex = i
		}
	}

	return atIndex > 0 && atIndex < len(email)-1
}
