import * as React from "react";
import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative overflow-auto", className)}
      {...props}
    >
      {children}
      <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-gray-100 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-gray-100 to-transparent pointer-events-none" />
    </div>
  );
});

ScrollArea.displayName = "ScrollArea";

export { ScrollArea };
