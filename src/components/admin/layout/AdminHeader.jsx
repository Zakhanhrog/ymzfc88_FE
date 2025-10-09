import { Layout, Button, Avatar } from 'antd';
import {
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { LAYOUT } from '../../../utils/theme';

const { Header } = Layout;

const AdminHeader = ({ collapsed, onToggleCollapse }) => {
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
        />
      </div>
    </Header>
  );
};

export default AdminHeader;

