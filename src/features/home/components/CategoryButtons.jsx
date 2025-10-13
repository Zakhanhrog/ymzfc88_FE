import { Icon } from '@iconify/react';

const CategoryButtons = () => {
  const categories = [
    { id: 'calendar', icon: 'mdi:play-circle', label: 'Lịch' },
    { id: 'sports', icon: 'mdi:soccer', label: 'THỂ THAO' },
    { id: 'casino', icon: 'mdi:cards-playing', label: 'SÒNG BÀI' },
    { id: 'cockfight', icon: 'game-icons:rooster', label: 'ĐÁ GÀ' },
    { id: 'slots', icon: 'mdi:slot-machine', label: 'SLOTS' },
    { id: 'card-games', icon: 'mdi:cards', label: 'GAME BÀI' },
  ];

  const handleCategoryClick = (categoryId) => {
  };

  return (
    <div className="mb-1 px-2 hidden">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="flex-shrink-0 bg-white rounded-full px-4 py-2 active:scale-95 transition-transform duration-150 border border-gray-200"
          >
            <div className="flex items-center gap-1.5">
              <Icon icon={category.icon} className="text-lg text-gray-400" />
              <span className="font-normal text-gray-500 whitespace-nowrap text-xs">{category.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryButtons;

