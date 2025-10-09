const Badge = ({ 
  children,
  count,
  dot = false,
  color = 'red',
  showZero = false,
  offset,
  className = '',
}) => {
  const colorClasses = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    gray: 'bg-gray-500',
  };

  const shouldShow = dot || (count !== undefined && (count > 0 || showZero));
  
  if (!shouldShow) return children;

  const offsetStyle = offset ? {
    transform: `translate(${offset[0]}px, ${offset[1]}px)`
  } : {};

  return (
    <div className={`relative inline-flex ${className}`}>
      {children}
      {dot ? (
        <span 
          className={`absolute top-0 right-0 block h-2 w-2 rounded-full ${colorClasses[color]} ring-2 ring-white`}
          style={offsetStyle}
        />
      ) : (
        <span 
          className={`absolute -top-2 -right-2 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white ${colorClasses[color]} rounded-full ring-2 ring-white`}
          style={offsetStyle}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  );
};

export default Badge;

