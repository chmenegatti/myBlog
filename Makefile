# Variables
DOCKER_COMPOSE = docker-compose
DOCKER_COMPOSE_DEV = docker-compose -f docker-compose.dev.yml
GO_CMD = go
BACKEND_DIR = backend

# Development commands
.PHONY: help dev build clean test docker-up docker-down docker-build setup

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

setup: ## Setup development environment
	@./scripts/setup.sh

dev: ## Run the application in development mode
	cd $(BACKEND_DIR) && $(GO_CMD) run cmd/main.go

build: ## Build the application
	cd $(BACKEND_DIR) && $(GO_CMD) build -o bin/myblog cmd/main.go

test: ## Run tests
	cd $(BACKEND_DIR) && $(GO_CMD) test ./...

clean: ## Clean build artifacts
	cd $(BACKEND_DIR) && rm -rf bin/

# Docker commands (Production)
docker-up: ## Start the application with Docker Compose
	$(DOCKER_COMPOSE) up -d

docker-down: ## Stop the application
	$(DOCKER_COMPOSE) down

docker-build: ## Build Docker images
	$(DOCKER_COMPOSE) build

docker-logs: ## Show Docker logs
	$(DOCKER_COMPOSE) logs -f

# Docker commands (Development)
dev-up: ## Start development environment (only database + pgAdmin)
	$(DOCKER_COMPOSE_DEV) up -d

dev-down: ## Stop development environment
	$(DOCKER_COMPOSE_DEV) down

dev-logs: ## Show development Docker logs
	$(DOCKER_COMPOSE_DEV) logs -f

# Database commands
db-migrate: ## Run database migrations (when implemented)
	@echo "Database migrations not implemented yet"

db-reset: ## Reset development database
	$(DOCKER_COMPOSE_DEV) down -v
	$(DOCKER_COMPOSE_DEV) up -d postgres-dev

# Utility commands
deps: ## Download Go dependencies
	cd $(BACKEND_DIR) && $(GO_CMD) mod download

tidy: ## Tidy Go dependencies
	cd $(BACKEND_DIR) && $(GO_CMD) mod tidy

fmt: ## Format Go code
	cd $(BACKEND_DIR) && $(GO_CMD) fmt ./...

lint: ## Run Go linter (requires golangci-lint)
	cd $(BACKEND_DIR) && golangci-lint run

# Production commands
prod-build: ## Build for production
	cd $(BACKEND_DIR) && CGO_ENABLED=0 GOOS=linux $(GO_CMD) build -a -installsuffix cgo -o bin/myblog cmd/main.go

# Quick start commands
quick-start: ## Quick start for development (setup + dev environment + run)
	@make setup
	@make dev-up
	@echo "Waiting for database to be ready..."
	@sleep 5
	@make dev
