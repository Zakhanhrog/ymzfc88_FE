import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const MobileSidebar = ({ isOpen, onClose, isLoggedIn, userName, userBalance }) => {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);
  const [isOpeningPhase, setIsOpeningPhase] = useState(false);
  const timeoutRef = useRef(null);
  const isMountedRef = useRef(false);

  const handleClose = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setIsClosing(true);
    
    timeoutRef.current = setTimeout(() => {
      setIsClosing(false);
      onClose();
      timeoutRef.current = null;
    }, 300); // Match animation duration
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return isLoggedIn;
  };

  const handleNavigate = (path) => {
    // Check if route requires authentication
    const requiresAuth = path.includes('/wallet') || path.includes('/account');
    
    if (requiresAuth && !isAuthenticated()) {
      // Redirect to login page with return path
      navigate('/login', { 
        state: { 
          redirectAfterLogin: path
        },
        replace: false
      });
      handleClose();
      return;
    }
    
    navigate(path, { replace: false });
    handleClose();
  };

  // Reset isClosing when sidebar opens
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      isMountedRef.current = true;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      // Smoothly fade in backdrop on open
      setIsOpeningPhase(true);
      const t = setTimeout(() => setIsOpeningPhase(false), 10);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Don't render if not open and not closing (but keep mounted during closing animation)
  if (!isOpen && !isClosing) {
    isMountedRef.current = false;
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black z-[60] md:hidden transition-opacity duration-300 ease-in-out ${
          isClosing ? 'opacity-0' : isOpen ? (isOpeningPhase ? 'opacity-0' : 'opacity-50') : 'opacity-0'
        }`}
        onClick={handleClose}
        style={{
          pointerEvents: isOpen || isClosing ? 'auto' : 'none'
        }}
      />
      
      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 bottom-0 w-72 bg-white shadow-xl z-[70] overflow-y-auto md:hidden transition-transform duration-300 ease-in-out ${
          isClosing ? 'animate-slide-out-left' : isOpen ? 'animate-slide-in-left' : '-translate-x-full'
        }`}
        style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden'
        }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 bg-white flex items-center justify-between">
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Đóng"
          >
            <Icon icon="mdi:close" className="w-5 h-5 text-gray-700" />
          </button>
          <img src="/images/logos/logo.webp" alt="Logo" className="h-6" />
        </div>

        {/* Menu List - Content only, white background */}
        <nav className="py-2">
          {[
            { label: 'Thể Thao', icon: '/icondieuhuongmb/imgi_21_sport.avif', path: '/' },
            { label: 'Sòng Bài', icon: '/icondieuhuongmb/imgi_22_casino.avif', path: '/' , badge: 'LIVE' },
            { label: 'Nổ Hũ', icon: '/icondieuhuongmb/imgi_24_slots.avif', path: '/' },
            { label: 'Quay Số', icon: '/icondieuhuongmb/imgi_25_lottery.avif', path: '/' },
            { label: 'Game Bài', icon: '/icondieuhuongmb/imgi_27_game-cards.avif', path: '/' },
            { label: 'Keno', icon: '/icondieuhuongmb/imgi_28_keno.avif', path: '/' },
            { label: 'Lô Đề', icon: '/icondieuhuongmb/imgi_29_lode.avif', path: '/' },
            { label: 'Đá Gà', icon: '/icondieuhuongmb/imgi_30_cockfight.avif', path: '/' },
            { label: 'Bắn Cá', icon: '/icondieuhuongmb/imgi_31_fishing.avif', path: '/' },
            { label: 'Cổng Game', icon: '/icondieuhuongmb/imgi_32_lobby-game.avif', path: '/' },
            { label: 'Khuyến Mãi', icon: '/icondieuhuongmb/imgi_34_promotion.avif', path: '/promotions' },
            { label: 'Trợ Giúp', icon: '/icondieuhuongmb/imgi_35_help.avif', path: '/contact' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigate(item.path)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-3">
                <img src={item.icon} alt={item.label} className="w-6 h-6" />
                <span className="text-sm font-medium text-gray-900">{item.label}</span>
              </span>
              {item.badge && (
                <span className="text-[7px] leading-none font-semibold text-white bg-red-500 px-0.5 py-[1px] rounded">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default MobileSidebar;

