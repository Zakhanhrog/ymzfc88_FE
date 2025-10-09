import { useState, useRef, useEffect } from 'react';

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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectRef = useRef(null);

  const currentValue = value !== undefined ? value : internalValue;
  const selectedOption = options.find(opt => opt.value === currentValue);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    md: 'px-4 py-2 text-base h-10',
    lg: 'px-4 py-3 text-lg h-12',
  };

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-2 
          border border-gray-300 rounded-lg 
          bg-white transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-[#D30102] focus:border-[#D30102]
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${sizeClasses[size]}
        `}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
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

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <button
              key={option.value ?? index}
              type="button"
              onClick={() => handleSelect(option)}
              disabled={option.disabled}
              className={`
                w-full text-left px-4 py-2 transition-colors
                ${currentValue === option.value ? 'bg-[#D30102] bg-opacity-10 text-[#D30102] font-medium' : 'text-gray-900 hover:bg-gray-50'}
                ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;

