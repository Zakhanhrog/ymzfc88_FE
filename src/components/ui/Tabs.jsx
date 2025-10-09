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
      <div className={`flex border-b border-gray-200 ${tabBarClassName}`}>
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => handleTabClick(item.key)}
            disabled={item.disabled}
            className={`
              relative px-6 py-3 font-medium text-sm transition-all duration-200
              ${currentActiveKey === item.key 
                ? 'text-[#D30102] border-b-2 border-[#D30102]' 
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
      <div className={`py-4 ${contentClassName}`}>
        {activeTab?.children}
      </div>
    </div>
  );
};

export default Tabs;

