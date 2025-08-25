import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, autoComplete, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      autoComplete={type === "password" ? "off" : autoComplete}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed xs:text-sm [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_transparent_inset] [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }
