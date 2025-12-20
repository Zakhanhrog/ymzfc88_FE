import React, { useState, useEffect } from 'react';

const Radio = ({ 
  value,
  checked,
  onChange,
  children,
  disabled = false,
  className = '',
}) => {
  return (
    <label className={`inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <input
        type="radio"
        checked={checked}
        onChange={(e) => {
          if (!disabled && onChange) {
            onChange(e);
          }
        }}
        disabled={disabled}
        className="sr-only"
      />
      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mr-2 ${
        checked 
          ? 'border-[#4CAF50] bg-[#4CAF50]' 
          : 'border-gray-300 bg-white'
      } ${disabled ? 'opacity-50' : ''}`}>
        {checked && (
          <span className="w-2 h-2 rounded-full bg-white" />
        )}
      </span>
      <span className="text-sm text-gray-700">{children}</span>
    </label>
  );
};

const RadioGroup = ({ 
  value,
  onChange,
  children,
  className = '',
  disabled = false,
}) => {
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleChange = (newValue) => {
    setSelectedValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {children.map((child, index) => {
        if (child.type === Radio || child.type === RadioButton) {
          return (
            <div key={index}>
              {React.cloneElement(child, {
                checked: selectedValue === child.props.value,
                onChange: (e) => {
                  if (!disabled) {
                    handleChange(child.props.value);
                  }
                },
                disabled: disabled || child.props.disabled,
              })}
            </div>
          );
        }
        return child;
      })}
    </div>
  );
};

const RadioButton = ({ 
  value,
  checked,
  onChange,
  children,
  disabled = false,
  className = '',
}) => {
  return (
    <label className={`
      inline-flex items-center justify-center px-4 py-2 border rounded-lg cursor-pointer transition-colors
      ${checked 
        ? 'border-[#4CAF50] bg-[#4CAF50] bg-opacity-10 text-[#4CAF50] font-medium' 
        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
      }
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      ${className}
    `}>
      <input
        type="radio"
        checked={checked}
        onChange={(e) => {
          if (!disabled && onChange) {
            onChange(e);
          }
        }}
        disabled={disabled}
        className="sr-only"
      />
      {children}
    </label>
  );
};

export { Radio, RadioGroup, RadioButton };
export default Radio;

