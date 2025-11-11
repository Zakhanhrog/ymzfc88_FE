import { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import * as AntIcons from '@ant-design/icons';
import { adminAuthService } from '../../features/admin/services/adminAuthService';
import { adminMenuItems } from './sidebar/adminMenuData';
import { LAYOUT } from '../../utils/theme';
import LogoutConfirmModal from '../common/LogoutConfirmModal';
import { getAdminLoginPath, getAdminPath } from '../../utils/navigation';
import { isAdminSubdomain } from '../../utils/subdomain';

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
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      adminAuthService.logout();
      setShowLogoutModal(false);
      navigate(getAdminLoginPath());
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Update openKeys when location changes
  useEffect(() => {
    setOpenKeys(getOpenKeys());
  }, [location]);

  const getSelectedKeys = () => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    const isAdmin = isAdminSubdomain();
    
    // Check specific paths first (handle both /admin/points and /points)
    if (path.includes('/points') && (isAdmin || path.includes('/admin/points'))) {
      return ['points-management'];
    }
    
    if (path.includes('/betting-odds') && (isAdmin || path.includes('/admin/betting-odds'))) {
      return ['betting-odds'];
    }
    
    if (path.includes('/xoc-dia/quick-bets') && (isAdmin || path.includes('/admin/xoc-dia/quick-bets'))) {
      return ['xoc-dia-quick-bets'];
    }
    
    if (path.includes('/sicbo/quick-bets') && (isAdmin || path.includes('/admin/sicbo/quick-bets'))) {
      return ['sicbo-quick-bets'];
    }
    
    if (path.includes('/dashboard') && (isAdmin || path.includes('/admin/dashboard'))) {
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
    const isAdmin = isAdminSubdomain();
    
    // Check specific paths first (handle both /admin/points and /points)
    if (path.includes('/points') && (isAdmin || path.includes('/admin/points'))) {
      return ['financial-management'];
    }
    
    if (path.includes('/betting-odds') && (isAdmin || path.includes('/admin/betting-odds'))) {
      return ['game-management'];
    }
    
    if (path.includes('/xoc-dia/quick-bets') && (isAdmin || path.includes('/admin/xoc-dia/quick-bets'))) {
      return ['game-management'];
    }
    
    if (path.includes('/sicbo/quick-bets') && (isAdmin || path.includes('/admin/sicbo/quick-bets'))) {
      return ['game-management'];
    }
    
    if (tab === 'users' || tab === 'kyc-verification' || tab === 'user-roles' || tab === 'user-activities') {
      return ['user-management'];
    }
    if (tab === 'deposits' || tab === 'withdraws' || tab === 'transactions' || tab === 'payment-methods' || tab === 'points-management') {
      return ['financial-management'];
    }
    if (
      tab === 'games' ||
      tab === 'bet-management' ||
      tab === 'game-results' ||
      tab === 'xoc-dia-results' ||
      tab === 'sicbo-results' ||
      tab === 'game-settings' ||
      tab === 'betting-odds'
    ) {
      return ['game-management'];
    }
    if (tab === 'banners' || tab === 'news' || tab === 'notifications' || tab === 'marquee-notifications') {
      return ['content-management'];
    }
    if (tab === 'settings' || tab === 'contact-links' || tab === 'promotions' || tab === 'maintenance' || tab === 'logs' || tab === 'telegram-settings') {
      return ['system-management'];
    }
    if (tab === 'analytics' || !tab) {
      return ['dashboard'];
    }
    
    return ['dashboard'];
  };

  const handleMenuClick = ({ key }) => {
    const menuActions = {
      'overview': () => navigate(getAdminPath('/dashboard')),
      'analytics': () => navigate(getAdminPath('/dashboard?tab=analytics')),
      'users': () => navigate(getAdminPath('/dashboard?tab=users')),
      'kyc-verification': () => navigate(getAdminPath('/dashboard?tab=kyc-verification')),
      'user-roles': () => navigate(getAdminPath('/dashboard?tab=user-roles')),
      'user-activities': () => navigate(getAdminPath('/dashboard?tab=user-activities')),
      'deposits': () => navigate(getAdminPath('/dashboard?tab=deposits')),
      'withdraws': () => navigate(getAdminPath('/dashboard?tab=withdraws')),
      'transactions': () => navigate(getAdminPath('/dashboard?tab=transactions')),
      'payment-methods': () => navigate(getAdminPath('/dashboard?tab=payment-methods')),
      'points-management': () => navigate(getAdminPath('/points')),
      'games': () => navigate(getAdminPath('/dashboard?tab=games')),
      'bet-management': () => navigate(getAdminPath('/dashboard?tab=bet-management')),
      'game-results': () => navigate(getAdminPath('/dashboard?tab=game-results')),
      'xoc-dia-results': () => navigate(getAdminPath('/dashboard?tab=xoc-dia-results')),
      'sicbo-results': () => navigate(getAdminPath('/dashboard?tab=sicbo-results')),
      'game-settings': () => navigate(getAdminPath('/dashboard?tab=game-settings')),
      'betting-odds': () => navigate(getAdminPath('/betting-odds')),
      'xoc-dia-quick-bets': () => navigate(getAdminPath('/xoc-dia/quick-bets')),
      'sicbo-quick-bets': () => navigate(getAdminPath('/sicbo/quick-bets')),
      'banners': () => navigate(getAdminPath('/dashboard?tab=banners')),
      'news': () => navigate(getAdminPath('/dashboard?tab=news')),
      'notifications': () => navigate(getAdminPath('/dashboard?tab=notifications')),
      'marquee-notifications': () => navigate(getAdminPath('/dashboard?tab=marquee-notifications')),
      'settings': () => navigate(getAdminPath('/dashboard?tab=settings')),
      'contact-links': () => navigate(getAdminPath('/dashboard?tab=contact-links')),
      'promotions': () => navigate(getAdminPath('/dashboard?tab=promotions')),
      'maintenance': () => navigate(getAdminPath('/dashboard?tab=maintenance')),
      'logs': () => navigate(getAdminPath('/dashboard?tab=logs')),
      'telegram-settings': () => navigate(getAdminPath('/dashboard?tab=telegram-settings')),
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

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        loading={isLoggingOut}
      />
    </Sider>
  );
};

export default AdminSidebar;
