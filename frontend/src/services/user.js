import api from './api';

export const userService = {
  // Get current user profile (PROTECTED ROUTE)
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Update current user profile (PROTECTED ROUTE)
  updateCurrentUser: async userData => {
    const response = await api.put('/users/me', userData);
    return response.data;
  },

  // Get all users (PROTECTED ROUTE - Admin only)
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Create user (PROTECTED ROUTE - Admin only)
  createUser: async userData => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Update user (PROTECTED ROUTE - Admin only)
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user (PROTECTED ROUTE - Admin only)
  deleteUser: async id => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export default userService;
