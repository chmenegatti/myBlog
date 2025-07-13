import api from './api';
import {
  getMockPosts,
  getMockFeaturedPosts,
  getMockCategories,
  searchMockPosts,
} from '../utils/mockData';

// Helper function to check if we should use mock data
const shouldUseMockData = error => {
  return (
    error.code === 'ECONNREFUSED' ||
    error.code === 'NETWORK_ERROR' ||
    error.message?.includes('Network Error') ||
    error.response?.status === 404
  );
};

export const postsService = {
  // Get all public posts with pagination (PUBLIC ROUTE)
  getAllPosts: async (page = 1, limit = 10, category = '', tags = '') => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (category) params.append('category', category);
      if (tags) params.append('tags', tags);

      const response = await api.get(`/public/posts?${params}`);
      return {
        data: response.data.posts,
        total: response.data.total,
        limit: response.data.limit,
        offset: response.data.offset,
      };
    } catch (error) {
      if (shouldUseMockData(error)) {
        console.log('Backend not available, using mock data');
        return getMockPosts(page, limit, category);
      }
      throw error;
    }
  },

  // Get featured posts (using getAllPosts with featured flag for now)
  getFeaturedPosts: async () => {
    try {
      // Since backend doesn't have dedicated featured endpoint, we'll get recent posts
      const response = await api.get('/public/posts?limit=6');
      return {
        data: response.data.posts,
        total: response.data.total,
        limit: response.data.limit,
        offset: response.data.offset,
      };
    } catch (error) {
      if (shouldUseMockData(error)) {
        console.log('Backend not available, using mock data');
        return getMockFeaturedPosts();
      }
      throw error;
    }
  },

  // Get post by slug (PUBLIC ROUTE)
  getPostBySlug: async slug => {
    try {
      const response = await api.get(`/public/posts/${slug}`);
      return { data: response.data };
    } catch (error) {
      if (shouldUseMockData(error)) {
        console.log('Backend not available, using mock data');
        // For now, return null or throw error since we don't have individual post mock
        throw new Error('Post not found');
      }
      throw error;
    }
  },

  // Search posts (using getAllPosts with search parameter for now)
  searchPosts: async (query, page = 1, limit = 10) => {
    try {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: limit.toString(),
      });

      // Since backend doesn't have dedicated search endpoint, we'll simulate
      const response = await api.get(`/public/posts?${params}`);
      return {
        data: response.data.posts,
        total: response.data.total,
        limit: response.data.limit,
        offset: response.data.offset,
      };
    } catch (error) {
      if (shouldUseMockData(error)) {
        console.log('Backend not available, using mock data');
        return searchMockPosts(query, page, limit);
      }
      throw error;
    }
  },

  // Get categories (PUBLIC ROUTE)
  getCategories: async () => {
    try {
      const response = await api.get('public/categories');
      return response.data;
    } catch (error) {
      if (shouldUseMockData(error)) {
        console.log('Backend not available, using mock data');
        return getMockCategories();
      }
      throw error;
    }
  },

  // Get tags (PUBLIC ROUTE)
  getTags: async () => {
    try {
      const response = await api.get('/public/tags');
      return response.data;
    } catch (error) {
      if (shouldUseMockData(error)) {
        console.log('Backend not available, using mock data');
        return { data: [] }; // Return empty tags for now
      }
      throw error;
    }
  },

  // Subscribe to newsletter (PUBLIC ROUTE)
  subscribeNewsletter: async email => {
    try {
      const response = await api.post('/public/newsletter/subscribe', {
        email,
      });
      return response.data;
    } catch (error) {
      if (shouldUseMockData(error)) {
        console.log(
          'Backend not available, simulating newsletter subscription'
        );
        // Simulate successful subscription
        return { message: 'Successfully subscribed!' };
      }
      throw error;
    }
  },

  // PROTECTED ROUTES (for admin/authenticated users)
  // Get all posts for admin (PROTECTED ROUTE)
  getAdminPosts: async (page = 1, limit = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await api.get(`/posts?${params}`);
    return response.data;
  },

  // Get post by ID for admin (PROTECTED ROUTE)
  getPostById: async id => {
    const response = await api.get(`/posts/${id}`);
    return { data: response.data };
  },

  // Create post (PROTECTED ROUTE)
  createPost: async postData => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  // Update post (PROTECTED ROUTE)
  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  // Delete post (PROTECTED ROUTE)
  deletePost: async id => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  // Publish post (PROTECTED ROUTE)
  publishPost: async id => {
    const response = await api.post(`/posts/${id}/publish`);
    return response.data;
  },

  // Unpublish post (PROTECTED ROUTE)
  unpublishPost: async id => {
    const response = await api.post(`/posts/${id}/unpublish`);
    return response.data;
  },

  // Preview markdown (PROTECTED ROUTE)
  previewMarkdown: async markdownContent => {
    const response = await api.post('/posts/preview', {
      content: markdownContent,
    });
    return response.data;
  },

  // CATEGORY MANAGEMENT (PROTECTED ROUTES)
  // Create category (PROTECTED ROUTE)
  createCategory: async categoryData => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Update category (PROTECTED ROUTE)
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Delete category (PROTECTED ROUTE)
  deleteCategory: async id => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  // TAG MANAGEMENT (PROTECTED ROUTES)
  // Create tag (PROTECTED ROUTE)
  createTag: async tagData => {
    const response = await api.post('/tags', tagData);
    return response.data;
  },

  // Update tag (PROTECTED ROUTE)
  updateTag: async (id, tagData) => {
    const response = await api.put(`/tags/${id}`, tagData);
    return response.data;
  },

  // Delete tag (PROTECTED ROUTE)
  deleteTag: async id => {
    const response = await api.delete(`/tags/${id}`);
    return response.data;
  },
};

export default postsService;
