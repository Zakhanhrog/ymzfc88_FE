import { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';

const MobileCategoryGameSection = ({ title, gameImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const itemsPerView = 3; // Show 3 items at a time on mobile
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
    <div className="w-full pt-0.5 pb-0 mb-0.5">
      <div className="w-full px-0 pb-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 px-0">
          <div className="flex items-center gap-2 px-0">
            <h2 className="text-base font-black text-gray-800 pl-2 pr-8 py-2 rounded-md bg-gradient-to-r from-green-400 via-green-200 to-transparent uppercase relative flex items-center tracking-wide font-oswald" style={{ fontWeight: 900, fontFamily: "'Oswald', sans-serif" }}>
              <span className="absolute left-0 w-1 h-5 bg-green-300 rounded-r-md"></span>
              <span className="relative pl-1" style={{ fontFamily: "'Oswald', sans-serif" }}>{title}</span>
            </h2>
            
            {/* Navigation Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="w-6 h-6 bg-white rounded-none flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Icon icon="mdi:chevron-left" className="text-gray-600 text-base" />
              </button>
              
              <button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className="w-6 h-6 bg-white rounded-none flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Icon icon="mdi:chevron-right" className="text-gray-600 text-base" />
              </button>
            </div>
          </div>

          {/* View Details Button */}
          <button className="text-green-600 hover:text-green-700 text-xs font-medium transition-colors px-0">
            Xem chi tiết
          </button>
        </div>

        {/* Games Carousel */}
        <div className="relative w-full px-0">
          <div 
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-hidden scrollbar-hide w-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={updateCurrentIndex}
          >
            {gameImages.map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[calc((100%-16px)/3)] aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group relative"
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
                    <div className="bg-gray-900 bg-opacity-95 rounded-lg p-2 mb-1">
                      <img 
                        src="/images/icons/playicon.jpeg" 
                        alt="Play" 
                        className="w-6 h-6 rounded-full"
                      />
                    </div>
                    {/* Play text */}
                    <span className="text-white font-medium text-xs">
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

export default MobileCategoryGameSection;

