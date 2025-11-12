import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminTabContent from '../components/AdminTabContent';
import { adminService } from '../services/adminService';
import { getPortalType } from '../../../utils/subdomain';

const AdminDashboardPage = () => {
  const location = useLocation();
  const portalType = getPortalType();
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(false);

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const currentTab = searchParams.get('tab') || 'overview';

  useEffect(() => {
    if (portalType === 'admin' && currentTab === 'overview') {
      loadDashboardStats();
    }
  }, [currentTab, portalType]);

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await adminService.getDashboardStats();
      if (response.success) {
        setDashboardStats(response.data);
      }
    } catch (error) {
      // Silently ignore for now
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <AdminTabContent
        currentTab={currentTab}
        dashboardStats={dashboardStats}
        loading={loading && portalType === 'admin'}
      />
    </AdminLayout>
  );
};

export default AdminDashboardPage;
