package database

import (
	"fmt"

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
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		cfg.Host, cfg.User, cfg.Password, cfg.Name, cfg.Port, cfg.SSLMode)

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
