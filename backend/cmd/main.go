package main

import (
	"log"

	"github.com/chmenegatti/myBlog/internal/app"
	"github.com/chmenegatti/myBlog/internal/config"
	"github.com/chmenegatti/myBlog/internal/logger"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Failed to load configuration:", err)
	}

	// Initialize structured logging
	if err := logger.Initialize(cfg.Logging.Level, cfg.Logging.Format, cfg.Logging.Output); err != nil {
		log.Fatal("Failed to initialize logger:", err)
	}

	// Log application startup
	logger.WithService("main").Info("Starting Blog API application", map[string]any{
		"version": "1.0.0",
		"env":     cfg.Server.Env,
		"port":    cfg.Server.Port,
	})

	// Initialize and start the application
	application, err := app.New(cfg)
	if err != nil {
		logger.WithService("main").Error("Failed to initialize application", map[string]any{
			"error": err.Error(),
		})
		log.Fatal("Failed to initialize application:", err)
	}

	// Start the server
	logger.WithService("main").Info("Server starting", map[string]any{
		"port":       cfg.Server.Port,
		"log_level":  cfg.Logging.Level,
		"log_output": cfg.Logging.Output,
	})

	if err := application.Start(); err != nil {
		logger.WithService("main").Error("Failed to start server", map[string]any{
			"error": err.Error(),
		})
		log.Fatal("Failed to start server:", err)
	}
}
