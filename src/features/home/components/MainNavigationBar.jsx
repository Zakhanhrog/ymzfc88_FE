import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const MainNavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('trang-chu');

  // Menu items theo hình ảnh
  const menuItems = [
    { 
      id: 'trang-chu', 
      label: 'Trang Chủ', 
      path: '/',
      hasBadge: false,
      hasFireIcon: false
    },
    { 
      id: 'the-thao', 
      label: 'Thể Thao', 
      hasBadge: false,
      hasFireIcon: false
    },
    { 
      id: 'song-bai', 
      label: 'Sòng Bài', 
      hasBadge: true,
      badgeText: 'Live',
      hasFireIcon: false
    },
    { 
      id: 'no-hu', 
      label: 'Nổ Hũ', 
      hasBadge: false,
      hasFireIcon: false
    },
    { 
      id: 'quay-so', 
      label: 'Quay Số', 
      hasBadge: false,
      hasFireIcon: true
    },
    { 
      id: 'game-bai', 
      label: 'Game Bài', 
      hasBadge: false,
      hasFireIcon: true
    },
    { 
      id: 'keno', 
      label: 'Keno', 
      hasBadge: false,
      hasFireIcon: false
    },
    { 
      id: 'xo-so', 
      label: 'Xổ Số', 
      path: '/lottery',
      hasBadge: false,
      hasFireIcon: false
    },
    { 
      id: 'da-ga', 
      label: 'Đá Gà', 
      hasBadge: false,
      hasFireIcon: false
    },
    { 
      id: 'ban-ca', 
      label: 'Bắn Cá', 
      hasBadge: false,
      hasFireIcon: false
    },
    { 
      id: 'cong-game', 
      label: 'Cổng Game', 
      hasBadge: false,
      hasFireIcon: false
    }
  ];

  // Xác định active item dựa trên route hiện tại
  const getActiveItemFromPath = () => {
    const path = location.pathname;
    if (path === '/lottery' || path.startsWith('/lottery')) {
      return 'xo-so';
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

  return (
    <div className="w-full rounded-lg mb-4 overflow-hidden bg-gray-100 relative">
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-between px-6 py-3 relative z-10">
        {menuItems.map((item) => {
          const isActive = activeItem === item.id 
            || (item.id === 'xo-so' && (location.pathname === '/lottery' || location.pathname.startsWith('/lottery')))
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
              <span className="text-lg font-medium">{item.label}</span>
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

      {/* Mobile Navigation - Horizontal Scroll */}
      <div className="md:hidden flex items-center justify-between px-3 py-2.5 overflow-x-auto scrollbar-hide relative z-10">
        {menuItems.map((item) => {
          const isActive = activeItem === item.id 
            || (item.id === 'xo-so' && (location.pathname === '/lottery' || location.pathname.startsWith('/lottery')))
            || (item.id === 'trang-chu' && location.pathname === '/');
          
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`
                relative flex items-center justify-center px-2 py-2 rounded-lg
                whitespace-nowrap transition-all duration-300 flex-shrink-0
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
                <span className="absolute -top-0.5 -right-0.5 text-[4px] text-white font-bold bg-red-600 px-0.5 py-0 rounded leading-none">
                  {item.badgeText}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MainNavigationBar;
