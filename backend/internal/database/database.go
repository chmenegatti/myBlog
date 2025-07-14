package database

import (
	"fmt"
	"log"
	"os"

	"github.com/chmenegatti/myBlog/internal/config"
	"github.com/chmenegatti/myBlog/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type DB struct {
	*gorm.DB
}

func New(cfg config.DatabaseConfig) (*DB, error) {
	var dsn string

	// Debug: Check environment variables
	databaseURL := os.Getenv("DATABASE_URL")
	log.Printf("DEBUG: DATABASE_URL from env: %s", databaseURL)
	log.Printf("DEBUG: cfg.URL: %s", cfg.URL)
	log.Printf("DEBUG: cfg.Host: %s", cfg.Host)

	// Check for DATABASE_URL first (Railway format)
	if cfg.URL != "" {
		dsn = cfg.URL
		log.Printf("Using cfg.URL: %s", dsn)
	} else if databaseURL != "" {
		// Fallback: get directly from environment
		dsn = databaseURL
		log.Printf("Using DATABASE_URL directly: %s", dsn)
	} else {
		// Use individual config values
		dsn = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
			cfg.Host, cfg.User, cfg.Password, cfg.Name, cfg.Port, cfg.SSLMode)
		log.Printf("Using individual config: %s", dsn)
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Auto migrate tables
	if err := db.AutoMigrate(
		&models.User{},
		&models.Post{},
		&models.Category{},
		&models.Tag{},
		&models.Comment{},
		&models.Newsletter{},
		&models.Image{},
	); err != nil {
		return nil, fmt.Errorf("failed to migrate database: %w", err)
	}

	return &DB{db}, nil
}

func (db *DB) GetDB() *gorm.DB {
	return db.DB
}
