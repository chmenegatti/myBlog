package config

import (
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	JWT      JWTConfig
	CORS     CORSConfig
	Upload   UploadConfig
	Logging  LoggingConfig
}

type ServerConfig struct {
	Port string
	Env  string
}

type DatabaseConfig struct {
	URL      string // Database URL (Railway format)
	Host     string
	Port     string
	User     string
	Password string
	Name     string
	SSLMode  string
}

type JWTConfig struct {
	Secret     string
	Expiration int // hours
}

type UploadConfig struct {
	Path    string
	BaseURL string
	MaxSize int64 // in bytes
}

type LoggingConfig struct {
	Level  string // DEBUG, INFO, WARN, ERROR
	Format string // json, text, emoji
	Output string // console, file, file-rotate (comma-separated)
}

type CORSConfig struct {
	AllowedOrigins []string
	AllowedMethods []string
	AllowedHeaders []string
}

func Load() (*Config, error) {
	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	cfg := &Config{
		Server: ServerConfig{
			Port: getEnv("PORT", getEnv("SERVER_PORT", "8080")), // Railway uses PORT env var
			Env:  getEnv("SERVER_ENV", "development"),
		},
		Database: DatabaseConfig{
			URL:      getEnv("DATABASE_URL", ""), // Railway format
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", ""),
			Name:     getEnv("DB_NAME", "myblog"),
			SSLMode:  getEnv("DB_SSL_MODE", "disable"),
		},
		JWT: JWTConfig{
			Secret:     getEnv("JWT_SECRET", "your-secret-key"),
			Expiration: getEnvAsInt("JWT_EXPIRATION", 24),
		},
		CORS: CORSConfig{
			AllowedOrigins: strings.Split(getEnv("CORS_ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173,http://localhost:5174"), ","),
			AllowedMethods: strings.Split(getEnv("CORS_ALLOWED_METHODS", "GET,POST,PUT,DELETE,OPTIONS"), ","),
			AllowedHeaders: strings.Split(getEnv("CORS_ALLOWED_HEADERS", "Content-Type,Authorization,X-Requested-With"), ","),
		},
		Upload: UploadConfig{
			Path:    getEnv("UPLOAD_PATH", "./uploads"),
			BaseURL: getUploadBaseURL(),
			MaxSize: getEnvAsInt64("UPLOAD_MAX_SIZE", 5<<20), // 5MB default
		},
		Logging: LoggingConfig{
			Level:  getEnv("LOG_LEVEL", "INFO"),
			Format: getEnv("LOG_FORMAT", "auto"),
			Output: getEnv("LOG_OUTPUT", "console"),
		},
	}

	return cfg, nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}

func getEnvAsInt64(key string, defaultValue int64) int64 {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.ParseInt(value, 10, 64); err == nil {
			return intValue
		}
	}
	return defaultValue
}

func getUploadBaseURL() string {
	// Priority order for upload base URL:
	// 1. UPLOAD_BASE_URL environment variable (manual override)
	// 2. Railway deployment URL (RAILWAY_STATIC_URL or auto-detect)
	// 3. localhost fallback for development

	if baseURL := os.Getenv("UPLOAD_BASE_URL"); baseURL != "" {
		return baseURL
	}

	// For Railway deployment, try to detect the public URL
	if railwayURL := os.Getenv("RAILWAY_STATIC_URL"); railwayURL != "" {
		return railwayURL
	}

	// Check if we're in production environment
	if env := os.Getenv("SERVER_ENV"); env == "production" {
		// In production without explicit URL, try to construct from Railway pattern
		if serviceName := os.Getenv("RAILWAY_SERVICE_NAME"); serviceName != "" {
			return "https://" + serviceName + ".up.railway.app"
		}
		// Generic Railway URL pattern - you should update this with your actual URL
		return "https://myblog-production-f427.up.railway.app"
	}

	// Development fallback
	port := getEnv("PORT", getEnv("SERVER_PORT", "8080"))
	return "http://localhost:" + port
}
