#!/bin/bash

# Frontend Development Helper Script

echo "🚀 MyBlog Frontend Development"
echo "=============================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    yarn install
fi

# Start development server
echo "🎯 Starting development server..."
echo "📍 Frontend: http://localhost:5173"
echo "📍 Backend API: http://localhost:8080/api"
echo ""
echo "💡 Tips:"
echo "   - Backend not required for initial development (using mock data)"
echo "   - Press Ctrl+C to stop the server"
echo "   - Check README.md for more information"
echo ""

yarn dev
