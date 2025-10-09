import { Layout as AntLayout } from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from './layout/AppHeader';
import MobileBottomNav from './layout/MobileBottomNav';
import AuthModal from './AuthModal';
import Sidebar from './Sidebar';
import { LAYOUT } from '../../utils/theme';

const { Content, Footer } = AntLayout;

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
      <AppHeader 
        isLoggedIn={isLoggedIn}
        isMobile={isMobile}
        sidebarCollapsed={sidebarCollapsed}
        onSidebarToggle={handleSidebarToggle}
        onLoginOpen={handleLoginOpen}
        onRegisterOpen={handleRegisterOpen}
        userName={userName}
        userBalance={userBalance}
        onRefreshBalance={fetchUserBalance}
        onLogout={handleLogout}
      />

      {/* Layout với Sidebar và Content */}
      <AntLayout style={{ marginTop: LAYOUT.headerHeight, background: '#f9fafb' }}>
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
          marginLeft: !isMobile ? (sidebarCollapsed ? LAYOUT.sidebarCollapsedWidth : LAYOUT.sidebarWidth) : '0px', 
          marginRight: !isMobile ? '20px' : '0px',
          marginBottom: isMobile ? LAYOUT.mobileBottomNavHeight : '0',
          minHeight: `calc(100vh - ${LAYOUT.headerHeight})`,
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
              top: ${LAYOUT.headerHeight} !important;
              left: 0 !important;
              bottom: ${LAYOUT.mobileBottomNavHeight} !important;
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
