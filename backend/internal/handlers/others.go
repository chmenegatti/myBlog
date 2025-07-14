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
	// Seed categories
	categories := []services.CreateCategoryRequest{
		{Name: "Technology", Description: "Articles about technology, programming, and software development", Color: "#3B82F6"},
		{Name: "Web Development", Description: "Frontend and backend development tutorials and tips", Color: "#10B981"},
		{Name: "Design", Description: "UI/UX design, visual design, and design thinking", Color: "#8B5CF6"},
		{Name: "Programming", Description: "Programming languages, algorithms, and coding practices", Color: "#F59E0B"},
		{Name: "DevOps", Description: "DevOps practices, CI/CD, and infrastructure", Color: "#EF4444"},
		{Name: "Mobile", Description: "Mobile app development for iOS and Android", Color: "#06B6D4"},
		{Name: "Database", Description: "Database design, optimization, and management", Color: "#84CC16"},
		{Name: "Cloud Computing", Description: "Cloud platforms, serverless, and distributed systems", Color: "#A855F7"},
		{Name: "AI & Machine Learning", Description: "Artificial Intelligence and Machine Learning topics", Color: "#EC4899"},
		{Name: "Career", Description: "Career advice, interviews, and professional development", Color: "#F97316"},
	}

	// Seed tags
	tags := []services.CreateTagRequest{
		// Programming Languages
		{Name: "JavaScript"}, {Name: "TypeScript"}, {Name: "Python"}, {Name: "Go"}, {Name: "Java"}, {Name: "C#"}, {Name: "PHP"}, {Name: "Rust"},
		// Frameworks
		{Name: "React"}, {Name: "Vue.js"}, {Name: "Angular"}, {Name: "Next.js"}, {Name: "Node.js"}, {Name: "Express"}, {Name: "Django"}, {Name: "Flask"}, {Name: "Spring Boot"}, {Name: "Laravel"},
		// Databases
		{Name: "PostgreSQL"}, {Name: "MySQL"}, {Name: "MongoDB"}, {Name: "Redis"},
		// Cloud & DevOps
		{Name: "AWS"}, {Name: "Azure"}, {Name: "Google Cloud"}, {Name: "Docker"}, {Name: "Kubernetes"}, {Name: "CI/CD"},
		// Tools
		{Name: "Git"}, {Name: "VS Code"}, {Name: "Figma"}, {Name: "API"}, {Name: "REST"}, {Name: "GraphQL"},
		// Concepts
		{Name: "Microservices"}, {Name: "Clean Code"}, {Name: "Testing"}, {Name: "Performance"}, {Name: "Security"}, {Name: "Tutorial"}, {Name: "Best Practices"}, {Name: "Tips"},
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
		"message": "Initial data seeded successfully",
		"categories_created": createdCategories,
		"tags_created": createdTags,
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
