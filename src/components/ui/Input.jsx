import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, style, prefix, suffix, error, ...props }, ref) => {
  // Đảm bảo font-size >= 16px trên mobile để tránh iOS Safari auto-zoom
  const mobileStyle = {
    fontSize: '16px',
    ...style
  };
  
  // Nếu có prefix hoặc suffix, wrap trong div
  if (prefix || suffix) {
    return (
      <div className="relative">
        {prefix && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {prefix}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            prefix ? "pl-10" : "px-3",
            suffix ? "pr-10" : "",
            error ? "border-red-500 focus-visible:ring-red-500" : "",
            className
          )}
          style={mobileStyle}
          ref={ref}
          {...props} />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {suffix}
          </div>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
  
  return (
    <div>
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          error ? "border-red-500 focus-visible:ring-red-500" : "",
        className
      )}
        style={mobileStyle}
      ref={ref}
      {...props} />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
})
Input.displayName = "Input"

export { Input }
