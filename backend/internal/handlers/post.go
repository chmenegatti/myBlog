package handlers

import (
	"math"
	"net/http"
	"strconv"
	"strings"

	"github.com/chmenegatti/myBlog/internal/models"
	"github.com/chmenegatti/myBlog/internal/services"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// Post Handler
type PostHandler struct {
	postService     services.PostService
	markdownService services.MarkdownService
}

func NewPostHandler(postService services.PostService, markdownService services.MarkdownService) *PostHandler {
	return &PostHandler{postService: postService, markdownService: markdownService}
}

func (h *PostHandler) CreatePost(c *gin.Context) {
	var req services.CreatePostRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}

	post, err := h.postService.Create(&req, userID.(uuid.UUID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create post"})
		return
	}

	c.JSON(http.StatusCreated, post)
}

func (h *PostHandler) GetPosts(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))
	status := models.PostStatus(c.DefaultQuery("status", ""))

	posts, total, err := h.postService.List(limit, offset, status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get posts"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"posts":  posts,
		"total":  total,
		"limit":  limit,
		"offset": offset,
	})
}

func (h *PostHandler) GetPublicPosts(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	posts, total, err := h.postService.GetPublished(limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get posts"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"posts":  posts,
		"total":  total,
		"limit":  limit,
		"offset": offset,
	})
}

func (h *PostHandler) GetPost(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	post, err := h.postService.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	c.JSON(http.StatusOK, post)
}

func (h *PostHandler) GetPostBySlug(c *gin.Context) {
	slug := c.Param("slug")

	post, err := h.postService.GetBySlug(slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	c.JSON(http.StatusOK, post)
}

func (h *PostHandler) UpdatePost(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	post, err := h.postService.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	var req struct {
		Title       string `json:"title"`
		Slug        string `json:"slug"`
		Content     string `json:"content"`
		Excerpt     string `json:"excerpt"`
		FeaturedImg string `json:"featured_img"`
		Status      string `json:"status"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Title != "" {
		post.Title = req.Title
	}
	if req.Slug != "" {
		post.Slug = req.Slug
	}
	if req.Content != "" {
		post.Content = req.Content
	}
	if req.Status != "" {
		post.Status = models.PostStatus(req.Status)
	}
	post.Excerpt = req.Excerpt
	post.FeaturedImg = req.FeaturedImg

	if err := h.postService.Update(post); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update post"})
		return
	}

	c.JSON(http.StatusOK, post)
}

func (h *PostHandler) DeletePost(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	if err := h.postService.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete post"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Post deleted successfully"})
}

func (h *PostHandler) PublishPost(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	if err := h.postService.Publish(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to publish post"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Post published successfully"})
}

func (h *PostHandler) UnpublishPost(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	if err := h.postService.Unpublish(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unpublish post"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Post unpublished successfully"})
}

// PostPreviewRequest represents a request to preview markdown content
type PostPreviewRequest struct {
	Content string `json:"content" binding:"required"`
}

// PostPreviewResponse represents the response with processed markdown
type PostPreviewResponse struct {
	HTML        string                     `json:"html"`
	PlainText   string                     `json:"plain_text"`
	Excerpt     string                     `json:"excerpt"`
	WordCount   int                        `json:"word_count"`
	ReadingTime int                        `json:"reading_time"`
	Images      []string                   `json:"images"`
	Headings    []services.MarkdownHeading `json:"headings"`
}

// PreviewMarkdown processes markdown content and returns preview data
func (h *PostHandler) PreviewMarkdown(c *gin.Context) {
	var req PostPreviewRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate markdown
	if err := h.markdownService.ValidateMarkdown(req.Content); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid markdown: " + err.Error()})
		return
	}

	// Process markdown
	html := h.markdownService.ToSafeHTML(req.Content)
	plainText := h.markdownService.ExtractExcerpt(req.Content, 0) // No limit for full text
	excerpt := h.markdownService.ExtractExcerpt(req.Content, 200)
	images := h.markdownService.ExtractImages(req.Content)
	headings := h.markdownService.ExtractHeadings(req.Content)

	// Calculate stats
	wordCount := len(strings.Fields(plainText))
	readingTime := calculateReadingTimeFromWordCount(wordCount)

	response := PostPreviewResponse{
		HTML:        html,
		PlainText:   plainText,
		Excerpt:     excerpt,
		WordCount:   wordCount,
		ReadingTime: readingTime,
		Images:      images,
		Headings:    headings,
	}

	c.JSON(http.StatusOK, response)
}

// calculateReadingTimeFromWordCount estimates reading time in minutes
func calculateReadingTimeFromWordCount(wordCount int) int {
	const avgWordsPerMinute = 200

	if wordCount == 0 {
		return 0
	}

	minutes := float64(wordCount) / avgWordsPerMinute

	if minutes < 1 {
		return 1
	}

	return int(math.Ceil(minutes))
}
