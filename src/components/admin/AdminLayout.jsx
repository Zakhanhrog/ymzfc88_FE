import { useState, useEffect } from 'react';
import { Layout, Button, Dropdown, Avatar, Typography } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { adminAuthService } from '../../features/admin/services/adminAuthService';

const { Header, Content } = Layout;
const { Text } = Typography;

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check admin authentication
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }

    // Get admin data
    const data = adminAuthService.getCurrentAdmin();
    setAdminData(data);
  }, [navigate]);

  const handleLogout = () => {
    adminAuthService.logout();
    navigate('/admin/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Thông tin cá nhân',
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: 'Cài đặt',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="min-h-screen">
      <AdminSidebar 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
      />
      
      <Layout style={{ marginLeft: collapsed ? 80 : 280, transition: 'margin-left 0.2s' }}>
        <Header 
          className="bg-white shadow-sm"
          style={{
            padding: '0 24px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'fixed',
            width: `calc(100% - ${collapsed ? 80 : 280}px)`,
            top: 0,
            zIndex: 99,
            transition: 'width 0.2s'
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div>
                <Text strong>
                  {adminData?.fullName || 'Admin'}
                </Text>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {adminData?.email || 'admin@example.com'}
                </Text>
              </div>
            </div>
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Avatar 
                icon={<UserOutlined />} 
                className="bg-blue-600 cursor-pointer"
                size="large"
              />
            </Dropdown>
          </div>
        </Header>
        
        <Content 
          style={{
            margin: '64px 0 0 0',
            padding: '24px',
            background: '#f0f2f5',
            minHeight: 'calc(100vh - 64px)',
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
