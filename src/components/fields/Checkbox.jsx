import React, { memo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { FaInfoCircle } from "react-icons/fa";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// States and constants
export const STATES = {
  default: "default",
  focus: "focus",
  error: "error",
  disable: "disable"
};

export const CHECKED_STATES = {
  checked: "checked",
  unchecked: "unchecked",
  indeterminated: "indeterminated"
};

export const Checkbox = memo(({
  name,
  label,
  description = "",
  required = false,
  disabled = false,
  info = "",
  state = STATES.default,
  checked = CHECKED_STATES.unchecked,
  className = "",
  value,
  onChange,
  ...props
}) => {
  const methods = useFormContext?.();
  const isUsingForm = !!(methods && name);
  const error = methods?.formState?.errors?.[name];

  const isDisabled = disabled || state === STATES.disable;

  // Derive state from error if in form context
  const derivedState = isUsingForm && error ? STATES.error : state;

  // Get border and background colors based on state
  const getBorderColor = () => {
    switch (derivedState) {
      case STATES.error:
        return "border-danger-normal";
      case STATES.disable:
        return "border-disable-normal";
      case STATES.focus:
        return "border-primary-normal";
      default:
        return "border-primary-normal";
    }
  };

  const getBackgroundColor = (isChecked) => {
    if (isDisabled) return "bg-disable-normal";
    if (isChecked) {
      switch (derivedState) {
        case STATES.error:
          return "bg-danger-normal";
        case STATES.focus:
          return "bg-primary-normal";
        default:
          return "bg-primary-normal";
      }
    }
    return "bg-white";
  };

  const getIndicatorColor = () => {
    switch (derivedState) {
      case STATES.error:
        return "bg-danger-normal";
      case STATES.disable:
        return "bg-disable-normal";
      case STATES.focus:
        return "bg-primary-normal";
      default:
        return "bg-primary-normal";
    }
  };

  // Render checkbox for form usage
  if (isUsingForm) {
    return (
      <div className="flex items-start space-x-2">
        <div className={cn(
          "relative inline-flex items-center justify-center",
          derivedState === STATES.focus && "p-[2px] bg-primary-soft rounded-[3px]"
        )}>
          <Controller
            name={name}
            control={methods.control}
            defaultValue={false}
            render={({ field }) => {
              const isIndeterminate = field.value === "indeterminate" || field.value === CHECKED_STATES.indeterminated;
              const isChecked = !isIndeterminate && Boolean(field.value);

              const handleChange = (newChecked) => {
                if (isDisabled) return;
                
                let newValue;
                if (isIndeterminate) {
                  newValue = true;
                } else {
                  newValue = newChecked;
                }
                
                field.onChange(newValue);
                onChange?.(newValue);
              };

              return (
                <CheckboxPrimitive.Root
                  id={name}
                  checked={isChecked || isIndeterminate}
                  disabled={isDisabled}
                  className={cn(
                    "shrink-0 rounded-[3px] border-2 h-[14px] w-[14px]",
                    "focus:outline-none focus:ring-2 focus:ring-primary-normal focus:ring-offset-2",
                    "transition-colors duration-200",
                    getBorderColor(),
                    getBackgroundColor(isChecked),
                    isDisabled && "cursor-not-allowed opacity-50",
                    !isDisabled && "cursor-pointer hover:border-primary-normal",
                    "data-[state=checked]:text-white",
                    className
                  )}
                  onCheckedChange={handleChange}
                  {...props}
                >
                  <CheckboxPrimitive.Indicator
                    className={cn(
                      "flex items-center justify-center",
                      "transition-all duration-200"
                    )}
                  >
                    {!isIndeterminate && isChecked && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                    {isIndeterminate && (
                      <div className={cn(
                        "h-[6px] w-[6px] rounded-[1px]",
                        getIndicatorColor()
                      )} />
                    )}
                  </CheckboxPrimitive.Indicator>
                </CheckboxPrimitive.Root>
              );
            }}
          />
        </div>

        <div>
          {label && (
            <label htmlFor={name} className="flex items-center space-x-1 text-sm font-medium">
              <span>{label}{required && <span className="text-primary-normal">*</span>}</span>
              {info && (
                <span className="relative group">
                  <FaInfoCircle className="text-disable-normal w-4 h-4 cursor-pointer" />
                  <div className="absolute left-1/2 z-10 -translate-x-1/2 mt-2 w-max rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100">
                    {info}
                  </div>
                </span>
              )}
            </label>
          )}

          {description && (
            <div className={`text-xs ${error ? "text-danger-normal" : "text-gray-500"}`}>
              {description}
            </div>
          )}

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-danger-normal text-xs mt-1"
              >
                {error.message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Render checkbox for non-form usage
  const rawValue = value !== undefined ? value : checked;
  const isIndeterminate = rawValue === "indeterminate" || rawValue === CHECKED_STATES.indeterminated;
  const isChecked = !isIndeterminate && (rawValue === CHECKED_STATES.checked || Boolean(rawValue));

  const handleChange = (newChecked) => {
    if (isDisabled) return;

    let newValue;
    if (isIndeterminate) {
      newValue = CHECKED_STATES.checked;
    } else {
      newValue = newChecked ? CHECKED_STATES.checked : CHECKED_STATES.unchecked;
    }

    onChange?.(newValue);
  };

  return (
    <div className="flex items-start space-x-2">
      <div className={cn(
        "relative inline-flex items-center justify-center",
        derivedState === STATES.focus && "p-[2px] bg-primary-soft rounded-[3px]"
      )}>
        <CheckboxPrimitive.Root
          id={name}
          checked={isChecked || isIndeterminate}
          disabled={isDisabled}
          className={cn(
            "shrink-0 rounded-[3px] border-2 h-[14px] w-[14px]",
            "focus:outline-none focus:ring-2 focus:ring-primary-normal focus:ring-offset-2",
            "transition-colors duration-200",
            getBorderColor(),
            getBackgroundColor(isChecked),
            isDisabled && "cursor-not-allowed opacity-50",
            !isDisabled && "cursor-pointer hover:border-primary-normal",
            "data-[state=checked]:text-white",
            className
          )}
          onCheckedChange={handleChange}
          {...props}
        >
          <CheckboxPrimitive.Indicator
            className={cn(
              "flex items-center justify-center",
              "transition-all duration-200"
            )}
          >
            {!isIndeterminate && isChecked && (
              <Check className="h-3 w-3 text-white" />
            )}
            {isIndeterminate && (
              <div className={cn(
                "h-[6px] w-[6px] rounded-[1px]",
                getIndicatorColor()
              )} />
            )}
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
      </div>

      <div>
        {label && (
          <label htmlFor={name} className="flex items-center space-x-1 text-sm font-medium">
            <span>{label}{required && <span className="text-primary-normal">*</span>}</span>
            {info && (
              <span className="relative group">
                <FaInfoCircle className="text-disable-normal w-4 h-4 cursor-pointer" />
                <div className="absolute left-1/2 z-10 -translate-x-1/2 mt-2 w-max rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100">
                  {info}
                </div>
              </span>
            )}
          </label>
        )}

        {description && (
          <div className={`text-xs ${error ? "text-danger-normal" : "text-gray-500"}`}>
            {description}
          </div>
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-danger-normal text-xs mt-1"
            >
              {error.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
