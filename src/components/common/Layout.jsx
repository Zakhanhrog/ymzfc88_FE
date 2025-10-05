import { Layout as AntLayout, Button, Dropdown, Avatar } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  MenuOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AuthModal from './AuthModal';
import Sidebar from './Sidebar';
import { getLogoStyle, getAvatarStyle, getButtonStyle, THEME_COLORS } from '../../utils/theme';

const { Header, Content, Footer } = AntLayout;

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [activeGame, setActiveGame] = useState('HOT');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập từ localStorage (backend thật)
    const token = localStorage.getItem('token');
    
    if (token) {
      setIsLoggedIn(true);
      
      // Lấy thông tin user từ localStorage (đã được set bởi backend)
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          setUserName(userData.username || userData.name || 'User');
          setUserBalance(userData.balance || 0);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setUserName('User');
          setUserBalance(0);
        }
      } else {
        // Nếu có token nhưng chưa có user data, set default
        setUserName('User');
        setUserBalance(0);
      }
    } else {
      setIsLoggedIn(false);
      setUserName('');
      setUserBalance(0);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
    setUserBalance(0);
    navigate('/');
    window.location.reload();
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin cá nhân',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
    },
  ];

  const handleUserMenuClick = ({ key }) => {
    if (key === 'profile') {
      navigate('/wallet');
    } else if (key === 'logout') {
      handleLogout();
    }
  };

  const handleLoginOpen = () => setIsLoginModalOpen(true);
  const handleRegisterOpen = () => setIsRegisterModalOpen(true);
  const handleLoginClose = () => setIsLoginModalOpen(false);
  const handleRegisterClose = () => setIsRegisterModalOpen(false);
  
  const handleSwitchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleGameSelect = (gameKey) => {
    setActiveGame(gameKey);
    console.log('Selected game:', gameKey);
  };

  const handleSidebarToggle = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <AntLayout className="min-h-screen bg-gray-50">
      {/* Header - Navbar trên cùng */}
      <Header className="bg-white px-6 fixed w-full z-10 shadow-md" style={{ height: '64px', lineHeight: '64px' }}>
        <div className="w-full flex items-center justify-between h-full">
          {/* Logo với Menu Icon - căn gần lề trái */}
          <div className="flex items-center pl-2">
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={handleSidebarToggle}
              className="text-gray-700 hover:bg-gray-100 mr-4"
              style={{
                fontSize: '20px',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px'
              }}
            />
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => navigate('/')}
            >
              <img 
                src="/logo.webp" 
                alt="Logo" 
                className="h-9 w-auto object-contain"
                style={{ maxHeight: '36px' }}
              />
            </div>
          </div>
          
          {/* Buttons - căn gần lề phải */}
          <div className="flex items-center gap-4 pr-2">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              {/* Hiển thị tên user và số dư */}
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">{userName}</span>
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                  <span className="text-gray-600">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(userBalance).replace('₫', 'đ')}
                  </span>
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      // Reload balance từ localStorage (đã được cập nhật bởi backend)
                      const user = localStorage.getItem('user');
                      if (user) {
                        try {
                          const userData = JSON.parse(user);
                          setUserBalance(userData.balance || 0);
                        } catch (error) {
                          console.error('Error reloading balance:', error);
                        }
                      }
                      // Có thể gọi API để lấy balance mới nhất từ backend
                      // fetchLatestBalance();
                    }}
                  >
                    🔄
                  </button>
                </div>
              </div>
              
              {/* Nút Nạp tiền */}
              <Button 
                type="primary"
                size="small"
                icon="🧩"
                onClick={() => navigate('/wallet?tab=deposit-withdraw')}
                className="font-semibold px-4 py-1 h-8 text-sm"
                style={{
                  borderRadius: '20px',
                  background: THEME_COLORS.primaryGradient,
                  border: 'none'
                }}
              >
                Nạp tiền
              </Button>
              
              {/* Nút Rút tiền */}
              <Button 
                size="small"
                icon="💳"
                onClick={() => navigate('/wallet?tab=deposit-withdraw')}
                className="font-semibold px-4 py-1 h-8 text-sm"
                style={{
                  borderRadius: '20px',
                  borderColor: THEME_COLORS.primary,
                  color: THEME_COLORS.primary
                }}
              >
                Rút tiền
              </Button>
              
              {/* Nút Chat */}
              <Button
                size="small"
                shape="circle"
                icon="💬"
                className="relative"
                onClick={() => console.log('Open chat')}
              >
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  •
                </span>
              </Button>
              
              {/* Nút Đăng xuất */}
              <Button 
                size="small"
                onClick={handleLogout}
                className="font-semibold px-4 py-1 h-8 text-sm bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
                style={{ borderRadius: '20px' }}
              >
                Đăng xuất
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button 
                type="ghost" 
                onClick={handleLoginOpen}
                className="font-semibold px-5 py-1 h-10 text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                style={{
                  borderRadius: '20px',
                  borderWidth: '2px',
                  ...getButtonStyle('ghost')
                }}
                onMouseEnter={(e) => {
                  const hoverStyle = getButtonStyle('ghost').hover;
                  e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor;
                  e.currentTarget.style.color = hoverStyle.color;
                }}
                onMouseLeave={(e) => {
                  const baseStyle = getButtonStyle('ghost');
                  e.currentTarget.style.backgroundColor = baseStyle.backgroundColor;
                  e.currentTarget.style.color = baseStyle.color;
                }}
              >
                Đăng nhập
              </Button>
              <Button 
                type="primary"
                onClick={handleRegisterOpen}
                className="text-white font-bold px-6 py-1 h-10 text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                style={{
                  borderRadius: '20px',
                  borderWidth: '2px',
                  ...getButtonStyle('primary')
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = getButtonStyle('primary').hover.backgroundColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = getButtonStyle('primary').backgroundColor;
                }}
              >
                Đăng ký
              </Button>
            </div>
          )}
          </div>
        </div>
      </Header>

      {/* Layout với Sidebar và Content */}
      <AntLayout style={{ marginTop: '64px', background: '#f9fafb' }}>
        {/* Sidebar bên trái */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
          activeGame={activeGame}
          onGameSelect={handleGameSelect}
          onLoginOpen={handleLoginOpen}
          onRegisterOpen={handleRegisterOpen}
          onLogout={handleLogout}
          isLoggedIn={isLoggedIn}
        />

        {/* Content chính */}
        <AntLayout style={{ 
          marginLeft: sidebarCollapsed ? '84px' : '300px', 
          marginRight: '40px',
          transition: 'margin-left 0.3s ease',
          minHeight: 'calc(100vh - 64px)',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingTop: '20px'
        }}>
          <Content style={{ 
            background: 'transparent',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            {children}
          </Content>
          
          <Footer className="text-center bg-transparent mt-8">
            <div className="text-gray-500 py-6 text-sm">
              ©2025 - Nền tảng cá cược trực tuyến hàng đầu
            </div>
          </Footer>
        </AntLayout>
      </AntLayout>

      {/* Auth Modals */}
      <AuthModal 
        isLoginOpen={isLoginModalOpen}
        isRegisterOpen={isRegisterModalOpen}
        onLoginClose={handleLoginClose}
        onRegisterClose={handleRegisterClose}
        onSwitchToRegister={handleSwitchToRegister}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </AntLayout>
  );
};

export default Layout;
