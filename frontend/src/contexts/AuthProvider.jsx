import { useState, useEffect } from 'react';
import { AuthContext } from './auth';
import { authService } from '../services';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = authService.getToken();
      if (token) {
        // Verify token by getting user profile
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          authService.logout();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch {
      // Token invalid, clear it
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    // For mock response, user data is directly in response
    const userData = response.user || response;
    setUser(userData);
    setIsAuthenticated(true);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (name, email, password) => {
    const response = await authService.register(name, email, password);
    setUser(response.user);
    setIsAuthenticated(true);
    return response;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    register,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
