const Card = ({ 
  children, 
  title,
  extra,
  className = '',
  bodyClassName = '',
  headerClassName = '',
  bordered = true,
  hoverable = false,
  onClick,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg overflow-hidden';
  const borderClasses = bordered ? 'border border-gray-200' : '';
  const hoverClasses = hoverable ? 'hover:shadow-lg transition-shadow duration-300 cursor-pointer' : 'shadow-sm';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div 
      className={`${baseClasses} ${borderClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {title && (
        <div className={`px-6 py-4 border-b border-gray-200 flex items-center justify-between ${headerClassName}`}>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {extra && <div>{extra}</div>}
        </div>
      )}
      
      <div className={`p-6 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;

