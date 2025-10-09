import { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import * as AntIcons from '@ant-design/icons';
import { adminAuthService } from '../../features/admin/services/adminAuthService';
import { adminMenuItems } from './sidebar/adminMenuData';
import { LAYOUT } from '../../utils/theme';

const { Sider } = Layout;
const { DashboardOutlined, LogoutOutlined } = AntIcons;

// Helper function to convert icon name string to component
const getIconComponent = (iconName) => {
  const IconComponent = AntIcons[iconName];
  return IconComponent ? <IconComponent /> : null;
};

// Convert menu data to include rendered icons
const convertMenuItems = (items) => {
  return items.map(item => ({
    ...item,
    icon: getIconComponent(item.icon),
    children: item.children ? convertMenuItems(item.children) : undefined
  }));
};

const AdminSidebar = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);

  const handleLogout = () => {
    adminAuthService.logout();
    navigate('/admin/login');
  };

  // Update openKeys when location changes
  useEffect(() => {
    setOpenKeys(getOpenKeys());
  }, [location]);

  const getSelectedKeys = () => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    
    // Check specific paths first
    if (path.includes('/admin/points')) {
      return ['points-management'];
    }
    
    if (path.includes('/admin/dashboard')) {
      if (tab) {
        return [tab];
      }
      return ['overview'];
    }
    return ['overview'];
  };

  const getOpenKeys = () => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    
    // Check specific paths first
    if (path.includes('/admin/points')) {
      return ['financial-management'];
    }
    
    if (tab === 'users' || tab === 'kyc-verification' || tab === 'user-roles' || tab === 'user-activities') {
      return ['user-management'];
    }
    if (tab === 'deposits' || tab === 'withdraws' || tab === 'transactions' || tab === 'payment-methods' || tab === 'points-management') {
      return ['financial-management'];
    }
    if (tab === 'games' || tab === 'game-results' || tab === 'game-settings') {
      return ['game-management'];
    }
    if (tab === 'banners' || tab === 'news' || tab === 'notifications') {
      return ['content-management'];
    }
    if (tab === 'settings' || tab === 'maintenance' || tab === 'logs') {
      return ['system-management'];
    }
    if (tab === 'analytics' || !tab) {
      return ['dashboard'];
    }
    
    return ['dashboard'];
  };

  const handleMenuClick = ({ key }) => {
    const menuActions = {
      'overview': () => navigate('/admin/dashboard'),
      'analytics': () => navigate('/admin/dashboard?tab=analytics'),
      'users': () => navigate('/admin/dashboard?tab=users'),
      'kyc-verification': () => navigate('/admin/dashboard?tab=kyc-verification'),
      'user-roles': () => navigate('/admin/dashboard?tab=user-roles'),
      'user-activities': () => navigate('/admin/dashboard?tab=user-activities'),
      'deposits': () => navigate('/admin/dashboard?tab=deposits'),
      'withdraws': () => navigate('/admin/dashboard?tab=withdraws'),
      'transactions': () => navigate('/admin/dashboard?tab=transactions'),
      'payment-methods': () => navigate('/admin/dashboard?tab=payment-methods'),
      'points-management': () => navigate('/admin/points'),
      'games': () => navigate('/admin/dashboard?tab=games'),
      'game-results': () => navigate('/admin/dashboard?tab=game-results'),
      'game-settings': () => navigate('/admin/dashboard?tab=game-settings'),
      'banners': () => navigate('/admin/dashboard?tab=banners'),
      'news': () => navigate('/admin/dashboard?tab=news'),
      'notifications': () => navigate('/admin/dashboard?tab=notifications'),
      'settings': () => navigate('/admin/dashboard?tab=settings'),
      'maintenance': () => navigate('/admin/dashboard?tab=maintenance'),
      'logs': () => navigate('/admin/dashboard?tab=logs'),
      'logout': handleLogout
    };

    if (menuActions[key]) {
      menuActions[key]();
    }
  };

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      trigger={null}
      width={parseInt(LAYOUT.adminSidebarWidth)}
      collapsedWidth={parseInt(LAYOUT.adminSidebarCollapsedWidth)}
      className="admin-sidebar"
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
        background: '#001529'
      }}
    >
      {/* Admin Logo */}
      <div className="admin-logo" style={{
        height: LAYOUT.headerHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        padding: collapsed ? '0' : '0 24px',
        background: '#002140',
        borderBottom: '1px solid #1a1a1a'
      }}>
        {collapsed ? (
          <DashboardOutlined style={{ fontSize: '24px', color: '#fff' }} />
        ) : (
          <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>
            ADMIN PANEL
          </div>
        )}
      </div>

      {/* Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={getSelectedKeys()}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        onClick={handleMenuClick}
        items={convertMenuItems(adminMenuItems)}
        style={{
          height: `calc(100vh - ${LAYOUT.headerHeight} - 64px)`,
          borderRight: 0,
          overflow: 'auto'
        }}
      />

      {/* Logout Button */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: '1px solid #1a1a1a',
        background: '#001529'
      }}>
        <Menu
          theme="dark"
          mode="inline"
          onClick={handleMenuClick}
          items={[
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: collapsed ? '' : 'Đăng xuất',
              style: { color: '#ff4d4f' }
            }
          ]}
        />
      </div>
    </Sider>
  );
};

export default AdminSidebar;
