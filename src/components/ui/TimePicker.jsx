import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Clock } from 'lucide-react';

dayjs.extend(customParseFormat);

const TimePicker = ({ 
  value,
  onChange,
  format = 'HH:mm',
  disabled = false,
  className = '',
  minuteStep = 1,
}) => {
  const [timeValue, setTimeValue] = useState('');

  useEffect(() => {
    if (value) {
      // Check if value is already a dayjs object (has isValid method)
      const time = (value && typeof value.isValid === 'function') ? value : dayjs(value, format);
      if (time.isValid()) {
        setTimeValue(time.format('HH:mm'));
      } else {
        setTimeValue('');
      }
    } else {
      setTimeValue('');
    }
  }, [value, format]);

  const handleChange = (e) => {
    const newTime = e.target.value;
    setTimeValue(newTime);
    if (newTime) {
      const [hours, minutes] = newTime.split(':');
      const dayjsTime = dayjs().hour(parseInt(hours)).minute(parseInt(minutes));
      onChange?.(dayjsTime);
    } else {
      onChange?.(null);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <Clock className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="time"
        value={timeValue}
        onChange={handleChange}
        disabled={disabled}
        step={minuteStep * 60}
        className="w-full h-10 pl-10 pr-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  );
};

export default TimePicker;

