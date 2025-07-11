import api from './api';

export const imageService = {
  // Upload image (PROTECTED ROUTE)
  uploadImage: async (file, description = '') => {
    const formData = new FormData();
    formData.append('image', file);
    if (description) {
      formData.append('description', description);
    }

    const response = await api.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get user images (PROTECTED ROUTE)
  getUserImages: async () => {
    const response = await api.get('/images/my');
    return response.data;
  },

  // Get all images (PROTECTED ROUTE - Admin only)
  getAllImages: async () => {
    const response = await api.get('/images/all');
    return response.data;
  },

  // Get image by ID (PROTECTED ROUTE)
  getImage: async id => {
    const response = await api.get(`/images/${id}`);
    return response.data;
  },

  // Delete image (PROTECTED ROUTE)
  deleteImage: async id => {
    const response = await api.delete(`/images/${id}`);
    return response.data;
  },

  // Upload avatar (PROTECTED ROUTE)
  uploadAvatar: async file => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/images/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload featured image (PROTECTED ROUTE)
  uploadFeaturedImage: async file => {
    const formData = new FormData();
    formData.append('featured', file);

    const response = await api.post('/images/featured', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default imageService;
