package handlers

import (
	"net/http"
	"strconv"

	"github.com/chmenegatti/myBlog/internal/models"
	"github.com/chmenegatti/myBlog/internal/services"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// Category Handler
type CategoryHandler struct {
	categoryService services.CategoryService
}

func NewCategoryHandler(categoryService services.CategoryService) *CategoryHandler {
	return &CategoryHandler{categoryService: categoryService}
}

func (h *CategoryHandler) CreateCategory(c *gin.Context) {
	var req services.CreateCategoryRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	category, err := h.categoryService.Create(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create category"})
		return
	}

	c.JSON(http.StatusCreated, category)
}

func (h *CategoryHandler) GetCategories(c *gin.Context) {
	categories, err := h.categoryService.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get categories"})
		return
	}

	c.JSON(http.StatusOK, categories)
}

func (h *CategoryHandler) UpdateCategory(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
		return
	}

	category, err := h.categoryService.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	var req struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		Color       string `json:"color"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Name != "" {
		category.Name = req.Name
	}
	category.Description = req.Description
	if req.Color != "" {
		category.Color = req.Color
	}

	if err := h.categoryService.Update(category); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update category"})
		return
	}

	c.JSON(http.StatusOK, category)
}

func (h *CategoryHandler) DeleteCategory(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
		return
	}

	if err := h.categoryService.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete category"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Category deleted successfully"})
}

// Migration Handler for seeding initial data
type MigrationHandler struct {
	categoryService services.CategoryService
	tagService      services.TagService
}

func NewMigrationHandler(categoryService services.CategoryService, tagService services.TagService) *MigrationHandler {
	return &MigrationHandler{
		categoryService: categoryService,
		tagService:      tagService,
	}
}

func (h *MigrationHandler) SeedInitialData(c *gin.Context) {
	// Seed categories - Updated to match the blog's Go-focused content
	categories := []services.CreateCategoryRequest{
		// Go Language Categories
		{Name: "Go Básico", Description: "Fundamentos e conceitos básicos da linguagem Go", Color: "#00ADD8"},
		{Name: "Go Avançado", Description: "Conceitos avançados e técnicas especializadas em Go", Color: "#5DCFFF"},
		{Name: "Padrões de Concorrência", Description: "Goroutines, channels e padrões de concorrência em Go", Color: "#00758F"},
		{Name: "Testes em Go", Description: "Testing, benchmarks e qualidade de código", Color: "#FFD23F"},
		{Name: "Performance", Description: "Otimização e análise de performance em Go", Color: "#FF6B35"},
		
		// Architecture Categories
		{Name: "Arquitetura de Software", Description: "Design e arquitetura de sistemas", Color: "#8B5CF6"},
		{Name: "Microsserviços", Description: "Arquitetura e implementação de microsserviços", Color: "#10B981"},
		{Name: "Domain-Driven Design (DDD)", Description: "DDD e modelagem de domínio", Color: "#3B82F6"},
		{Name: "Clean Architecture", Description: "Princípios de arquitetura limpa", Color: "#06B6D4"},
		{Name: "Padrões de Projeto", Description: "Design patterns e boas práticas", Color: "#8B5CF6"},
		
		// Systems Categories
		{Name: "Sistemas Distribuídos", Description: "Sistemas distribuídos e escalabilidade", Color: "#A855F7"},
		{Name: "APIs e Webservices", Description: "REST, GraphQL e desenvolvimento de APIs", Color: "#10B981"},
		{Name: "Bancos de Dados", Description: "Integração e otimização de bancos de dados", Color: "#84CC16"},
		{Name: "Mensageria", Description: "Message queues e comunicação assíncrona", Color: "#F59E0B"},
		
		// DevOps Categories
		{Name: "DevOps e Infra", Description: "DevOps, infraestrutura e deployment", Color: "#EF4444"},
		{Name: "CI/CD", Description: "Continuous Integration e Continuous Deployment", Color: "#06B6D4"},
		{Name: "Observabilidade", Description: "Monitoramento, logging e métricas", Color: "#8B5CF6"},
		{Name: "Segurança", Description: "Segurança em aplicações e infraestrutura", Color: "#EF4444"},
		
		// Community Categories
		{Name: "Carreira e Mercado", Description: "Carreira, mercado de trabalho e dicas profissionais", Color: "#F97316"},
		{Name: "Tutoriais", Description: "Tutoriais passo a passo e guias práticos", Color: "#10B981"},
		{Name: "Estudos de Caso", Description: "Casos reais e exemplos práticos", Color: "#3B82F6"},
		{Name: "Ferramentas", Description: "Ferramentas e utilitários para desenvolvimento", Color: "#8B5CF6"},
		{Name: "Boas Práticas", Description: "Melhores práticas e convenções", Color: "#06B6D4"},
		{Name: "Projetos da Comunidade", Description: "Projetos open source e da comunidade", Color: "#84CC16"},
		{Name: "Biblioteca Padrão", Description: "Explorando a biblioteca padrão do Go", Color: "#00ADD8"},
	}

	// Seed tags - Updated to be Go-focused
	tags := []services.CreateTagRequest{
		// Go Fundamentals
		{Name: "golang"}, {Name: "go-basics"}, {Name: "goroutines"}, {Name: "channels"}, {Name: "interfaces"}, 
		{Name: "structs"}, {Name: "pointers"}, {Name: "slices"}, {Name: "maps"}, {Name: "functions"},
		
		// Go Advanced
		{Name: "reflection"}, {Name: "generics"}, {Name: "modules"}, {Name: "embedding"}, {Name: "type-assertion"},
		{Name: "context"}, {Name: "sync"}, {Name: "atomic"}, {Name: "unsafe"}, {Name: "cgo"},
		
		// Testing & Quality
		{Name: "testing"}, {Name: "benchmarks"}, {Name: "fuzzing"}, {Name: "testify"}, {Name: "mocking"},
		{Name: "code-coverage"}, {Name: "race-detection"}, {Name: "profiling"}, {Name: "debugging"},
		
		// Web & APIs
		{Name: "gin"}, {Name: "echo"}, {Name: "fiber"}, {Name: "http"}, {Name: "rest-api"}, 
		{Name: "grpc"}, {Name: "graphql"}, {Name: "websockets"}, {Name: "middleware"}, {Name: "routing"},
		
		// Databases
		{Name: "gorm"}, {Name: "sqlx"}, {Name: "database-sql"}, {Name: "postgresql"}, {Name: "mysql"}, 
		{Name: "mongodb"}, {Name: "redis"}, {Name: "migrations"}, {Name: "orm"}, {Name: "sql"},
		
		// Architecture & Patterns
		{Name: "clean-architecture"}, {Name: "hexagonal"}, {Name: "ddd"}, {Name: "cqrs"}, {Name: "event-sourcing"},
		{Name: "microservices"}, {Name: "monolith"}, {Name: "design-patterns"}, {Name: "solid"}, {Name: "dependency-injection"},
		
		// DevOps & Tools
		{Name: "docker"}, {Name: "kubernetes"}, {Name: "helm"}, {Name: "ci-cd"}, {Name: "github-actions"},
		{Name: "terraform"}, {Name: "monitoring"}, {Name: "logging"}, {Name: "metrics"}, {Name: "tracing"},
		
		// Cloud & Infrastructure
		{Name: "aws"}, {Name: "gcp"}, {Name: "azure"}, {Name: "serverless"}, {Name: "lambda"},
		{Name: "kafka"}, {Name: "rabbitmq"}, {Name: "nats"}, {Name: "etcd"}, {Name: "consul"},
		
		// Performance & Optimization
		{Name: "performance"}, {Name: "optimization"}, {Name: "memory"}, {Name: "cpu"}, {Name: "gc"},
		{Name: "pprof"}, {Name: "benchmarking"}, {Name: "profiling"}, {Name: "memory-leaks"},
		
		// Security & Best Practices
		{Name: "security"}, {Name: "authentication"}, {Name: "authorization"}, {Name: "jwt"}, {Name: "oauth"},
		{Name: "encryption"}, {Name: "tls"}, {Name: "best-practices"}, {Name: "code-review"}, {Name: "refactoring"},
		
		// Community & Learning
		{Name: "tutorial"}, {Name: "beginner"}, {Name: "intermediate"}, {Name: "advanced"}, {Name: "tips"},
		{Name: "opensource"}, {Name: "community"}, {Name: "career"}, {Name: "interview"}, {Name: "resources"},
	}

	createdCategories := 0
	createdTags := 0

	// Create categories
	for _, catReq := range categories {
		if _, err := h.categoryService.Create(&catReq); err == nil {
			createdCategories++
		}
	}

	// Create tags
	for _, tagReq := range tags {
		if _, err := h.tagService.Create(&tagReq); err == nil {
			createdTags++
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message":            "Initial data seeded successfully",
		"categories_created": createdCategories,
		"tags_created":       createdTags,
	})
}

// Clear all categories and tags (for migration purposes)
func (h *MigrationHandler) ClearData(c *gin.Context) {
	// This endpoint clears all existing categories and tags
	// Use with caution - only for migration purposes
	
	c.JSON(http.StatusOK, gin.H{
		"message": "Data clearing is disabled for safety. Use manual database operations if needed.",
		"note": "To clear data, execute: DELETE FROM post_categories; DELETE FROM post_tags; DELETE FROM categories; DELETE FROM tags;",
	})
}

// Tag Handler
type TagHandler struct {
	tagService services.TagService
}

func NewTagHandler(tagService services.TagService) *TagHandler {
	return &TagHandler{tagService: tagService}
}

func (h *TagHandler) CreateTag(c *gin.Context) {
	var req services.CreateTagRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tag, err := h.tagService.Create(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create tag"})
		return
	}

	c.JSON(http.StatusCreated, tag)
}

func (h *TagHandler) GetTags(c *gin.Context) {
	tags, err := h.tagService.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get tags"})
		return
	}

	c.JSON(http.StatusOK, tags)
}

func (h *TagHandler) UpdateTag(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tag ID"})
		return
	}

	tag, err := h.tagService.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tag not found"})
		return
	}

	var req struct {
		Name string `json:"name"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Name != "" {
		tag.Name = req.Name
	}

	if err := h.tagService.Update(tag); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update tag"})
		return
	}

	c.JSON(http.StatusOK, tag)
}

