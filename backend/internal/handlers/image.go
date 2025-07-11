package handlers

import (
	"net/http"
	"strconv"

	"github.com/chmenegatti/myBlog/internal/models"
	"github.com/chmenegatti/myBlog/internal/services"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ImageHandler struct {
	imageService services.ImageService
}

func NewImageHandler(imageService services.ImageService) *ImageHandler {
	return &ImageHandler{
		imageService: imageService,
	}
}

// UploadImage handles image upload
func (h *ImageHandler) UploadImage(c *gin.Context) {
	// Get user ID from context
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Get category from query parameter (default to "general")
	categoryStr := c.DefaultQuery("category", "general")
	category := models.ImageCategory(categoryStr)

	// Validate category
	if !isValidCategory(category) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category"})
		return
	}

	// Get file from form
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	// Upload image
	image, err := h.imageService.UploadImage(file, userID.(uuid.UUID), category)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, image)
}

// GetUserImages returns images uploaded by the current user
func (h *ImageHandler) GetUserImages(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Parse pagination parameters
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	images, err := h.imageService.GetUserImages(userID.(uuid.UUID), limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"images": images,
		"total":  len(images),
		"limit":  limit,
		"offset": offset,
	})
}

// GetAllImages returns all images (admin only)
func (h *ImageHandler) GetAllImages(c *gin.Context) {
	// Parse pagination parameters
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	images, err := h.imageService.GetAllImages(limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"images": images,
		"total":  len(images),
		"limit":  limit,
		"offset": offset,
	})
}

// GetImage returns a specific image by ID
func (h *ImageHandler) GetImage(c *gin.Context) {
	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid image ID"})
		return
	}

	image, err := h.imageService.GetImage(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Image not found"})
		return
	}

	c.JSON(http.StatusOK, image)
}

// DeleteImage deletes an image
func (h *ImageHandler) DeleteImage(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid image ID"})
		return
	}

	err = h.imageService.DeleteImage(id, userID.(uuid.UUID))
	if err != nil {
		if err.Error() == "unauthorized to delete this image" {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Image deleted successfully"})
}

// UploadAvatar handles avatar upload for users
func (h *ImageHandler) UploadAvatar(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Get file from form
	file, err := c.FormFile("avatar")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No avatar file uploaded"})
		return
	}

	// Upload as avatar category
	image, err := h.imageService.UploadImage(file, userID.(uuid.UUID), models.ImageCategoryAvatar)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":    "Avatar uploaded successfully",
		"avatar_url": image.URL,
		"image":      image,
	})
}

// UploadFeaturedImage handles featured image upload for posts
func (h *ImageHandler) UploadFeaturedImage(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Get file from form
	file, err := c.FormFile("featured_image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No featured image file uploaded"})
		return
	}

	// Upload as featured category
	image, err := h.imageService.UploadImage(file, userID.(uuid.UUID), models.ImageCategoryFeatured)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":          "Featured image uploaded successfully",
		"featured_img_url": image.URL,
		"image":            image,
	})
}

func isValidCategory(category models.ImageCategory) bool {
	validCategories := []models.ImageCategory{
		models.ImageCategoryAvatar,
		models.ImageCategoryFeatured,
		models.ImageCategoryContent,
		models.ImageCategoryGeneral,
	}

	for _, validCategory := range validCategories {
		if category == validCategory {
			return true
		}
	}
	return false
}
