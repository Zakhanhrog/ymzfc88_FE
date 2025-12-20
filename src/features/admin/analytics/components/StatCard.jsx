const StatCard = ({ 
  title, 
  value, 
  subtitle,
  icon: Icon,
  valueColor = 'text-white', 
  bgColor = 'bg-gray-600', 
  textColor = 'text-white' 
}) => {
  return (
    <div 
      className={`${bgColor} rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200 w-full relative overflow-hidden`}
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {Icon && (
        <div className="absolute top-3 right-3 opacity-20">
          <Icon className="h-8 w-8 text-white" />
        </div>
      )}
      <div className="relative">
      <div 
          className={`text-xs font-semibold ${textColor} mb-1 leading-relaxed`}
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontWeight: 600,
        }}
      >
        {title}
      </div>
      <div 
          className={`text-lg font-bold ${valueColor} leading-tight mb-1`}
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontWeight: 700,
        }}
      >
        {value}
        </div>
        {subtitle && (
          <div 
            className={`text-xs ${textColor} opacity-80 leading-tight`}
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
