import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Check if mobile
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        // On mobile, redirect to login page
        navigate('/login', { 
          state: { 
            redirectAfterLogin: location.pathname + location.search
          },
          replace: true
        });
      } else {
        // On desktop, redirect về trang chủ và trigger modal đăng nhập
        navigate('/', { 
          state: { 
            showLoginModal: true,
            redirectAfterLogin: location.pathname + location.search
          },
          replace: true
        });
      }
    }
  }, [isAuthenticated, loading, navigate, location.pathname, location.search]);

  // Show loading while checking authentication - small green spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not authenticated, don't render anything (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
