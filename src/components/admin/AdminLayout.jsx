import { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './layout/AdminHeader';
import { LAYOUT } from '../../utils/theme';
import { getPortalLoginPath } from '../../utils/navigation';
import { getPortalType } from '../../utils/subdomain';
import { adminAuthService } from '../../features/admin/services/adminAuthService';

const { Content } = Layout;

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const portalType = getPortalType();

  useEffect(() => {
    // Check admin authentication
    const isAuthenticated = adminAuthService.isAuthenticated(portalType);
    const isAuthorized = adminAuthService.isAuthorizedForPortal(portalType);
    if (!isAuthenticated || !isAuthorized) {
      adminAuthService.logout();
      navigate(getPortalLoginPath(portalType));
    }
  }, [navigate, portalType]);

  return (
    <Layout className="min-h-screen">
      <AdminSidebar 
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />
      
      <Layout style={{ 
        marginLeft: collapsed ? LAYOUT.adminSidebarCollapsedWidth : LAYOUT.adminSidebarWidth, 
        transition: 'margin-left 0.2s' 
      }}>
        <AdminHeader 
          collapsed={collapsed}
        />
        
        <Content 
          style={{
            margin: `${LAYOUT.headerHeight} 0 0 0`,
            padding: '24px',
            background: '#f0f2f5',
            minHeight: `calc(100vh - ${LAYOUT.headerHeight})`,
            overflow: 'auto'
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
