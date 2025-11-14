import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ 
  collapsed, 
  onCollapse, 
  activeGame, 
  onGameSelect,
  className = '',
}) => {
  const navigate = useNavigate();

  // Special menu items với icon hình ảnh
  const specialMenuItems = [
    // { key: 'daily', label: 'Mỗi Ngày', image: '/images/icons/sm-check.png' },
    // { key: 'lucky-wheel', label: 'Vòng Quay May Mắn', image: '/images/icons/sm-wheel.png' },
    // { key: 'reward-results', label: 'Kết Quả Trao Thưởng', image: '/images/icons/sm-mb.webp' },
    // { key: 'red-envelope', label: 'Phong Bì Đỏ', image: '/images/icons/sm-red.png' },
  ];

  // Game categories
  const gameCategories = [
    { key: 'HOT', label: 'HOT GAMES', icon: 'mdi:fire' },
    // { key: 'THETHAO', label: 'THỂ THAO', icon: 'mdi:soccer' },
    // { key: 'SONGBAI', label: 'SÒNG BÀI', icon: 'mdi:cards-playing' },
    // { key: 'SLOTS', label: 'SLOTS', icon: 'mdi:slot-machine' },
    // { key: 'DAGA', label: 'ĐÁ GÀ', icon: 'game-icons:rooster' },
    // { key: 'GAMEBAI', label: 'GAME BÀI', icon: 'mdi:cards' },
    // { key: 'RACING', label: 'RACING BALL', icon: 'mdi:basketball' },
    // { key: 'esports', label: 'E-SPORTS', icon: 'mdi:controller' },
    { key: 'promotions', label: 'KHUYẾN MÃI', icon: 'mdi:gift' },
    // { key: 'vip', label: 'VIP', icon: 'mdi:crown' },
    // { key: 'app', label: 'APP', icon: 'mdi:cellphone' },
    // { key: 'external-agent', label: 'ĐẠI LÝ NGOÀI', icon: 'mdi:swap-horizontal' },
    { key: 'contact', label: 'Liên Hệ', icon: 'mdi:headset' }
  ];

  const handleMenuClick = (key) => {
    const menuActions = {
      'contact': () => window.dispatchEvent(new CustomEvent('openContactDrawer')),
      'promotions': () => navigate('/promotions', { replace: false }),
    };

    if (menuActions[key]) {
      menuActions[key]();
    } else {
      onGameSelect(key);
      // Không cần lưu vào localStorage nữa vì Layout sẽ tự động quản lý
    }
  };


  if (collapsed) {
    // Collapsed mode - chỉ hiển thị trên desktop
    return (
      <div className={`fixed left-0 top-[70px] h-[calc(100vh-70px)] w-[80px] bg-white shadow-lg overflow-y-auto z-10 transition-all duration-300 ease-in-out ${className}`}>
        <div className="p-2 space-y-2">
          {/* Special menu items - Only show if there are items */}
          {specialMenuItems.length > 0 && (
            <>
              {specialMenuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleMenuClick(item.key)}
                  className="w-full p-2 hover:bg-gray-100 rounded-lg transition-all group relative"
                  title={item.label}
                >
                  <img src={item.image} alt={item.label} className="w-8 h-8 mx-auto object-contain transition-transform duration-300 group-hover:scale-110" />
                  {/* Tooltip on hover */}
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none font-medium">
                    {item.label}
                  </div>
                </button>
              ))}
              <div className="h-px bg-gray-200 my-3" />
            </>
          )}
          
          {gameCategories.map((category) => (
            <button
              key={category.key}
              onClick={() => handleMenuClick(category.key)}
              className={`
                w-full p-2 rounded-lg transition-all group relative
                ${activeGame === category.key 
                  ? 'bg-green-400 bg-opacity-10 text-green-500' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-green-500'
                }
              `}
              title={category.label}
            >
              <Icon icon={category.icon} className="w-7 h-7 mx-auto transition-transform duration-300 group-hover:scale-110" />
              {/* Tooltip on hover */}
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none font-medium">
                {category.label}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Expanded mode
  return (
    <div className={`
      fixed left-0 top-[70px] h-[calc(100vh-70px)] w-[280px] bg-white shadow-lg overflow-y-auto z-30
      transition-all duration-300 ease-in-out
      ${className}
    `}>
      
      {/* Mã Dự Thưởng Banner */}
      {/* <div className="px-2 pt-1 animate-fadeIn">
        <img 
          src="/images/banners/maduthuong.png" 
          alt="Mã Dự Thưởng" 
          className="w-full cursor-pointer hover:opacity-90 transition-opacity"
        />
      </div> */}

      {/* Banner */}
       <div className="px-2 pb-4 animate-fadeIn">
        <img
          src="/images/banners/banner-yua.webp"
          alt="VUA MIKAMI Banner"
          className="w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
        />
      </div>

      {/* Special menu items - Only show if there are items */}
      {specialMenuItems.length > 0 && (
        <>
          <div className="px-2 space-y-2">
            {specialMenuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleMenuClick(item.key)}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-all hover:scale-105 group"
              >
                <img src={item.image} alt={item.label} className="w-7 h-7 object-contain transition-transform duration-300 group-hover:scale-110" />
                <span className="font-medium text-sm text-gray-700 animate-slideInLeft">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
          <div className="h-px bg-gray-200 my-4 mx-2" />
        </>
      )}

      {/* Game categories */}
      <div className="px-2 pb-4 space-y-2">
        {gameCategories.map((category) => (
          <button
            key={category.key}
            onClick={() => handleMenuClick(category.key)}
            className={`
              w-full flex items-center gap-3 p-3 rounded-lg transition-all group
              ${activeGame === category.key 
                ? 'text-green-500 font-semibold bg-green-50' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-green-500 font-medium hover:scale-105'
              }
            `}
          >
            <Icon icon={category.icon} className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-sm animate-slideInLeft">
              {category.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

