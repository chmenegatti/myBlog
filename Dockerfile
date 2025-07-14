# Build stage
FROM golang:1.24.5-alpine AS builder

# Install git and ca-certificates
RUN apk add --no-cache git ca-certificates

WORKDIR /app

# Copy go mod files
COPY backend/go.mod backend/go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY backend/ ./

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/main.go

# Final stage
FROM alpine:latest

# Install ca-certificates, timezone data, and curl for health checks
RUN apk --no-cache add ca-certificates tzdata curl

WORKDIR /app

# Copy the binary from builder stage
COPY --from=builder /app/main .

# Copy migration files if they exist
COPY backend/migrations/ ./migrations/

# Create uploads directory
RUN mkdir -p /app/uploads

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8080}/health || exit 1

# Expose port (Railway uses PORT environment variable)
EXPOSE $PORT

# Command to run
CMD ["./main"]
