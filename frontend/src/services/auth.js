import api from './api';

export const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      // Mock login for testing when backend is not available
      if (
        error.code === 'ECONNREFUSED' ||
        error.code === 'NETWORK_ERROR' ||
        error.message?.includes('Network Error')
      ) {
        console.log('Backend not available, using mock login');

        // Simple mock validation
        if (email === 'admin@blog.com' && password === 'admin123') {
          const mockUser = {
            id: 1,
            name: 'Admin User',
            email: 'admin@blog.com',
            token: 'mock-jwt-token-' + Date.now(),
          };

          localStorage.setItem('token', mockUser.token);
          return mockUser;
        } else {
          throw new Error('Invalid credentials');
        }
      }
      throw error;
    }
  },

  // Register user
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
    });

    // Store token in localStorage if provided
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');

    // Update token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get current token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Get current user (mock for now)
  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      // Mock user for testing
      if (
        error.code === 'ECONNREFUSED' ||
        error.code === 'NETWORK_ERROR' ||
        error.message?.includes('Network Error')
      ) {
        return {
          id: 1,
          name: 'Admin User',
          email: 'admin@blog.com',
        };
      }
      // If error, remove invalid token
      localStorage.removeItem('token');
      return null;
    }
  },
};

export default authService;
