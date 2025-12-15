import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MonthPicker = ({ 
  value,
  onChange,
  placeholder = 'Chọn tháng',
  format = 'YYYY-MM',
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value ? dayjs(value).format(format) : '');
  const pickerRef = useRef(null);

  useEffect(() => {
    if (value) {
      setInputValue(dayjs(value).format(format));
    } else {
      setInputValue('');
    }
  }, [value, format]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleMonthSelect = (month, year) => {
    const selected = dayjs().year(year).month(month).startOf('month');
    onChange?.(selected);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.(null);
    setInputValue('');
  };

  const today = dayjs();
  const selectedDate = value ? dayjs(value) : today;
  const currentYear = selectedDate.year();
  const currentMonth = selectedDate.month();

  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const handlePrevYear = () => {
    const newDate = selectedDate.subtract(1, 'year');
    onChange?.(newDate);
  };

  const handleNextYear = () => {
    const newDate = selectedDate.add(1, 'year');
    onChange?.(newDate);
  };

  return (
    <div ref={pickerRef} className={`relative ${className}`}>
      <input
        type="text"
        value={inputValue}
        readOnly
        onClick={() => !disabled && setIsOpen(!isOpen)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-2 
          border border-transparent rounded-lg 
          bg-white px-3 py-2 text-sm
          transition-all duration-200
          focus:outline-none
          disabled:bg-gray-100 disabled:cursor-not-allowed
          cursor-pointer
        `}
      />
      
      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[280px]">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevYear}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-sm font-semibold">
              {currentYear}
            </div>
            <button
              type="button"
              onClick={handleNextYear}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => {
              const isSelected = currentMonth === index;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleMonthSelect(index, currentYear)}
                  className={`
                    px-3 py-2 text-sm rounded
                    ${isSelected ? 'bg-[#4CAF50] text-white font-semibold' : 'hover:bg-gray-100 text-gray-900'}
                  `}
                >
                  {month}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-end pt-3 border-t">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Xóa
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthPicker;

