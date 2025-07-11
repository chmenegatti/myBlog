// Mock data for testing the frontend without backend
export const mockPosts = [
  {
    id: 1,
    title: 'Getting Started with React and Material UI',
    slug: 'getting-started-react-material-ui',
    excerpt:
      'Learn how to build beautiful and responsive user interfaces using React and Material UI. This comprehensive guide covers everything from setup to advanced components.',
    content: '# Getting Started\n\nThis is a sample blog post...',
    featured_image: '/placeholder-image.jpg',
    reading_time: 5,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    author: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '/placeholder-image.jpg',
    },
    category: {
      id: 1,
      name: 'Frontend',
      slug: 'frontend',
    },
    tags: [
      { id: 1, name: 'React', slug: 'react' },
      { id: 2, name: 'Material UI', slug: 'material-ui' },
      { id: 3, name: 'JavaScript', slug: 'javascript' },
    ],
  },
  {
    id: 2,
    title: 'Building RESTful APIs with Go and Gin',
    slug: 'building-restful-apis-go-gin',
    excerpt:
      'Discover how to create robust and scalable REST APIs using Go and the Gin framework. Perfect for backend developers looking to level up their skills.',
    content: '# Building APIs\n\nThis is another sample blog post...',
    featured_image: '/placeholder-image.jpg',
    reading_time: 8,
    created_at: '2024-01-14T15:30:00Z',
    updated_at: '2024-01-14T15:30:00Z',
    author: {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: '/placeholder-image.jpg',
    },
    category: {
      id: 2,
      name: 'Backend',
      slug: 'backend',
    },
    tags: [
      { id: 4, name: 'Go', slug: 'go' },
      { id: 5, name: 'Gin', slug: 'gin' },
      { id: 6, name: 'API', slug: 'api' },
    ],
  },
  {
    id: 3,
    title: 'Modern Design Principles for Web Applications',
    slug: 'modern-design-principles-web-applications',
    excerpt:
      'Explore the latest design trends and principles that make web applications both beautiful and functional. From typography to color theory.',
    content: '# Design Principles\n\nThis is a design-focused blog post...',
    featured_image: '/placeholder-image.jpg',
    reading_time: 6,
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z',
    author: {
      id: 3,
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatar: '/placeholder-image.jpg',
    },
    category: {
      id: 3,
      name: 'Design',
      slug: 'design',
    },
    tags: [
      { id: 7, name: 'Design', slug: 'design' },
      { id: 8, name: 'UI/UX', slug: 'ui-ux' },
      { id: 9, name: 'Typography', slug: 'typography' },
    ],
  },
  {
    id: 4,
    title: 'Database Optimization Techniques',
    slug: 'database-optimization-techniques',
    excerpt:
      'Learn advanced database optimization techniques to improve your application performance. Covers indexing, query optimization, and more.',
    content: '# Database Optimization\n\nThis post covers database tips...',
    featured_image: '/placeholder-image.jpg',
    reading_time: 10,
    created_at: '2024-01-12T14:20:00Z',
    updated_at: '2024-01-12T14:20:00Z',
    author: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '/placeholder-image.jpg',
    },
    category: {
      id: 4,
      name: 'Database',
      slug: 'database',
    },
    tags: [
      { id: 10, name: 'Database', slug: 'database' },
      { id: 11, name: 'Performance', slug: 'performance' },
      { id: 12, name: 'SQL', slug: 'sql' },
    ],
  },
  {
    id: 5,
    title: 'Introduction to Machine Learning',
    slug: 'introduction-machine-learning',
    excerpt:
      'A beginner-friendly introduction to machine learning concepts and algorithms. Perfect for developers wanting to understand AI basics.',
    content: '# Machine Learning\n\nThis is an ML introduction...',
    featured_image: '/placeholder-image.jpg',
    reading_time: 12,
    created_at: '2024-01-11T11:45:00Z',
    updated_at: '2024-01-11T11:45:00Z',
    author: {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: '/placeholder-image.jpg',
    },
    category: {
      id: 5,
      name: 'AI/ML',
      slug: 'ai-ml',
    },
    tags: [
      { id: 13, name: 'Machine Learning', slug: 'machine-learning' },
      { id: 14, name: 'AI', slug: 'ai' },
      { id: 15, name: 'Python', slug: 'python' },
    ],
  },
  {
    id: 6,
    title: 'DevOps Best Practices for Modern Teams',
    slug: 'devops-best-practices-modern-teams',
    excerpt:
      'Discover essential DevOps practices that help teams ship software faster and more reliably. From CI/CD to monitoring.',
    content: '# DevOps Practices\n\nThis covers DevOps methodologies...',
    featured_image: '/placeholder-image.jpg',
    reading_time: 7,
    created_at: '2024-01-10T16:30:00Z',
    updated_at: '2024-01-10T16:30:00Z',
    author: {
      id: 3,
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatar: '/placeholder-image.jpg',
    },
    category: {
      id: 6,
      name: 'DevOps',
      slug: 'devops',
    },
    tags: [
      { id: 16, name: 'DevOps', slug: 'devops' },
      { id: 17, name: 'CI/CD', slug: 'cicd' },
      { id: 18, name: 'Docker', slug: 'docker' },
    ],
  },
];

export const mockCategories = [
  { id: 1, name: 'Frontend', slug: 'frontend' },
  { id: 2, name: 'Backend', slug: 'backend' },
  { id: 3, name: 'Design', slug: 'design' },
  { id: 4, name: 'Database', slug: 'database' },
  { id: 5, name: 'AI/ML', slug: 'ai-ml' },
  { id: 6, name: 'DevOps', slug: 'devops' },
];

export const mockFeaturedPosts = mockPosts.slice(0, 3);

// Helper function to simulate API delays
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
export const getMockPosts = async (page = 1, limit = 10, category = '') => {
  await delay(500);

  let filteredPosts = mockPosts;

  if (category) {
    filteredPosts = mockPosts.filter(post => post.category.slug === category);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  return {
    data: paginatedPosts,
    total: filteredPosts.length,
    page,
    limit,
    totalPages: Math.ceil(filteredPosts.length / limit),
  };
};

export const getMockFeaturedPosts = async () => {
  await delay(300);
  return {
    data: mockFeaturedPosts,
  };
};

export const getMockCategories = async () => {
  await delay(200);
  return {
    data: mockCategories,
  };
};

export const searchMockPosts = async (query, page = 1, limit = 10) => {
  await delay(400);

  const filteredPosts = mockPosts.filter(
    post =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      post.tags.some(tag =>
        tag.name.toLowerCase().includes(query.toLowerCase())
      )
  );

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  return {
    data: paginatedPosts,
    total: filteredPosts.length,
    page,
    limit,
    totalPages: Math.ceil(filteredPosts.length / limit),
  };
};
