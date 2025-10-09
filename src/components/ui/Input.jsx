import { forwardRef } from 'react';

const Input = forwardRef(({ 
  type = 'text',
  label,
  error,
  helper,
  prefix,
  suffix,
  size = 'md',
  disabled = false,
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-4 py-2 text-base h-10',
    lg: 'px-4 py-3 text-lg h-12',
  };

  const baseClasses = 'w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D30102] focus:border-[#D30102] disabled:bg-gray-100 disabled:cursor-not-allowed';
  
  const errorClasses = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300';
  
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      
      <div className="relative">
        {prefix && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {prefix}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          className={`${baseClasses} ${errorClasses} ${sizeClass} ${prefix ? 'pl-10' : ''} ${suffix ? 'pr-10' : ''} ${className}`}
          {...props}
        />
        
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {suffix}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
      
      {helper && !error && (
        <p className="mt-1.5 text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

