import { useState, useRef } from 'react';
import { Icon } from '@iconify/react';

const LotteryCarousel = ({ games, regionName, maxVisible, onGameSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  // Chỉ hiển thị carousel nếu số lượng games vượt quá maxVisible
  const shouldShowCarousel = games.length > maxVisible;

  const nextSlide = () => {
    if (currentIndex < games.length - maxVisible) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (!shouldShowCarousel) {
    // Nếu không cần carousel, hiển thị grid bình thường
    return (
      <div className="grid gap-1 h-full" style={{ gridTemplateColumns: `repeat(${maxVisible}, 1fr)` }}>
        {games.map((game) => (
          <div
            key={game.id}
            className="group cursor-pointer transition-all duration-300 transform  relative overflow-hidden rounded-lg shadow-none hover:shadow-[0_0_30px_rgba(211,1,2,0.5)] p-0 bg-white rounded-lg h-full"
            onClick={() => onGameSelect(game.id)}
          >
            <img
              src={game.image}
              alt={game.name}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        ))}
      </div>
    );
  }

  // Tính toán số slide tối đa
  const maxSlides = games.length - maxVisible + 1;

  return (
    <div className="relative h-full overflow-hidden">
      {/* Carousel Container */}
      <div 
        ref={carouselRef}
        className="flex transition-transform duration-300 ease-in-out h-full"
        style={{ 
          transform: `translateX(-${currentIndex * (100 / maxVisible)}%)`,
          width: `${(games.length / maxVisible) * 100}%`
        }}
      >
        {games.map((game, index) => (
          <div
            key={game.id}
            className="flex-shrink-0 h-full"
            style={{ width: `${100 / games.length}%` }}
          >
            <div className="h-full px-0.5">
              <div
                className="group cursor-pointer transition-all duration-300 transform  relative overflow-hidden rounded-lg shadow-none hover:shadow-[0_0_30px_rgba(211,1,2,0.5)] p-0 bg-white rounded-lg h-full"
                onClick={() => onGameSelect(game.id)}
              >
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {maxSlides > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
              currentIndex === 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl'
            }`}
          >
            <Icon icon="mdi:chevron-left" className="text-lg" />
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxSlides - 1}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
              currentIndex >= maxSlides - 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl'
            }`}
          >
            <Icon icon="mdi:chevron-right" className="text-lg" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {maxSlides > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
          {Array.from({ length: maxSlides }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-red-500' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LotteryCarousel;
