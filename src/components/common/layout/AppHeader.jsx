import { Layout as AntLayout, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import UserMenu from './UserMenu';
import AuthButtons from './AuthButtons';
import { LAYOUT, THEME_COLORS } from '../../../utils/theme';

const { Header } = AntLayout;

const AppHeader = ({ 
  isLoggedIn, 
  isMobile, 
  sidebarCollapsed,
  onSidebarToggle, 
  onLoginOpen, 
  onRegisterOpen,
  userName,
  userBalance,
  onRefreshBalance,
  onLogout
}) => {
  const navigate = useNavigate();

  return (
    <Header 
      className="bg-white px-6 fixed w-full z-10 border-b border-gray-200" 
      style={{ 
        height: LAYOUT.headerHeight, 
        lineHeight: LAYOUT.headerHeight 
      }}
    >
      <div className="w-full flex items-center justify-between h-full">
        {/* Logo - luôn hiển thị */}
        <div className="flex items-center pl-2">
          {/* Menu button chỉ hiển thị trên desktop */}
          {!isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={onSidebarToggle}
              className="text-gray-700 hover:bg-gray-100 mr-4"
              style={{
                fontSize: '20px',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                color: THEME_COLORS.secondaryLight
              }}
            />
          )}
          <Logo onClick={() => navigate('/')} />
        </div>
        
        {/* User Menu hoặc Auth Buttons */}
        <div className="flex items-center gap-4 pr-2">
          {isLoggedIn ? (
            <UserMenu 
              isMobile={isMobile}
              userName={userName}
              userBalance={userBalance}
              onRefreshBalance={onRefreshBalance}
              onLogout={onLogout}
              onNavigate={navigate}
            />
          ) : (
            <AuthButtons 
              isMobile={isMobile}
              onLoginOpen={onLoginOpen}
              onRegisterOpen={onRegisterOpen}
            />
          )}
        </div>
      </div>
    </Header>
  );
};

export default AppHeader;

