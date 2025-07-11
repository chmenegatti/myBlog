package logger

import (
	"os"
	"strings"

	"github.com/chmenegatti/lazylog"
)

// Global logger instance
var Logger *lazylog.Logger

// Initialize initializes the global logger with the provided configuration
func Initialize(logLevel, logFormat, logOutput string) error {
	level := parseLogLevel(logLevel)
	formatter := parseLogFormatter(logFormat)

	var transports []lazylog.Transport

	// Create logs directory if it doesn't exist
	if err := os.MkdirAll("logs", 0755); err != nil {
		// If we can't create logs directory, fall back to console only
		Logger = lazylog.NewLogger(&lazylog.ConsoleTransport{
			Level:     level,
			Formatter: &lazylog.TextFormatter{}, // Use safe formatter
		})
		return nil
	}

	// Parse output destinations
	outputs := strings.Split(logOutput, ",")
	for _, output := range outputs {
		output = strings.TrimSpace(output)
		switch output {
		case "console":
			transports = append(transports, &lazylog.ConsoleTransport{
				Level:     level,
				Formatter: formatter,
			})
		case "file":
			fileTransport, err := lazylog.NewFileTransport("logs/app.log", level, &lazylog.JSONFormatter{})
			if err == nil {
				transports = append(transports, fileTransport)
			}
		case "file-rotate":
			lumberjackTransport := lazylog.NewLumberjackTransport(
				"logs/app.log",
				level,
				&lazylog.JSONFormatter{},
				10,   // maxSize MB
				5,    // maxBackups
				30,   // maxAge days
				true, // compress
			)
			transports = append(transports, lumberjackTransport)
		}
	}

	// Default to console if no valid output found
	if len(transports) == 0 {
		transports = append(transports, &lazylog.ConsoleTransport{
			Level:     level,
			Formatter: &lazylog.TextFormatter{}, // Use safe formatter
		})
	}

	Logger = lazylog.NewLogger(transports...)

	// Test the logger to make sure it works
	defer func() {
		if r := recover(); r != nil {
			// If logger panics, fall back to a simple console logger
			Logger = lazylog.NewLogger(&lazylog.ConsoleTransport{
				Level:     level,
				Formatter: &lazylog.TextFormatter{},
			})
		}
	}()

	// Test log to verify everything works
	Logger.Info("Logger initialized successfully")

	return nil
}

// parseLogLevel converts string level to lazylog level
func parseLogLevel(level string) lazylog.Level {
	switch strings.ToUpper(level) {
	case "DEBUG":
		return lazylog.DEBUG
	case "INFO":
		return lazylog.INFO
	case "WARN", "WARNING":
		return lazylog.WARN
	case "ERROR":
		return lazylog.ERROR
	default:
		return lazylog.INFO
	}
}

// parseLogFormatter converts string format to lazylog formatter
func parseLogFormatter(format string) lazylog.Formatter {
	switch strings.ToLower(format) {
	case "json":
		return &lazylog.JSONFormatter{}
	case "text":
		return &lazylog.TextFormatter{}
	case "emoji":
		// EmojiFormatter seems to have issues, fall back to TextFormatter for now
		return &lazylog.TextFormatter{}
	default:
		// Use text formatter for development, json for production
		if os.Getenv("SERVER_ENV") == "production" {
			return &lazylog.JSONFormatter{}
		}
		return &lazylog.TextFormatter{}
	}
}

// Helper functions for structured logging with common fields

// WithRequestID adds request_id field to log
func WithRequestID(requestID string) *lazylog.ChildLogger {
	return Logger.WithFields(map[string]any{
		"request_id": requestID,
	})
}

// WithUserID adds user_id field to log
func WithUserID(userID string) *lazylog.ChildLogger {
	return Logger.WithFields(map[string]any{
		"user_id": userID,
	})
}

// WithService adds service field to log
func WithService(service string) *lazylog.ChildLogger {
	return Logger.WithFields(map[string]any{
		"service": service,
	})
}

