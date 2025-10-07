import { Layout as AntLayout, Button, Dropdown, Avatar } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  MenuOutlined,
  ReloadOutlined,
  HomeOutlined,
  SettingOutlined,
  GiftOutlined,
  PhoneOutlined,
  StarOutlined
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
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Function để fetch user balance từ API
  const fetchUserBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:8080/api/wallet/balance', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setUserBalance(data.data.balance || 0);
          
          // Cập nhật localStorage với balance mới
          const user = localStorage.getItem('user');
          if (user) {
            const userData = JSON.parse(user);
            userData.balance = data.data.balance || 0;
            localStorage.setItem('user', JSON.stringify(userData));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user balance:', error);
    }
  };

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

      // Fetch balance từ API để đảm bảo dữ liệu mới nhất
      fetchUserBalance();

      // Auto refresh balance mỗi 30 giây
      const interval = setInterval(() => {
        fetchUserBalance();
      }, 30000);

      return () => clearInterval(interval);
    } else {
      setIsLoggedIn(false);
      setUserName('');
      setUserBalance(0);
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUserName('');
      setUserBalance(0);
      navigate('/');
      window.location.reload();
    }
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

  // Mobile Bottom Navigation Component
  const MobileBottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 md:hidden">
      <div className="flex justify-around items-center py-2">
        <button 
          className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-red-600 transition-colors"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <SettingOutlined className="text-xl mb-1" />
          <span className="text-xs">Tuỳ chọn</span>
        </button>
        
        <button 
          className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-red-600 transition-colors"
          onClick={() => navigate('/')}
        >
          <HomeOutlined className="text-xl mb-1" />
          <span className="text-xs">Trang chủ</span>
        </button>
        
        <button 
          className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-red-600 transition-colors"
          onClick={() => console.log('AE888 clicked')}
        >
          <StarOutlined className="text-xl mb-1" />
          <span className="text-xs">AE888</span>
        </button>
        
        <button 
          className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-red-600 transition-colors"
          onClick={() => console.log('Khuyến mãi clicked')}
        >
          <GiftOutlined className="text-xl mb-1" />
          <span className="text-xs">Khuyến mãi</span>
        </button>
        
        <button 
          className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-red-600 transition-colors"
          onClick={() => console.log('Liên hệ clicked')}
        >
          <PhoneOutlined className="text-xl mb-1" />
          <span className="text-xs">Liên hệ</span>
        </button>
      </div>
    </div>
  );

  return (
    <AntLayout className="min-h-screen bg-gray-50">
      {/* Header - Navbar trên cùng */}
      <Header className="bg-white px-6 fixed w-full z-10 border-b border-gray-200" style={{ height: '64px', lineHeight: '64px' }}>
        <div className="w-full flex items-center justify-between h-full">
          {/* Logo - luôn hiển thị */}
          <div className="flex items-center pl-2">
            {/* Menu button chỉ hiển thị trên desktop */}
            {!isMobile && (
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
            )}
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
          
          {/* Buttons - responsive */}
          <div className="flex items-center gap-4 pr-2">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              {/* Hiển thị đầy đủ trên desktop, thu gọn trên mobile */}
              {!isMobile ? (
                <>
                  {/* Desktop view - full layout theo ảnh mẫu */}
                  <div className="flex items-center gap-3">
                    {/* Username và Balance với icon reload */}
                    <div className="flex items-center gap-3 border border-gray-300 px-4 py-2 rounded-full bg-white">
                      <span className="text-gray-600 text-sm font-medium">{userName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm font-normal">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }).format(userBalance / 1000)}
                        </span>
                        <Button 
                          type="text"
                          size="small"
                          icon={<ReloadOutlined />}
                          onClick={() => fetchUserBalance()}
                          className="text-gray-400 hover:text-gray-600"
                          style={{
                            padding: '0',
                            height: '20px',
                            width: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Nạp tiền button */}
                    <Button 
                      onClick={() => navigate('/wallet?tab=deposit-withdraw')}
                      className="flex items-center gap-2 border-0 shadow-none"
                      style={{
                        background: 'transparent',
                        color: '#9ca3af',
                        fontSize: '16px',
                        fontWeight: '500',
                        padding: '8px 12px',
                        height: 'auto'
                      }}
                    >
                      <UserOutlined style={{ fontSize: '20px' }} />
                      <span>Nạp tiền</span>
                    </Button>
                    
                    {/* Rút tiền button */}
                    <Button 
                      onClick={() => navigate('/wallet?tab=withdraw')}
                      className="flex items-center gap-2 border-0 shadow-none"
                      style={{
                        background: 'transparent',
                        color: '#9ca3af',
                        fontSize: '16px',
                        fontWeight: '500',
                        padding: '8px 12px',
                        height: 'auto'
                      }}
                    >
                      <GiftOutlined style={{ fontSize: '20px' }} />
                      <span>Rút tiền</span>
                    </Button>
                    
                    {/* Đăng xuất button */}
                    <Button 
                      onClick={handleLogout}
                      className="shadow-none hover:bg-gray-50"
                      style={{
                        background: 'white',
                        color: '#9ca3af',
                        fontSize: '14px',
                        fontWeight: '400',
                        padding: '6px 18px',
                        height: '36px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '20px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      Đăng xuất
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Mobile view - compact layout với avatar dropdown */}
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700 text-base font-semibold">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(userBalance).replace('₫', 'đ')}
                    </span>
                  </div>
                  
                  {/* Avatar với dropdown cho mobile */}
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: 'wallet',
                          icon: <UserOutlined />,
                          label: 'Ví của tôi',
                          onClick: () => navigate('/wallet')
                        },
                        {
                          key: 'deposit',
                          icon: <ReloadOutlined />,
                          label: 'Nạp tiền',
                          onClick: () => navigate('/wallet?tab=deposit-withdraw')
                        },
                        {
                          type: 'divider'
                        },
                        {
                          key: 'logout',
                          icon: <LogoutOutlined />,
                          label: 'Đăng xuất',
                          onClick: handleLogout
                        }
                      ]
                    }}
                    trigger={['click']}
                    placement="bottomRight"
                  >
                    <Avatar 
                      size={36}
                      icon={<UserOutlined />}
                      className="cursor-pointer bg-gray-500 hover:bg-gray-600 transition-colors"
                      style={{
                        backgroundColor: '#6b7280',
                        color: 'white'
                      }}
                    />
                  </Dropdown>
                </>
              )}
            </div>
          ) : (
            <div className={`flex gap-3 ${isMobile ? 'mobile-auth-buttons' : ''}`}>
              <Button 
                type="ghost" 
                onClick={handleLoginOpen}
                className={`font-semibold ${isMobile ? 'px-4 py-1 h-9 text-sm' : 'px-5 py-1 h-10 text-sm'} shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105`}
                style={{
                  borderRadius: '20px',
                  borderWidth: '2px',
                  borderColor: '#4a5568',
                  color: '#4a5568',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4a5568';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#4a5568';
                }}
              >
                Đăng nhập
              </Button>
              <Button 
                type="primary"
                onClick={handleRegisterOpen}
                className={`text-white font-bold ${isMobile ? 'px-5 py-1 h-9 text-sm' : 'px-6 py-1 h-10 text-sm'} shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105`}
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
        {/* Sidebar bên trái - chỉ hiển thị trên desktop */}
        {!isMobile && (
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
        )}

        {/* Content chính */}
        <AntLayout style={{ 
          marginLeft: !isMobile ? (sidebarCollapsed ? '84px' : '300px') : '0px', 
          marginRight: !isMobile ? '20px' : '0px',
          marginBottom: isMobile ? '80px' : '0', // Thêm margin bottom cho mobile bottom nav
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

      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileBottomNav />}

      {/* Sidebar overlay cho mobile khi mở tuỳ chọn */}
      {isMobile && !sidebarCollapsed && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarCollapsed(true)}
          />
          <div className="fixed left-0 top-16 bottom-20 w-80 bg-white z-50 shadow-xl overflow-y-auto">
            <Sidebar
              collapsed={false}
              onCollapse={setSidebarCollapsed}
              activeGame={activeGame}
              onGameSelect={handleGameSelect}
              onLoginOpen={handleLoginOpen}
              onRegisterOpen={handleRegisterOpen}
              onLogout={handleLogout}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </>
      )}

      {/* Auth Modals */}
      <AuthModal 
        isLoginOpen={isLoginModalOpen}
        isRegisterOpen={isRegisterModalOpen}
        onLoginClose={handleLoginClose}
        onRegisterClose={handleRegisterClose}
        onSwitchToRegister={handleSwitchToRegister}
        onSwitchToLogin={handleSwitchToLogin}
      />

      {/* Mobile responsive styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (max-width: 768px) {
            .ant-layout-header {
              padding: 0 16px !important;
            }
            
            .sidebar-scrollable {
              position: fixed !important;
              top: 64px !important;
              left: 0 !important;
              bottom: 80px !important;
              width: 320px !important;
              z-index: 60 !important;
            }
            
            /* Hide scrollbar on mobile */
            .sidebar-scrollable::-webkit-scrollbar {
              display: none;
            }
            
            /* Mobile bottom navigation styles */
            .mobile-bottom-nav {
              backdrop-filter: blur(10px);
              background: rgba(255, 255, 255, 0.95);
            }
            
            /* Ensure content doesn't overlap */
            .ant-layout-content {
              padding-bottom: 20px !important;
            }
            
            /* Mobile auth buttons - làm to hơn */
            .mobile-auth-buttons .ant-btn {
              min-height: 36px !important;
              font-size: 14px !important;
              font-weight: 600 !important;
              padding: 0 16px !important;
              border-radius: 18px !important;
            }
            
            /* Mobile logout button */
            .ant-layout-header .ant-btn-middle {
              min-height: 36px !important;
              font-size: 14px !important;
              font-weight: 600 !important;
              padding: 0 16px !important;
            }
          }
          
          @media (max-width: 480px) {
            .ant-layout-header {
              padding: 0 12px !important;
            }
            
            /* Đảm bảo nút không bị thu nhỏ quá mức trên màn hình nhỏ */
            .mobile-auth-buttons .ant-btn {
              min-height: 34px !important;
              font-size: 13px !important;
              padding: 0 14px !important;
            }
          }
        `
      }} />
    </AntLayout>
  );
};

export default Layout;
