const Avatar = ({ 
  size = 'md',
  src,
  alt,
  icon,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-20 h-20 text-2xl',
  };

  const numericSize = typeof size === 'number' ? size : null;
  const sizeClass = numericSize ? '' : sizeClasses[size] || sizeClasses.md;
  const style = numericSize ? { width: `${size}px`, height: `${size}px` } : {};

  if (src) {
    return (
      <img
        src={src}
        alt={alt || 'Avatar'}
        className={`rounded-full object-cover ${sizeClass} ${className}`}
        style={style}
        {...props}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-gray-200 flex items-center justify-center text-gray-600 ${sizeClass} ${className}`}
      style={style}
      {...props}
    >
      {icon || (
        <svg className="w-1/2 h-1/2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      )}
    </div>
  );
};

export default Avatar;

