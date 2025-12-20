import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const Select = ({ 
  value,
  defaultValue,
  onChange,
  options = [],
  placeholder = 'Chọn...',
  disabled = false,
  size = 'md',
  className = '',
  allowClear = false,
  bordered = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0, placement: 'bottom' });
  const selectRef = useRef(null);
  const dropdownRef = useRef(null);

  const currentValue = value !== undefined ? value : internalValue;
  const selectedOption = options.find(opt => opt.value === currentValue);

  useEffect(() => {
    const updateDropdownPosition = () => {
      if (!selectRef.current || !isOpen) return;
      
      const rect = selectRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 240; // max-h-60 = 240px
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;
      
      let placement = 'bottom';
      let top = rect.bottom + scrollY + 4; // mt-1 = 4px
      
      // Nếu không đủ không gian bên dưới và có đủ không gian bên trên, hiển thị lên trên
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        placement = 'top';
        top = rect.top + scrollY - dropdownHeight - 4; // mb-1 = 4px
      }
      
      setDropdownPosition({
        top,
        left: rect.left + scrollX,
        width: rect.width,
        placement
      });
    };

    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      updateDropdownPosition();
      
      // Update position on scroll and resize
      window.addEventListener('scroll', updateDropdownPosition, true);
      window.addEventListener('resize', updateDropdownPosition);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updateDropdownPosition, true);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [isOpen]);

  const handleSelect = (option) => {
    const newValue = option.value;
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue, option);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (value === undefined) {
      setInternalValue(undefined);
    }
    onChange?.(undefined);
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-4 py-2 text-sm h-10',
    lg: 'px-4 py-3 text-sm h-12',
  };

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-2 
          border ${bordered ? 'border-gray-200 hover:border-gray-300 focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/10' : 'border-transparent'} rounded-lg 
          bg-white transition-all duration-200
          focus:outline-none
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${sizeClasses[size]}
        `}
      >
        <span className={`text-sm ${selectedOption ? 'text-gray-900' : 'text-gray-400'}`}>
          {selectedOption?.label || placeholder}
        </span>
        
        <div className="flex items-center gap-1">
          {allowClear && currentValue !== undefined && (
            <svg 
              onClick={handleClear}
              className="w-4 h-4 text-gray-400 hover:text-gray-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
          }}
        >
          {options.map((option, index) => (
            <button
              key={option.value ?? index}
              type="button"
              onClick={() => handleSelect(option)}
              disabled={option.disabled}
              className={`
                w-full text-left px-4 py-2 text-sm transition-colors
                ${currentValue === option.value ? 'bg-[#4CAF50] bg-opacity-10 text-[#4CAF50] font-medium' : 'text-gray-900 hover:bg-gray-50'}
                ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

export default Select;

