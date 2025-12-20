import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Header from './layout/Header';
import MobileDepositHeader from './layout/MobileDepositHeader';
import Sidebar from './layout/Sidebar';
import MobileSidebar from './layout/MobileSidebar';
import AuthModal from './layout/AuthModal';
import LogoutConfirmModal from './LogoutConfirmModal';
import Footer from './layout/Footer';
import MobileFooter from './layout/MobileFooter';
import MobileBottomNav from './layout/MobileBottomNav';
import pointService from '../../services/pointService';
import contactService from '../../services/contactService';
import { message } from 'antd';

const CONTACT_CARDS = [
  {
    id: 1,
    key: 'livechat',
    title: 'Livechat 24/24',
    icon: '/iconhotro/imgi_138_livechat.svg',
  },
  {
    id: 2,
    key: 'facebook',
    title: 'Kênh Facebook',
    icon: '/iconhotro/imgi_139_facebook.svg',
  },
  {
    id: 3,
    key: 'messenger',
    title: 'Messenger Facebook',
    icon: '/iconhotro/imgi_140_messenger.svg',
  },
  {
    id: 4,
    key: 'telegram',
    title: 'Telegram',
    icon: '/iconhotro/imgi_141_telegram_chanel.svg',
  },
  {
    id: 5,
    key: 'hotline',
    title: 'Hotline',
    icon: '/iconhotro/imgi_138_livechat.svg',
  },
];

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
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [userName, setUserName] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);
  const [contactLinks, setContactLinks] = useState({});
  const [contactLoading, setContactLoading] = useState(false);
  const hasLoadedContactLinks = useRef(false);
  const contactPanelRef = useRef(null);
  const [contactButtonVisible, setContactButtonVisible] = useState(true);
  const contactButtonTimeoutRef = useRef(null);
  const hasInitialContactEffectRun = useRef(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Function để fetch thông tin user từ API với caching
  const fetchUserInfo = async (forceRefresh = false) => {
    try {
      // Check cache first (cache 30 seconds)
      if (!forceRefresh) {
        const cached = sessionStorage.getItem('user_info_cache');
        if (cached) {
          try {
            const { data, timestamp } = JSON.parse(cached);
            const now = Date.now();
            if (now - timestamp < 30000) { // 30 seconds cache
              setUserName(data.username || data.name || '');
              setUserPoints(data.points || 0);
              return;
            }
          } catch (e) {
            // Cache invalid, continue to fetch
          }
        }
      }

      // Gọi API /auth/me để lấy thông tin user mới nhất
      const response = await fetch('https://api.tathiet168.com/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        if (userData.success && userData.data) {
          const user = userData.data;
          
          // Cập nhật state
          setUserName(user.username || user.name || '');
          setUserPoints(user.points || 0);
          
          // Lưu vào localStorage
          localStorage.setItem('user', JSON.stringify(user));
          
          // Cache in sessionStorage
          try {
            sessionStorage.setItem('user_info_cache', JSON.stringify({
              data: user,
              timestamp: Date.now()
            }));
          } catch (e) {
            // Ignore storage errors
          }
          return;
        }
      }
      
      // Fallback: lấy từ localStorage
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        setUserName(userData.username || userData.name || '');
        setUserPoints(userData.points || 0);
      }
    } catch (error) {
      // Silent error handling - fallback to localStorage
      const user = localStorage.getItem('user');
      if (user) {
        try {
        const userData = JSON.parse(user);
        setUserName(userData.username || userData.name || '');
        setUserPoints(userData.points || 0);
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  };

  // Function để fetch user points từ API
  const fetchUserPoints = async () => {
    try {
      // Thử gọi API wallet/balance trước (có points)
      const walletResponse = await fetch('https://api.tathiet168.com/api/wallet/balance', {
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

  const loadContactLinks = useCallback(async () => {
    try {
      setContactLoading(true);
      const links = await contactService.getContactLinks();
      setContactLinks(links || {});
      hasLoadedContactLinks.current = true;
    } catch (error) {
      message.error('Không thể tải danh sách liên hệ');
    } finally {
      setContactLoading(false);
    }
  }, []);

  const openContactDrawer = useCallback(() => {
     if (isMobile) {
       navigate('/contact', { replace: false });
       return;
     }
    setIsContactDrawerOpen((prev) => !prev);
  }, [isMobile, navigate]);

  const closeContactDrawer = useCallback(() => {
    setIsContactDrawerOpen(false);
  }, []);
 
  const handleContactCardClick = useCallback(
    (card) => {
      const link = contactLinks?.[card.key];
      if (link && link !== '#') {
        if (link.startsWith('tel:')) {
          window.location.href = link;
        } else {
          window.open(link, '_blank', 'noopener');
        }
        closeContactDrawer();
      } else {
        message.info('Kênh này chưa được cấu hình');
      }
    },
    [contactLinks, closeContactDrawer]
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      setIsLoggedIn(true);
      
      // Lấy thông tin user từ localStorage trước (để hiển thị ngay)
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          setUserName(userData.username || userData.name || '');
          setUserPoints(userData.points || 0);
        } catch (error) {
          setUserName('');
          setUserPoints(0);
        }
      }
      
      // Sau đó gọi API để cập nhật thông tin mới nhất (với cache)
      fetchUserInfo();

      // Refresh points less frequently (every 60 seconds instead of 30)
      const interval = setInterval(() => {
        fetchUserPoints();
      }, 60000);

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const inviteCode = params.get('inviteCode');
    const shouldOpenRegister = params.get('register') === '1' || params.get('register') === 'true';

    if (!isLoggedIn && (inviteCode || shouldOpenRegister)) {
      setIsRegisterModalOpen(true);
    }
  }, [location.search, isLoggedIn]);

  useEffect(() => {
    const handleLoginSuccess = (event) => {
      setIsLoginModalOpen(false);
      setIsRegisterModalOpen(false);
      setIsLoggedIn(true);

      const user = event.detail?.user;
      if (user) {
        setUserName(user.username || user.name || '');
        setUserPoints(user.points || 0);
        try {
          localStorage.setItem('user', JSON.stringify(user));
        } catch (e) {
          // ignore storage errors
        }
      }

      fetchUserInfo(true);
    };

    window.addEventListener('userLoginSuccess', handleLoginSuccess);

    return () => {
      window.removeEventListener('userLoginSuccess', handleLoginSuccess);
    };
  }, []);

  useEffect(() => {
    const handleOpenContactDrawer = () => setIsContactDrawerOpen(true);
    window.addEventListener('openContactDrawer', handleOpenContactDrawer);
    return () => {
      window.removeEventListener('openContactDrawer', handleOpenContactDrawer);
    };
  }, []);
 
  useEffect(() => {
    if (isContactDrawerOpen && !hasLoadedContactLinks.current) {
      loadContactLinks();
    }

    if (!isContactDrawerOpen) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (contactPanelRef.current && !contactPanelRef.current.contains(event.target)) {
        setIsContactDrawerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isContactDrawerOpen, loadContactLinks]);

  useEffect(() => {
    if (!hasInitialContactEffectRun.current) {
      hasInitialContactEffectRun.current = true;
      return;
    }

    if (contactButtonTimeoutRef.current) {
      clearTimeout(contactButtonTimeoutRef.current);
      contactButtonTimeoutRef.current = null;
    }

    if (isContactDrawerOpen) {
      setContactButtonVisible(false);
    } else {
      setContactButtonVisible(false);
      contactButtonTimeoutRef.current = setTimeout(() => {
        setContactButtonVisible(true);
      }, 300);
    }
  }, [isContactDrawerOpen]);

  useEffect(() => () => {
    if (contactButtonTimeoutRef.current) {
      clearTimeout(contactButtonTimeoutRef.current);
    }
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    if (isLoggingOut) return; // Prevent double execution
    
    setIsLoggingOut(true);
    try {
      // Call logout API if needed
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          await fetch('https://api.tathiet168.com/api/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });
        } catch (apiError) {
          console.error('Logout API error:', apiError);
          // Continue with local logout even if API fails
        }
      }
      
      // Remove all tokens and user data
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('adminUser');
      
      setIsLoggedIn(false);
      setUserName('');
      setUserPoints(0);
      setShowLogoutModal(false);
      
      // Navigate and reload after a short delay
      navigate('/');
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if API fails
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('adminUser');
      setIsLoggedIn(false);
      setUserName('');
      setUserPoints(0);
      setShowLogoutModal(false);
      
      // Navigate and reload after a short delay
      navigate('/');
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleGameSelect = (gameKey) => {
    setActiveGame(gameKey);
  };

  const sidebarWidth = sidebarCollapsed ? '80px' : '280px';
  const shouldShowSidebar = false; // Toggle to true when sidebar needs to reappear
  const effectiveSidebarWidth = shouldShowSidebar ? sidebarWidth : '0px';

  // Hide header on mobile notification page only
  const isNotificationPage = location.pathname === '/notifications';
  const isNotificationDetailPage = location.pathname.startsWith('/notifications/') && location.pathname !== '/notifications';
  const isMobileNotificationPage = isNotificationPage && isMobile;
  const isMobileNotificationDetailPage = isNotificationDetailPage && isMobile;
  const shouldHideHeader = isNotificationPage || isNotificationDetailPage;

  // Check if on mobile deposit/withdraw page
  const isWalletPage = location.pathname === '/wallet';
  const searchParams = new URLSearchParams(location.search);
  const walletTab = searchParams.get('tab');
  const isDepositPage = isWalletPage && walletTab === 'deposit-withdraw';
  const isWithdrawPage = isWalletPage && walletTab === 'withdraw';
  const isTransactionHistoryPage = isWalletPage && walletTab === 'transaction-history';
  const isKycVerificationPage = isWalletPage && (walletTab === 'kyc-verification' || walletTab === 'account');
  const isMobileDepositPage = isMobile && (isDepositPage || isWithdrawPage);
  const isMobileTransactionHistoryPage = isMobile && isTransactionHistoryPage;
  const isMobileKycVerificationPage = isMobile && isKycVerificationPage;
  const depositPageTitle = isDepositPage ? 'Nạp tiền' : isWithdrawPage ? 'Rút tiền' : '';

  // Check if on mobile promotions page
  const isPromotionsPage = location.pathname === '/promotions';
  const isMobilePromotionsPage = isMobile && isPromotionsPage;

  // Check if on mobile KYC page
  const isKycPage = location.pathname === '/kyc';
  const isMobileKycPage = isMobile && isKycPage;

  // Check if on mobile betting history page
  const isBettingHistoryPage = location.pathname === '/betting-history';
  const isMobileBettingHistoryPage = isMobile && isBettingHistoryPage;

  // Check if on mobile contact/support page
  const isContactPage = location.pathname === '/contact';
  const isMobileContactPage = isMobile && isContactPage;

  const hasMobileSpecialHeader =
    isMobileDepositPage ||
    isMobilePromotionsPage ||
    isMobileTransactionHistoryPage ||
    isMobileKycVerificationPage ||
    isMobileKycPage ||
    isMobileBettingHistoryPage ||
    isMobileContactPage ||
    isMobileNotificationPage ||
    isMobileNotificationDetailPage;

  const mainPaddingClass = shouldHideHeader
    ? (isMobileNotificationPage || isMobileNotificationDetailPage ? 'pt-[56px]' : 'pt-0')
    : hasMobileSpecialHeader
      ? 'pt-[56px]'
      : 'pt-[56px] md:pt-[70px]';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Deposit/Withdraw Header */}
      {isMobileDepositPage && depositPageTitle && (
        <MobileDepositHeader title={depositPageTitle} backPath="/account" />
      )}

      {/* Mobile Transaction History Header */}
      {isMobileTransactionHistoryPage && (
        <MobileDepositHeader title="Lịch sử giao dịch" backPath="/account" />
      )}

      {/* Mobile KYC Verification Header (from wallet tab) */}
      {isMobileKycVerificationPage && (
        <MobileDepositHeader title="Xác thực tài khoản" backPath="/account" />
      )}

      {/* Mobile Promotions Header */}
      {isMobilePromotionsPage && (
        <MobileDepositHeader title="Khuyến mãi" />
      )}

      {/* Mobile KYC Page Header */}
      {isMobileKycPage && (
        <MobileDepositHeader title="Xác thực tài khoản" />
      )}

      {/* Mobile Betting History Header */}
      {isMobileBettingHistoryPage && (
        <MobileDepositHeader title="Lịch sử cược" />
      )}

      {/* Mobile Contact/Support Header */}
      {isMobileContactPage && (
        <MobileDepositHeader title="Hỗ trợ" />
      )}

      {/* Mobile Notification Header */}
      {isMobileNotificationPage && (
        <MobileDepositHeader title="Thông báo" />
      )}

      {/* Mobile Notification Detail Header */}
      {isMobileNotificationDetailPage && (
        <MobileDepositHeader title="Chi tiết thông báo" backPath="/notifications" />
      )}

      {/* Header - Hidden on mobile notification page and mobile special pages */}
      {!shouldHideHeader && !isMobileDepositPage && !isMobilePromotionsPage && !isMobileTransactionHistoryPage && !isMobileKycVerificationPage && !isMobileKycPage && !isMobileBettingHistoryPage && !isMobileContactPage && (
      <Header
        isLoggedIn={isLoggedIn}
        sidebarCollapsed={sidebarCollapsed}
        onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLoginOpen={() => setIsLoginModalOpen(true)}
        onRegisterOpen={() => setIsRegisterModalOpen(true)}
        userName={userName}
        userBalance={userPoints}
        onRefreshBalance={fetchUserInfo}
        onLogout={handleLogout}
        onMobileMenuToggle={() => setShowMobileSidebar(true)}
      />
      )}

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={showMobileSidebar}
        onClose={() => setShowMobileSidebar(false)}
        isLoggedIn={isLoggedIn}
        userName={userName}
        userBalance={userPoints}
      />

      {/* Sidebar - Hidden on mobile */}
      {shouldShowSidebar && (
      <div className="hidden md:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
          activeGame={activeGame}
          onGameSelect={handleGameSelect}
        />
      </div>
      )}

      {/* Main Content */}
      <main 
        className={`flex-1 ml-0 w-full md:transition-all md:duration-300 md:ease-in-out ${mainPaddingClass}`}
        style={{ 
          marginLeft: '0px',
          width: '100%',
        }}
      >
        {/* Desktop spacing */}
        <div className="hidden md:block" style={{ marginLeft: effectiveSidebarWidth, width: `calc(100% - ${effectiveSidebarWidth})` }}>
          <div className="p-5 min-h-full w-full">
            {children}
          </div>
        </div>
        
        {/* Mobile layout */}
        <div className="md:hidden px-3 pb-16 min-h-full w-full pt-0">
          {children}
        </div>
      </main>

      {/* Footer */}
      <div className="ml-0 w-full md:transition-all md:duration-300 md:ease-in-out">
        {/* Desktop spacing */}
        <div className="hidden md:block" style={{ marginLeft: effectiveSidebarWidth, width: `calc(100% - ${effectiveSidebarWidth})` }}>
          <Footer />
        </div>
        
        {/* Mobile layout - Hidden */}
        <div className="md:hidden hidden">
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

      {/* Contact Button - Fixed position on right edge */}
      {/* Mobile: Small icon button at bottom - sát cạnh, bo 2 góc bên trái */}
      <button
        onClick={openContactDrawer}
        className="md:hidden fixed right-0 bottom-24 z-50 bg-green-400 hover:bg-green-500 text-black rounded-tl-lg rounded-bl-lg p-1.5 w-8 h-8 flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-xl"
        aria-label="Liên hệ"
      >
        <img src="/iconhotro/lienhe.svg" alt="Liên hệ" className="w-4 h-4" />
      </button>

      {/* Desktop Contact Button */}
      <button
        onClick={openContactDrawer}
        className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-green-400 hover:bg-green-500 text-black rounded-l-lg px-1 py-2 flex-col items-center justify-center gap-1 shadow-md transition-transform transition-opacity duration-200 hover:shadow-lg"
        style={{
          transform: `translateY(-50%) translateX(${isContactDrawerOpen || !contactButtonVisible ? '120%' : '0'})`,
          opacity: isContactDrawerOpen || !contactButtonVisible ? 0 : 1,
          pointerEvents: isContactDrawerOpen || !contactButtonVisible ? 'none' : 'auto',
        }}
      >
          <img src="/iconhotro/lienhe.svg" alt="Liên hệ" className="w-5 h-5" />
        <span 
          className="text-[10px] font-semibold tracking-wide"
          style={{ writingMode: 'vertical-lr', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
        >
          Liên hệ
        </span>
      </button>

      {/* Contact Drawer */}
      <div
         ref={contactPanelRef}
        className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-50"
      >
        <div
          className={`overflow-hidden transition-all duration-200 ease-out ${
            isContactDrawerOpen ? 'max-w-[240px] opacity-100 ml-2 pointer-events-auto' : 'max-w-0 opacity-0 ml-0 pointer-events-none'
          }`}
        >
          <div className="w-60 rounded-2xl bg-white text-gray-900 shadow-md p-2 space-y-1">
            {contactLoading ? (
              <div className="flex justify-center py-4 text-sm text-gray-600">Đang tải...</div>
            ) : (
              CONTACT_CARDS.map((card) => (
                <button
                  type="button"
                  key={card.id}
                  onClick={() => handleContactCardClick(card)}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-xl bg-white hover:bg-gray-100 transition-colors text-left"
                >
                  <img src={card.icon} alt={card.title} className="w-6 h-6" />
                  <span className="flex-1 text-sm font-semibold text-gray-900 truncate">{card.title}</span>
                  <Icon icon="mdi:chevron-right" className="w-4 h-4 text-gray-400" />
                </button>
              ))
            )}
          </div>
        </div>
      </div>
 
    </div>
  );
};

export default Layout;

