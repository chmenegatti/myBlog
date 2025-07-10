#!/bin/bash

# Setup script for development environment

echo "🚀 Setting up Blog development environment..."

# Check if Go is installed
if ! command -v go &> /dev/null; then
    echo "❌ Go is not installed. Please install Go 1.21+ first."
    exit 1
fi

echo "✅ Go is installed: $(go version)"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✅ Docker is installed: $(docker --version)"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker Compose is installed: $(docker-compose --version)"

# Copy environment file
if [ ! -f backend/.env ]; then
    echo "📄 Creating .env file from template..."
    cp backend/.env.example backend/.env
    echo "✅ .env file created. Please edit backend/.env with your settings."
else
    echo "⚠️  .env file already exists."
fi

# Download Go dependencies
echo "📦 Downloading Go dependencies..."
cd backend && go mod download && cd ..

# Build the application
echo "🔨 Building the application..."
cd backend && go build -o bin/myblog cmd/main.go && cd ..

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your database settings"
echo "2. Run 'make docker-up' to start the application with Docker"
echo "3. Or run 'make dev' to start in development mode"
echo ""
echo "The API will be available at: http://localhost:8080"
echo "Health check: http://localhost:8080/health"
