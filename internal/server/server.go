package server

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/redis/go-redis/v9"

	"vigil/internal/config"
	"vigil/internal/database"
	"vigil/internal/handlers"
	"vigil/internal/middleware"
	"vigil/internal/monitoring"
)

// Server represents the HTTP server
type Server struct {
	app            *fiber.App
	config         *config.Config
	db             *database.DB
	redis          *redis.Client
	monitorService *monitoring.Service
}

// New creates a new server instance
func New(cfg *config.Config, db *database.DB, redis *redis.Client, monitorService *monitoring.Service) *Server {
	app := fiber.New(fiber.Config{
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  120 * time.Second,
	})

	server := &Server{
		app:            app,
		config:         cfg,
		db:             db,
		redis:          redis,
		monitorService: monitorService,
	}

	server.setupMiddleware()
	server.setupRoutes()

	return server
}

// setupMiddleware sets up server middleware
func (s *Server) setupMiddleware() {
	// Recovery middleware
	s.app.Use(recover.New())

	// Logger middleware
	s.app.Use(logger.New(logger.Config{
		Format: "[${time}] ${status} - ${latency} ${method} ${path}\n",
	}))

	// CORS middleware
	s.app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))
}

// setupRoutes sets up all application routes
func (s *Server) setupRoutes() {
	// Health check
	s.app.Get("/health", s.healthCheck)

	// API routes
	api := s.app.Group("/api/v1")

	// Auth routes
	auth := api.Group("/auth")
	auth.Post("/register", handlers.Register(s.db))
	auth.Post("/login", handlers.Login(s.db, s.config.JWTSecret))

	// Protected routes
	protected := api.Group("/", middleware.AuthMiddleware(s.config.JWTSecret))

	// Organizations
	orgs := protected.Group("/organizations")
	orgs.Get("/", handlers.GetOrganizations(s.db))
	orgs.Post("/", handlers.CreateOrganization(s.db))
	orgs.Get("/:id", handlers.GetOrganization(s.db))
	orgs.Put("/:id", handlers.UpdateOrganization(s.db))
	orgs.Delete("/:id", handlers.DeleteOrganization(s.db))

	// Monitors
	monitors := protected.Group("/monitors")
	monitors.Get("/", handlers.GetMonitors(s.db))
	monitors.Post("/", handlers.CreateMonitor(s.db, s.monitorService))
	monitors.Get("/:id", handlers.GetMonitor(s.db))
	monitors.Put("/:id", handlers.UpdateMonitor(s.db, s.monitorService))
	monitors.Delete("/:id", handlers.DeleteMonitor(s.db, s.monitorService))
	monitors.Get("/:id/checks", handlers.GetMonitorChecks(s.db))
	monitors.Get("/:id/status", handlers.GetMonitorStatus(s.monitorService))

	// Alerts
	alerts := protected.Group("/alerts")
	alerts.Get("/", handlers.GetAlerts(s.db))
	alerts.Get("/:id", handlers.GetAlert(s.db))
	alerts.Put("/:id/resolve", handlers.ResolveAlert(s.db))

	// Notification channels
	channels := protected.Group("/notification-channels")
	channels.Get("/", handlers.GetNotificationChannels(s.db))
	channels.Post("/", handlers.CreateNotificationChannel(s.db))
	channels.Get("/:id", handlers.GetNotificationChannel(s.db))
	channels.Put("/:id", handlers.UpdateNotificationChannel(s.db))
	channels.Delete("/:id", handlers.DeleteNotificationChannel(s.db))

	// Webhooks
	webhooks := protected.Group("/webhooks")
	webhooks.Get("/", handlers.GetWebhooks(s.db))
	webhooks.Post("/", handlers.CreateWebhook(s.db))
	webhooks.Get("/:id", handlers.GetWebhook(s.db))
	webhooks.Put("/:id", handlers.UpdateWebhook(s.db))
	webhooks.Delete("/:id", handlers.DeleteWebhook(s.db))
	webhooks.Get("/:id/deliveries", handlers.GetWebhookDeliveries(s.db))

	// Webhook receiver (public endpoint)
	s.app.Post("/webhook/:id", handlers.ReceiveWebhook(s.db))

	// Interest list routes (public)
	interest := s.app.Group("/api/interest")
	interest.Post("/signup", handlers.InterestSignup(s.db))
	interest.Get("/unsubscribe", handlers.Unsubscribe(s.db))

	// Admin routes for interest list (should be protected in production)
	admin := api.Group("/admin")
	admin.Get("/interest-list", handlers.GetInterestList(s.db))
	admin.Post("/interest-list/launch-notification", handlers.SendLaunchNotification(s.db))

	// Dashboard stats
	dashboard := protected.Group("/dashboard")
	dashboard.Get("/stats", handlers.GetDashboardStats(s.db))
	dashboard.Get("/uptime", handlers.GetUptimeStats(s.db))
}

// healthCheck handles health check requests
func (s *Server) healthCheck(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"status":    "healthy",
		"timestamp": time.Now().Unix(),
		"service":   "vigil",
		"version":   "1.0.0",
	})
}

// Listen starts the server
func (s *Server) Listen(addr string) error {
	return s.app.Listen(addr)
}

// Shutdown gracefully shuts down the server
func (s *Server) Shutdown() error {
	return s.app.Shutdown()
}
