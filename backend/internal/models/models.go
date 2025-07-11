package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// User represents a blog user (admin/author)
type User struct {
	ID        uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Username  string         `json:"username" gorm:"unique;not null"`
	Email     string         `json:"email" gorm:"unique;not null"`
	Password  string         `json:"-" gorm:"not null"`
	Name      string         `json:"name" gorm:"not null"`
	Bio       string         `json:"bio"`
	Avatar    string         `json:"avatar"`
	Role      UserRole       `json:"role" gorm:"default:'author'"`
	IsActive  bool           `json:"is_active" gorm:"default:true"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	Posts []Post `json:"posts,omitempty" gorm:"foreignKey:AuthorID"`
}

type UserRole string

const (
	RoleAdmin  UserRole = "admin"
	RoleAuthor UserRole = "author"
)

// Post represents a blog post
type Post struct {
	ID          uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Title       string         `json:"title" gorm:"not null"`
	Slug        string         `json:"slug" gorm:"unique;not null"`
	Excerpt     string         `json:"excerpt"`
	Content     string         `json:"content" gorm:"type:text"`      // Raw markdown content
	ContentHTML string         `json:"content_html" gorm:"type:text"` // Processed HTML content
	FeaturedImg string         `json:"featured_img"`
	Status      PostStatus     `json:"status" gorm:"default:'draft'"`
	AuthorID    uuid.UUID      `json:"author_id" gorm:"type:uuid;not null"`
	ViewCount   int            `json:"view_count" gorm:"default:0"`
	ReadingTime int            `json:"reading_time" gorm:"default:0"` // Estimated reading time in minutes
	WordCount   int            `json:"word_count" gorm:"default:0"`   // Word count of content
	PublishedAt *time.Time     `json:"published_at"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	Author     User       `json:"author" gorm:"foreignKey:AuthorID"`
	Categories []Category `json:"categories,omitempty" gorm:"many2many:post_categories;"`
	Tags       []Tag      `json:"tags,omitempty" gorm:"many2many:post_tags;"`
	Comments   []Comment  `json:"comments,omitempty" gorm:"foreignKey:PostID"`
}

type PostStatus string

const (
	StatusDraft     PostStatus = "draft"
	StatusPublished PostStatus = "published"
	StatusArchived  PostStatus = "archived"
)

// Category represents a blog category
type Category struct {
	ID          uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Name        string         `json:"name" gorm:"unique;not null"`
	Slug        string         `json:"slug" gorm:"unique;not null"`
	Description string         `json:"description"`
	Color       string         `json:"color" gorm:"default:'#6B7280'"` // Tailwind gray-500
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	Posts []Post `json:"posts,omitempty" gorm:"many2many:post_categories;"`
}

// Tag represents a blog tag
type Tag struct {
	ID        uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Name      string         `json:"name" gorm:"unique;not null"`
	Slug      string         `json:"slug" gorm:"unique;not null"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	Posts []Post `json:"posts,omitempty" gorm:"many2many:post_tags;"`
}

// Comment represents a comment on a blog post
type Comment struct {
	ID        uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	PostID    uuid.UUID      `json:"post_id" gorm:"type:uuid;not null"`
	ParentID  *uuid.UUID     `json:"parent_id" gorm:"type:uuid"` // For reply comments
	Name      string         `json:"name" gorm:"not null"`
	Email     string         `json:"email" gorm:"not null"`
	Website   string         `json:"website"`
	Content   string         `json:"content" gorm:"type:text;not null"`
	Status    CommentStatus  `json:"status" gorm:"default:'pending'"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	Post    Post      `json:"post" gorm:"foreignKey:PostID"`
	Parent  *Comment  `json:"parent,omitempty" gorm:"foreignKey:ParentID"`
	Replies []Comment `json:"replies,omitempty" gorm:"foreignKey:ParentID"`
}

type CommentStatus string

const (
	CommentPending  CommentStatus = "pending"
	CommentApproved CommentStatus = "approved"
	CommentRejected CommentStatus = "rejected"
)

// Newsletter represents newsletter subscriptions
type Newsletter struct {
	ID          uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Email       string         `json:"email" gorm:"unique;not null"`
	IsActive    bool           `json:"is_active" gorm:"default:true"`
	Token       string         `json:"-" gorm:"unique"` // For unsubscribe
	ConfirmedAt *time.Time     `json:"confirmed_at"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

// Image represents an uploaded image
type Image struct {
	ID           uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	FileName     string         `json:"file_name" gorm:"not null"`
	OriginalName string         `json:"original_name" gorm:"not null"`
	MimeType     string         `json:"mime_type" gorm:"not null"`
	Size         int64          `json:"size" gorm:"not null"`
	Path         string         `json:"path" gorm:"not null"`
	URL          string         `json:"url" gorm:"not null"`
	Width        int            `json:"width"`
	Height       int            `json:"height"`
	UploadedBy   uuid.UUID      `json:"uploaded_by" gorm:"type:uuid;not null"`
	IsActive     bool           `json:"is_active" gorm:"default:true"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	Uploader User `json:"uploader,omitempty" gorm:"foreignKey:UploadedBy"`
}

// ImageCategory represents different types of images
type ImageCategory string

const (
	ImageCategoryAvatar   ImageCategory = "avatar"
	ImageCategoryFeatured ImageCategory = "featured"
	ImageCategoryContent  ImageCategory = "content"
	ImageCategoryGeneral  ImageCategory = "general"
)
