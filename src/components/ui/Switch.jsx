import { useState, useEffect } from 'react';

const Switch = ({
  checked = false,
  onChange,
  disabled = false,
  checkedChildren,
  unCheckedChildren,
  className = '',
  size = 'md'
}) => {
  const [internalChecked, setInternalChecked] = useState(checked);

  useEffect(() => {
    setInternalChecked(checked);
  }, [checked]);

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !internalChecked;
    setInternalChecked(newValue);
    onChange?.(newValue);
  };

  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-11 h-6',
    lg: 'w-14 h-7'
  };

  const thumbSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const translateClasses = {
    sm: internalChecked ? 'translate-x-[14px]' : 'translate-x-0.5',
    md: internalChecked ? 'translate-x-[22px]' : 'translate-x-0.5',
    lg: internalChecked ? 'translate-x-[28px]' : 'translate-x-0.5'
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={internalChecked}
      disabled={disabled}
      onClick={handleToggle}
      className={`
        ${sizeClasses[size]}
        relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${internalChecked ? 'bg-[#4CAF50]' : 'bg-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <span
        className={`
          ${thumbSizeClasses[size]}
          ${translateClasses[size]}
          pointer-events-none inline-block transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out
        `}
      />
      {(checkedChildren || unCheckedChildren) && (
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
          {internalChecked ? checkedChildren : unCheckedChildren}
        </span>
      )}
    </button>
  );
};

export default Switch;

