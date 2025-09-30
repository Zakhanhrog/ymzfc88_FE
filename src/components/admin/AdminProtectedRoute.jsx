import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { adminAuthService } from '../../features/admin/services/adminAuthService';

const AdminProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = adminAuthService.isAuthenticated();
      if (!isAuthenticated) {
        navigate('/admin/login');
      }
    };

    checkAuth();
  }, [navigate]);

  // Show loading while checking authentication
  const isAuthenticated = adminAuthService.isAuthenticated();
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return children;
};

export default AdminProtectedRoute;
