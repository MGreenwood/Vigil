package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"vigil/internal/database"
)

// RegisterRequest represents a registration request
type RegisterRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Name     string `json:"name" validate:"required"`
	Password string `json:"password" validate:"required,min=6"`
}

// LoginRequest represents a login request
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

// Register handles user registration
func Register(db *database.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req RegisterRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		// Check if user already exists
		var existingUser database.User
		if err := db.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
			return c.Status(409).JSON(fiber.Map{
				"error": "User already exists",
			})
		}

		// Hash password
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to hash password",
			})
		}

		// Create user
		user := database.User{
			Email:        req.Email,
			Name:         req.Name,
			PasswordHash: string(hashedPassword),
		}

		if err := db.Create(&user).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to create user",
			})
		}

		return c.Status(201).JSON(fiber.Map{
			"message": "User created successfully",
			"user": fiber.Map{
				"id":    user.ID,
				"email": user.Email,
				"name":  user.Name,
			},
		})
	}
}

// Login handles user login
func Login(db *database.DB, jwtSecret string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req LoginRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		// Find user
		var user database.User
		if err := db.Where("email = ?", req.Email).First(&user).Error; err != nil {
			return c.Status(401).JSON(fiber.Map{
				"error": "Invalid credentials",
			})
		}

		// Check password
		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
			return c.Status(401).JSON(fiber.Map{
				"error": "Invalid credentials",
			})
		}

		// Generate JWT token
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"user_id": user.ID,
			"email":   user.Email,
			"exp":     time.Now().Add(time.Hour * 24 * 7).Unix(), // 7 days
		})

		tokenString, err := token.SignedString([]byte(jwtSecret))
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to generate token",
			})
		}

		return c.JSON(fiber.Map{
			"token": tokenString,
			"user": fiber.Map{
				"id":    user.ID,
				"email": user.Email,
				"name":  user.Name,
			},
		})
	}
}
