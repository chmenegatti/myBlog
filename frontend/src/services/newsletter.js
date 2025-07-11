import api from './api';

export const newsletterService = {
  // Subscribe to newsletter (PUBLIC ROUTE)
  subscribe: async email => {
    const response = await api.post('/public/newsletter/subscribe', {
      email,
    });
    return response.data;
  },

  // Unsubscribe from newsletter (PUBLIC ROUTE)
  unsubscribe: async token => {
    const response = await api.get(`/public/newsletter/unsubscribe/${token}`);
    return response.data;
  },

  // Get subscribers (PROTECTED ROUTE - Admin only)
  getSubscribers: async () => {
    const response = await api.get('/newsletter/subscribers');
    return response.data;
  },

  // Delete subscriber (PROTECTED ROUTE - Admin only)
  deleteSubscriber: async id => {
    const response = await api.delete(`/newsletter/subscribers/${id}`);
    return response.data;
  },
};

export default newsletterService;
