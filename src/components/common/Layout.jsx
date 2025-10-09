import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import AuthModal from './layout/AuthModal';
import Footer from './layout/Footer';

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
  const [userBalance, setUserBalance] = useState(0);
  const [userName, setUserName] = useState('');

  // Lưu activeGame vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('activeGame', activeGame);
  }, [activeGame]);

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
    const token = localStorage.getItem('token');
    
    if (token) {
      setIsLoggedIn(true);
      
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
        setUserName('User');
        setUserBalance(0);
      }

      fetchUserBalance();

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
        userBalance={userBalance}
        onRefreshBalance={fetchUserBalance}
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

