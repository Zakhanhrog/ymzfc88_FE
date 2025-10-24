import React, { useState, useEffect } from 'react';

const DynamicMarquee = ({ content, speed, textColor, backgroundColor, fontSize }) => {
  const [animationDuration, setAnimationDuration] = useState(50);

  useEffect(() => {
    // Công thức tính tốc độ mới:
    // speed: 10-200, duration: 2-30s
    // Tốc độ cao (170+) = duration thấp (2-5s)
    // Tốc độ thấp (10-50) = duration cao (20-30s)
    const duration = Math.max(2, Math.min(30, 35 - (speed * 0.15)));
    setAnimationDuration(duration);
  }, [speed]);

  return (
    <div
      style={{
        backgroundColor,
        color: textColor,
        fontSize: `${Math.max(12, fontSize - 2)}px`,
        borderRadius: '50px',
        padding: '4px 12px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        position: 'relative',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        width: '100%'
      }}
    >
      <div
        style={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          animation: `marquee ${animationDuration}s linear infinite`,
          willChange: 'transform'
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(100vw);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
};

export default DynamicMarquee;
