package database

import (
	"fmt"
	"log"
	"os"
	"strings"

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

	// Priority order for database connection:
	// 1. DATABASE_URL from config (Railway/production)
	// 2. DATABASE_URL directly from environment 
	// 3. Individual config values (local development)
	
	databaseURL := os.Getenv("DATABASE_URL")
	
	if cfg.URL != "" {
		dsn = cfg.URL
		log.Printf("Using configured DATABASE_URL")
	} else if databaseURL != "" {
		dsn = databaseURL
		log.Printf("Using DATABASE_URL from environment")
	} else {
		dsn = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
			cfg.Host, cfg.User, cfg.Password, cfg.Name, cfg.Port, cfg.SSLMode)
		log.Printf("Using individual database config (development mode)")
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

// maskPassword masks the password in a DSN string for safe logging
func maskPassword(dsn string) string {
	if strings.Contains(dsn, "password=") {
		parts := strings.Split(dsn, " ")
		for i, part := range parts {
			if strings.HasPrefix(part, "password=") {
				parts[i] = "password=****"
			}
		}
		return strings.Join(parts, " ")
	}
	// For postgres:// URLs, mask the password part
	if strings.HasPrefix(dsn, "postgres://") && strings.Contains(dsn, ":") && strings.Contains(dsn, "@") {
		parts := strings.Split(dsn, "@")
		if len(parts) == 2 {
			userPart := strings.Split(parts[0], ":")
			if len(userPart) >= 3 {
				userPart[2] = "****"
				parts[0] = strings.Join(userPart, ":")
			}
			return strings.Join(parts, "@")
		}
	}
	return dsn
}
