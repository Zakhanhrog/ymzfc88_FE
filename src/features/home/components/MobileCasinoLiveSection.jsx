import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import liveCasinoGames from '../../casino/data/liveCasinoGames';

const MobileCasinoLiveSection = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Tự động chuyển thẻ sau 15 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % liveCasinoGames.length);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleGameClick = (gameId) => {
    // Handle game click - có thể navigate hoặc mở game
    console.log('Game clicked:', gameId);
    // navigate(`/casino/${gameId}`);
  };

  return (
    <div className="px-0 pt-4 pb-2 md:hidden">
      {/* Title */}
      <div className="px-0 mb-2">
        <div className="flex items-center justify-between px-0">
            <div className="flex items-center">
            <div className="pl-2 pr-8 py-2 rounded-md bg-gradient-to-r from-green-400 via-green-200 to-transparent flex items-center relative">
              <span className="absolute left-0 w-1 h-5 bg-green-300 rounded-r-md"></span>
              <span className="relative pl-1 flex items-center gap-1.5">
                <span className="text-xs text-white font-bold bg-red-600 px-1.5 py-0.5 rounded">LIVE</span>
                <h2 className="text-base font-black text-gray-800 uppercase relative z-10 tracking-wide font-oswald" style={{ fontWeight: 900 }}>
                  Casino Trực Tiếp
                </h2>
              </span>
            </div>
          </div>
            <button
              type="button"
              onClick={() => navigate('/casino/live')}
              className="text-xs font-semibold text-green-600 hover:text-green-700 transition-colors"
            >
              Xem tất cả
            </button>
        </div>
      </div>

      {/* Game Card - Chỉ hiển thị 1 thẻ tại một thời điểm */}
      <div className="px-0">
        <div className="relative w-full">
          {/* Container để bo góc các thẻ game */}
          <div className="relative w-full">
            {liveCasinoGames.map((game, index) => (
              <button
                key={game.id}
                onClick={() => handleGameClick(game.id)}
                className={`w-full transition-opacity duration-500 ${
                  index === currentIndex ? 'opacity-100 z-10 block' : 'opacity-0 z-0 hidden'
                }`}
              >
                {/* Game Image - hiển thị ảnh tự nhiên không bị cắt */}
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-auto rounded-xl"
                />
              </button>
            ))}
            
            {/* Dots indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {liveCasinoGames.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'bg-white w-6' 
                      : 'bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileCasinoLiveSection;

