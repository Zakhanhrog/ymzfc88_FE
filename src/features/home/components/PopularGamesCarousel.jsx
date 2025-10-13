import { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';

const PopularGamesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // Game images data
  const gameImages = [
    '/images/games/gamephobien/imgi_7_25e25786-cd43-42a4-83eb-b6632bc87916.png',
    '/images/games/gamephobien/imgi_8_175208d4-8a6d-4047-8411-e814eb3a8173.png',
    '/images/games/gamephobien/imgi_9_b7342ee5-ea0b-4f47-8213-2567022d8d77.png',
    '/images/games/gamephobien/imgi_10_33b456e9-aacb-4969-b023-a032f11f0285.png',
    '/images/games/gamephobien/imgi_11_8db3f431-f268-4f1a-97be-c9c50a97b746.png',
    '/images/games/gamephobien/imgi_12_8c556842-fd16-47ab-b913-59293a01f920.png',
    '/images/games/gamephobien/imgi_13_598cf8e6-6719-4892-b19f-7c7dce9c668e.png',
    '/images/games/gamephobien/imgi_14_1cf73dcc-3418-45f3-8168-a0c60356044d.png',
    '/images/games/gamephobien/imgi_15_b9bd8ed8-4fa7-464d-b7c1-8a053b9eba6d.png',
    '/images/games/gamephobien/imgi_16_17de59db-6aa5-4d5d-8044-afd66e5a4f72.png',
    '/images/games/gamephobien/imgi_17_8d1e6090-b826-49b1-9b68-c826509ba573.png'
  ];

  const itemsPerView = 6; // Show 6 items at a time
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
    <div className="w-full bg-gray-100 py-6">
      <div className="w-full px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Arial, sans-serif' }}>
              Trò chơi phổ biến
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
                className="flex-shrink-0 w-[calc((100%-40px)/6)] h-[calc((100%-40px)/6)] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
              >
                <img
                  src={image}
                  alt={`Game ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PopularGamesCarousel;
