.PHONY: build run test clean docker-build docker-run dev

# Build the application
build:
	go build -o bin/vigil cmd/server/main.go

# Run the application
run:
	go run cmd/server/main.go

# Run tests
test:
	go test ./...

# Clean build artifacts
clean:
	rm -rf bin/
	go clean

# Build Docker image
docker-build:
	docker build -t vigil:latest .

# Run with Docker Compose
docker-run:
	docker-compose up -d

# Stop Docker Compose
docker-stop:
	docker-compose down

# Development mode with hot reload
dev:
	air

# Install dependencies
deps:
	go mod download
	go mod tidy

# Generate go.sum
sum:
	go mod tidy

# Run linter
lint:
	golangci-lint run

# Format code
fmt:
	go fmt ./...

# Database migrations
migrate:
	go run cmd/migrate/main.go

# Create database
db-create:
	createdb vigil

# Drop database
db-drop:
	dropdb vigil

# Reset database
db-reset: db-drop db-create migrate

# Help
help:
	@echo "Available commands:"
	@echo "  build       - Build the application"
	@echo "  run         - Run the application"
	@echo "  test        - Run tests"
	@echo "  clean       - Clean build artifacts"
	@echo "  docker-build- Build Docker image"
	@echo "  docker-run  - Run with Docker Compose"
	@echo "  docker-stop - Stop Docker Compose"
	@echo "  dev         - Development mode with hot reload"
	@echo "  deps        - Install dependencies"
	@echo "  lint        - Run linter"
	@echo "  fmt         - Format code"
	@echo "  migrate     - Run database migrations"
	@echo "  db-create   - Create database"
	@echo "  db-drop     - Drop database"
	@echo "  db-reset    - Reset database" 