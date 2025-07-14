-- Migration: Insert initial categories and tags
-- Description: Populate database with default categories and tags for the blog

-- Insert Categories
INSERT INTO categories (id, name, slug, description, color, created_at, updated_at) VALUES
-- Go Language Categories
(gen_random_uuid(), 'Go Básico', 'go-basico', 'Fundamentos e conceitos básicos da linguagem Go', '#00ADD8', NOW(), NOW()),
(gen_random_uuid(), 'Go Avançado', 'go-avancado', 'Conceitos avançados e técnicas especializadas em Go', '#5DCFFF', NOW(), NOW()),
(gen_random_uuid(), 'Padrões de Concorrência', 'padroes-concorrencia', 'Goroutines, channels e padrões de concorrência em Go', '#00758F', NOW(), NOW()),
(gen_random_uuid(), 'Testes em Go', 'testes-em-go', 'Testing, benchmarks e qualidade de código', '#FFD23F', NOW(), NOW()),
(gen_random_uuid(), 'Performance', 'performance', 'Otimização e análise de performance em Go', '#FF6B35', NOW(), NOW()),

-- Architecture Categories
(gen_random_uuid(), 'Arquitetura de Software', 'arquitetura-de-software', 'Design e arquitetura de sistemas', '#8B5CF6', NOW(), NOW()),
(gen_random_uuid(), 'Microsserviços', 'microsservicos', 'Arquitetura e implementação de microsserviços', '#10B981', NOW(), NOW()),
(gen_random_uuid(), 'Domain-Driven Design (DDD)', 'domain-driven-design', 'DDD e modelagem de domínio', '#3B82F6', NOW(), NOW()),
(gen_random_uuid(), 'Clean Architecture', 'clean-architecture', 'Princípios de arquitetura limpa', '#06B6D4', NOW(), NOW()),
(gen_random_uuid(), 'Padrões de Projeto', 'padroes-de-projeto', 'Design patterns e boas práticas', '#8B5CF6', NOW(), NOW()),

-- Systems Categories
(gen_random_uuid(), 'Sistemas Distribuídos', 'sistemas-distribuidos', 'Sistemas distribuídos e escalabilidade', '#A855F7', NOW(), NOW()),
(gen_random_uuid(), 'APIs e Webservices', 'apis-webservices', 'REST, GraphQL e desenvolvimento de APIs', '#10B981', NOW(), NOW()),
(gen_random_uuid(), 'Bancos de Dados', 'bancos-de-dados', 'Integração e otimização de bancos de dados', '#84CC16', NOW(), NOW()),
(gen_random_uuid(), 'Mensageria', 'mensageria', 'Message queues e comunicação assíncrona', '#F59E0B', NOW(), NOW()),

-- DevOps Categories
(gen_random_uuid(), 'DevOps e Infra', 'devops-infra', 'DevOps, infraestrutura e deployment', '#EF4444', NOW(), NOW()),
(gen_random_uuid(), 'CI/CD', 'ci-cd', 'Continuous Integration e Continuous Deployment', '#06B6D4', NOW(), NOW()),
(gen_random_uuid(), 'Observabilidade', 'observabilidade', 'Monitoramento, logging e métricas', '#8B5CF6', NOW(), NOW()),
(gen_random_uuid(), 'Segurança', 'seguranca', 'Segurança em aplicações e infraestrutura', '#EF4444', NOW(), NOW()),

