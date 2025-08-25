import React from "react";
import { cn } from "@/lib/utils";

const Card = ({ 
  title, 
  children, 
  className, 
  variant, 
  scrollable = false, 
  maxHeight = "400px", 
  customStyle = {},
  ...props 
}) => {
  const isDark = variant === "dark";
  return (
    <div
      className={cn(
        "rounded-lg border shadow mb-4",
        isDark ? "bg-gray-200 text-white" : "bg-white",
        className
      )}
      style={{ ...customStyle }}
      {...props}
    >
      
      {title && (
        <div className="inline-block bg-[#5b595b] text-white font-bold text-lg rounded-tl-lg rounded-br-lg px-4 py-1 mb-2 shadow-sm" style={{ paddingTop: '7px', paddingBottom: '9px', marginLeft: '-1px' }}>
          {title}
        </div>
      )}
      <div
        className={cn(title ? "px-6 pb-4" : "p-4", scrollable && "overflow-y-auto")}
        style={scrollable ? { maxHeight, ...customStyle.contentStyle } : { ...customStyle.contentStyle }}
      >
        {children}
      </div>
    </div>
  );
};

export default Card; 