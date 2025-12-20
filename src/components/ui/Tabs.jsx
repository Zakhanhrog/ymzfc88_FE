import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { useState } from "react"

import { cn } from "../../lib/utils"

const TabsRoot = TabsPrimitive.Root

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-600",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

// Shadcn Tabs (named export)
export const Tabs = TabsRoot

// Legacy Tabs component for backward compatibility
const LegacyTabs = ({ 
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
  
  const handleValueChange = (value) => {
    if (activeKey === undefined) {
      setInternalActiveKey(value);
    }
    onChange?.(value);
  };

  return (
    <TabsRoot value={currentActiveKey} onValueChange={handleValueChange} className={className}>
      {/* Tab Bar */}
      {tabBarClassName.includes('border-0') ? (
        <TabsList className={cn("gap-2 h-auto p-0 bg-transparent rounded-none", tabBarClassName)}>
          {items.map((item) => (
            <TabsTrigger
              key={item.key}
              value={item.key}
              disabled={item.disabled}
              className={cn(
                "px-6 h-10 font-medium text-sm transition-all duration-200",
                currentActiveKey === item.key
                  ? 'bg-[#4CAF50] text-white rounded-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="flex items-center gap-2">
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
      ) : (
        <TabsList className={cn("border-b border-gray-200 h-auto p-0 bg-transparent rounded-none", tabBarClassName)}>
          {items.map((item) => (
            <TabsTrigger
              key={item.key}
              value={item.key}
              disabled={item.disabled}
              className={cn(
                "relative px-6 h-10 font-medium text-sm transition-all duration-200",
                currentActiveKey === item.key
                  ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]'
                  : 'text-gray-600 hover:text-gray-900',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="flex items-center gap-2">
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
      )}
      
      {/* Tab Content */}
      {contentClassName !== 'hidden' && (
        <div className={cn(contentClassName || 'p-4 md:p-6')}>
          {items.map((item) => (
            <TabsContent key={item.key} value={item.key}>
              {item.children}
            </TabsContent>
          ))}
        </div>
      )}
    </TabsRoot>
  );
};

// Default export for backward compatibility
export default LegacyTabs;

// Named exports for shadcn usage
export { TabsRoot, TabsList, TabsTrigger, TabsContent }
