import { useMemo, useEffect, useState } from 'react';
import { Layout, Button, Avatar, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { LAYOUT } from '../../../utils/theme';
import { getPortalPath } from '../../../utils/navigation';
import { getPortalType } from '../../../utils/subdomain';
import { adminAuthService } from '../../../features/admin/services/adminAuthService';

const { Header } = Layout;

const AdminHeader = ({ collapsed, onToggleCollapse }) => {
  const navigate = useNavigate();
  const portalType = getPortalType();

  const session = useMemo(() => adminAuthService.getCurrentAdmin(), []);
  const isAdmin = session?.role === 'ADMIN';
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleProfileClick = () => {
    if (!isAdmin) return;
    const profilePath = getPortalPath(portalType, '/dashboard?tab=admin-profile');
    navigate(profilePath);
  };

  return (
    <Header 
      className="bg-white shadow-sm"
      style={{
        padding: '0 24px',
        height: LAYOUT.headerHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        width: `calc(100% - ${collapsed ? LAYOUT.adminSidebarCollapsedWidth : LAYOUT.adminSidebarWidth})`,
        top: 0,
        zIndex: 99,
        transition: 'width 0.2s'
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggleCollapse}
        style={{ fontSize: '16px', width: 64, height: 64 }}
      />
      
      <div className="flex items-center space-x-4">
        <div className="text-right leading-tight hidden md:block">
          <div className="text-sm font-semibold text-gray-700">
            {currentTime.toLocaleTimeString('vi-VN')}
          </div>
          <div className="text-xs text-gray-500">
            {currentTime.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}
          </div>
        </div>
        <Tooltip title={isAdmin ? 'Xem thông tin tài khoản' : undefined}>
          <Avatar 
            icon={<UserOutlined />} 
            className="bg-blue-600"
            size="large"
            onClick={handleProfileClick}
            style={{ cursor: isAdmin ? 'pointer' : 'default' }}
          />
        </Tooltip>
      </div>
    </Header>
  );
};

export default AdminHeader;

