import React, { memo } from "react";

// Utils
import { cn } from "@/lib/utils";

// Shadcn Components
import {
  Alert as ShadcnAlert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export const Alert = memo(
  ({ variant = "default", title, description, className, ...props }) => {
    const variantStyles = {
      default: "bg-background",
      destructive:
        "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
    };

    return (
      <ShadcnAlert
        variant={variant}
        className={cn(variantStyles[variant], className)}
        {...props}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {description && <AlertDescription>{description}</AlertDescription>}
      </ShadcnAlert>
    );
  }
);  