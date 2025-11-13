import { Layout, Button, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { LAYOUT } from '../../../utils/theme';
import { getPortalPath } from '../../../utils/navigation';
import { getPortalType } from '../../../utils/subdomain';

const { Header } = Layout;

const AdminHeader = ({ collapsed, onToggleCollapse }) => {
  const navigate = useNavigate();
  const portalType = getPortalType();

  const handleProfileClick = () => {
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
        <Avatar 
          icon={<UserOutlined />} 
          className="bg-blue-600"
          size="large"
          onClick={handleProfileClick}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </Header>
  );
};

export default AdminHeader;

