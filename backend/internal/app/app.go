package app

import (
	"github.com/chmenegatti/myBlog/internal/config"
	"github.com/chmenegatti/myBlog/internal/database"
	"github.com/chmenegatti/myBlog/internal/handlers"
	"github.com/chmenegatti/myBlog/internal/middleware"
	"github.com/chmenegatti/myBlog/internal/repositories"
	"github.com/chmenegatti/myBlog/internal/services"
	"github.com/gin-gonic/gin"
)

type App struct {
	config *config.Config
	router *gin.Engine
	db     *database.DB
}

func New(cfg *config.Config) (*App, error) {
	// Initialize database
	db, err := database.New(cfg.Database)
	if err != nil {
		return nil, err
	}

	// Initialize repositories
	userRepo := repositories.NewUserRepository(db.GetDB())
	postRepo := repositories.NewPostRepository(db.GetDB())
	categoryRepo := repositories.NewCategoryRepository(db.GetDB())
	tagRepo := repositories.NewTagRepository(db.GetDB())
	commentRepo := repositories.NewCommentRepository(db.GetDB())
	newsletterRepo := repositories.NewNewsletterRepository(db.GetDB())

	// Initialize services
	authService := services.NewAuthService(userRepo, cfg.JWT)
	userService := services.NewUserService(userRepo)
	postService := services.NewPostService(postRepo, categoryRepo, tagRepo)
	categoryService := services.NewCategoryService(categoryRepo)
	tagService := services.NewTagService(tagRepo)
	commentService := services.NewCommentService(commentRepo)
	newsletterService := services.NewNewsletterService(newsletterRepo)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService)
	userHandler := handlers.NewUserHandler(userService)
	postHandler := handlers.NewPostHandler(postService)
	categoryHandler := handlers.NewCategoryHandler(categoryService)
	tagHandler := handlers.NewTagHandler(tagService)
	commentHandler := handlers.NewCommentHandler(commentService)
	newsletterHandler := handlers.NewNewsletterHandler(newsletterService)

	// Setup router
	router := setupRouter(cfg, authHandler, userHandler, postHandler, categoryHandler, tagHandler, commentHandler, newsletterHandler)

	return &App{
		config: cfg,
		router: router,
		db:     db,
	}, nil
}

func (a *App) Start() error {
	return a.router.Run(":" + a.config.Server.Port)
}

func setupRouter(
	cfg *config.Config,
	authHandler *handlers.AuthHandler,
	userHandler *handlers.UserHandler,
	postHandler *handlers.PostHandler,
	categoryHandler *handlers.CategoryHandler,
	tagHandler *handlers.TagHandler,
	commentHandler *handlers.CommentHandler,
	newsletterHandler *handlers.NewsletterHandler,
) *gin.Engine {
	if cfg.Server.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()

	// Middleware
	router.Use(middleware.CORS(cfg.CORS))
	router.Use(middleware.Logger())
	router.Use(gin.Recovery())

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// API routes
	api := router.Group("/api/v1")
	{
		// Public routes
		auth := api.Group("/auth")
		{
			auth.POST("/login", authHandler.Login)
			auth.POST("/register", authHandler.Register)
			auth.POST("/refresh", authHandler.RefreshToken)
		}

		// Public blog routes
		public := api.Group("/public")
		{
			public.GET("/posts", postHandler.GetPublicPosts)
			public.GET("/posts/:slug", postHandler.GetPostBySlug)
			public.GET("/categories", categoryHandler.GetCategories)
			public.GET("/tags", tagHandler.GetTags)
			public.POST("/comments", commentHandler.CreateComment)
			public.POST("/newsletter/subscribe", newsletterHandler.Subscribe)
			public.GET("/newsletter/unsubscribe/:token", newsletterHandler.Unsubscribe)
		}

		// Protected routes
		protected := api.Group("/")
		protected.Use(middleware.AuthRequired(cfg.JWT))
		{
			// Users
			users := protected.Group("/users")
			{
				users.GET("/me", userHandler.GetCurrentUser)
				users.PUT("/me", userHandler.UpdateCurrentUser)
				users.GET("/", userHandler.GetUsers)
				users.POST("/", userHandler.CreateUser)
				users.PUT("/:id", userHandler.UpdateUser)
				users.DELETE("/:id", userHandler.DeleteUser)
			}

			// Posts
			posts := protected.Group("/posts")
			{
				posts.GET("/", postHandler.GetPosts)
				posts.POST("/", postHandler.CreatePost)
				posts.GET("/:id", postHandler.GetPost)
				posts.PUT("/:id", postHandler.UpdatePost)
				posts.DELETE("/:id", postHandler.DeletePost)
				posts.POST("/:id/publish", postHandler.PublishPost)
				posts.POST("/:id/unpublish", postHandler.UnpublishPost)
			}

			// Categories
			categories := protected.Group("/categories")
			{
				categories.POST("/", categoryHandler.CreateCategory)
				categories.PUT("/:id", categoryHandler.UpdateCategory)
				categories.DELETE("/:id", categoryHandler.DeleteCategory)
			}

			// Tags
			tags := protected.Group("/tags")
			{
				tags.POST("/", tagHandler.CreateTag)
				tags.PUT("/:id", tagHandler.UpdateTag)
				tags.DELETE("/:id", tagHandler.DeleteTag)
			}

			// Comments
			comments := protected.Group("/comments")
			{
				comments.GET("/", commentHandler.GetComments)
				comments.PUT("/:id", commentHandler.UpdateComment)
				comments.DELETE("/:id", commentHandler.DeleteComment)
				comments.POST("/:id/approve", commentHandler.ApproveComment)
				comments.POST("/:id/reject", commentHandler.RejectComment)
			}

			// Newsletter
			newsletter := protected.Group("/newsletter")
			{
				newsletter.GET("/subscribers", newsletterHandler.GetSubscribers)
				newsletter.DELETE("/subscribers/:id", newsletterHandler.DeleteSubscriber)
			}
		}
	}

	return router
}
