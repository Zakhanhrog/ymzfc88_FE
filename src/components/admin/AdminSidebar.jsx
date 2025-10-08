import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  DollarOutlined,
  ShoppingOutlined,
  BankOutlined,
  SettingOutlined,
  BarChartOutlined,
  FileTextOutlined,
  SafetyOutlined,
  LogoutOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CreditCardOutlined,
  TrophyOutlined,
  MessageOutlined,
  BellOutlined,
  ToolOutlined,
  SafetyCertificateOutlined,
  StarOutlined
} from '@ant-design/icons';
import { adminAuthService } from '../../features/admin/services/adminAuthService';

const { Sider } = Layout;

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

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      children: [
        {
          key: 'overview',
          icon: <BarChartOutlined />,
          label: 'Tổng quan',
        },
        {
          key: 'analytics',
          icon: <FileTextOutlined />,
          label: 'Thống kê',
        }
      ]
    },
    {
      key: 'user-management',
      icon: <TeamOutlined />,
      label: 'Quản lý người dùng',
      children: [
        {
          key: 'users',
          icon: <UserOutlined />,
          label: 'Danh sách người dùng',
        },
        {
          key: 'kyc-verification',
          icon: <SafetyCertificateOutlined />,
          label: 'Xác thực tài khoản',
        },
        {
          key: 'user-roles',
          icon: <SafetyOutlined />,
          label: 'Phân quyền',
        },
        {
          key: 'user-activities',
          icon: <BarChartOutlined />,
          label: 'Hoạt động người dùng',
        }
      ]
    },
    {
      key: 'financial-management',
      icon: <DollarOutlined />,
      label: 'Quản lý tài chính',
      children: [
        {
          key: 'deposits',
          icon: <ArrowUpOutlined />,
          label: 'Duyệt nạp tiền',
        },
        {
          key: 'withdraws',
          icon: <ArrowDownOutlined />,
          label: 'Duyệt rút tiền',
        },
        {
          key: 'transactions',
          icon: <ShoppingOutlined />,
          label: 'Lịch sử giao dịch',
        },
        {
          key: 'payment-methods',
          icon: <CreditCardOutlined />,
          label: 'Phương thức thanh toán',
        },
        {
          key: 'points-management',
          icon: <StarOutlined />,
          label: 'Quản lý điểm ',
        }
      ]
    },
    {
      key: 'game-management',
      icon: <TrophyOutlined />,
      label: 'Quản lý game',
      children: [
        {
          key: 'games',
          icon: <TrophyOutlined />,
          label: 'Danh sách game',
        },
        {
          key: 'game-results',
          icon: <BarChartOutlined />,
          label: 'Kết quả game',
        },
        {
          key: 'game-settings',
          icon: <SettingOutlined />,
          label: 'Cài đặt game',
        }
      ]
    },
    {
      key: 'content-management',
      icon: <FileTextOutlined />,
      label: 'Quản lý nội dung',
      children: [
        {
          key: 'banners',
          icon: <FileTextOutlined />,
          label: 'Banner',
        },
        {
          key: 'news',
          icon: <MessageOutlined />,
          label: 'Tin tức',
        },
        {
          key: 'notifications',
          icon: <BellOutlined />,
          label: 'Thông báo',
        }
      ]
    },
    {
      key: 'system-management',
      icon: <SettingOutlined />,
      label: 'Quản lý hệ thống',
      children: [
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: 'Cài đặt hệ thống',
        },
        {
          key: 'maintenance',
          icon: <ToolOutlined />,
          label: 'Bảo trì',
        },
        {
          key: 'logs',
          icon: <FileTextOutlined />,
          label: 'Nhật ký hệ thống',
        }
      ]
    }
  ];

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
    switch (key) {
      case 'overview':
        navigate('/admin/dashboard');
        break;
      case 'analytics':
        navigate('/admin/dashboard?tab=analytics');
        break;
      case 'users':
        navigate('/admin/dashboard?tab=users');
        break;
      case 'kyc-verification':
        navigate('/admin/dashboard?tab=kyc-verification');
        break;
      case 'user-roles':
        navigate('/admin/dashboard?tab=user-roles');
        break;
      case 'user-activities':
        navigate('/admin/dashboard?tab=user-activities');
        break;
      case 'deposits':
        navigate('/admin/dashboard?tab=deposits');
        break;
      case 'withdraws':
        navigate('/admin/dashboard?tab=withdraws');
        break;
      case 'transactions':
        navigate('/admin/dashboard?tab=transactions');
        break;
      case 'payment-methods':
        navigate('/admin/dashboard?tab=payment-methods');
        break;
      case 'points-management':
        navigate('/admin/points');
        break;
      case 'games':
        navigate('/admin/dashboard?tab=games');
        break;
      case 'game-results':
        navigate('/admin/dashboard?tab=game-results');
        break;
      case 'game-settings':
        navigate('/admin/dashboard?tab=game-settings');
        break;
      case 'banners':
        navigate('/admin/dashboard?tab=banners');
        break;
      case 'news':
        navigate('/admin/dashboard?tab=news');
        break;
      case 'notifications':
        navigate('/admin/dashboard?tab=notifications');
        break;
      case 'settings':
        navigate('/admin/dashboard?tab=settings');
        break;
      case 'maintenance':
        navigate('/admin/dashboard?tab=maintenance');
        break;
      case 'logs':
        navigate('/admin/dashboard?tab=logs');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
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
      width={280}
      collapsedWidth={80}
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
        height: '64px',
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
        items={menuItems}
        style={{
          height: 'calc(100vh - 128px)',
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