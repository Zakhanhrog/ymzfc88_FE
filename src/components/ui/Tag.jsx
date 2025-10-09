const Tag = ({ 
  children,
  color = 'default',
  closable = false,
  onClose,
  className = '',
}) => {
  const colorClasses = {
    default: 'bg-gray-100 text-gray-800 border-gray-300',
    primary: 'bg-[#D30102] bg-opacity-10 text-[#D30102] border-[#D30102]',
    success: 'bg-green-100 text-green-800 border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    blue: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  return (
    <span 
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-sm font-medium border rounded ${colorClasses[color]} ${className}`}
    >
      {children}
      {closable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          className="ml-1 hover:opacity-70 transition-opacity"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </span>
  );
};

export default Tag;

