import React, { memo } from "react";
import { useFormContext } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";

// Shadcn Components
import { Input as ShadcnInput } from "@/components/ui/input";

export const InputNumber = memo(
  ({ label, name, value, onChange, formatting = false, ...props }) => {
    const methods = useFormContext?.();
    const isUsingForm = !!(methods?.register && name);
    const error = methods?.formState?.errors?.[name];

    const formatDisplay = (value) => {
      if (!value && value !== 0) return "";
      
      // Convert to string and remove any existing commas
      const numStr = value.toString().replace(/,/g, '');
      
      // Split into integer and decimal parts
      const [integerPart, decimalPart] = numStr.split('.');
      
      // Add commas to integer part
      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      
      // Return formatted number with decimal if it exists
      return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
    };

    const handleChange = (e) => {
      const inputValue = e.target.value;
      
      // Remove all non-numeric characters except decimal and minus
      const cleanValue = inputValue.replace(/[^\d.-]/g, '');
      
      // Handle empty or just minus sign
      if (cleanValue === '' || cleanValue === '-') {
        if (isUsingForm) {
          methods.setValue(name, cleanValue);
        } else if (onChange) {
          onChange(cleanValue);
        }
        return;
      }

      // Convert to number if valid
      const numberValue = parseFloat(cleanValue);
      if (!isNaN(numberValue)) {
        // Store clean number value internally
        if (isUsingForm) {
          methods.setValue(name, numberValue);
        } else if (onChange) {
          onChange(numberValue);
        }
      }
    };

    // Get the raw value for internal state
    const rawValue = isUsingForm ? methods.watch(name) : value;
    
    // Only format the display value, keeping raw value for form data
    const displayValue = formatDisplay(rawValue);

    return (
      <div className="mb-2">
        <div className="flex items-center gap-1">
          <label className="block text-base font-medium">{label}</label>
          <AnimatePresence>
            {error && (
              <motion.i
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="text-primary-normal-500 text-sm"
              >
                {error}
              </motion.i>
            )}
          </AnimatePresence>
        </div>
        <ShadcnInput
          type="text"
          inputMode="numeric"
          {...(isUsingForm ? methods.register(name) : {})}
          {...props}
          onChange={handleChange}
          value={displayValue}
        />
      </div>
    );
  }
);
