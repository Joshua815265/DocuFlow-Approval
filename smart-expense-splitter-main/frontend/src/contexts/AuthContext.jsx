import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        // Set user from localStorage first - this ensures immediate authentication
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);

        // Optional: Verify token is still valid in the background
        // Don't logout on failure - just log the error
        try {
          console.log('Verifying token with /api/auth/me...');
          const response = await authAPI.getCurrentUser();
          console.log('Token verification successful:', response.data);
          setUser(response.data);
        } catch (error) {
          // Token validation failed, but keep user logged in with cached data
          console.warn('Token validation failed, using cached user data:', {
            status: error.response?.status,
            message: error.response?.data,
            token: token ? 'present' : 'missing'
          });

          // If it's a 401 or 403, the token is likely invalid, so logout
          if (error.response?.status === 401 || error.response?.status === 403) {
            console.log('Token is invalid, logging out...');
            logout();
            return; // Exit early to prevent setting loading to false
          }
        }
      } else {
        // No token or user data, ensure logged out state
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Only logout if there's a critical error, not just token validation failure
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      const { token, userDto } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userDto));
      
      setUser(userDto);
      setIsAuthenticated(true);
      
      return { success: true, user: userDto };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      const { token, userDto } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userDto));
      
      setUser(userDto);
      setIsAuthenticated(true);
      
      return { success: true, user: userDto };
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
