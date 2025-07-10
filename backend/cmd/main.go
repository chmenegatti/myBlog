package main

import (
	"log"

	"github.com/chmenegatti/myBlog/internal/app"
	"github.com/chmenegatti/myBlog/internal/config"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Failed to load configuration:", err)
	}

	// Initialize and start the application
	application, err := app.New(cfg)
	if err != nil {
		log.Fatal("Failed to initialize application:", err)
	}

	// Start the server
	log.Printf("Starting server on port %s", cfg.Server.Port)
	if err := application.Start(); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