func (h *TagHandler) DeleteTag(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tag ID"})
		return
	}

	if err := h.tagService.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete tag"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Tag deleted successfully"})
}

// Comment Handler
type CommentHandler struct {
	commentService services.CommentService
}

func NewCommentHandler(commentService services.CommentService) *CommentHandler {
	return &CommentHandler{commentService: commentService}
}

func (h *CommentHandler) CreateComment(c *gin.Context) {
	var req services.CreateCommentRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	comment, err := h.commentService.Create(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create comment"})
		return
	}

	c.JSON(http.StatusCreated, comment)
}

func (h *CommentHandler) GetComments(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	comments, total, err := h.commentService.List(limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get comments"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"comments": comments,
		"total":    total,
		"limit":    limit,
		"offset":   offset,
	})
}

func (h *CommentHandler) UpdateComment(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid comment ID"})
		return
	}

	comment, err := h.commentService.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
		return
	}

	var req struct {
		Content string `json:"content"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Content != "" {
		comment.Content = req.Content
	}

	if err := h.commentService.Update(comment); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update comment"})
		return
	}

	c.JSON(http.StatusOK, comment)
}

func (h *CommentHandler) DeleteComment(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid comment ID"})
		return
	}

	if err := h.commentService.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete comment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Comment deleted successfully"})
}

func (h *CommentHandler) ApproveComment(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid comment ID"})
		return
	}

	if err := h.commentService.Approve(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to approve comment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Comment approved successfully"})
}

func (h *CommentHandler) RejectComment(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid comment ID"})
		return
	}

	if err := h.commentService.Reject(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reject comment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Comment rejected successfully"})
}

func (h *CommentHandler) GetCommentsByPost(c *gin.Context) {
	postID, err := uuid.Parse(c.Param("post_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	comments, err := h.commentService.GetByPostID(postID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get comments"})
		return
	}

	// Filter approved comments for public endpoint
	approvedComments := make([]*models.Comment, 0)
	for _, comment := range comments {
		if comment.Status == models.CommentApproved {
			approvedComments = append(approvedComments, comment)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"comments": approvedComments,
		"total":    len(approvedComments),
	})
}

// Newsletter Handler
type NewsletterHandler struct {
	newsletterService services.NewsletterService
}

func NewNewsletterHandler(newsletterService services.NewsletterService) *NewsletterHandler {
	return &NewsletterHandler{newsletterService: newsletterService}
}

func (h *NewsletterHandler) Subscribe(c *gin.Context) {
	var req struct {
		Email string `json:"email" binding:"required,email"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	newsletter, err := h.newsletterService.Subscribe(req.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, newsletter)
}

func (h *NewsletterHandler) Unsubscribe(c *gin.Context) {
	token := c.Param("token")

	if err := h.newsletterService.Unsubscribe(token); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Unsubscribed successfully"})
}

func (h *NewsletterHandler) GetSubscribers(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	subscribers, total, err := h.newsletterService.GetSubscribers(limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get subscribers"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"subscribers": subscribers,
		"total":       total,
		"limit":       limit,
		"offset":      offset,
	})
}

func (h *NewsletterHandler) DeleteSubscriber(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid subscriber ID"})
		return
	}

	if err := h.newsletterService.DeleteSubscriber(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete subscriber"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Subscriber deleted successfully"})
}
