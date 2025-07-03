package main

import (
	"log"
	"os"

	"vigil/internal/config"
	"vigil/internal/database"
	"vigil/internal/monitoring"
	"vigil/internal/server"
	"vigil/internal/services"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize database
	db, err := database.New(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Initialize Redis
	redis, err := services.NewRedisClient(cfg.RedisURL)
	if err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}

	// Initialize monitoring service
	monitorService := monitoring.NewService(db, redis.Client)

	// Start monitoring scheduler
	go monitorService.StartScheduler()

	// Initialize and start server
	app := server.New(cfg, db, redis.Client, monitorService)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting Vigil server on port %s", port)
	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
