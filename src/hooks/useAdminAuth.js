import { useState, useEffect } from 'react';
import { adminAuthService } from '../features/admin/services/adminAuthService';

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is authenticated on mount
    const checkAuth = () => {
      try {
        const isAuth = adminAuthService.isAuthenticated();
        setIsAuthenticated(isAuth);
        
        if (isAuth) {
          const adminData = adminAuthService.getCurrentAdmin();
          setAdmin(adminData);
        }
      } catch (error) {
        console.error('Error checking admin auth:', error);
        setIsAuthenticated(false);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const result = await adminAuthService.login(credentials);
      if (result.success) {
        setIsAuthenticated(true);
        setAdmin(result.data);
        return result;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    adminAuthService.logout();
    setIsAuthenticated(false);
    setAdmin(null);
  };

  return {
    isAuthenticated,
    admin,
    loading,
    login,
    logout
  };
};
