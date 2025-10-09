import { useState, useEffect, useCallback } from 'react';

const Carousel = ({ 
  children,
  autoplay = false,
  autoplaySpeed = 3000,
  dots = true,
  arrows = false,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = Array.isArray(children) ? children : [children];
  const totalSlides = slides.length;

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay
  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(goToNext, autoplaySpeed);
    return () => clearInterval(interval);
  }, [autoplay, autoplaySpeed, goToNext]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Slides */}
      <div className="relative w-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0 absolute inset-0'
            }`}
          >
            {slide}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {arrows && totalSlides > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {dots && totalSlides > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white w-8' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;

