package middleware

import (
	"time"

	"github.com/chmenegatti/myBlog/internal/logger"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// RequestLogger creates a new request logging middleware using lazylog
func RequestLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Generate request ID
		requestID := uuid.New().String()
		c.Set("request_id", requestID)

		// Start timer
		start := time.Now()

		// Process request
		c.Next()

		// Calculate latency
		latency := time.Since(start)

		// Log request details
		status := c.Writer.Status()
		method := c.Request.Method
		path := c.Request.URL.Path
		userAgent := c.Request.UserAgent()
		clientIP := c.ClientIP()

		// Get user ID if available
		userID := ""
		if userIDInterface, exists := c.Get("user_id"); exists {
			if uid, ok := userIDInterface.(string); ok {
				userID = uid
			}
		}

		// Log level based on status code
		logLevel := "info"
		if status >= 400 && status < 500 {
			logLevel = "warn"
		} else if status >= 500 {
			logLevel = "error"
		}

		// Create log entry with structured fields
		fields := map[string]any{
			"request_id": requestID,
			"user_id":    userID,
		}

		// Log based on level
		switch logLevel {
		case "error":
			logger.WithHTTPRequest(method, path, userAgent, clientIP, status, latency.String()).Error("HTTP request completed", fields)
		case "warn":
			logger.WithHTTPRequest(method, path, userAgent, clientIP, status, latency.String()).Warn("HTTP request completed", fields)
		default:
			logger.WithHTTPRequest(method, path, userAgent, clientIP, status, latency.String()).Info("HTTP request completed", fields)
		}
	}
}

// ErrorLogger logs errors with structured format
func ErrorLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		// Log any errors that occurred during request processing
		for _, err := range c.Errors {
			requestID, _ := c.Get("request_id")
			userID, _ := c.Get("user_id")

			logger.WithFields(map[string]any{
				"request_id": requestID,
				"user_id":    userID,
				"method":     c.Request.Method,
				"path":       c.Request.URL.Path,
				"error":      err.Error(),
				"error_type": err.Type,
			}).Error("Request error occurred")
		}
	}
}

// Recovery is a custom recovery middleware with structured logging
func Recovery() gin.HandlerFunc {
	return gin.CustomRecovery(func(c *gin.Context, recovered any) {
		requestID, _ := c.Get("request_id")
		userID, _ := c.Get("user_id")

		// Log panic with stack trace
		fields := map[string]any{
			"request_id": requestID,
			"user_id":    userID,
			"method":     c.Request.Method,
			"path":       c.Request.URL.Path,
			"panic":      recovered,
		}

		logger.WithSecurity("panic_recovered", c.Request.URL.Path, "Application panic recovered", "critical").Error("Application panic recovered", fields)

		c.AbortWithStatus(500)
	})
}

// PerformanceLogger logs slow requests
func PerformanceLogger(threshold time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next()
		duration := time.Since(start)

		// Log slow requests
		if duration > threshold {
			requestID, _ := c.Get("request_id")
			userID, _ := c.Get("user_id")

			fields := map[string]any{
				"request_id": requestID,
				"user_id":    userID,
				"method":     c.Request.Method,
				"path":       c.Request.URL.Path,
				"status":     c.Writer.Status(),
				"threshold":  threshold.String(),
			}

			logger.WithPerformance("http_request", duration.String(), 0).Warn("Slow request detected", fields)
		}
	}
}

// DatabaseLogger logs database operations (to be used in repositories)
func LogDatabaseOperation(operation, table string, startTime time.Time, affectedRows int64, err error) {
	duration := time.Since(startTime)

	logEntry := logger.WithDBOperation(operation, table, affectedRows, duration.String())

	if err != nil {
		fields := map[string]any{
			"error": err.Error(),
		}
		logEntry.Error("Database operation failed", fields)
	} else {
		logEntry.Debug("Database operation completed")
	}
}

// AuthLogger logs authentication attempts
func LogAuthAttempt(email, action string, success bool, reason string) {
	logEntry := logger.WithAuth(email, action, success)

	if !success {
		fields := map[string]any{
			"reason": reason,
		}
		logEntry.Warn("Authentication failed", fields)
	} else {
		logEntry.Info("Authentication successful")
	}
}

// SecurityLogger logs security events
func LogSecurityEvent(action, resource, userID, reason, severity string) {
	fields := map[string]any{
		"user_id": userID,
	}
	logger.WithSecurity(action, resource, reason, severity).Warn("Security event logged", fields)
}

// BusinessLogger logs business operations
func LogBusinessOperation(operation string, userID string, details map[string]any) {
	// Merge user_id and operation into details
	allFields := make(map[string]any)
	for k, v := range details {
		allFields[k] = v
	}
	allFields["user_id"] = userID
	allFields["operation"] = operation

	logger.Info("Business operation completed", allFields)
}
