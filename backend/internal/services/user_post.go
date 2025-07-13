package services

import (
	"errors"
	"log"
	"math"
	"strings"

	"github.com/chmenegatti/myBlog/internal/models"
	"github.com/chmenegatti/myBlog/internal/repositories"
	"github.com/google/uuid"
)

// User Service
type UserService interface {
	GetByID(id uuid.UUID) (*models.User, error)
	Update(user *models.User) error
	Delete(id uuid.UUID) error
	List(limit, offset int) ([]*models.User, int64, error)
	CreateUser(req *CreateUserRequest) (*models.User, error)
}

type userService struct {
	userRepo repositories.UserRepository
}

type CreateUserRequest struct {
	Username string          `json:"username" binding:"required"`
	Email    string          `json:"email" binding:"required,email"`
	Name     string          `json:"name" binding:"required"`
	Role     models.UserRole `json:"role"`
}

func NewUserService(userRepo repositories.UserRepository) UserService {
	return &userService{userRepo: userRepo}
}

func (s *userService) GetByID(id uuid.UUID) (*models.User, error) {
	return s.userRepo.GetByID(id)
}

func (s *userService) Update(user *models.User) error {
	return s.userRepo.Update(user)
}

func (s *userService) Delete(id uuid.UUID) error {
	return s.userRepo.Delete(id)
}

func (s *userService) List(limit, offset int) ([]*models.User, int64, error) {
	return s.userRepo.List(limit, offset)
}

