import React, { memo, useRef } from "react";
import { useField } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * TextArea component for use with Formik.
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Field name (required for Formik)
 * @param {string} props.label - Label text
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.disabled - Whether the textarea is disabled
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.required - Whether the field is required
 * @param {number} props.rows - Number of rows to display
 * @returns {JSX.Element} TextArea component
 */
export const TextArea = memo(
  ({
    label,
    placeholder = "Enter text...",
    disabled = false,
    className = "",
    required = false,
    rows = 4,
    ...props
  }) => {
    const textareaRef = useRef(null);
    const isFormik = !!props.name;
    const [field, meta] = isFormik ? useField(props) : [{ value: props.value || "" }, {}];

    return (
      <div className={cn("mb-4", className)}>
        <div className="flex items-center gap-1">
          <label className="block text-base font-medium mb-1" htmlFor={props.name}>
            {label}
          </label>
          {required && <span className="text-primary-normal-500">*</span>}
          <AnimatePresence>
            {meta.touched && meta.error && (
              <motion.i
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="text-primary-normal text-sm mb-1"
              >
                ({meta.error})
              </motion.i>
            )}
          </AnimatePresence>
        </div>

        <textarea
          id={props.name}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          ref={textareaRef}
          className={cn(
            "w-full min-h-[80px] rounded-md border p-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            meta.touched && meta.error ? "border-primary-normal" : "border-gray-300 focus:ring-none"
          )}
          {...field}
          {...props}
        />
      </div>
    );
  }
);
