import { useState } from 'react';

const Tooltip = ({ 
  children, 
  title,
  placement = 'top', // 'top' | 'bottom' | 'left' | 'right'
  className = '',
}) => {
  const [visible, setVisible] = useState(false);

  if (!title) return children;

  const placementClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-900',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-900',
  };

  return (
    <div 
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      
      {visible && (
        <div 
          className={`absolute z-50 ${placementClasses[placement]} animate-in fade-in duration-150`}
        >
          <div className="bg-gray-900 text-white text-sm px-3 py-1.5 rounded whitespace-nowrap">
            {title}
            <div className={`absolute ${arrowClasses[placement]} w-0 h-0 border-4 border-transparent`} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;

