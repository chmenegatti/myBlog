-- Migration: Add markdown support fields to posts table
-- Add this to your database migration

ALTER TABLE posts 
ADD COLUMN content_html TEXT,
ADD COLUMN reading_time INTEGER DEFAULT 0,
ADD COLUMN word_count INTEGER DEFAULT 0;

-- Create index for better performance on reading_time queries
CREATE INDEX idx_posts_reading_time ON posts(reading_time);

-- Create index for word_count queries  
CREATE INDEX idx_posts_word_count ON posts(word_count);

-- Update existing posts to have empty content_html
UPDATE posts SET content_html = '' WHERE content_html IS NULL;
