import { forwardRef } from 'react';

const buttonVariants = {
  primary: 'bg-[#D30102] hover:bg-[#B00001] text-white border-[#D30102]',
  secondary: 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300',
  outline: 'bg-transparent hover:bg-gray-50 text-gray-700 border-gray-300',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent',
  link: 'bg-transparent hover:underline text-[#D30102] border-transparent p-0',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-red-600',
  success: 'bg-green-600 hover:bg-green-700 text-white border-green-600',
};

const buttonSizes = {
  xs: 'px-2 py-1 text-xs h-6',
  sm: 'px-3 py-1.5 text-sm h-8',
  md: 'px-4 py-2 text-base h-10',
  lg: 'px-6 py-3 text-lg h-12',
  xl: 'px-8 py-4 text-xl h-14',
};

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  block = false,
  className = '',
  onClick,
  type = 'button',
  icon,
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D30102] disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = buttonVariants[variant] || buttonVariants.primary;
  const sizeClasses = buttonSizes[size] || buttonSizes.md;
  const blockClasses = block ? 'w-full' : '';
  
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${blockClasses} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;

