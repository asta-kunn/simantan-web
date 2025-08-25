import React, { memo } from "react";
import { useField } from "formik";
import { AnimatePresence, motion } from "framer-motion";

// Shadcn Components
import { Input as ShadcnInput } from "@/components/ui/input";

export const InputNumber = memo(({ label, formatting = false, ...props }) => {
  const [field, meta, helpers] = useField(props);
  const { setValue } = helpers;

  const formatWithSeparator = (value) => {
    // Remove any non-digit characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, "");

    // Split into integer and decimal parts
    const [integerPart, decimalPart] = cleanValue.split(".");

    // Add thousand separators to integer part
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Return formatted number with decimal if it exists
    return decimalPart
      ? `${formattedInteger}.${decimalPart}`
      : formattedInteger;
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;

    // Remove existing commas
    const cleanValue = inputValue.replace(/,/g, "");

    // Store raw value in formik state
    setValue(cleanValue);
  };

  const displayValue = () => {
    if (!field.value) return "";
    return formatWithSeparator(field.value.toString());
  };

  return (
    <div className="mb-2">
      <div className="flex items-center gap-1">
        <label className="block text-base font-medium">{label}</label>
        <AnimatePresence>
          {meta.touched && meta.error && (
            <motion.i
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="text-primary-normal-500 text-sm"
            >
              ({meta.error})
            </motion.i>
          )}
        </AnimatePresence>
      </div>
      <ShadcnInput
        type="text"
        {...field}
        {...props}
        onChange={handleChange}
        value={displayValue()}
      />
    </div>
  );
}); 