import { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';

const CategoryGameSection = ({ title, gameImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const itemsPerView = 4; // Show 4 items at a time
  const maxIndex = Math.max(0, gameImages.length - itemsPerView);

  const scrollToIndex = (index) => {
    if (scrollContainerRef.current) {
      // Get the actual width of a game item dynamically
      const firstItem = scrollContainerRef.current.children[0];
      if (firstItem) {
        const itemWidth = firstItem.offsetWidth + 8; // item width + gap-2 (8px)
        const scrollLeft = index * itemWidth;
        scrollContainerRef.current.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = Math.min(maxIndex, currentIndex + 1);
    scrollToIndex(newIndex);
  };

  const updateCurrentIndex = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const firstItem = scrollContainerRef.current.children[0];
      if (firstItem) {
        const itemWidth = firstItem.offsetWidth + 8; // item width + gap
        setCurrentIndex(Math.round(scrollLeft / itemWidth));
      }
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateCurrentIndex);
      return () => scrollContainer.removeEventListener('scroll', updateCurrentIndex);
    }
  }, []);

  return (
    <div className="w-full bg-gray-100 py-4">
      <div className="w-full px-6 pb-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Arial, sans-serif' }}>
              {title}
            </h2>
            
            {/* Navigation Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Icon icon="mdi:chevron-left" className="text-gray-600" />
              </button>
              
              <button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Icon icon="mdi:chevron-right" className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* View Details Button */}
          <button className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors" style={{ fontFamily: 'Arial, sans-serif' }}>
            Xem chi tiết
          </button>
        </div>

        {/* Games Carousel */}
        <div className="relative w-full">
          <div 
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-hidden scrollbar-hide w-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={updateCurrentIndex}
          >
            {gameImages.map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[calc((100%-28px)/4)] aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group relative"
              >
                <img
                  src={image}
                  alt={`${title} Game ${index + 1}`}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                {/* Hover overlay with play icon and text */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex flex-col items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center">
                    {/* Dark overlay for play button */}
                    <div className="bg-gray-900 bg-opacity-95 rounded-lg p-3 mb-2">
                      <img 
                        src="/images/icons/playicon.jpeg" 
                        alt="Play" 
                        className="w-8 h-8 rounded-full"
                      />
                    </div>
                    {/* Play text */}
                    <span className="text-white font-medium text-sm" style={{ fontFamily: 'Arial, sans-serif' }}>
                      Chơi Ngay
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CategoryGameSection;