-- Community Categories
(gen_random_uuid(), 'Carreira e Mercado', 'carreira-mercado', 'Carreira, mercado de trabalho e dicas profissionais', '#F97316', NOW(), NOW()),
(gen_random_uuid(), 'Tutoriais', 'tutoriais', 'Tutoriais passo a passo e guias práticos', '#10B981', NOW(), NOW()),
(gen_random_uuid(), 'Estudos de Caso', 'estudos-de-caso', 'Casos reais e exemplos práticos', '#3B82F6', NOW(), NOW()),
(gen_random_uuid(), 'Ferramentas', 'ferramentas', 'Ferramentas e utilitários para desenvolvimento', '#8B5CF6', NOW(), NOW()),
(gen_random_uuid(), 'Boas Práticas', 'boas-praticas', 'Melhores práticas e convenções', '#06B6D4', NOW(), NOW()),
(gen_random_uuid(), 'Projetos da Comunidade', 'projetos-comunidade', 'Projetos open source e da comunidade', '#84CC16', NOW(), NOW()),
(gen_random_uuid(), 'Biblioteca Padrão', 'biblioteca-padrao', 'Explorando a biblioteca padrão do Go', '#00ADD8', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Insert Tags  
INSERT INTO tags (id, name, slug, created_at, updated_at) VALUES
-- Go Fundamentals
(gen_random_uuid(), 'golang', 'golang', NOW(), NOW()),
(gen_random_uuid(), 'go-basics', 'go-basics', NOW(), NOW()),
(gen_random_uuid(), 'goroutines', 'goroutines', NOW(), NOW()),
(gen_random_uuid(), 'channels', 'channels', NOW(), NOW()),
(gen_random_uuid(), 'interfaces', 'interfaces', NOW(), NOW()),
(gen_random_uuid(), 'structs', 'structs', NOW(), NOW()),
(gen_random_uuid(), 'pointers', 'pointers', NOW(), NOW()),
(gen_random_uuid(), 'slices', 'slices', NOW(), NOW()),
(gen_random_uuid(), 'maps', 'maps', NOW(), NOW()),
(gen_random_uuid(), 'functions', 'functions', NOW(), NOW()),

-- Go Advanced
(gen_random_uuid(), 'reflection', 'reflection', NOW(), NOW()),
(gen_random_uuid(), 'generics', 'generics', NOW(), NOW()),
(gen_random_uuid(), 'modules', 'modules', NOW(), NOW()),
(gen_random_uuid(), 'embedding', 'embedding', NOW(), NOW()),
(gen_random_uuid(), 'type-assertion', 'type-assertion', NOW(), NOW()),
(gen_random_uuid(), 'context', 'context', NOW(), NOW()),
(gen_random_uuid(), 'sync', 'sync', NOW(), NOW()),
(gen_random_uuid(), 'atomic', 'atomic', NOW(), NOW()),

-- Testing & Quality
(gen_random_uuid(), 'testing', 'testing', NOW(), NOW()),
(gen_random_uuid(), 'benchmarks', 'benchmarks', NOW(), NOW()),
(gen_random_uuid(), 'fuzzing', 'fuzzing', NOW(), NOW()),
(gen_random_uuid(), 'testify', 'testify', NOW(), NOW()),
(gen_random_uuid(), 'mocking', 'mocking', NOW(), NOW()),
(gen_random_uuid(), 'code-coverage', 'code-coverage', NOW(), NOW()),
(gen_random_uuid(), 'profiling', 'profiling', NOW(), NOW()),

-- Web & APIs
(gen_random_uuid(), 'gin', 'gin', NOW(), NOW()),
(gen_random_uuid(), 'echo', 'echo', NOW(), NOW()),
(gen_random_uuid(), 'fiber', 'fiber', NOW(), NOW()),
(gen_random_uuid(), 'http', 'http', NOW(), NOW()),
(gen_random_uuid(), 'rest-api', 'rest-api', NOW(), NOW()),
(gen_random_uuid(), 'grpc', 'grpc', NOW(), NOW()),
(gen_random_uuid(), 'graphql', 'graphql', NOW(), NOW()),
(gen_random_uuid(), 'websockets', 'websockets', NOW(), NOW()),

-- Databases
(gen_random_uuid(), 'gorm', 'gorm', NOW(), NOW()),
(gen_random_uuid(), 'sqlx', 'sqlx', NOW(), NOW()),
(gen_random_uuid(), 'postgresql', 'postgresql', NOW(), NOW()),
(gen_random_uuid(), 'mysql', 'mysql', NOW(), NOW()),
(gen_random_uuid(), 'mongodb', 'mongodb', NOW(), NOW()),
(gen_random_uuid(), 'redis', 'redis', NOW(), NOW()),
(gen_random_uuid(), 'migrations', 'migrations', NOW(), NOW()),

-- Architecture & Patterns
(gen_random_uuid(), 'clean-architecture', 'clean-architecture', NOW(), NOW()),
(gen_random_uuid(), 'hexagonal', 'hexagonal', NOW(), NOW()),
(gen_random_uuid(), 'ddd', 'ddd', NOW(), NOW()),
(gen_random_uuid(), 'microservices', 'microservices', NOW(), NOW()),
(gen_random_uuid(), 'design-patterns', 'design-patterns', NOW(), NOW()),

-- DevOps & Tools
(gen_random_uuid(), 'docker', 'docker', NOW(), NOW()),
(gen_random_uuid(), 'kubernetes', 'kubernetes', NOW(), NOW()),
(gen_random_uuid(), 'ci-cd', 'ci-cd', NOW(), NOW()),
(gen_random_uuid(), 'github-actions', 'github-actions', NOW(), NOW()),
(gen_random_uuid(), 'monitoring', 'monitoring', NOW(), NOW()),
(gen_random_uuid(), 'logging', 'logging', NOW(), NOW()),

-- Cloud & Infrastructure
(gen_random_uuid(), 'aws', 'aws', NOW(), NOW()),
(gen_random_uuid(), 'gcp', 'gcp', NOW(), NOW()),
(gen_random_uuid(), 'azure', 'azure', NOW(), NOW()),
(gen_random_uuid(), 'serverless', 'serverless', NOW(), NOW()),
(gen_random_uuid(), 'kafka', 'kafka', NOW(), NOW()),

-- Performance & Security
(gen_random_uuid(), 'performance', 'performance', NOW(), NOW()),
(gen_random_uuid(), 'optimization', 'optimization', NOW(), NOW()),
(gen_random_uuid(), 'security', 'security', NOW(), NOW()),
(gen_random_uuid(), 'authentication', 'authentication', NOW(), NOW()),
(gen_random_uuid(), 'jwt', 'jwt', NOW(), NOW()),

-- Community & Learning
(gen_random_uuid(), 'tutorial', 'tutorial', NOW(), NOW()),
(gen_random_uuid(), 'beginner', 'beginner', NOW(), NOW()),
(gen_random_uuid(), 'intermediate', 'intermediate', NOW(), NOW()),
(gen_random_uuid(), 'advanced', 'advanced', NOW(), NOW()),
(gen_random_uuid(), 'best-practices', 'best-practices', NOW(), NOW()),
(gen_random_uuid(), 'tips', 'tips', NOW(), NOW()),
(gen_random_uuid(), 'opensource', 'opensource', NOW(), NOW()),
(gen_random_uuid(), 'community', 'community', NOW(), NOW()),
(gen_random_uuid(), 'career', 'career', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;
