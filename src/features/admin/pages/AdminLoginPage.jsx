import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import AdminLoginForm from '../components/AdminLoginForm';
import { getPortalDashboardPath } from '../../../utils/navigation';
import { getPortalType } from '../../../utils/subdomain';
import { adminAuthService } from '../services/adminAuthService';

const STAFF_DEFAULT_TABS = {
  STAFF_MKT: 'staff-mkt-users',
  STAFF_XNK: 'staff-xnk-users',
  STAFF_TX1: 'staff-tx1-overview',
  STAFF_TX2: 'staff-tx2-overview',
  STAFF_XD: 'staff-xd-overview'
};

const getDefaultTabForSession = (portalType, session) => {
  if (portalType === 'agent') {
    return 'agent-overview';
  }

  if (portalType === 'staff') {
    const staffRole = session?.staffRole;
    return STAFF_DEFAULT_TABS[staffRole] || 'overview';
  }

  return 'overview';
};

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const portalType = getPortalType();
  const [isChecking, setIsChecking] = useState(true);

  const goToDefaultDashboard = useMemo(() => {
    return (session) => {
      const defaultTab = getDefaultTabForSession(portalType, session);
      navigate(getPortalDashboardPath(portalType, defaultTab));
    };
  }, [navigate, portalType]);

  useEffect(() => {
    const isAuthenticated = adminAuthService.isAuthenticated(portalType);
    const isAuthorized = adminAuthService.isAuthorizedForPortal(portalType);
    if (isAuthenticated && isAuthorized) {
      const session = adminAuthService.getCurrentAdmin();
      goToDefaultDashboard(session);
    } else {
      setIsChecking(false);
    }
  }, [portalType, goToDefaultDashboard]);

  const handleLoginSuccess = (session) => {
    goToDefaultDashboard(session);
  };

  if (isChecking) {
    return null;
  }

  return <AdminLoginForm onLogin={handleLoginSuccess} portalType={portalType} />;
};

export default AdminLoginPage;
