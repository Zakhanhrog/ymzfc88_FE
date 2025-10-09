import { useState, useRef, useEffect } from 'react';

const Dropdown = ({ 
  trigger = 'click', // 'click' | 'hover'
  placement = 'bottom-end', // 'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end'
  children,
  overlay,
  disabled = false,
  className = '',
  onVisibleChange, // Callback when visibility changes
}) => {
  const [visible, setVisible] = useState(false);
  const dropdownRef = useRef(null);

  // Notify parent when visibility changes
  useEffect(() => {
    onVisibleChange?.(visible);
  }, [visible, onVisibleChange]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setVisible(false);
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible]);

  const handleTriggerClick = () => {
    if (trigger === 'click' && !disabled) {
      setVisible(!visible);
    }
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover' && !disabled) {
      setVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover' && !disabled) {
      setVisible(false);
    }
  };

  const placementClasses = {
    'bottom': 'top-full left-1/2 -translate-x-1/2 mt-2',
    'bottom-start': 'top-full left-0 mt-2',
    'bottom-end': 'top-full right-0 mt-2',
    'top': 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    'top-start': 'bottom-full left-0 mb-2',
    'top-end': 'bottom-full right-0 mb-2',
  };

  return (
    <div 
      ref={dropdownRef}
      className={`relative inline-block ${className}`}
      onClick={handleTriggerClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {visible && (
        <div 
          className={`absolute z-50 ${placementClasses[placement]} animate-in fade-in duration-150`}
        >
          {overlay}
        </div>
      )}
    </div>
  );
};

// Dropdown.Menu - For menu items
export const DropdownMenu = ({ items, onClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]">
      {items.map((item, index) => (
        <div key={index}>
          {item.divider ? (
            <div className="h-px bg-gray-200 my-1" />
          ) : (
            <button
              onClick={() => onClick?.(item)}
              disabled={item.disabled}
              className={`w-full text-left px-4 py-2 text-sm transition-colors
                ${item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-100'}
                ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center gap-2">
                {item.icon && <span className="text-lg">{item.icon}</span>}
                <span>{item.label}</span>
              </div>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Dropdown;

