import api from './api';

export const commentService = {
  // Create comment (PUBLIC ROUTE)
  createComment: async commentData => {
    const response = await api.post('/public/comments', commentData);
    return response.data;
  },

  // Get all comments (PROTECTED ROUTE - Admin only)
  getComments: async () => {
    const response = await api.get('/comments');
    return response.data;
  },

  // Update comment (PROTECTED ROUTE - Admin only)
  updateComment: async (id, commentData) => {
    const response = await api.put(`/comments/${id}`, commentData);
    return response.data;
  },

  // Delete comment (PROTECTED ROUTE - Admin only)
  deleteComment: async id => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },

  // Approve comment (PROTECTED ROUTE - Admin only)
  approveComment: async id => {
    const response = await api.post(`/comments/${id}/approve`);
    return response.data;
  },

  // Reject comment (PROTECTED ROUTE - Admin only)
  rejectComment: async id => {
    const response = await api.post(`/comments/${id}/reject`);
    return response.data;
  },
};

export default commentService;
