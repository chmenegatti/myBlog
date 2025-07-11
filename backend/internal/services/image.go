package services

import (
	"errors"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/chmenegatti/myBlog/internal/models"
	"github.com/chmenegatti/myBlog/internal/repositories"
	"github.com/google/uuid"
	"github.com/nfnt/resize"
)

type ImageService interface {
	UploadImage(file *multipart.FileHeader, userID uuid.UUID, category models.ImageCategory) (*models.Image, error)
	GetImage(id uuid.UUID) (*models.Image, error)
	GetUserImages(userID uuid.UUID, limit, offset int) ([]*models.Image, error)
	GetAllImages(limit, offset int) ([]*models.Image, error)
	DeleteImage(id uuid.UUID, userID uuid.UUID) error
	ResizeImage(imagePath string, width, height uint) error
}

type imageService struct {
	imageRepo   repositories.ImageRepository
	uploadPath  string
	baseURL     string
	maxFileSize int64
}

func NewImageService(imageRepo repositories.ImageRepository, uploadPath, baseURL string) ImageService {
	// Create upload directory if it doesn't exist
	os.MkdirAll(uploadPath, 0755)

	return &imageService{
		imageRepo:   imageRepo,
		uploadPath:  uploadPath,
		baseURL:     baseURL,
		maxFileSize: 5 << 20, // 5MB
	}
}

func (s *imageService) UploadImage(file *multipart.FileHeader, userID uuid.UUID, category models.ImageCategory) (*models.Image, error) {
	// Validate file size
	if file.Size > s.maxFileSize {
		return nil, errors.New("file size exceeds maximum limit of 5MB")
	}

	// Validate file type
	if !s.isValidImageType(file.Header.Get("Content-Type")) {
		return nil, errors.New("invalid file type. Only JPEG, PNG and GIF are allowed")
	}

	// Open the uploaded file
	src, err := file.Open()
	if err != nil {
		return nil, err
	}
	defer src.Close()

	// Generate unique filename
	ext := filepath.Ext(file.Filename)
	fileName := fmt.Sprintf("%s_%d%s", uuid.New().String(), time.Now().Unix(), ext)

	// Create category subdirectory
	categoryPath := filepath.Join(s.uploadPath, string(category))
	os.MkdirAll(categoryPath, 0755)

	// Full file path
	filePath := filepath.Join(categoryPath, fileName)

	// Create the destination file
	dst, err := os.Create(filePath)
	if err != nil {
		return nil, err
	}
	defer dst.Close()

	// Copy the uploaded file to the destination
	_, err = io.Copy(dst, src)
	if err != nil {
		return nil, err
	}

	// Get image dimensions
	width, height, err := s.getImageDimensions(filePath)
	if err != nil {
		// If we can't get dimensions, continue with 0 values
		width, height = 0, 0
	}

	// Create image record
	imageRecord := &models.Image{
		FileName:     fileName,
		OriginalName: file.Filename,
		MimeType:     file.Header.Get("Content-Type"),
		Size:         file.Size,
		Path:         filePath,
		URL:          fmt.Sprintf("%s/uploads/%s/%s", s.baseURL, category, fileName),
		Width:        width,
		Height:       height,
		UploadedBy:   userID,
		IsActive:     true,
	}

	// Save to database
	err = s.imageRepo.Create(imageRecord)
	if err != nil {
		// Remove file if database save fails
		os.Remove(filePath)
		return nil, err
	}

	return imageRecord, nil
}

func (s *imageService) GetImage(id uuid.UUID) (*models.Image, error) {
	return s.imageRepo.GetByID(id)
}

func (s *imageService) GetUserImages(userID uuid.UUID, limit, offset int) ([]*models.Image, error) {
	return s.imageRepo.GetByUser(userID, limit, offset)
}

func (s *imageService) GetAllImages(limit, offset int) ([]*models.Image, error) {
	return s.imageRepo.GetAll(limit, offset)
}

func (s *imageService) DeleteImage(id uuid.UUID, userID uuid.UUID) error {
	// Get image to verify ownership
	image, err := s.imageRepo.GetByID(id)
	if err != nil {
		return err
	}

	// Check if user owns the image (or is admin - this check should be done in handler)
	if image.UploadedBy != userID {
		return errors.New("unauthorized to delete this image")
	}

	// Delete from database (soft delete)
	err = s.imageRepo.Delete(id)
	if err != nil {
		return err
	}

	// Optionally delete physical file
	// os.Remove(image.Path)

	return nil
}

func (s *imageService) ResizeImage(imagePath string, width, height uint) error {
	// Open the image file
	file, err := os.Open(imagePath)
	if err != nil {
		return err
	}
	defer file.Close()

	// Decode the image
	img, _, err := image.Decode(file)
	if err != nil {
		return err
	}

	// Resize the image
	resizedImg := resize.Resize(width, height, img, resize.Lanczos3)

	// Create output file
	outputPath := strings.Replace(imagePath, filepath.Ext(imagePath), "_resized"+filepath.Ext(imagePath), 1)
	out, err := os.Create(outputPath)
	if err != nil {
		return err
	}
	defer out.Close()

	// Encode based on file extension
	ext := strings.ToLower(filepath.Ext(imagePath))
	switch ext {
	case ".jpg", ".jpeg":
		return jpeg.Encode(out, resizedImg, &jpeg.Options{Quality: 80})
	case ".png":
		return png.Encode(out, resizedImg)
	default:
		return jpeg.Encode(out, resizedImg, &jpeg.Options{Quality: 80})
	}
}

func (s *imageService) isValidImageType(contentType string) bool {
	validTypes := []string{
		"image/jpeg",
		"image/jpg",
		"image/png",
		"image/gif",
	}

	for _, validType := range validTypes {
		if contentType == validType {
			return true
		}
	}
	return false
}

func (s *imageService) getImageDimensions(imagePath string) (int, int, error) {
	file, err := os.Open(imagePath)
	if err != nil {
		return 0, 0, err
	}
	defer file.Close()

	img, _, err := image.DecodeConfig(file)
	if err != nil {
		return 0, 0, err
	}

	return img.Width, img.Height, nil
}
