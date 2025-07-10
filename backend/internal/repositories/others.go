package repositories

import (
	"github.com/chmenegatti/myBlog/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Category Repository
type CategoryRepository interface {
	Create(category *models.Category) error
	GetByID(id uuid.UUID) (*models.Category, error)
	GetBySlug(slug string) (*models.Category, error)
	Update(category *models.Category) error
	Delete(id uuid.UUID) error
	List() ([]*models.Category, error)
}

type categoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) CategoryRepository {
	return &categoryRepository{db: db}
}

func (r *categoryRepository) Create(category *models.Category) error {
	return r.db.Create(category).Error
}

func (r *categoryRepository) GetByID(id uuid.UUID) (*models.Category, error) {
	var category models.Category
	err := r.db.Where("id = ?", id).First(&category).Error
	return &category, err
}

func (r *categoryRepository) GetBySlug(slug string) (*models.Category, error) {
	var category models.Category
	err := r.db.Where("slug = ?", slug).First(&category).Error
	return &category, err
}

func (r *categoryRepository) Update(category *models.Category) error {
	return r.db.Save(category).Error
}

func (r *categoryRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Category{}, id).Error
}

func (r *categoryRepository) List() ([]*models.Category, error) {
	var categories []*models.Category
	err := r.db.Find(&categories).Error
	return categories, err
}

// Tag Repository
type TagRepository interface {
	Create(tag *models.Tag) error
	GetByID(id uuid.UUID) (*models.Tag, error)
	GetBySlug(slug string) (*models.Tag, error)
	Update(tag *models.Tag) error
	Delete(id uuid.UUID) error
	List() ([]*models.Tag, error)
}

type tagRepository struct {
	db *gorm.DB
}

func NewTagRepository(db *gorm.DB) TagRepository {
	return &tagRepository{db: db}
}

func (r *tagRepository) Create(tag *models.Tag) error {
	return r.db.Create(tag).Error
}

func (r *tagRepository) GetByID(id uuid.UUID) (*models.Tag, error) {
	var tag models.Tag
	err := r.db.Where("id = ?", id).First(&tag).Error
	return &tag, err
}

func (r *tagRepository) GetBySlug(slug string) (*models.Tag, error) {
	var tag models.Tag
	err := r.db.Where("slug = ?", slug).First(&tag).Error
	return &tag, err
}

func (r *tagRepository) Update(tag *models.Tag) error {
	return r.db.Save(tag).Error
}

func (r *tagRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Tag{}, id).Error
}

func (r *tagRepository) List() ([]*models.Tag, error) {
	var tags []*models.Tag
	err := r.db.Find(&tags).Error
	return tags, err
}

// Comment Repository
type CommentRepository interface {
	Create(comment *models.Comment) error
	GetByID(id uuid.UUID) (*models.Comment, error)
	Update(comment *models.Comment) error
	Delete(id uuid.UUID) error
	GetByPostID(postID uuid.UUID) ([]*models.Comment, error)
	List(limit, offset int) ([]*models.Comment, int64, error)
}

type commentRepository struct {
	db *gorm.DB
}

func NewCommentRepository(db *gorm.DB) CommentRepository {
	return &commentRepository{db: db}
}

func (r *commentRepository) Create(comment *models.Comment) error {
	return r.db.Create(comment).Error
}

func (r *commentRepository) GetByID(id uuid.UUID) (*models.Comment, error) {
	var comment models.Comment
	err := r.db.Preload("Post").Preload("Replies").Where("id = ?", id).First(&comment).Error
	return &comment, err
}

func (r *commentRepository) Update(comment *models.Comment) error {
	return r.db.Save(comment).Error
}

func (r *commentRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Comment{}, id).Error
}

func (r *commentRepository) GetByPostID(postID uuid.UUID) ([]*models.Comment, error) {
	var comments []*models.Comment
	err := r.db.Where("post_id = ? AND parent_id IS NULL", postID).
		Preload("Replies").Order("created_at DESC").Find(&comments).Error
	return comments, err
}

func (r *commentRepository) List(limit, offset int) ([]*models.Comment, int64, error) {
	var comments []*models.Comment
	var total int64

	if err := r.db.Model(&models.Comment{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := r.db.Preload("Post").Order("created_at DESC").
		Limit(limit).Offset(offset).Find(&comments).Error
	return comments, total, err
}

// Newsletter Repository
type NewsletterRepository interface {
	Create(newsletter *models.Newsletter) error
	GetByEmail(email string) (*models.Newsletter, error)
	GetByToken(token string) (*models.Newsletter, error)
	Update(newsletter *models.Newsletter) error
	Delete(id uuid.UUID) error
	List(limit, offset int) ([]*models.Newsletter, int64, error)
}

type newsletterRepository struct {
	db *gorm.DB
}

func NewNewsletterRepository(db *gorm.DB) NewsletterRepository {
	return &newsletterRepository{db: db}
}

func (r *newsletterRepository) Create(newsletter *models.Newsletter) error {
	return r.db.Create(newsletter).Error
}

func (r *newsletterRepository) GetByEmail(email string) (*models.Newsletter, error) {
	var newsletter models.Newsletter
	err := r.db.Where("email = ?", email).First(&newsletter).Error
	return &newsletter, err
}

func (r *newsletterRepository) GetByToken(token string) (*models.Newsletter, error) {
	var newsletter models.Newsletter
	err := r.db.Where("token = ?", token).First(&newsletter).Error
	return &newsletter, err
}

func (r *newsletterRepository) Update(newsletter *models.Newsletter) error {
	return r.db.Save(newsletter).Error
}

func (r *newsletterRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Newsletter{}, id).Error
}

func (r *newsletterRepository) List(limit, offset int) ([]*models.Newsletter, int64, error) {
	var newsletters []*models.Newsletter
	var total int64

	if err := r.db.Model(&models.Newsletter{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := r.db.Order("created_at DESC").Limit(limit).Offset(offset).Find(&newsletters).Error
	return newsletters, total, err
}
