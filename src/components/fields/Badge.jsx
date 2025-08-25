import React, { memo } from "react";
import { cn } from "@/lib/utils";
/**
 * A customizable badge component with various styles and variants
 * @component
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The badge content
 * @param {string} [props.color="primary"] - The badge color theme (primary, secondary, success, info, warning, danger, disable)
 * @param {string} [props.variant="filled"] - The badge variant (filled, outline, soft, label)
 * @param {string} [props.className] - Additional CSS classes to apply
 * @param {string} [props.size="md"] - Size of the badge (md)
 * @returns {React.ReactElement} The Badge component
 */

export const Badge = memo(
  ({
    children,
    color = "primary",
    variant = "filled",
    className = "",
    size = "md",
    ...props
  }) => {
    const colorMap = {
      primary: {
        filled: "bg-primary-normal text-white border-transparent",
        outline:
          "bg-transparent text-primary-normal border border-primary-normal",
        soft: "bg-primary-soft text-primary-normal border-transparent",
        label: "bg-transparent text-primary-normal border-0 px-0 font-bold",
      },
      secondary: {
        filled: "bg-secondary-normal text-black border-transparent",
        outline:
          "bg-transparent text-secondary-normal border border-secondary-normal",
        soft: "bg-secondary-soft text-secondary-normal border-transparent",
        label: "bg-transparent text-secondary-normal border-0 px-0 font-bold",
      },
      success: {
        filled: "bg-success-normal text-white border-transparent",
        outline:
          "bg-transparent text-success-normal border border-success-normal",
        soft: "bg-success-soft text-success-normal border-transparent",
        label: "bg-transparent text-success-normal border-0 px-0 font-bold",
      },
      info: {
        filled: "bg-info-normal text-white border-transparent",
        outline: "bg-transparent text-info-normal border border-info-normal",
        soft: "bg-info-soft text-info-normal border-transparent",
        label: "bg-transparent text-info-normal border-0 px-0 font-bold",
      },
      warning: {
        filled: "bg-warning-normal text-white border-transparent",
        outline:
          "bg-transparent text-warning-normal border border-warning-normal",
        soft: "bg-warning-soft text-warning-normal border-transparent",
        label: "bg-transparent text-warning-normal border-0 px-0 font-bold",
      },
      danger: {
        filled: "bg-danger-normal text-white border-transparent",
        outline:
          "bg-transparent text-danger-normal border border-danger-normal",
        soft: "bg-danger-soft text-danger-normal border-transparent",
        label: "bg-transparent text-danger-normal border-0 px-0 font-bold",
      },
      tertiary: {
        filled: "bg-tertiary-normal text-white border-transparent",
        outline:
          "bg-transparent text-tertiary-normal border border-tertiary-normal",
        soft: "bg-tertiary-soft text-tertiary-normal border-transparent",
        label: "bg-transparent text-tertiary-normal border-0 px-0 font-bold",
      },
      disable: {
        filled: "bg-disable-normal text-white border-transparent",
        outline:
          "bg-transparent text-disable-normal border border-disable-normal",
        soft: "bg-disable-soft text-disable-normal border-transparent",
        label: "bg-transparent text-disable-normal border-0 px-0 font-bold",
      },
      white: {
        filled: "bg-white text-black border-transparent",
        outline: "bg-transparent text-black border border-black",
        soft: "bg-white text-black border-transparent",
        label: "bg-transparent text-black border-0 px-0 font-bold",
      },
    };
    const colorClass =
      colorMap[color]?.[variant] ||
      colorMap.primary[variant] ||
      colorMap.primary.filled;

    const sizeStyles = {
      sm:
        variant === "label"
          ? "text-xs font-bold px-0"
          : "h-[22px] px-3 py-[2px] text-xs rounded-full",
      md:
        variant === "label"
          ? "text-sm font-bold px-0"
          : "h-[26px] px-4 py-1 text-sm rounded-full",
    };

    return (
      <span
        className={cn(
          variant === "label"
            ? "inline-flex items-center"
            : "inline-flex items-center font-bold border rounded-full",
          sizeStyles[size] || sizeStyles.md,
          colorClass,
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
