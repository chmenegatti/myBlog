package services

import (
	"errors"
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
	Delete(id uuid.UUID) error
	List(limit, offset int, status models.PostStatus) ([]*models.Post, int64, error)
	GetPublished(limit, offset int) ([]*models.Post, int64, error)
	Publish(id uuid.UUID) error
	Unpublish(id uuid.UUID) error
}

type postService struct {
	postRepo     repositories.PostRepository
	categoryRepo repositories.CategoryRepository
	tagRepo      repositories.TagRepository
}

type CreatePostRequest struct {
	Title       string   `json:"title" binding:"required"`
	Content     string   `json:"content" binding:"required"`
	Excerpt     string   `json:"excerpt"`
	FeaturedImg string   `json:"featured_img"`
	CategoryIDs []string `json:"category_ids"`
	TagIDs      []string `json:"tag_ids"`
}

func NewPostService(postRepo repositories.PostRepository, categoryRepo repositories.CategoryRepository, tagRepo repositories.TagRepository) PostService {
	return &postService{
		postRepo:     postRepo,
		categoryRepo: categoryRepo,
		tagRepo:      tagRepo,
	}
}

func (s *postService) Create(req *CreatePostRequest, authorID uuid.UUID) (*models.Post, error) {
	// Generate slug from title
	slug := generateSlug(req.Title)

	post := &models.Post{
		Title:       req.Title,
		Slug:        slug,
		Content:     req.Content,
		Excerpt:     req.Excerpt,
		FeaturedImg: req.FeaturedImg,
		AuthorID:    authorID,
		Status:      models.StatusDraft,
	}

	if err := s.postRepo.Create(post); err != nil {
		return nil, err
	}

	return post, nil
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

// Helper function to generate slug from title
func generateSlug(title string) string {
	slug := strings.ToLower(title)
	slug = strings.ReplaceAll(slug, " ", "-")
	// Add more slug generation logic here
	return slug
}
