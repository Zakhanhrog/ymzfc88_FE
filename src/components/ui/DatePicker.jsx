import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';

const DatePicker = ({ 
  value,
  onChange,
  placeholder = 'Chọn ngày',
  format = 'DD/MM/YYYY',
  disabled = false,
  className = '',
  bordered = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value ? dayjs(value).format(format) : '');
  const pickerRef = useRef(null);
  const inputRef = useRef(null);

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

  const handleDateSelect = (date) => {
    onChange?.(date);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.(null);
    setInputValue('');
  };

  const today = dayjs();
  const selectedDate = value ? dayjs(value) : null;

  const generateCalendar = () => {
    const startOfMonth = selectedDate ? selectedDate.startOf('month') : today.startOf('month');
    const daysInMonth = startOfMonth.daysInMonth();
    const firstDayOfWeek = startOfMonth.day();
    const days = [];

    // Days of previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: startOfMonth.subtract(i + 1, 'day'),
        isCurrentMonth: false,
      });
    }

    // Days of current month
    for (let i = 0; i < daysInMonth; i++) {
      days.push({
        date: startOfMonth.add(i, 'day'),
        isCurrentMonth: true,
      });
    }

    // Fill remaining days to complete 6 weeks
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: startOfMonth.add(daysInMonth + i - 1, 'day'),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const calendarDays = generateCalendar();
  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const currentMonth = selectedDate ? selectedDate : today;

  const handlePrevMonth = () => {
    const newDate = currentMonth.subtract(1, 'month');
    onChange?.(newDate.toDate());
  };

  const handleNextMonth = () => {
    const newDate = currentMonth.add(1, 'month');
    onChange?.(newDate.toDate());
  };

  const handleToday = () => {
    onChange?.(today.toDate());
  };

  return (
    <div ref={pickerRef} className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        readOnly
        onClick={() => !disabled && setIsOpen(!isOpen)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-2 
          border ${bordered ? 'border-gray-200 hover:border-gray-300 focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/10' : 'border-transparent'} rounded-lg 
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
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-sm font-semibold">
              {months[currentMonth.month()]} {currentMonth.year()}
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-xs text-center text-gray-500 font-medium py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((dayItem, index) => {
              const isSelected = selectedDate && dayItem.date.isSame(selectedDate, 'day');
              const isToday = dayItem.date.isSame(today, 'day');

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDateSelect(dayItem.date.toDate())}
                  className={`
                    aspect-square text-sm rounded
                    ${dayItem.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                    ${isSelected ? 'bg-[#4CAF50] text-white font-semibold' : 'hover:bg-gray-100'}
                    ${isToday && !isSelected ? 'ring-2 ring-[#4CAF50]' : ''}
                  `}
                >
                  {dayItem.date.date()}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between pt-3 border-t">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Xóa
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="text-xs text-[#4CAF50] hover:text-[#45a049] font-medium"
            >
              Hôm nay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
