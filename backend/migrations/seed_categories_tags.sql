-- Migration: Insert initial categories and tags
-- Description: Populate database with default categories and tags for the blog

-- Insert Categories
INSERT INTO categories (id, name, slug, description, color, created_at, updated_at) VALUES
(gen_random_uuid(), 'Technology', 'technology', 'Articles about technology, programming, and software development', '#3B82F6', NOW(), NOW()),
(gen_random_uuid(), 'Web Development', 'web-development', 'Frontend and backend development tutorials and tips', '#10B981', NOW(), NOW()),
(gen_random_uuid(), 'Design', 'design', 'UI/UX design, visual design, and design thinking', '#8B5CF6', NOW(), NOW()),
(gen_random_uuid(), 'Programming', 'programming', 'Programming languages, algorithms, and coding practices', '#F59E0B', NOW(), NOW()),
(gen_random_uuid(), 'DevOps', 'devops', 'DevOps practices, CI/CD, and infrastructure', '#EF4444', NOW(), NOW()),
(gen_random_uuid(), 'Mobile', 'mobile', 'Mobile app development for iOS and Android', '#06B6D4', NOW(), NOW()),
(gen_random_uuid(), 'Database', 'database', 'Database design, optimization, and management', '#84CC16', NOW(), NOW()),
(gen_random_uuid(), 'Cloud Computing', 'cloud-computing', 'Cloud platforms, serverless, and distributed systems', '#A855F7', NOW(), NOW()),
(gen_random_uuid(), 'AI & Machine Learning', 'ai-machine-learning', 'Artificial Intelligence and Machine Learning topics', '#EC4899', NOW(), NOW()),
(gen_random_uuid(), 'Career', 'career', 'Career advice, interviews, and professional development', '#F97316', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Insert Tags  
INSERT INTO tags (id, name, slug, created_at, updated_at) VALUES
-- Programming Languages
(gen_random_uuid(), 'JavaScript', 'javascript', NOW(), NOW()),
(gen_random_uuid(), 'TypeScript', 'typescript', NOW(), NOW()),
(gen_random_uuid(), 'Python', 'python', NOW(), NOW()),
(gen_random_uuid(), 'Go', 'go', NOW(), NOW()),
(gen_random_uuid(), 'Java', 'java', NOW(), NOW()),
(gen_random_uuid(), 'C#', 'csharp', NOW(), NOW()),
(gen_random_uuid(), 'PHP', 'php', NOW(), NOW()),
(gen_random_uuid(), 'Rust', 'rust', NOW(), NOW()),

-- Frameworks & Libraries
(gen_random_uuid(), 'React', 'react', NOW(), NOW()),
(gen_random_uuid(), 'Vue.js', 'vuejs', NOW(), NOW()),
(gen_random_uuid(), 'Angular', 'angular', NOW(), NOW()),
(gen_random_uuid(), 'Next.js', 'nextjs', NOW(), NOW()),
(gen_random_uuid(), 'Node.js', 'nodejs', NOW(), NOW()),
(gen_random_uuid(), 'Express', 'express', NOW(), NOW()),
(gen_random_uuid(), 'Django', 'django', NOW(), NOW()),
(gen_random_uuid(), 'Flask', 'flask', NOW(), NOW()),
(gen_random_uuid(), 'Spring Boot', 'spring-boot', NOW(), NOW()),
(gen_random_uuid(), 'Laravel', 'laravel', NOW(), NOW()),

-- Databases
(gen_random_uuid(), 'PostgreSQL', 'postgresql', NOW(), NOW()),
(gen_random_uuid(), 'MySQL', 'mysql', NOW(), NOW()),
(gen_random_uuid(), 'MongoDB', 'mongodb', NOW(), NOW()),
(gen_random_uuid(), 'Redis', 'redis', NOW(), NOW()),

-- Cloud & DevOps
(gen_random_uuid(), 'AWS', 'aws', NOW(), NOW()),
(gen_random_uuid(), 'Azure', 'azure', NOW(), NOW()),
(gen_random_uuid(), 'Google Cloud', 'google-cloud', NOW(), NOW()),
(gen_random_uuid(), 'Docker', 'docker', NOW(), NOW()),
(gen_random_uuid(), 'Kubernetes', 'kubernetes', NOW(), NOW()),
(gen_random_uuid(), 'CI/CD', 'cicd', NOW(), NOW()),

-- Tools & Technologies
(gen_random_uuid(), 'Git', 'git', NOW(), NOW()),
(gen_random_uuid(), 'VS Code', 'vscode', NOW(), NOW()),
(gen_random_uuid(), 'Figma', 'figma', NOW(), NOW()),
(gen_random_uuid(), 'API', 'api', NOW(), NOW()),
(gen_random_uuid(), 'REST', 'rest', NOW(), NOW()),
(gen_random_uuid(), 'GraphQL', 'graphql', NOW(), NOW()),

-- Concepts
(gen_random_uuid(), 'Microservices', 'microservices', NOW(), NOW()),
(gen_random_uuid(), 'Clean Code', 'clean-code', NOW(), NOW()),
(gen_random_uuid(), 'Testing', 'testing', NOW(), NOW()),
(gen_random_uuid(), 'Performance', 'performance', NOW(), NOW()),
(gen_random_uuid(), 'Security', 'security', NOW(), NOW()),
(gen_random_uuid(), 'Tutorial', 'tutorial', NOW(), NOW()),
(gen_random_uuid(), 'Best Practices', 'best-practices', NOW(), NOW()),
(gen_random_uuid(), 'Tips', 'tips', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;
