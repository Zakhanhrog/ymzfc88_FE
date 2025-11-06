const Loading = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-2',
  };

  return (
    <div className={`flex justify-center items-center py-8 ${className}`}>
      <div className={`${sizeClasses[size]} border-green-500 border-t-transparent rounded-full animate-spin`} />
    </div>
  );
};

export default Loading;
