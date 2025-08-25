import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";
import { useFormContext } from "react-hook-form";

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
    name,
    ...props
  }) => {
    const methods = useFormContext?.();
    const isUsingForm = !!(methods?.register && name);
    const error = methods?.formState?.errors?.[name];

    return (
      <div className={cn("mb-2", className)}>
        <div className="flex items-center gap-1">
          <label
            className="block text-base font-medium mb-1"
            htmlFor={name}
          >
            {label}
          </label>
          {required && <span className="text-primary-normal">*</span>}
          <AnimatePresence>
            {error && (
              <motion.i
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="text-primary-normal text-sm mb-1"
              >
                {error?.message}
              </motion.i>
            )}
          </AnimatePresence>
        </div>

        <textarea
          id={name}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full min-h-[80px] rounded-md border p-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-primary-normal" : "border-gray-300 focus:ring-none"
          )}
          {...(isUsingForm && methods?.register(name))}
          {...props}
        />
      </div>
    );
  }
);
