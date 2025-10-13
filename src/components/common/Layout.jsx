import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import MobileSidebar from './layout/MobileSidebar';
import AuthModal from './layout/AuthModal';
import LogoutConfirmModal from './LogoutConfirmModal';
import Footer from './layout/Footer';
import MobileFooter from './layout/MobileFooter';
import MobileBottomNav from './layout/MobileBottomNav';
import pointService from '../../services/pointService';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Load activeGame từ localStorage hoặc route hiện tại
  const [activeGame, setActiveGame] = useState(() => {
    const getActiveGameFromPath = (pathname) => {
      if (pathname.startsWith('/lottery')) {
        return 'lottery';
      } else if (pathname.startsWith('/wallet')) {
        return 'deposit';
      } else if (pathname.startsWith('/points')) {
        return 'daily';
      } else if (pathname === '/') {
        return 'HOT';
      }
      return 'HOT';
    };
    
    // Ưu tiên route hiện tại, fallback về localStorage
    return getActiveGameFromPath(location.pathname) || localStorage.getItem('activeGame') || 'HOT';
  });
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [userName, setUserName] = useState('');

  // Lưu activeGame vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('activeGame', activeGame);
  }, [activeGame]);

  // Reset activeGame dựa trên route hiện tại khi route thay đổi
  useEffect(() => {
    const getActiveGameFromPath = (pathname) => {
      if (pathname.startsWith('/lottery')) {
        return 'lottery';
      } else if (pathname.startsWith('/wallet')) {
        return 'deposit';
      } else if (pathname.startsWith('/points')) {
        return 'daily';
      } else if (pathname === '/') {
        return 'HOT';
      }
      return 'HOT';
    };

    const newActiveGame = getActiveGameFromPath(location.pathname);
    if (newActiveGame !== activeGame) {
      setActiveGame(newActiveGame);
    }
  }, [location.pathname]);

  // Function để fetch user points từ API
  const fetchUserPoints = async () => {
    try {
      // Thử gọi API wallet/balance trước (có points)
      const walletResponse = await fetch('http://localhost:8080/api/wallet/balance', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (walletResponse.ok) {
        const walletData = await walletResponse.json();
        if (walletData.success && walletData.data.points !== undefined) {
          setUserPoints(walletData.data.points || 0);
          
          // Lưu vào localStorage
          const user = localStorage.getItem('user');
          if (user) {
            const userData = JSON.parse(user);
            userData.points = walletData.data.points || 0;
            localStorage.setItem('user', JSON.stringify(userData));
          }
          return;
        }
      }
      
      // Fallback: gọi pointService
      const response = await pointService.getMyPoints();
      if (response.success) {
        setUserPoints(response.data.totalPoints || 0);
        
        // Lưu vào localStorage
        const user = localStorage.getItem('user');
        if (user) {
          const userData = JSON.parse(user);
          userData.points = response.data.totalPoints || 0;
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      setIsLoggedIn(true);
      
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          setUserName(userData.username || userData.name || 'User');
          setUserPoints(userData.points || 0);
        } catch (error) {
          setUserName('User');
          setUserPoints(0);
        }
      } else {
        setUserName('User');
        setUserPoints(0);
      }

      fetchUserPoints();

      const interval = setInterval(() => {
        fetchUserPoints();
      }, 30000);

      return () => clearInterval(interval);
    } else {
      setIsLoggedIn(false);
      setUserName('');
      setUserPoints(0);
    }
  }, []);

  // Listen for custom event to show login modal
  useEffect(() => {
    const handleShowLoginModal = (event) => {
      setRedirectAfterLogin(event.detail?.redirectAfterLogin || null);
      setIsLoginModalOpen(true);
    };

    window.addEventListener('showLoginModal', handleShowLoginModal);

    return () => {
      window.removeEventListener('showLoginModal', handleShowLoginModal);
    };
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call logout API if needed
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUserName('');
      setUserPoints(0);
      setShowLogoutModal(false);
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if API fails
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUserName('');
      setUserPoints(0);
      setShowLogoutModal(false);
      navigate('/');
      window.location.reload();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleGameSelect = (gameKey) => {
    setActiveGame(gameKey);
  };

  const sidebarWidth = sidebarCollapsed ? '80px' : '280px';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header
        isLoggedIn={isLoggedIn}
        sidebarCollapsed={sidebarCollapsed}
        onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLoginOpen={() => setIsLoginModalOpen(true)}
        onRegisterOpen={() => setIsRegisterModalOpen(true)}
        userName={userName}
        userBalance={userPoints}
        onRefreshBalance={fetchUserPoints}
        onLogout={handleLogout}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={showMobileSidebar}
        onClose={() => setShowMobileSidebar(false)}
        isLoggedIn={isLoggedIn}
        userName={userName}
        userBalance={userPoints}
      />

      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
          activeGame={activeGame}
          onGameSelect={handleGameSelect}
        />
      </div>

      {/* Main Content */}
      <main 
        className="pt-[60px] md:pt-[70px] flex-1 ml-0 w-full md:transition-all md:duration-300 md:ease-in-out"
        style={{ 
          marginLeft: '0px',
          width: '100%',
        }}
      >
        {/* Desktop spacing */}
        <div className="hidden md:block" style={{ marginLeft: sidebarWidth, width: `calc(100% - ${sidebarWidth})` }}>
          <div className="p-5 min-h-full w-full">
            {children}
          </div>
        </div>
        
        {/* Mobile layout */}
        <div className="md:hidden p-3 pb-24 min-h-full w-full">
          {children}
        </div>
      </main>

      {/* Footer */}
      <div className="ml-0 w-full md:transition-all md:duration-300 md:ease-in-out">
        {/* Desktop spacing */}
        <div className="hidden md:block" style={{ marginLeft: sidebarWidth, width: `calc(100% - ${sidebarWidth})` }}>
          <Footer />
        </div>
        
        {/* Mobile layout */}
        <div className="md:hidden">
          <MobileFooter />
        </div>
      </div>

      {/* Auth Modals */}
      <AuthModal
        isLoginOpen={isLoginModalOpen}
        isRegisterOpen={isRegisterModalOpen}
        onLoginClose={() => {
          setIsLoginModalOpen(false);
          setRedirectAfterLogin(null);
        }}
        onRegisterClose={() => {
          setIsRegisterModalOpen(false);
          setRedirectAfterLogin(null);
        }}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
        redirectAfterLogin={redirectAfterLogin}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        loading={isLoggingOut}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onMenuClick={() => setShowMobileSidebar(true)} />
    </div>
  );
};

export default Layout;

