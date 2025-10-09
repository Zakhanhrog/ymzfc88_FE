import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminTabContent from '../components/AdminTabContent';
import { adminService } from '../services/adminService';

const AdminDashboardPage = () => {
  const location = useLocation();
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(false);

  // Get current tab from URL params
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'overview';

  useEffect(() => {
    if (currentTab === 'overview') {
      loadDashboardStats();
    }
  }, [currentTab]);

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await adminService.getDashboardStats();
      if (response.success) {
        setDashboardStats(response.data);
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <AdminTabContent 
        currentTab={currentTab}
        dashboardStats={dashboardStats}
        loading={loading}
      />
    </AdminLayout>
  );
};

export default AdminDashboardPage;