// WithError adds error field to log
func WithError(err error) *lazylog.ChildLogger {
	return Logger.WithFields(map[string]any{
		"error": err.Error(),
	})
}

// WithFields adds custom fields to log
func WithFields(fields map[string]any) *lazylog.ChildLogger {
	return Logger.WithFields(fields)
}

// HTTP middleware logging helpers

// WithHTTPRequest adds HTTP request fields
func WithHTTPRequest(method, path, userAgent, clientIP string, statusCode int, latency string) *lazylog.ChildLogger {
	return Logger.WithFields(map[string]any{
		"method":     method,
		"path":       path,
		"status":     statusCode,
		"latency":    latency,
		"user_agent": userAgent,
		"client_ip":  clientIP,
	})
}

// Database operation logging helpers

// WithDBOperation adds database operation fields
func WithDBOperation(operation, table string, affectedRows int64, duration string) *lazylog.ChildLogger {
	return Logger.WithFields(map[string]any{
		"db_operation":   operation,
		"db_table":       table,
		"affected_rows":  affectedRows,
		"query_duration": duration,
	})
}

// Authentication logging helpers

// WithAuth adds authentication fields
func WithAuth(userEmail, action string, success bool) *lazylog.ChildLogger {
	return Logger.WithFields(map[string]any{
		"auth_user":    userEmail,
		"auth_action":  action,
		"auth_success": success,
	})
}

// File upload logging helpers

// WithFileUpload adds file upload fields
func WithFileUpload(fileName, fileType, category string, fileSize int64, userID string) *lazylog.ChildLogger {
	return Logger.WithFields(map[string]any{
		"file_name":     fileName,
		"file_type":     fileType,
		"file_category": category,
		"file_size":     fileSize,
		"uploaded_by":   userID,
	})
}

// Business logic logging helpers

// WithPost adds post-related fields
func WithPost(postID, title, action string) *lazylog.ChildLogger {
	return Logger.WithFields(map[string]any{
		"post_id":     postID,
		"post_title":  title,
		"post_action": action,
	})
}

// WithUser adds user-related fields
func WithUser(userID, email, action string) *lazylog.ChildLogger {
	return Logger.WithFields(map[string]any{
		"target_user_id":    userID,
		"target_user_email": email,
		"user_action":       action,
	})
}

// Performance logging helpers

// WithPerformance adds performance metrics
func WithPerformance(operation string, duration string, memoryUsage int64) *lazylog.ChildLogger {
	return Logger.WithFields(map[string]any{
		"operation":    operation,
		"duration":     duration,
		"memory_usage": memoryUsage,
	})
}

// Security logging helpers

// WithSecurity adds security-related fields
func WithSecurity(action, resource, reason string, severity string) *lazylog.ChildLogger {
	return Logger.WithFields(map[string]any{
		"security_action":   action,
		"security_resource": resource,
		"security_reason":   reason,
		"security_severity": severity,
	})
}

// Direct logging methods for convenience

// Debug logs a debug message
func Debug(msg string, fields ...map[string]any) {
	if len(fields) > 0 {
		Logger.WithFields(fields[0]).Debug(msg)
	} else {
		Logger.Debug(msg)
	}
}

// Info logs an info message
func Info(msg string, fields ...map[string]any) {
	if len(fields) > 0 {
		Logger.WithFields(fields[0]).Info(msg)
	} else {
		Logger.Info(msg)
	}
}

// Warn logs a warning message
func Warn(msg string, fields ...map[string]any) {
	if len(fields) > 0 {
		Logger.WithFields(fields[0]).Warn(msg)
	} else {
		Logger.Warn(msg)
	}
}

// Error logs an error message
func Error(msg string, fields ...map[string]any) {
	if len(fields) > 0 {
		Logger.WithFields(fields[0]).Error(msg)
	} else {
		Logger.Error(msg)
	}
}
