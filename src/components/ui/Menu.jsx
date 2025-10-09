import { useState } from 'react';

const Menu = ({ 
  items = [],
  selectedKeys = [],
  onClick,
  mode = 'vertical', // 'vertical' | 'horizontal'
  className = '',
}) => {
  const [openKeys, setOpenKeys] = useState([]);

  const handleItemClick = (item) => {
    if (!item.disabled && !item.children) {
      onClick?.({ key: item.key });
    }
  };

  const toggleSubmenu = (key) => {
    setOpenKeys(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const isSelected = (key) => selectedKeys.includes(key);
  const isOpen = (key) => openKeys.includes(key);

  const renderItem = (item) => {
    const hasChildren = item.children && item.children.length > 0;
    const selected = isSelected(item.key);
    const open = isOpen(item.key);

    if (hasChildren) {
      return (
        <div key={item.key} className="mb-1">
          <button
            onClick={() => toggleSubmenu(item.key)}
            className={`
              w-full flex items-center justify-between px-4 py-2.5 rounded-lg
              text-left font-medium transition-all duration-200
              ${selected ? 'bg-[#D30102] bg-opacity-10 text-[#D30102]' : 'text-gray-700 hover:bg-gray-100'}
              ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            disabled={item.disabled}
          >
            <div className="flex items-center gap-3">
              {item.icon && <span className="text-xl">{item.icon}</span>}
              <span>{item.label}</span>
            </div>
            <svg 
              className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {open && (
            <div className="ml-4 mt-1 space-y-1">
              {item.children.map(child => renderItem(child))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.key}
        onClick={() => handleItemClick(item)}
        disabled={item.disabled}
        className={`
          w-full flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1
          text-left font-medium transition-all duration-200
          ${selected ? 'bg-[#D30102] bg-opacity-10 text-[#D30102] border-l-4 border-[#D30102]' : 'text-gray-700 hover:bg-gray-100'}
          ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {item.icon && <span className="text-xl">{item.icon}</span>}
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <nav className={`${mode === 'horizontal' ? 'flex gap-2' : 'space-y-1'} ${className}`}>
      {items.map(item => renderItem(item))}
    </nav>
  );
};

// Menu.Item - Standalone menu item
export const MenuItem = ({ 
  icon, 
  children, 
  selected = false,
  disabled = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
        text-left font-medium transition-all duration-200
        ${selected ? 'bg-[#D30102] bg-opacity-10 text-[#D30102] border-l-4 border-[#D30102]' : 'text-gray-700 hover:bg-gray-100'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

// Menu.Divider
export const MenuDivider = ({ className = '' }) => {
  return <div className={`h-px bg-gray-200 my-2 ${className}`} />;
};

export default Menu;

