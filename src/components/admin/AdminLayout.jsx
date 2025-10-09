import { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './layout/AdminHeader';
import { LAYOUT } from '../../utils/theme';

const { Content } = Layout;

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check admin authentication
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  return (
    <Layout className="min-h-screen">
      <AdminSidebar 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
      />
      
      <Layout style={{ 
        marginLeft: collapsed ? LAYOUT.adminSidebarCollapsedWidth : LAYOUT.adminSidebarWidth, 
        transition: 'margin-left 0.2s' 
      }}>
        <AdminHeader 
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
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
