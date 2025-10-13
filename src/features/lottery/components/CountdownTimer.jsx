import { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // 18:30 chiều hôm nay
      const targetTime = new Date(today.getTime() + 18 * 60 * 60 * 1000 + 30 * 60 * 1000);
      
      // Nếu đã qua 18:30 thì tính đến 18:30 ngày mai
      if (now >= targetTime) {
        targetTime.setDate(targetTime.getDate() + 1);
      }
      
      const difference = targetTime - now;
      
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        return { hours, minutes, seconds };
      }
      
      return { hours: 0, minutes: 0, seconds: 0 };
    };

    const updateTimer = () => {
      setTimeLeft(calculateTimeLeft());
    };

    // Update immediately
    updateTimer();
    
    // Update every second
    const timer = setInterval(updateTimer, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const formatTime = (num) => num.toString().padStart(2, '0');

  return (
    <div className="bg-white px-3 py-2 rounded-lg shadow-sm">
      {/* Mobile: Inline layout */}
      <div className="md:hidden flex items-center gap-2">
        <span className="text-xs text-gray-600">Còn lại</span>
        <div className="flex items-center gap-1">
          <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-mono font-bold">
            {formatTime(timeLeft.hours)}
          </div>
          <span className="text-red-600 font-bold">:</span>
          <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-mono font-bold">
            {formatTime(timeLeft.minutes)}
          </div>
          <span className="text-red-600 font-bold">:</span>
          <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-mono font-bold">
            {formatTime(timeLeft.seconds)}
          </div>
        </div>
      </div>
      
      {/* Desktop: Centered layout */}
      <div className="hidden md:block">
        <div className="text-xs text-gray-600 mb-1 text-center">Còn lại</div>
        <div className="flex items-center justify-center gap-1">
          <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-mono font-bold">
            {formatTime(timeLeft.hours)}
          </div>
          <span className="text-red-600 font-bold">:</span>
          <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-mono font-bold">
            {formatTime(timeLeft.minutes)}
          </div>
          <span className="text-red-600 font-bold">:</span>
          <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-mono font-bold">
            {formatTime(timeLeft.seconds)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
