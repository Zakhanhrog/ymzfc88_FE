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
    { key: 'daily', label: 'Mỗi Ngày', image: '/sm-check.png' },
    { key: 'lucky-wheel', label: 'Vòng Quay May Mắn', image: '/sm-wheel.png' },
    { key: 'reward-results', label: 'Kết Quả Trao Thưởng', image: '/sm-mb.webp' },
    { key: 'red-envelope', label: 'Phong Bì Đỏ', image: '/sm-red.png' },
    { key: 'deposit', label: 'Nạp Tiền', image: '/icon-deposit.png' }
  ];

  // Game categories
  const gameCategories = [
    { key: 'HOT', label: 'HOT GAMES', icon: 'mdi:fire' },
    { key: 'THETHAO', label: 'THỂ THAO', icon: 'mdi:soccer' },
    { key: 'SONGBAI', label: 'SÒNG BÀI', icon: 'mdi:cards-playing' },
    { key: 'SLOTS', label: 'SLOTS', icon: 'mdi:slot-machine' },
    { key: 'DAGA', label: 'ĐÁ GÀ', icon: 'game-icons:rooster' },
    { key: 'GAMEBAI', label: 'GAME BÀI', icon: 'mdi:cards' },
    { key: 'RACING', label: 'RACING BALL', icon: 'mdi:basketball' },
    { key: 'lottery', label: 'XỔ SỐ', icon: 'mdi:dice-multiple' },
    { key: 'esports', label: 'E-SPORTS', icon: 'mdi:controller' },
    { key: 'promotions', label: 'KHUYẾN MÃI', icon: 'mdi:gift' },
    { key: 'vip', label: 'VIP', icon: 'mdi:crown' },
    { key: 'app', label: 'APP', icon: 'mdi:cellphone' },
    { key: 'external-agent', label: 'ĐẠI LÝ NGOÀI', icon: 'mdi:swap-horizontal' },
    { key: 'about', label: 'Về Chúng Tôi', icon: 'mdi:lightbulb' },
    { key: 'contact', label: 'Liên Hệ', icon: 'mdi:headset' }
  ];

  const handleMenuClick = (key) => {
    const menuActions = {
      'deposit': () => navigate('/wallet?tab=deposit-withdraw'),
      'lottery': () => {
        navigate('/lottery');
        onGameSelect('lottery');
        localStorage.setItem('activeGame', 'lottery');
      },
      'daily': () => console.log('Mỗi Ngày clicked'),
      'lucky-wheel': () => console.log('Vòng Quay May Mắn clicked'),
      'reward-results': () => console.log('Kết Quả Trao Thưởng clicked'),
      'red-envelope': () => console.log('Phong Bì Đỏ clicked'),
    };

    if (menuActions[key]) {
      menuActions[key]();
    } else {
      onGameSelect(key);
      localStorage.setItem('activeGame', key); // Lưu vào localStorage
    }

  };

  if (collapsed) {
    // Collapsed mode - chỉ hiển thị trên desktop
    return (
      <div className={`fixed left-0 top-[80px] h-[calc(100vh-80px)] w-[80px] bg-white shadow-lg overflow-y-auto z-10 ${className}`}>
        <div className="p-2 space-y-2">
          {specialMenuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleMenuClick(item.key)}
              className="w-full p-2 hover:bg-gray-100 rounded-lg transition-colors group relative"
              title={item.label}
            >
              <img src={item.image} alt={item.label} className="w-8 h-8 mx-auto object-contain" />
              {/* Tooltip on hover */}
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {item.label}
              </div>
            </button>
          ))}
          
          <div className="h-px bg-gray-200 my-3" />
          
          {gameCategories.map((category) => (
            <button
              key={category.key}
              onClick={() => handleMenuClick(category.key)}
              className={`
                w-full p-2 rounded-lg transition-all group relative
                ${activeGame === category.key 
                  ? 'bg-[#D30102] bg-opacity-10 text-[#D30102]' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-[#D30102]'
                }
              `}
              title={category.label}
            >
              <Icon icon={category.icon} className="w-7 h-7 mx-auto" />
              {/* Tooltip on hover */}
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
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
      fixed left-0 top-[80px] h-[calc(100vh-80px)] w-[280px] bg-white shadow-lg overflow-y-auto z-30
      transition-transform duration-300 ease-in-out
      ${className}
    `}>
      
      {/* Banner */}
      <div className="p-4">
        <img 
          src="/banner-yua.webp" 
          alt="VUA MIKAMI Banner" 
          className="w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => console.log('Banner clicked')}
        />
      </div>

      {/* Special menu items */}
      <div className="px-4 space-y-2">
        {specialMenuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => handleMenuClick(item.key)}
            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <img src={item.image} alt={item.label} className="w-8 h-8 object-contain" />
            <span className="font-medium text-[17px]" style={{ fontFamily: 'Tahoma, "Microsoft Sans Serif", Arial, sans-serif', color: '#B2C0D1' }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <div className="h-px bg-gray-200 my-4 mx-4" />

      {/* Game categories */}
      <div className="px-4 pb-4 space-y-2">
        {gameCategories.map((category) => (
          <button
            key={category.key}
            onClick={() => handleMenuClick(category.key)}
            className={`
              w-full flex items-center gap-3 p-3 rounded-lg transition-all
              ${activeGame === category.key 
                ? 'bg-[#D30102] bg-opacity-10 text-[#D30102] font-bold border-l-4 border-[#D30102]' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-[#D30102] font-medium'
              }
            `}
          >
            <Icon icon={category.icon} className="w-6 h-6" />
            <span className="text-[17px]" style={{ fontFamily: 'Tahoma, "Microsoft Sans Serif", Arial, sans-serif' }}>
              {category.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

