package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

func main() {
	// Get DATABASE_URL from environment
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL environment variable is required")
	}

	// Connect to database
	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Test connection
	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	fmt.Println("🚀 Connected to database, running migrations...")

	// Run categories migration
	if err := seedCategories(db); err != nil {
		log.Printf("Categories migration failed (might already exist): %v", err)
	} else {
		fmt.Println("✅ Categories seeded successfully")
	}

	// Run tags migration
	if err := seedTags(db); err != nil {
		log.Printf("Tags migration failed (might already exist): %v", err)
	} else {
		fmt.Println("✅ Tags seeded successfully")
	}

	// Check results
	var categoryCount, tagCount int
	db.QueryRow("SELECT COUNT(*) FROM categories").Scan(&categoryCount)
	db.QueryRow("SELECT COUNT(*) FROM tags").Scan(&tagCount)

	fmt.Printf("📊 Database contains %d categories and %d tags\n", categoryCount, tagCount)
	fmt.Println("🎉 Migration completed!")
}

func seedCategories(db *sql.DB) error {
	categories := []struct {
		name, slug, description, color string
	}{
		{"Technology", "technology", "Articles about technology, programming, and software development", "#3B82F6"},
		{"Web Development", "web-development", "Frontend and backend development tutorials and tips", "#10B981"},
		{"Design", "design", "UI/UX design, visual design, and design thinking", "#8B5CF6"},
		{"Programming", "programming", "Programming languages, algorithms, and coding practices", "#F59E0B"},
		{"DevOps", "devops", "DevOps practices, CI/CD, and infrastructure", "#EF4444"},
		{"Mobile", "mobile", "Mobile app development for iOS and Android", "#06B6D4"},
		{"Database", "database", "Database design, optimization, and management", "#84CC16"},
		{"Cloud Computing", "cloud-computing", "Cloud platforms, serverless, and distributed systems", "#A855F7"},
		{"AI & Machine Learning", "ai-machine-learning", "Artificial Intelligence and Machine Learning topics", "#EC4899"},
		{"Career", "career", "Career advice, interviews, and professional development", "#F97316"},
	}

	for _, cat := range categories {
		_, err := db.Exec(`
			INSERT INTO categories (id, name, slug, description, color, created_at, updated_at) 
			VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
			ON CONFLICT (slug) DO NOTHING`,
			cat.name, cat.slug, cat.description, cat.color)
		if err != nil {
			return err
		}
	}
	return nil
}

func seedTags(db *sql.DB) error {
	tags := []struct {
		name, slug string
	}{
		// Programming Languages
		{"JavaScript", "javascript"},
		{"TypeScript", "typescript"},
		{"Python", "python"},
		{"Go", "go"},
		{"Java", "java"},
		{"C#", "csharp"},
		{"PHP", "php"},
		{"Rust", "rust"},
		// Frameworks
		{"React", "react"},
		{"Vue.js", "vuejs"},
		{"Angular", "angular"},
		{"Next.js", "nextjs"},
		{"Node.js", "nodejs"},
		{"Express", "express"},
		{"Django", "django"},
		{"Flask", "flask"},
		{"Spring Boot", "spring-boot"},
		{"Laravel", "laravel"},
		// Databases
		{"PostgreSQL", "postgresql"},
		{"MySQL", "mysql"},
		{"MongoDB", "mongodb"},
		{"Redis", "redis"},
		// Cloud & DevOps
		{"AWS", "aws"},
		{"Azure", "azure"},
		{"Google Cloud", "google-cloud"},
		{"Docker", "docker"},
		{"Kubernetes", "kubernetes"},
		{"CI/CD", "cicd"},
		// Tools
		{"Git", "git"},
		{"VS Code", "vscode"},
		{"Figma", "figma"},
		{"API", "api"},
		{"REST", "rest"},
		{"GraphQL", "graphql"},
		// Concepts
		{"Microservices", "microservices"},
		{"Clean Code", "clean-code"},
		{"Testing", "testing"},
		{"Performance", "performance"},
		{"Security", "security"},
		{"Tutorial", "tutorial"},
		{"Best Practices", "best-practices"},
		{"Tips", "tips"},
	}

	for _, tag := range tags {
		_, err := db.Exec(`
			INSERT INTO tags (id, name, slug, created_at, updated_at) 
			VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())
			ON CONFLICT (slug) DO NOTHING`,
			tag.name, tag.slug)
		if err != nil {
			return err
		}
	}
	return nil
}
