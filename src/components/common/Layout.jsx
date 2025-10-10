import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import AuthModal from './layout/AuthModal';
import Footer from './layout/Footer';
import pointService from '../../services/pointService';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  
  // Load activeGame từ localStorage
  const [activeGame, setActiveGame] = useState(() => {
    return localStorage.getItem('activeGame') || 'HOT';
  });
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [userName, setUserName] = useState('');

  // Lưu activeGame vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('activeGame', activeGame);
  }, [activeGame]);

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
      console.error('Error fetching user points:', error);
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
          console.error('Error parsing user data:', error);
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

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUserName('');
      setUserPoints(0);
      navigate('/');
      window.location.reload();
    }
  };

  const handleGameSelect = (gameKey) => {
    setActiveGame(gameKey);
    console.log('Selected game:', gameKey);
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

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        activeGame={activeGame}
        onGameSelect={handleGameSelect}
      />

      {/* Main Content */}
      <main 
        className="pt-[80px] flex-1 transition-all duration-300"
        style={{ 
          marginLeft: sidebarWidth,
          paddingRight: '20px',
        }}
      >
        <div className="p-5 min-h-full">
          {children}
        </div>
      </main>

      {/* Footer */}
      <div 
        className="transition-all duration-300"
        style={{ 
          marginLeft: sidebarWidth,
        }}
      >
        <Footer />
      </div>

      {/* Auth Modals */}
      <AuthModal
        isLoginOpen={isLoginModalOpen}
        isRegisterOpen={isRegisterModalOpen}
        onLoginClose={() => setIsLoginModalOpen(false)}
        onRegisterClose={() => setIsRegisterModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </div>
  );
};

export default Layout;

