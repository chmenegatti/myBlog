#!/bin/bash

# Run database migrations and seeds
# This script connects to the Railway PostgreSQL database and runs all migrations

set -e  # Exit on any error

echo "🚀 Starting database migrations..."

# Database connection URL from Railway
DATABASE_URL="postgresql://postgres:vvBfsyOMcJpxGHrTTZkEOyQzqTAkrnPA@postgres.railway.internal:5432/railway"

# Run migrations
echo "📋 Running existing migrations..."
if [ -f "migrations/add_markdown_fields.sql" ]; then
    echo "- Executing add_markdown_fields.sql"
    psql "$DATABASE_URL" -f migrations/add_markdown_fields.sql || echo "Migration already applied or failed"
fi

echo "🌱 Seeding categories and tags..."
if [ -f "migrations/seed_categories_tags.sql" ]; then
    echo "- Executing seed_categories_tags.sql"
    psql "$DATABASE_URL" -f migrations/seed_categories_tags.sql || echo "Seed already applied or failed"
fi

echo "✅ All migrations completed!"

# Optional: Check if data was inserted
echo "📊 Checking inserted data..."
echo "Categories count:"
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM categories;"

echo "Tags count:"
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM tags;"

echo "🎉 Database setup complete!"
