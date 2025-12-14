const StatCard = ({ title, value, valueColor = 'text-white', bgColor = 'bg-gray-600', textColor = 'text-white' }) => {
  return (
    <div 
      className={`${bgColor} rounded-2xl px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200 text-center w-full`}
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
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
        className={`text-base font-bold ${valueColor} leading-tight`}
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontWeight: 700,
        }}
      >
        {value}
      </div>
    </div>
  );
};

export default StatCard;