func (s *userService) CreateUser(req *CreateUserRequest) (*models.User, error) {
	// Check if user already exists
	if _, err := s.userRepo.GetByEmail(req.Email); err == nil {
		return nil, errors.New("email already exists")
	}

	if _, err := s.userRepo.GetByUsername(req.Username); err == nil {
		return nil, errors.New("username already exists")
	}

	user := &models.User{
		Username: req.Username,
		Email:    req.Email,
		Name:     req.Name,
		Role:     req.Role,
		IsActive: true,
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	return user, nil
}

// Post Service
type PostService interface {
	Create(req *CreatePostRequest, authorID uuid.UUID) (*models.Post, error)
	GetByID(id uuid.UUID) (*models.Post, error)
	GetBySlug(slug string) (*models.Post, error)
	Update(post *models.Post) error
	UpdateWithAssociations(id uuid.UUID, req *UpdatePostRequest) (*models.Post, error)
	Delete(id uuid.UUID) error
	List(limit, offset int, status models.PostStatus) ([]*models.Post, int64, error)
	GetPublished(limit, offset int) ([]*models.Post, int64, error)
	Publish(id uuid.UUID) error
	Unpublish(id uuid.UUID) error
}

type postService struct {
	postRepo        repositories.PostRepository
	categoryRepo    repositories.CategoryRepository
	tagRepo         repositories.TagRepository
	markdownService MarkdownService
}

type CreatePostRequest struct {
	Title       string   `json:"title" binding:"required"`
	Content     string   `json:"content" binding:"required"`
	Excerpt     string   `json:"excerpt"`
	FeaturedImg string   `json:"featured_img"`
	Category    string   `json:"category"`     // Category name (single)
	Tags        string   `json:"tags"`         // Comma-separated tag names
	CategoryIDs []string `json:"category_ids"` // Optional: UUID strings for categories
	TagIDs      []string `json:"tag_ids"`      // Optional: UUID strings for tags
}

func NewPostService(postRepo repositories.PostRepository, categoryRepo repositories.CategoryRepository, tagRepo repositories.TagRepository) PostService {
	return &postService{
		postRepo:        postRepo,
		categoryRepo:    categoryRepo,
		tagRepo:         tagRepo,
		markdownService: NewMarkdownService(),
	}
}

func (s *postService) Create(req *CreatePostRequest, authorID uuid.UUID) (*models.Post, error) {
	// Validate markdown content
	if err := s.markdownService.ValidateMarkdown(req.Content); err != nil {
		return nil, err
	}

	// Generate slug from title
	slug := generateSlug(req.Title)

	// Process markdown content
	contentHTML := s.markdownService.ToSafeHTML(req.Content)

	// Generate excerpt if not provided
	excerpt := req.Excerpt
	if excerpt == "" {
		excerpt = s.markdownService.ExtractExcerpt(req.Content, 200)
	}

	// Calculate reading time and word count
	wordCount := s.calculateWordCount(req.Content)
	readingTime := s.calculateReadingTime(wordCount)

	post := &models.Post{
		Title:       req.Title,
		Slug:        slug,
		Content:     req.Content,
		ContentHTML: contentHTML,
		Excerpt:     excerpt,
		FeaturedImg: req.FeaturedImg,
		AuthorID:    authorID,
		Status:      models.StatusDraft,
		WordCount:   wordCount,
		ReadingTime: readingTime,
	}

	// Process categories and tags before creating
	if err := s.processCategories(post, req); err != nil {
		return nil, err
	}

	if err := s.processTags(post, req); err != nil {
		return nil, err
	}

	// Create the post with associations
	if err := s.postRepo.CreateWithAssociations(post); err != nil {
		return nil, err
	}

	// Reload post with associations
	return s.postRepo.GetByID(post.ID)
}

func (s *postService) GetByID(id uuid.UUID) (*models.Post, error) {
	return s.postRepo.GetByID(id)
}

func (s *postService) GetBySlug(slug string) (*models.Post, error) {
	post, err := s.postRepo.GetBySlug(slug)
	if err != nil {
		return nil, err
	}

	// Increment view count
	s.postRepo.IncrementViewCount(post.ID)

	return post, nil
}

func (s *postService) Update(post *models.Post) error {
	return s.postRepo.Update(post)
}

func (s *postService) Delete(id uuid.UUID) error {
	return s.postRepo.Delete(id)
}

func (s *postService) List(limit, offset int, status models.PostStatus) ([]*models.Post, int64, error) {
	return s.postRepo.List(limit, offset, status)
}

func (s *postService) GetPublished(limit, offset int) ([]*models.Post, int64, error) {
	return s.postRepo.GetPublished(limit, offset)
}

func (s *postService) Publish(id uuid.UUID) error {
	post, err := s.postRepo.GetByID(id)
	if err != nil {
		return err
	}

	post.Status = models.StatusPublished
	return s.postRepo.Update(post)
}

func (s *postService) Unpublish(id uuid.UUID) error {
	post, err := s.postRepo.GetByID(id)
	if err != nil {
		return err
	}

	post.Status = models.StatusDraft
	return s.postRepo.Update(post)
}

// UpdatePostRequest for updating posts with categories and tags
type UpdatePostRequest struct {
	Title       string `json:"title"`
	Slug        string `json:"slug"`
	Content     string `json:"content"`
	Excerpt     string `json:"excerpt"`
	FeaturedImg string `json:"featured_img"`
	Status      string `json:"status"`
	Category    string `json:"category"` // Category name
	Tags        string `json:"tags"`     // Comma-separated tag names
}

// UpdateWithAssociations updates a post and its categories/tags
func (s *postService) UpdateWithAssociations(id uuid.UUID, req *UpdatePostRequest) (*models.Post, error) {
	post, err := s.postRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Update basic fields
	if req.Title != "" {
		post.Title = req.Title
	}
	if req.Slug != "" {
		post.Slug = req.Slug
	}
	if req.Content != "" {
		post.Content = req.Content
		// Reprocess markdown content
		post.ContentHTML = s.markdownService.ToSafeHTML(req.Content)
		// Recalculate word count and reading time
		post.WordCount = s.calculateWordCount(req.Content)
		post.ReadingTime = s.calculateReadingTime(post.WordCount)
	}
	if req.Status != "" {
		post.Status = models.PostStatus(req.Status)
	}
	post.Excerpt = req.Excerpt
	post.FeaturedImg = req.FeaturedImg

	// Process categories and tags
	createReq := &CreatePostRequest{
		Category: req.Category,
		Tags:     req.Tags,
	}

	// Clear existing associations and set new ones
	post.Categories = []models.Category{}
	post.Tags = []models.Tag{}

	if err := s.processCategories(post, createReq); err != nil {
		return nil, err
	}

	if err := s.processTags(post, createReq); err != nil {
		return nil, err
	}

	// Update the post
	if err := s.postRepo.UpdateWithAssociations(post); err != nil {
		return nil, err
	}

	// Reload post with associations
	return s.postRepo.GetByID(post.ID)
}

// Helper function to generate slug from title
func generateSlug(title string) string {
	slug := strings.ToLower(title)
	slug = strings.ReplaceAll(slug, " ", "-")
	// Remove special characters and normalize
	slug = strings.ReplaceAll(slug, ".", "")
	slug = strings.ReplaceAll(slug, ",", "")
	slug = strings.ReplaceAll(slug, "!", "")
	slug = strings.ReplaceAll(slug, "?", "")
	slug = strings.ReplaceAll(slug, ":", "")
	slug = strings.ReplaceAll(slug, ";", "")
	return slug
}

// calculateWordCount counts words in markdown content
func (s *postService) calculateWordCount(content string) int {
	if content == "" {
		return 0
	}

	// Strip markdown and get plain text
	plainText := s.markdownService.ExtractExcerpt(content, 0) // 0 means no limit

	// Split by whitespace and count
	words := strings.Fields(plainText)
	return len(words)
}

// calculateReadingTime estimates reading time in minutes
func (s *postService) calculateReadingTime(wordCount int) int {
	// Average reading speed: 200 words per minute
	const avgWordsPerMinute = 200

	if wordCount == 0 {
		return 0
	}

	minutes := float64(wordCount) / avgWordsPerMinute

	// Round up to at least 1 minute
	if minutes < 1 {
		return 1
	}

	return int(math.Ceil(minutes))
}

// Helper methods for processing categories and tags

// processCategories handles category assignment for a post
func (s *postService) processCategories(post *models.Post, req *CreatePostRequest) error {
	var categories []models.Category

	log.Printf("DEBUG processCategories - Category input: '%s'", req.Category)
	log.Printf("DEBUG processCategories - CategoryIDs input: %v", req.CategoryIDs)

	// If category name is provided, find or create the category
	if req.Category != "" && strings.TrimSpace(req.Category) != "" {
		categoryName := strings.TrimSpace(req.Category)
		log.Printf("DEBUG processCategories - Looking for category by name: '%s'", categoryName)

		// Try to find existing category by name
		allCategories, err := s.categoryRepo.List()
		if err != nil {
			log.Printf("DEBUG processCategories - Error listing categories: %v", err)
			return err
		}

		log.Printf("DEBUG processCategories - Found %d total categories", len(allCategories))

		var foundCategory *models.Category
		for _, cat := range allCategories {
			log.Printf("DEBUG processCategories - Comparing '%s' with '%s'", cat.Name, categoryName)
			if strings.EqualFold(cat.Name, categoryName) {
				foundCategory = cat
				log.Printf("DEBUG processCategories - Found matching category: %s (ID: %s)", cat.Name, cat.ID)
				break
			}
		}

		if foundCategory != nil {
			categories = append(categories, *foundCategory)
		} else {
			log.Printf("DEBUG processCategories - No category found with name: '%s'", categoryName)
		}
		// If category doesn't exist, we skip it (could create it automatically in the future)
	}

	// Process CategoryIDs if provided (takes precedence over category name)
	if len(req.CategoryIDs) > 0 {
		log.Printf("DEBUG processCategories - Processing CategoryIDs: %v", req.CategoryIDs)
		categories = []models.Category{} // Reset categories array
		for _, idStr := range req.CategoryIDs {
			if id, err := uuid.Parse(idStr); err == nil {
				if category, err := s.categoryRepo.GetByID(id); err == nil {
					categories = append(categories, *category)
					log.Printf("DEBUG processCategories - Added category by ID: %s (%s)", category.Name, category.ID)
				} else {
					log.Printf("DEBUG processCategories - Category not found by ID: %s", idStr)
				}
			} else {
				log.Printf("DEBUG processCategories - Invalid category ID format: %s", idStr)
			}
		}
	}

	// Assign categories to post using GORM's association
	if len(categories) > 0 {
		post.Categories = categories
		log.Printf("DEBUG processCategories - Assigned %d categories to post", len(categories))
	} else {
		log.Printf("DEBUG processCategories - No categories assigned to post")
	}

	return nil
}

// processTags handles tag assignment for a post
func (s *postService) processTags(post *models.Post, req *CreatePostRequest) error {
	var tags []models.Tag

	log.Printf("DEBUG processTags - Tags input: '%s'", req.Tags)
	log.Printf("DEBUG processTags - TagIDs input: %v", req.TagIDs)

	// If tags string is provided, process comma-separated tag names
	if req.Tags != "" && strings.TrimSpace(req.Tags) != "" {
		tagNames := strings.Split(req.Tags, ",")
		log.Printf("DEBUG processTags - Split into %d tag names: %v", len(tagNames), tagNames)

		// Get all existing tags
		allTags, err := s.tagRepo.List()
		if err != nil {
			log.Printf("DEBUG processTags - Error listing tags: %v", err)
			return err
		}

		log.Printf("DEBUG processTags - Found %d total tags", len(allTags))

		for _, tagName := range tagNames {
			tagName = strings.TrimSpace(tagName)
			if tagName == "" {
				continue
			}

			log.Printf("DEBUG processTags - Looking for tag by name: '%s'", tagName)

			// Try to find existing tag by name
			var foundTag *models.Tag
			for _, tag := range allTags {
				log.Printf("DEBUG processTags - Comparing '%s' with '%s'", tag.Name, tagName)
				if strings.EqualFold(tag.Name, tagName) {
					foundTag = tag
					log.Printf("DEBUG processTags - Found matching tag: %s (ID: %s)", tag.Name, tag.ID)
					break
				}
			}

			if foundTag != nil {
				tags = append(tags, *foundTag)
			} else {
				log.Printf("DEBUG processTags - No tag found with name: '%s'", tagName)
			}
			// If tag doesn't exist, we skip it (could create it automatically in the future)
		}
	}

	// Process TagIDs if provided (takes precedence over tag names)
	if len(req.TagIDs) > 0 {
		log.Printf("DEBUG processTags - Processing TagIDs: %v", req.TagIDs)
		tags = []models.Tag{} // Reset tags array
		for _, idStr := range req.TagIDs {
			if id, err := uuid.Parse(idStr); err == nil {
				if tag, err := s.tagRepo.GetByID(id); err == nil {
					tags = append(tags, *tag)
					log.Printf("DEBUG processTags - Added tag by ID: %s (%s)", tag.Name, tag.ID)
				} else {
					log.Printf("DEBUG processTags - Tag not found by ID: %s", idStr)
				}
			} else {
				log.Printf("DEBUG processTags - Invalid tag ID format: %s", idStr)
			}
		}
	}

	// Assign tags to post using GORM's association
	if len(tags) > 0 {
		post.Tags = tags
		log.Printf("DEBUG processTags - Assigned %d tags to post", len(tags))
	} else {
		log.Printf("DEBUG processTags - No tags assigned to post")
	}

	return nil
}
