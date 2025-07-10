-- Initial database setup
-- This file will be executed when the PostgreSQL container starts for the first time

-- Create the main database (if not exists)
SELECT 'CREATE DATABASE myblog_dev' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'myblog_dev')\gexec

-- You can add more initial SQL commands here if needed
-- For example, create initial users, setup extensions, etc.

-- Enable UUID extension (will be used by GORM)
\c myblog_dev;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
