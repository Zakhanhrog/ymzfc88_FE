import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

// Check auth synchronously on initialization
const checkAuthSync = () => {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    
    if (token && userData) {
      return {
        isAuthenticated: true,
        user: JSON.parse(userData)
      };
    }
  } catch (error) {
    console.error('Error checking auth:', error);
  }
  
  return {
    isAuthenticated: false,
    user: null
  };
};

export const useAuth = () => {
  // Initialize state synchronously to avoid loading flash
  const initialAuth = checkAuthSync();
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth.isAuthenticated);
  const [user, setUser] = useState(initialAuth.user);
  const [loading, setLoading] = useState(false); // Start with false since we check sync

  // Only use useEffect for updates, not initial check
  useEffect(() => {
    // This effect can be used for future auth state updates if needed
    // For now, initial check is done synchronously above
  }, []);

  const login = (token, userData) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };
};
