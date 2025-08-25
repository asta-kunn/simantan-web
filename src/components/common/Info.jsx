import { cn } from "@/lib/utils";
import { memo } from "react";

export const Info = memo(
  ({
    label = "-",
    value = "-",
    labelClassName,
    valueClassName,
    containerClassName,
  }) => {
    return (
      <div className={cn("flex flex-col gap-0.5 text-base", containerClassName)}>
        <div className={cn("text-muted-foreground", labelClassName)}>
          {label}
        </div>
        <div className={cn("font-semibold text-black", valueClassName)}>
          {value}
        </div>
      </div>
    );
  }
);
