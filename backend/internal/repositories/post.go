package repositories

import (
	"github.com/chmenegatti/myBlog/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PostRepository interface {
	Create(post *models.Post) error
	GetByID(id uuid.UUID) (*models.Post, error)
	GetBySlug(slug string) (*models.Post, error)
	Update(post *models.Post) error
	Delete(id uuid.UUID) error
	List(limit, offset int, status models.PostStatus) ([]*models.Post, int64, error)
	GetPublished(limit, offset int) ([]*models.Post, int64, error)
	IncrementViewCount(id uuid.UUID) error
	CreateWithAssociations(post *models.Post) error
	UpdateWithAssociations(post *models.Post) error
}

type postRepository struct {
	db *gorm.DB
}

func NewPostRepository(db *gorm.DB) PostRepository {
	return &postRepository{db: db}
}

func (r *postRepository) Create(post *models.Post) error {
	return r.db.Create(post).Error
}

func (r *postRepository) GetByID(id uuid.UUID) (*models.Post, error) {
	var post models.Post
	err := r.db.Preload("Author").Preload("Categories").Preload("Tags").
		Where("id = ?", id).First(&post).Error
	if err != nil {
		return nil, err
	}
	return &post, nil
}

func (r *postRepository) GetBySlug(slug string) (*models.Post, error) {
	var post models.Post
	err := r.db.Preload("Author").Preload("Categories").Preload("Tags").
		Where("slug = ? AND status = ?", slug, models.StatusPublished).First(&post).Error
	if err != nil {
		return nil, err
	}
	return &post, nil
}

func (r *postRepository) Update(post *models.Post) error {
	return r.db.Save(post).Error
}

func (r *postRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Post{}, id).Error
}

func (r *postRepository) List(limit, offset int, status models.PostStatus) ([]*models.Post, int64, error) {
	var posts []*models.Post
	var total int64

	query := r.db.Model(&models.Post{}).Preload("Author").Preload("Categories").Preload("Tags")

	if status != "" {
		query = query.Where("status = ?", status)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := query.Order("created_at DESC").Limit(limit).Offset(offset).Find(&posts).Error
	return posts, total, err
}

func (r *postRepository) GetPublished(limit, offset int) ([]*models.Post, int64, error) {
	return r.List(limit, offset, models.StatusPublished)
}

func (r *postRepository) IncrementViewCount(id uuid.UUID) error {
	return r.db.Model(&models.Post{}).Where("id = ?", id).
		UpdateColumn("view_count", gorm.Expr("view_count + ?", 1)).Error
}

func (r *postRepository) CreateWithAssociations(post *models.Post) error {
	// Create the post with all associations in a transaction
	return r.db.Transaction(func(tx *gorm.DB) error {
		// Create the post first
		if err := tx.Create(post).Error; err != nil {
			return err
		}

		// If categories are provided, associate them
		if len(post.Categories) > 0 {
			if err := tx.Model(post).Association("Categories").Replace(post.Categories); err != nil {
				return err
			}
		}

		// If tags are provided, associate them
		if len(post.Tags) > 0 {
			if err := tx.Model(post).Association("Tags").Replace(post.Tags); err != nil {
				return err
			}
		}

		return nil
	})
}

func (r *postRepository) UpdateWithAssociations(post *models.Post) error {
	// Update the post with all associations in a transaction
	return r.db.Transaction(func(tx *gorm.DB) error {
		// Update the basic post fields
		if err := tx.Save(post).Error; err != nil {
			return err
		}

		// Replace categories association
		if err := tx.Model(post).Association("Categories").Replace(post.Categories); err != nil {
			return err
		}

		// Replace tags association
		if err := tx.Model(post).Association("Tags").Replace(post.Tags); err != nil {
			return err
		}

		return nil
	})
}
