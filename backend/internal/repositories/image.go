package repositories

import (
	"github.com/chmenegatti/myBlog/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ImageRepository interface {
	Create(image *models.Image) error
	GetByID(id uuid.UUID) (*models.Image, error)
	GetByUser(userID uuid.UUID, limit, offset int) ([]*models.Image, error)
	GetAll(limit, offset int) ([]*models.Image, error)
	Update(image *models.Image) error
	Delete(id uuid.UUID) error
	GetByPath(path string) (*models.Image, error)
}

type imageRepository struct {
	db *gorm.DB
}

func NewImageRepository(db *gorm.DB) ImageRepository {
	return &imageRepository{
		db: db,
	}
}

func (r *imageRepository) Create(image *models.Image) error {
	return r.db.Create(image).Error
}

func (r *imageRepository) GetByID(id uuid.UUID) (*models.Image, error) {
	var image models.Image
	err := r.db.Preload("Uploader").Where("id = ? AND is_active = ?", id, true).First(&image).Error
	if err != nil {
		return nil, err
	}
	return &image, nil
}

func (r *imageRepository) GetByUser(userID uuid.UUID, limit, offset int) ([]*models.Image, error) {
	var images []*models.Image
	err := r.db.Preload("Uploader").
		Where("uploaded_by = ? AND is_active = ?", userID, true).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&images).Error
	return images, err
}

func (r *imageRepository) GetAll(limit, offset int) ([]*models.Image, error) {
	var images []*models.Image
	err := r.db.Preload("Uploader").
		Where("is_active = ?", true).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&images).Error
	return images, err
}

func (r *imageRepository) Update(image *models.Image) error {
	return r.db.Save(image).Error
}

func (r *imageRepository) Delete(id uuid.UUID) error {
	return r.db.Model(&models.Image{}).Where("id = ?", id).Update("is_active", false).Error
}

func (r *imageRepository) GetByPath(path string) (*models.Image, error) {
	var image models.Image
	err := r.db.Where("path = ? AND is_active = ?", path, true).First(&image).Error
	if err != nil {
		return nil, err
	}
	return &image, nil
}
