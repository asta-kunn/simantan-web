import React, { memo } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { get } from "lodash";
import { AnimatePresence, motion } from "framer-motion";

/**
 * RadioButton component that can be used with or without React Hook Form
 * @param {Object} props - Component props
 * @param {string} props.name - Input name attribute
 * @param {string} props.label - Label for the radio button
 * @param {boolean} props.checked - Whether the radio button is checked
 * @param {function} props.onChange - onChange handler
 * @param {string} props.value - Value of the radio button
 * @param {boolean} props.disabled - Whether the radio button is disabled
 * @param {string} props.className - Additional class names
 * @param {Object} props.register - React Hook Form register function
 */
export const RadioButton = memo(
  ({
    name,
    label,
    checked,
    onChange,
    value,
    disabled = false,
    className = "",
    ...props
  }) => {
    // Prepare props based on whether we're using React Hook Form or not
    const methods = useFormContext?.();
    const isUsingForm = !!(methods?.register && name);
    const error =
      name && methods?.formState?.errors
        ? get(methods.formState.errors, name)
        : undefined;

    return (
      <div className={cn("flex items-center gap-2", className)}>
        <input
          type="radio"
          id={`${label ? label + "-" : ""}${Date.now()}`}
          disabled={disabled}
          className={cn(
            "h-4 w-4 accent-primary-normal-default cursor-pointer",
            error && "border-danger-normal"
          )}
          {...(isUsingForm
            ? {
                ...methods.register(name, {
                  checked,
                }),
              }
            : {
                value,
                onChange,
                checked,
              })}
          {...props}
        />
        {label && (
          <label
            htmlFor={`${label ? label + "-" : ""}${Date.now()}`}
            className={cn(
              "text-sm cursor-pointer",
              disabled && "text-gray-400 cursor-not-allowed"
            )}
          >
            {label}
          </label>
        )}
        <AnimatePresence>
          {error && (
            <motion.i
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="text-danger-normal text-sm mb-1 ml-2"
            >
              {error.message}
            </motion.i>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

RadioButton.displayName = "RadioButton";
