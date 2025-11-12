import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '../ui';
import { adminAuthService } from '../../features/admin/services/adminAuthService';
import { getPortalLoginPath } from '../../utils/navigation';
import { getPortalType } from '../../utils/subdomain';

const AdminProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const portalType = getPortalType();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = adminAuthService.isAuthenticated(portalType);
      const isAuthorized = adminAuthService.isAuthorizedForPortal(portalType);
      if (!isAuthenticated || !isAuthorized) {
        adminAuthService.logout();
        navigate(getPortalLoginPath(portalType));
        setAuthorized(false);
      } else {
        setAuthorized(true);
      }
      setChecking(false);
    };

    checkAuth();
  }, [navigate, portalType]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return children;
};

export default AdminProtectedRoute;
