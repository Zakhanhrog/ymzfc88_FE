import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';

const MobileBottomNav = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();


  const navItems = [
    {
      id: 'menu',
      label: 'Tùy Chọn',
      icon: '/mbnav/nav-menu.png',
      isMenu: true,
      isImage: true
    },
    {
      id: 'deposit',
      label: 'Nạp Tiền',
      icon: 'mdi:wallet',
      path: '/wallet?tab=deposit-withdraw'
    },
    {
      id: 'casino',
      label: 'AEcasino',
      icon: '/mbnav/nav-ae888.png',
      path: '/',
      isActive: location.pathname === '/',
      isImage: true
    },
    {
      id: 'promo',
      label: 'Khuyến Mãi',
      icon: '/mbnav/nav-promo.png',
      path: '/promotions',
      isImage: true
    },
    {
      id: 'contact',
      label: 'Liên Hệ',
      icon: '/mbnav/nav-cs.png',
      path: '/contact',
      isImage: true
    }
  ];

  const handleNavClick = (item) => {
    if (item.isMenu) {
      onMenuClick?.();
    } else {
      navigate(item.path);
    }
  };


  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-1 px-3">
        {/* Main Navigation with curved background */}
        <div className="relative w-full">
          {/* Curved background image */}
          <div className="absolute inset-0">
            <img 
              src="/mbnav/nav-bg.png" 
              alt="Navigation background" 
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Navigation items overlay */}
          <div className="relative z-10 flex items-center justify-between px-2 py-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`flex flex-col items-center justify-center py-1 px-1 min-w-0 flex-1 relative ${
                  item.isActive ? 'text-red-500' : 'text-gray-600'
                }`}
              >
                {/* Icon */}
                <div className={`relative ${item.id === 'casino' ? '-mt-10 mb-1' : 'mb-1'}`}>
                  {item.isImage ? (
                    <img
                      src={item.icon}
                      alt={item.label}
                      className={item.id === 'casino' ? 'w-14 h-14' : 'w-5 h-5'}
                    />
                  ) : (
                    <Icon
                      icon={item.icon}
                      className={`${item.id === 'casino' ? 'w-14 h-14' : 'w-5 h-5'} ${
                        item.isActive ? 'text-red-500' : 'text-gray-600'
                      }`}
                    />
                  )}
                </div>
                
                {/* Label */}
                <span className={`text-xs font-medium ${
                  item.isActive ? 'text-red-500' : 'text-gray-600'
                } ${item.id === 'casino' ? 'mt-1' : ''}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

    </>
  );
};

export default MobileBottomNav;
