import { cn } from "@/lib/utils";
import { forwardRef } from "react";

/**
 * A customizable button component with various styles and variants
 * @component
 * @param {Object} props - The component props
 * @param {string} [props.className] - Additional CSS classes to apply
 * @param {React.ReactNode} props.children - The button content
 * @param {boolean} [props.disabled] - Whether the button is disabled
 * @param {string} [props.type="button"] - The button type (button, submit, reset)
 * @param {string} [props.variant="filled"] - The button variant (filled, outline, soft)
 * @param {string} [props.color="primary"] - The button color theme (primary, secondary, success)
 * @param {React.ReactNode} [props.icon] - Icon element to display
 * @param {string} [props.iconPosition="left"] - Position of the icon (left, right)
 * @param {string} [props.size] - Size of the button (sm, md, lg)
 * @param {React.Ref} ref - Forward ref for the button element
 * @returns {React.ReactElement} The Button component
 */

export const Button = forwardRef(
  (
    {
      className,
      children,
      disabled,
      type = "button",
      variant = "filled",
      color = "primary",
      icon,
      iconPosition = "left",
      size,
      ...props
    },
    ref
  ) => {
    // const isFormik = !!type;
    // const formik = isFormik ? useFormikContext() : null;
    // let isSubmitting = isFormik ? formik?.isSubmitting : false;

    let variantClass = "";

    // Base styles buttons
    const baseStyles = "transition-all duration-300 rounded-md font-medium flex items-center justify-center gap-2 h-10 box-border focus:outline-none focus-visible:outline-none";

    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm h-8",
      md: "px-4 py-2 text-base h-10",
      lg: "px-6 py-3 text-lg h-12"
    };

    const colorStyles = {
      primary: {
        filled: "bg-primary-normal hover:bg-primary-normal-hover active:bg-primary-normal-active text-white hover:disabled:bg-primary-normal hover:disabled:text-white",
        outline: "border border-primary-normal text-primary-normal bg-white hover:bg-primary-normal hover:text-white active:bg-primary-normal-active active:text-white px-[16px] py-[8px] hover:disabled:bg-white hover:disabled:text-primary-normal",
        soft: "bg-primary-soft text-primary-normal hover:bg-primary-normal-hover hover:text-white active:bg-primary-normal-active active:text-white hover:disabled:bg-primary-soft hover:disabled:text-primary-normal"
      },
      secondary: {
        filled: "bg-secondary-normal hover:bg-secondary-normal-hover active:bg-secondary-normal-active text-white hover:disabled:bg-secondary-normal hover:disabled:text-white",
        outline: "border border-secondary-normal text-secondary-normal bg-white hover:bg-secondary-normal hover:text-white active:bg-secondary-normal-active active:text-white px-[16px] py-[8px] hover:disabled:bg-white hover:disabled:text-secondary-normal",
        soft: "bg-secondary-soft text-secondary-normal hover:bg-secondary-normal-hover hover:text-white active:bg-secondary-normal-active active:text-white hover:disabled:bg-secondary-soft hover:disabled:text-secondary-normal"
      },
      success: {
        filled: "bg-success-normal hover:bg-success-normal-hover active:bg-success-normal-active text-white hover:disabled:bg-success-normal hover:disabled:text-white",
        outline: "border border-success-normal text-success-normal bg-white hover:bg-success-normal hover:text-white active:bg-success-normal-active active:text-white px-[15px] py-[7px] hover:disabled:bg-white hover:disabled:text-success-normal",
        soft: "bg-success-soft text-success-normal hover:bg-success-normal-hover hover:text-white active:bg-success-normal-active active:text-white hover:disabled:bg-success-soft hover:disabled:text-success-normal"
      },
      info: {
        filled: "bg-info-normal hover:bg-info-normal-hover active:bg-info-normal-active text-white hover:disabled:bg-info-normal hover:disabled:text-white",
        outline: "border border-info-normal text-info-normal bg-white hover:bg-info-normal hover:text-white active:bg-info-normal-active active:text-white px-[15px] py-[7px] hover:disabled:bg-white hover:disabled:text-info-normal",
        soft: "bg-info-soft text-info-normal hover:bg-info-normal-hover hover:text-white active:bg-info-normal-active active:text-white hover:disabled:bg-info-soft hover:disabled:text-info-normal"
      },
      warning: {
        filled: "bg-warning-normal hover:bg-warning-normal-hover active:bg-warning-normal-active text-white hover:disabled:bg-warning-normal hover:disabled:text-white",
        outline: "border border-warning-normal text-warning-normal bg-white hover:bg-warning-normal hover:text-white active:bg-warning-normal-active active:text-white px-[15px] py-[7px] hover:disabled:bg-white hover:disabled:text-warning-normal",
        soft: "bg-warning-soft text-warning-normal hover:bg-warning-normal-hover hover:text-white active:bg-warning-normal-active active:text-white hover:disabled:bg-warning-soft hover:disabled:text-warning-normal"
      },
      danger: {
        filled: "bg-danger-normal hover:bg-danger-normal-hover active:bg-danger-normal-active text-white hover:disabled:bg-danger-normal hover:disabled:text-white",
        outline: "border border-danger-normal text-danger-normal bg-white hover:bg-danger-normal hover:text-white active:bg-danger-normal-active active:text-white px-[15px] py-[7px] hover:disabled:bg-white hover:disabled:text-danger-normal",
        soft: "bg-danger-soft text-danger-normal hover:bg-danger-normal-hover hover:text-white active:bg-danger-normal-active active:text-white hover:disabled:bg-danger-soft hover:disabled:text-danger-normal"
      },
      disable: {
        filled: "bg-disable-normal hover:bg-disable-normal-hover active:bg-disable-normal-active text-white hover:disabled:bg-disable-normal hover:disabled:text-white",
        outline: "border border-disable-normal text-disable-normal bg-white hover:bg-white hover:text-disable-normal active:bg-white active:text-disable-normal px-[15px] py-[7px] hover:disabled:bg-white hover:disabled:text-disable-normal",
        soft: "bg-disable-soft text-disable-normal hover:bg-disable-normal-hover hover:text-disable-normal active:bg-disable-normal-active active:text-disable-normal hover:disabled:bg-disable-soft hover:disabled:text-disable-normal"
      },
      tertiary: {
        filled: "bg-white hover:bg-tertiary-normal active:bg-tertiary-normal-active text-black hover:disabled:bg-white hover:disabled:text-tertiary-normal",
        outline: "border border-tertiary-normal text-black bg-white hover:bg-tertiary-normal active:bg-tertiary-normal-active px-[15px] py-[7px] hover:disabled:bg-white hover:disabled:text-tertiary-normal",
        soft: "bg-tertiary-soft text-black hover:bg-tertiary-normal active:bg-tertiary-normal-active hover:disabled:bg-tertiary-soft hover:disabled:text-tertiary-normal"
      }
    };

    // variantClass
    variantClass = `${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${colorStyles[color]?.[variant] || colorStyles.primary.filled}`;

    if (disabled) {
      variantClass += " opacity-50 cursor-not-allowed";
    }

    const renderContent = () => {
      if (!icon) return children;

      const iconElement = <span className="flex items-center">{icon}</span>;

      if (iconPosition === "left") {
        return (
          <>
            {iconElement}
            {children}
          </>
        );
      }

      if (iconPosition === "right") {
        return (
          <>
            {children}
            {iconElement}
          </>
        );
      }

      return children;
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(variantClass, className)}
        disabled={disabled}
        {...props}
      >
        {renderContent()}
      </button>
    );
  }
);
