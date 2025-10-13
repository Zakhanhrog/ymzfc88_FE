import { useState } from 'react';
import { Icon } from '@iconify/react';

const CategoryNavigation = () => {
  const [activeCategory, setActiveCategory] = useState('HOT');

  // Game categories from sidebar
  const categories = [
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
    { key: 'app', label: 'APP', icon: 'mdi:cellphone' }
  ];

  const handleCategoryClick = (categoryKey) => {
    setActiveCategory(categoryKey);
    // Handle category navigation logic here
  };

  return (
    <div className="px-0 pt-1 pb-1 md:hidden">
      <div className="flex gap-1 overflow-x-auto">
        {categories.map((category, index) => (
          <div key={category.key} className="flex items-center">
            <button
              onClick={() => handleCategoryClick(category.key)}
              className={`flex items-center gap-1 min-w-0 flex-shrink-0 transition-all duration-200 ${
                activeCategory === category.key 
                  ? 'bg-white rounded-xl px-2 py-2 shadow-sm' 
                  : 'px-1 py-1'
              }`}
            >
              {/* Icon */}
              <Icon 
                icon={category.icon} 
                className={`w-4 h-4 ${
                  activeCategory === category.key ? 'text-gray-700' : 'text-gray-400'
                }`} 
              />
              
              {/* Label */}
              <span className={`text-xs font-medium whitespace-nowrap ${
                activeCategory === category.key ? 'text-gray-700' : 'text-gray-400'
              }`}>
                {category.label}
              </span>
            </button>
            
            {/* Arrow - chỉ hiển thị nếu không phải mục cuối */}
            {index < categories.length - 1 && (
              <Icon 
                icon="mdi:chevron-right" 
                className="w-3 h-3 text-gray-400 mx-0.5" 
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryNavigation;
