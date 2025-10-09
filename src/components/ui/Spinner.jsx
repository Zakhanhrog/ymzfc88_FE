const Spinner = ({ 
  size = 'md',
  color = 'primary',
  tip,
  fullScreen = false,
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4 border-2',
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  const colorClasses = {
    primary: 'border-[#D30102] border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-600 border-t-transparent',
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`} />
      {tip && <p className="text-sm text-gray-600">{tip}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Spinner;

