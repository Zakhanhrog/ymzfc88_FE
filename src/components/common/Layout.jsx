import { Layout as AntLayout, Menu, Button, Dropdown, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, HomeOutlined, TrophyOutlined, FireOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AuthModal from './AuthModal';

const { Header, Content, Footer } = AntLayout;

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [activeGame, setActiveGame] = useState('HOT');

  const gameCategories = [
    { key: 'HOT', label: 'HOT', icon: <FireOutlined />, color: '#ff4d4f' },
    { key: 'BANCA', label: 'BẮN CÁ', icon: null, color: '#1890ff' },
    { key: 'CASINO', label: 'CASINO', icon: null, color: '#722ed1' },
    { key: 'GAMEBAI', label: 'GAME BÀI', icon: null, color: '#52c41a' },
    { key: 'NOHU', label: 'NỔ HŨ', icon: null, color: '#faad14' },
    { key: 'XOSO', label: 'XỔ SỐ', icon: null, color: '#eb2f96' },
    { key: 'THETHAO', label: 'THỂ THAO', icon: null, color: '#13c2c2' },
    { key: 'ESPORTS', label: 'ESPORTS', icon: null, color: '#fa541c' },
    { key: 'DAGA', label: 'ĐÁ GÀ', icon: null, color: '#a0d911' }
  ];

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập từ localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
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
      onClick: handleLogout,
    },
  ];

  const handleLoginOpen = () => {
    setIsLoginModalOpen(true);
  };

  const handleRegisterOpen = () => {
    setIsRegisterModalOpen(true);
  };

  const handleLoginClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleRegisterClose = () => {
    setIsRegisterModalOpen(false);
  };

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
    // Navigate to specific game category or handle game selection
    console.log('Selected game:', gameKey);
  };

  return (
    <AntLayout className="min-h-screen">
      <Header className="bg-blue-600 px-4" style={{ height: '80px', lineHeight: '80px' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
          <div className="flex items-center flex-1">
            <div 
              className="text-white text-2xl font-bold cursor-pointer"
              onClick={() => navigate('/')}
            >
              BettingHub
            </div>
          </div>
          
          <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Avatar 
                icon={<UserOutlined />} 
                className="cursor-pointer bg-blue-500"
                size="large"
              />
            </Dropdown>
          ) : (
            <div className="flex gap-3">
              <Button 
                type="ghost" 
                onClick={handleLoginOpen}
                className="text-white border-white hover:bg-white hover:text-blue-600 font-semibold px-6 py-2 h-12 text-base shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                style={{
                  borderRadius: '8px',
                  borderWidth: '2px'
                }}
              >
                Đăng nhập
              </Button>
              <Button 
                type="primary"
                onClick={handleRegisterOpen}
                className="bg-white text-blue-600 border-white hover:bg-gray-100 font-bold px-8 py-2 h-12 text-base shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                style={{
                  borderRadius: '8px',
                  borderWidth: '2px'
                }}
              >
                Đăng ký
              </Button>
            </div>
          )}
        </div>
      </div>
      </Header>

      {/* Sub Navigation - Game Categories */}
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center py-4 game-nav-container overflow-x-auto">
            <div className="flex items-center space-x-6 min-w-max">
              {gameCategories.map((category) => (
                <div
                  key={category.key}
                  onClick={() => handleGameSelect(category.key)}
                  className={`game-nav-button relative cursor-pointer px-4 py-3 transition-all duration-300 group ${
                    activeGame === category.key
                      ? (category.key === 'HOT' ? 'text-red-600 font-bold' : 'text-blue-600 font-bold')
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {category.icon && (
                      <span 
                        className="text-lg" 
                        style={{ color: activeGame === category.key ? category.color : 'inherit' }}
                      >
                        {category.icon}
                      </span>
                    )}
                    <span className="text-base font-semibold">{category.label}</span>
                  </div>
                  
                  {/* Underline effect */}
                  <span 
                    className="absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 w-0 group-hover:w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Content className="flex-1">
        {children}
      </Content>
      
      <Footer className="text-center bg-gray-100">
        <div className="text-gray-600">
          BettingHub ©2025 - Nền tảng cá cược trực tuyến hàng đầu
        </div>
      </Footer>

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
