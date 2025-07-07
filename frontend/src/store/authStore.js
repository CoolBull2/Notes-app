import { create } from 'zustand';
import { authAPI } from '../services/api';
import React from 'react';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  // Login action
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login(credentials);
      const { access_token } = response.data;
      
      // Store token
      localStorage.setItem('token', access_token);
      
      // Get user info
      const userResponse = await authAPI.getCurrentUser();
      
      set({
        token: access_token,
        user: userResponse.data,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed';
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      });
      localStorage.removeItem('token');
      return { success: false, error: errorMessage };
    }
  },

  // Register action
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      await authAPI.register(userData);
      
      // Auto-login after registration
      const loginResult = await get().login({
        username: userData.username,
        password: userData.password,
      });
      
      return loginResult;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Registration failed';
      set({
        error: errorMessage,
        isLoading: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Logout action
  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  // Initialize user from token
  initializeAuth: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userResponse = await authAPI.getCurrentUser();
        set({
          user: userResponse.data,
          token,
          isAuthenticated: true,
        });
      } catch (error) {
        // Token is invalid
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      }
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;