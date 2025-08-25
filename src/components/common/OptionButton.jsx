import { memo } from "react";
import { useController, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

/**
 * OptionButton component for React Hook Form
 * @param {Object} props - Component props
 * @param {string} props.name - Field name for React Hook Form
 * @param {Array} props.options - Array of options with value and label properties
 * @param {string} props.defaultValue - Default selected value
 * @param {function} props.onChange - Optional callback when value changes
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} OptionButton component
 */

export const OptionButton = memo(
  ({
    name,
    label,
    options = [],
    defaultValue = "",
    onChange,
    className = "",
    required = false,
    disabled = false,
  }) => {
    const { control, watch, formState } = useFormContext();

    const { field } = useController({
      name,
      control,
      defaultValue: defaultValue,
    });
    const error = formState.errors[name];

    const handleOptionChange = (value) => {
      if (disabled) return; // prevent changes when disabled
      if (field.value === value) {
        field.onChange("");
        if (onChange) onChange("");
        return;
      }
      field.onChange(value);
      if (onChange) onChange(value);
    };

    const selectedValue = watch(name);

    return (
      <div>
        {label && (
          <div className="flex flex-col gap-1">
            <div className="text-base font-medium mb-1">
              {label}
              {required && <span className="ml-1 text-primary-normal">*</span>}
            </div>
          </div>
        )}
        <div
          className={cn(
            "flex border border-gray-300 rounded-lg overflow-hidden",
            className
          )}
        >
          {options.map((option) => (
            <button
              disabled={disabled}
              key={option.value}
              type="button"
              onClick={() => handleOptionChange(option.value)}
              className={`flex-1 p-3 text-sm transition-colors border-r border-gray-300 last:border-r-0 ${
                selectedValue === option.value
                  ? "bg-primary-soft text-primary-normal font-bold"
                  : disabled
                    ? "bg-white text-gray-700"
                    : "bg-white text-gray-700 hover:bg-gray-50"
              } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {error && <div className="mt-1 text-sm text-danger-normal">{error.message}</div>}
      </div>
    );
  }
);
