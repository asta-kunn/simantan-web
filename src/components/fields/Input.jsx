import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { memo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaInfoCircle } from "react-icons/fa";
import { get } from "lodash";

// Shadcn Components
import { Input as ShadcnInput } from "@/components/ui/input";

export const Input = memo(
  ({
    prefix,
    suffix,
    label,
    caption = "",
    name,
    required = false,
    disabled = false,
    info,
    value,
    onChange,
    type,
    ...props
  }) => {
    const [showPassword, setShowPassword] = useState(false);
    const methods = useFormContext?.();
    const isUsingForm = !!(methods?.register && name);

    const error =
      name && methods?.formState?.errors
        ? get(methods.formState.errors, name)
        : undefined;

    const getSuffix = () => {
      if (type === "password") {
        return (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="focus:outline-none"
          >
            {showPassword ? (
              <Eye className="h-4 w-4 text-gray-400" />
            ) : (
              <EyeOff className="h-4 w-4 text-gray-400" />
            )}
          </button>
        );
      }
      return suffix;
    };

    const finalSuffix = getSuffix();
    const finalType =
      type === "password" ? (showPassword ? "text" : "password") : type;

    const renderLabel = () => (
      <div className="flex items-center gap-1">
        <label className="text-base font-medium mb-1.5">{label}</label>
        {required && <span className="text-primary-normal self-start">*</span>}
        {info && (
          <span className="relative group">
            <FaInfoCircle className="text-disable-normal w-3 h-3 cursor-pointer" />
            <span className="absolute left-1/2 z-10 -translate-x-1/2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition whitespace-nowrap min-w-[120px] text-center">
              {info}
            </span>
          </span>
        )}
      </div>
    );

    return (
      <div>
        {renderLabel()}
        <div className="mb-2">
          <div className="relative flex items-center group">
            {prefix &&
              (typeof prefix === "string" ? (
                <span
                  className={
                    "absolute left-0 top-0 bottom-0 h-full flex items-center px-3 font-bold text-base z-10 " +
                    (disabled
                      ? "bg-white border border-[#d2deeb] text-info-normal rounded-l-md border-r-0"
                      : error
                        ? "bg-danger-soft border border-danger-normal text-danger-normal rounded-l-md border-r-0"
                        : "bg-white border border-[#d2deeb] text-info-normal rounded-l-md border-r-0 transition-all group-hover:border-primary-normal group-focus-within:border-primary-normal group-focus-within:border-2") +
                    " group-hover:border-r-0 group-focus-within:border-r-0"
                  }
                >
                  {prefix}
                </span>
              ) : (
                <span
                  className={`absolute left-3 pointer-events-none select-none flex items-center ${error ? "text-danger-normal" : "text-gray-400"}`}
                >
                  {prefix}
                </span>
              ))}
            <ShadcnInput
              {...(isUsingForm
                ? {
                    ...methods.register(name),
                  }
                : {
                    value,
                    onChange,
                  })}
              id={name}
              disabled={disabled}
              type={finalType}
              {...props}
              className={[
                prefix && typeof prefix === "string"
                  ? "!border-l-0 pl-[92px]"
                  : prefix
                    ? "pl-9"
                    : "",
                finalSuffix && typeof finalSuffix === "string"
                  ? "!border-r-0 pr-[92px]"
                  : finalSuffix
                    ? "pr-9"
                    : "",
                disabled
                  ? "border border-[#d2deeb] bg-gray-100 text-gray-400 font-semibold placeholder:text-disable-normal"
                  : error
                    ? "border-danger-normal text-black bg-gray-100"
                    : "border border-[#d2deeb] group-hover:border-primary-normal group-focus-within:border-primary-normal group-focus-within:border-2 transition-all bg-gray-100",
                props.className || "",
              ].join(" ")}
            />
            {finalSuffix &&
              (typeof finalSuffix === "string" ? (
                <span
                  className={
                    "absolute right-0 top-0 bottom-0 h-full flex items-center px-3 font-bold text-base z-10 " +
                    (disabled
                      ? "bg-white border border-[#d2deeb] text-info-normal rounded-r-md border-l-0"
                      : error
                        ? "bg-danger-soft border border-danger-normal text-danger-normal rounded-r-md border-l-0"
                        : "bg-white border border-[#d2deeb] text-info-normal rounded-r-md border-l-0 transition-all group-hover:border-primary-normal group-focus-within:border-primary-normal group-focus-within:border-2") +
                    " group-hover:border-l-0 group-focus-within:border-l-0"
                  }
                >
                  {finalSuffix}
                </span>
              ) : (
                <span
                  className={`absolute right-3 flex items-center gap-1 ${error ? "text-danger-normal" : ""}`}
                >
                  {finalSuffix}
                </span>
              ))}
          </div>
          {caption && <div className="text-xs mt-1 text-gray-500">{caption}</div>}
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
      </div>
    );
  }
);
