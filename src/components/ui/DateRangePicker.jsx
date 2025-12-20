import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import DatePicker from './DatePicker';

const DateRangePicker = ({ 
  value,
  onChange,
  placeholder = ['Từ ngày', 'Đến ngày'],
  format = 'DD/MM/YYYY',
  disabled = false,
  className = '',
  allowClear = true,
  bordered = false,
}) => {
  const getStartDate = () => {
    if (!value || !Array.isArray(value)) return null;
    return value[0] || null;
  };

  const getEndDate = () => {
    if (!value || !Array.isArray(value)) return null;
    return value[1] || null;
  };

  const [startDate, setStartDate] = useState(getStartDate());
  const [endDate, setEndDate] = useState(getEndDate());

  useEffect(() => {
    setStartDate(getStartDate());
    setEndDate(getEndDate());
  }, [value]);

  const handleStartDateChange = (date) => {
    const newStart = date;
    setStartDate(newStart);
    if (newStart && endDate && dayjs(newStart).isAfter(dayjs(endDate))) {
      setEndDate(null);
      onChange?.([newStart, null]);
    } else {
      onChange?.([newStart, endDate]);
    }
  };

  const handleEndDateChange = (date) => {
    const newEnd = date;
    setEndDate(newEnd);
    onChange?.([startDate, newEnd]);
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    onChange?.(null);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1">
        <DatePicker
          value={startDate}
          onChange={handleStartDateChange}
          placeholder={placeholder[0]}
          format={format}
          disabled={disabled}
          className="w-full"
          bordered={bordered}
        />
      </div>
      <span className="text-gray-400">-</span>
      <div className="flex-1">
        <DatePicker
          value={endDate}
          onChange={handleEndDateChange}
          placeholder={placeholder[1]}
          format={format}
          disabled={disabled}
          className="w-full"
          bordered={bordered}
        />
      </div>
      {allowClear && (startDate || endDate) && (
        <button
          type="button"
          onClick={handleClear}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          title="Xóa"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default DateRangePicker;
