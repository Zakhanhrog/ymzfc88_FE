import { useState } from 'react';

const Tabs = ({ 
  items = [],
  defaultActiveKey,
  activeKey,
  onChange,
  className = '',
  tabBarClassName = '',
  contentClassName = '',
}) => {
  const [internalActiveKey, setInternalActiveKey] = useState(defaultActiveKey || items[0]?.key);
  
  const currentActiveKey = activeKey !== undefined ? activeKey : internalActiveKey;
  
  const handleTabClick = (key) => {
    if (activeKey === undefined) {
      setInternalActiveKey(key);
    }
    onChange?.(key);
  };

  const activeTab = items.find(item => item.key === currentActiveKey);

  return (
    <div className={className}>
      {/* Tab Bar */}
      <div className={`flex ${tabBarClassName || 'border-b border-gray-200'}`}>
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => handleTabClick(item.key)}
            disabled={item.disabled}
            className={`
              relative px-6 h-10 font-medium text-sm transition-all duration-200 flex items-center justify-center
              ${currentActiveKey === item.key 
                ? tabBarClassName.includes('border-0')
                  ? 'bg-[#4CAF50] text-white rounded-2xl'
                  : 'text-[#4CAF50] border-b-2 border-[#4CAF50]'
                : tabBarClassName.includes('border-0')
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-2xl'
                  : 'text-gray-600 hover:text-gray-900'
              }
              ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-center gap-2">
              {item.icon && <span>{item.icon}</span>}
              <span>{item.label}</span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      {contentClassName !== 'hidden' && (
        <div className={`${contentClassName || 'p-4 md:p-6'}`}>
          {activeTab?.children}
        </div>
      )}
    </div>
  );
};

export default Tabs;

