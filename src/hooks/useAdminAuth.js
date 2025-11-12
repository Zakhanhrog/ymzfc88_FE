import { useState, useEffect, useCallback } from 'react';
import { adminAuthService } from '../features/admin/services/adminAuthService';
import { getPortalType } from '../utils/subdomain';

export const useAdminAuth = () => {
  const portalType = getPortalType();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const isAuth = adminAuthService.isAuthenticated(portalType);
        const isAuthorized = adminAuthService.isAuthorizedForPortal(portalType);
        const valid = isAuth && isAuthorized;
        setIsAuthenticated(valid);

        if (valid) {
          const adminData = adminAuthService.getCurrentAdmin();
          setAdmin(adminData);
        } else {
          setAdmin(null);
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
  }, [portalType]);

  const login = useCallback(async (credentials) => {
    const result = await adminAuthService.login(credentials);
    if (result.success) {
      setIsAuthenticated(true);
      setAdmin(result.data);
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    adminAuthService.logout();
    setIsAuthenticated(false);
    setAdmin(null);
  }, []);

  return {
    isAuthenticated,
    admin,
    loading,
    login,
    logout
  };
};
