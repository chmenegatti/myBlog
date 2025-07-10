package services

import (
	"crypto/rand"
	"encoding/hex"
	"errors"

	"github.com/chmenegatti/myBlog/internal/models"
	"github.com/chmenegatti/myBlog/internal/repositories"
	"github.com/google/uuid"
)

// Category Service
type CategoryService interface {
	Create(req *CreateCategoryRequest) (*models.Category, error)
	GetByID(id uuid.UUID) (*models.Category, error)
	Update(category *models.Category) error
	Delete(id uuid.UUID) error
	List() ([]*models.Category, error)
}

type categoryService struct {
	categoryRepo repositories.CategoryRepository
}

type CreateCategoryRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
	Color       string `json:"color"`
}

func NewCategoryService(categoryRepo repositories.CategoryRepository) CategoryService {
	return &categoryService{categoryRepo: categoryRepo}
}

func (s *categoryService) Create(req *CreateCategoryRequest) (*models.Category, error) {
	slug := generateSlug(req.Name)

	category := &models.Category{
		Name:        req.Name,
		Slug:        slug,
		Description: req.Description,
		Color:       req.Color,
	}

	if err := s.categoryRepo.Create(category); err != nil {
		return nil, err
	}

	return category, nil
}

func (s *categoryService) GetByID(id uuid.UUID) (*models.Category, error) {
	return s.categoryRepo.GetByID(id)
}

func (s *categoryService) Update(category *models.Category) error {
	return s.categoryRepo.Update(category)
}

func (s *categoryService) Delete(id uuid.UUID) error {
	return s.categoryRepo.Delete(id)
}

func (s *categoryService) List() ([]*models.Category, error) {
	return s.categoryRepo.List()
}

// Tag Service
type TagService interface {
	Create(req *CreateTagRequest) (*models.Tag, error)
	GetByID(id uuid.UUID) (*models.Tag, error)
	Update(tag *models.Tag) error
	Delete(id uuid.UUID) error
	List() ([]*models.Tag, error)
}

type tagService struct {
	tagRepo repositories.TagRepository
}

type CreateTagRequest struct {
	Name string `json:"name" binding:"required"`
}

func NewTagService(tagRepo repositories.TagRepository) TagService {
	return &tagService{tagRepo: tagRepo}
}

func (s *tagService) Create(req *CreateTagRequest) (*models.Tag, error) {
	slug := generateSlug(req.Name)

	tag := &models.Tag{
		Name: req.Name,
		Slug: slug,
	}

	if err := s.tagRepo.Create(tag); err != nil {
		return nil, err
	}

	return tag, nil
}

func (s *tagService) GetByID(id uuid.UUID) (*models.Tag, error) {
	return s.tagRepo.GetByID(id)
}

func (s *tagService) Update(tag *models.Tag) error {
	return s.tagRepo.Update(tag)
}

func (s *tagService) Delete(id uuid.UUID) error {
	return s.tagRepo.Delete(id)
}

func (s *tagService) List() ([]*models.Tag, error) {
	return s.tagRepo.List()
}

// Comment Service
type CommentService interface {
	Create(req *CreateCommentRequest) (*models.Comment, error)
	GetByID(id uuid.UUID) (*models.Comment, error)
	Update(comment *models.Comment) error
	Delete(id uuid.UUID) error
	GetByPostID(postID uuid.UUID) ([]*models.Comment, error)
	List(limit, offset int) ([]*models.Comment, int64, error)
	Approve(id uuid.UUID) error
	Reject(id uuid.UUID) error
}

type commentService struct {
	commentRepo repositories.CommentRepository
}

type CreateCommentRequest struct {
	PostID   uuid.UUID  `json:"post_id" binding:"required"`
	ParentID *uuid.UUID `json:"parent_id"`
	Name     string     `json:"name" binding:"required"`
	Email    string     `json:"email" binding:"required,email"`
	Website  string     `json:"website"`
	Content  string     `json:"content" binding:"required"`
}

func NewCommentService(commentRepo repositories.CommentRepository) CommentService {
	return &commentService{commentRepo: commentRepo}
}

func (s *commentService) Create(req *CreateCommentRequest) (*models.Comment, error) {
	comment := &models.Comment{
		PostID:   req.PostID,
		ParentID: req.ParentID,
		Name:     req.Name,
		Email:    req.Email,
		Website:  req.Website,
		Content:  req.Content,
		Status:   models.CommentPending,
	}

	if err := s.commentRepo.Create(comment); err != nil {
		return nil, err
	}

	return comment, nil
}

func (s *commentService) GetByID(id uuid.UUID) (*models.Comment, error) {
	return s.commentRepo.GetByID(id)
}

func (s *commentService) Update(comment *models.Comment) error {
	return s.commentRepo.Update(comment)
}

func (s *commentService) Delete(id uuid.UUID) error {
	return s.commentRepo.Delete(id)
}

func (s *commentService) GetByPostID(postID uuid.UUID) ([]*models.Comment, error) {
	return s.commentRepo.GetByPostID(postID)
}

func (s *commentService) List(limit, offset int) ([]*models.Comment, int64, error) {
	return s.commentRepo.List(limit, offset)
}

func (s *commentService) Approve(id uuid.UUID) error {
	comment, err := s.commentRepo.GetByID(id)
	if err != nil {
		return err
	}

	comment.Status = models.CommentApproved
	return s.commentRepo.Update(comment)
}

func (s *commentService) Reject(id uuid.UUID) error {
	comment, err := s.commentRepo.GetByID(id)
	if err != nil {
		return err
	}

	comment.Status = models.CommentRejected
	return s.commentRepo.Update(comment)
}

// Newsletter Service
type NewsletterService interface {
	Subscribe(email string) (*models.Newsletter, error)
	Unsubscribe(token string) error
	GetSubscribers(limit, offset int) ([]*models.Newsletter, int64, error)
	DeleteSubscriber(id uuid.UUID) error
}

type newsletterService struct {
	newsletterRepo repositories.NewsletterRepository
}

func NewNewsletterService(newsletterRepo repositories.NewsletterRepository) NewsletterService {
	return &newsletterService{newsletterRepo: newsletterRepo}
}

func (s *newsletterService) Subscribe(email string) (*models.Newsletter, error) {
	// Check if already subscribed
	if existing, err := s.newsletterRepo.GetByEmail(email); err == nil {
		if existing.IsActive {
			return nil, errors.New("email already subscribed")
		}
		// Reactivate subscription
		existing.IsActive = true
		if err := s.newsletterRepo.Update(existing); err != nil {
			return nil, err
		}
		return existing, nil
	}

	// Generate unsubscribe token
	token, err := generateRandomToken()
	if err != nil {
		return nil, err
	}

	newsletter := &models.Newsletter{
		Email:    email,
		IsActive: true,
		Token:    token,
	}

	if err := s.newsletterRepo.Create(newsletter); err != nil {
		return nil, err
	}

	return newsletter, nil
}

func (s *newsletterService) Unsubscribe(token string) error {
	newsletter, err := s.newsletterRepo.GetByToken(token)
	if err != nil {
		return errors.New("invalid unsubscribe token")
	}

	newsletter.IsActive = false
	return s.newsletterRepo.Update(newsletter)
}

func (s *newsletterService) GetSubscribers(limit, offset int) ([]*models.Newsletter, int64, error) {
	return s.newsletterRepo.List(limit, offset)
}

func (s *newsletterService) DeleteSubscriber(id uuid.UUID) error {
	return s.newsletterRepo.Delete(id)
}

// Helper function to generate random token
func generateRandomToken() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}
