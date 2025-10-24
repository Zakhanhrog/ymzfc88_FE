import React, { useState } from 'react';

const WeekdayNavigation = ({ onDaySelect }) => {
  const [selectedDay, setSelectedDay] = useState('T6'); // Default to Friday

  const days = [
    { key: 'T2', label: 'T2' },
    { key: 'T3', label: 'T3' },
    { key: 'T4', label: 'T4' },
    { key: 'T5', label: 'T5' },
    { key: 'T6', label: 'T6' },
    { key: 'T7', label: 'T7' },
    { key: 'CN', label: 'CN' }
  ];

  const handleDayClick = (dayKey) => {
    setSelectedDay(dayKey);
    if (onDaySelect) {
      onDaySelect(dayKey);
    }
  };

  return (
    <div className="flex gap-0 justify-center">
      {days.map((day) => (
        <button
          key={day.key}
          onClick={() => handleDayClick(day.key)}
          className={`px-1.5 py-1 rounded text-xs font-medium transition-colors ${
            selectedDay === day.key
              ? 'bg-red-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {day.label}
        </button>
      ))}
    </div>
  );
};

export default WeekdayNavigation;
