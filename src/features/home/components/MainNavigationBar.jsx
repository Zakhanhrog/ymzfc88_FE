import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const MainNavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('trang-chu');
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const itemRefs = useRef({});

  // Check if notification modal is open
  useEffect(() => {
    const checkModalState = () => {
      setIsNotificationModalOpen(document.body.hasAttribute('data-notification-modal-open'));
    };
    
    // Check initially
    checkModalState();
    
    // Watch for changes
    const observer = new MutationObserver(checkModalState);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-notification-modal-open']
    });
    
    return () => observer.disconnect();
  }, []);

  // Menu items theo hình ảnh
  const menuItems = [
    { 
      id: 'trang-chu', 
      label: 'Trang Chủ', 
      path: '/',
      hasBadge: false,
      hasFireIcon: false,
      mobileIcon: null // Trang chủ không có trong danh sách icon
    },
    { 
      id: 'lo-de', 
      label: 'Lô Đề', 
      hasBadge: false,
      hasFireIcon: false,
      mobileIcon: '/icondieuhuongmb/imgi_29_lode.avif',
      path: '/lottery'
    },
    { 
      id: 'song-bai', 
      label: 'Sòng Bài', 
      hasBadge: true,
      badgeText: 'Live',
      hasFireIcon: false,
      mobileIcon: '/icondieuhuongmb/imgi_22_casino.avif',
      path: '/casino/live'
    },
    { 
      id: 'no-hu', 
      label: 'Nổ Hũ', 
      hasBadge: false,
      hasFireIcon: false,
      mobileIcon: '/icondieuhuongmb/imgi_24_slots.avif'
    },
    { 
      id: 'quay-so', 
      label: 'Quay Số', 
      hasBadge: false,
      hasFireIcon: true,
      mobileIcon: '/icondieuhuongmb/imgi_25_lottery.avif'
    },
    { 
      id: 'game-bai', 
      label: 'Game Bài', 
      hasBadge: false,
      hasFireIcon: true,
      mobileIcon: '/icondieuhuongmb/imgi_27_game-cards.avif'
    },
    { 
      id: 'keno', 
      label: 'Keno', 
      hasBadge: false,
      hasFireIcon: false,
      mobileIcon: '/icondieuhuongmb/imgi_28_keno.avif'
    },
    { 
      id: 'the-thao', 
      label: 'Thể Thao', 
      hasBadge: false,
      hasFireIcon: false,
      mobileIcon: '/icondieuhuongmb/imgi_21_sport.avif'
    },
    { 
      id: 'da-ga', 
      label: 'Đá Gà', 
      hasBadge: false,
      hasFireIcon: false,
      mobileIcon: '/icondieuhuongmb/imgi_30_cockfight.avif'
    },
    { 
      id: 'ban-ca', 
      label: 'Bắn Cá', 
      hasBadge: false,
      hasFireIcon: false,
      mobileIcon: '/icondieuhuongmb/imgi_31_fishing.avif'
    },
    { 
      id: 'cong-game', 
      label: 'Cổng Game', 
      hasBadge: false,
      hasFireIcon: false,
      mobileIcon: '/icondieuhuongmb/imgi_32_lobby-game.avif'
    }
  ];

  // Xác định active item dựa trên route hiện tại
  const getActiveItemFromPath = () => {
    const path = location.pathname;
    if (path === '/lottery' || path.startsWith('/lottery')) {
      return 'lo-de';
    }
    if (path === '/casino/live' || path.startsWith('/casino')) {
      return 'song-bai';
    }
    if (path === '/') {
      return 'trang-chu';
    }
    return 'trang-chu';
  };

  // Update active item khi route thay đổi
  useEffect(() => {
    setActiveItem(getActiveItemFromPath());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleItemClick = (item) => {
    setActiveItem(item.id);
    if (item.path) {
      navigate(item.path);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    const activeButton = itemRefs.current[activeItem];
    if (activeButton && typeof activeButton.scrollIntoView === 'function') {
      activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeItem]);

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:block w-full rounded-lg mb-4 overflow-hidden bg-gray-100 relative">
        <div className="flex items-center justify-between px-6 py-3 relative z-10">
        {menuItems.map((item) => {
          const isActive = activeItem === item.id 
            || (item.id === 'lo-de' && (location.pathname === '/lottery' || location.pathname.startsWith('/lottery')))
            || (item.id === 'song-bai' && (location.pathname === '/casino/live' || location.pathname.startsWith('/casino')))
            || (item.id === 'trang-chu' && location.pathname === '/');
          
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`
                relative flex items-center justify-center px-4 py-2.5 rounded-lg
                whitespace-nowrap transition-all duration-300
                ${isActive 
                  ? 'bg-gradient-to-r from-green-400 to-emerald-600 text-white font-semibold shadow-md' 
                  : 'text-gray-700 hover:text-green-500 hover:bg-green-50'
                }
              `}
            >
              {/* Label */}
                <span className="text-base font-medium">{item.label}</span>
              {/* Live Badge for Sòng Bài */}
              {item.hasBadge && item.badgeText && (
                <span className="absolute -top-0.5 -right-0.5 text-[8px] text-white font-bold bg-red-600 px-1 py-0.5 rounded leading-none scale-50 origin-top-right">
                  {item.badgeText}
                </span>
              )}
            </button>
          );
        })}
        </div>
      </div>

      {/* Mobile Navigation - Card Grid Layout */}
      {!isNotificationModalOpen && (
        <div className="md:hidden fixed top-[56px] left-0 right-0 z-30 bg-gray-100 rounded-lg px-3 py-1 pt-1">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {menuItems.filter(item => item.mobileIcon).map((item) => {
          const isActive = activeItem === item.id 
            || (item.id === 'lo-de' && (location.pathname === '/lottery' || location.pathname.startsWith('/lottery')))
            || (item.id === 'song-bai' && (location.pathname === '/casino/live' || location.pathname.startsWith('/casino')))
            || (item.id === 'trang-chu' && location.pathname === '/');
          
          return (
            <button
              key={item.id}
              ref={(el) => {
                if (el) {
                  itemRefs.current[item.id] = el;
                }
              }}
              onClick={() => handleItemClick(item)}
              className={`
                  relative flex flex-col items-center justify-center px-2 py-1.5 rounded-lg
                  transition-all duration-300 flex-shrink-0 min-w-[60px]
                  ${isActive 
                    ? 'bg-green-100' 
                    : 'bg-gray-200 hover:bg-gray-300'}
                `}
              >
                {/* Icon */}
                <div className="mb-0.5">
                  <img
                    src={item.mobileIcon}
                    alt={item.label}
                    className={`w-7 h-7 transition-all ${isActive ? 'opacity-100' : 'opacity-70'}`}
                  />
                </div>
                
              {/* Label */}
                <span className={`text-[10px] font-medium text-center whitespace-nowrap ${
                  isActive ? 'text-green-600' : 'text-gray-700'
                }`}>
                  {item.label}
                </span>
            </button>
          );
        })}
      </div>
    </div>
      )}
    </>
  );
};

export default MainNavigationBar;
