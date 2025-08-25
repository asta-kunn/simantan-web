import { get } from "lodash";
import { ChevronDown, Info } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";

// Utils
import { cn } from "@/lib/utils";

// Shadcn Components
import { Button as ShadcnButton } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * Enhanced Select component that supports both search and multiple selection.
 * Can be used with React Hook Form + Zod, or as a standalone component with onChange.
 * @component
 *
 * @param {Object} props - Component props
 * @param {string} [props.name] - Field name for React Hook Form registration
 * @param {React.ReactNode} [props.info] - Optional info icon or tooltip
 * @param {string} [props.label] - Field label
 * @param {Array<{ label: string, value: string, preview?: React.ReactNode }>} props.options - List of selectable options
 * @param {string} [props.placeholder="Select options..."] - Placeholder text when no value is selected
 * @param {function(string | string[]): void} [props.onChange] - Callback when selection changes (for uncontrolled usage)
 * @param {function(string): void} [props.onSearchChange] - Callback when search query changes (for fetching options dynamically)
 * @param {string | string[]} [props.value] - Current selected value(s) for controlled usage
 * @param {boolean} [props.disabled=false] - Disable interaction
 * @param {string} [props.className] - Additional Tailwind or custom classes
 * @param {boolean} [props.required=false] - Marks the field as required (adds asterisk)
 * @param {boolean} [props.searchable=false] - Enable search/filtering in dropdown
 * @param {boolean} [props.multiple=false] - Allow multiple selections
 * @param {function(): void} [props.onBlur] - Optional blur event handler
 *
 * @returns {JSX.Element} Select dropdown component
 */

export const Select = memo(
  ({
    name,
    info,
    label,
    options = [],
    placeholder = "Select options...",
    onChange,
    onSearchChange = () => { },
    value,
    disabled = false,
    className = "",
    required = false,
    searchable = false,
    multiple = false,
    ...props
  }) => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [internalValue, setInternalValue] = useState(
      multiple ? (Array.isArray(value) ? value : []) : value || ""
    );

    const methods = useFormContext?.();
    const isUsingForm = !!(methods?.register && name);
    const error =
      name && methods?.formState?.errors
        ? get(methods.formState.errors, name)
        : undefined;

    const currentValue = isUsingForm
      ? methods?.getValues(name)
      : value !== undefined
        ? value
        : internalValue;

    useEffect(() => {
      setInternalValue(currentValue);
    }, [currentValue]);

    useEffect(() => {
      if (searchable) {
        onSearchChange(searchQuery);
      }
    }, [searchQuery]);

    const filteredOptions = useMemo(() => {
      if (!searchQuery || !searchable) return options;
      return options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [options, searchQuery, searchable]);

    const handleValueChange = (selectedValue) => {
      let newValues;

      if (multiple) {
        if (Array.isArray(currentValue)) {
          newValues = currentValue.includes(selectedValue)
            ? currentValue.filter((val) => val !== selectedValue)
            : [...currentValue, selectedValue];
        } else {
          newValues = [selectedValue];
        }
      } else {
        newValues = selectedValue;
        setOpen(false);
      }

      if (isUsingForm) {
        methods.setValue(name, newValues, { shouldValidate: true });
      } else if (value === undefined) {
        setInternalValue(newValues);
      }

      onChange?.(newValues);
    };

    const getDisplayValue = () => {
      if (
        !currentValue ||
        (Array.isArray(currentValue) && currentValue.length === 0)
      ) {
        return (
          <span className="text-neutral-gray text-base font-semibold">
            {placeholder}
          </span>
        );
      }

      if (multiple && Array.isArray(currentValue) && currentValue.length > 0) {
        return (
          <div className="flex items-center justify-center gap-1">
            <span className="text-white items-center font-semibold bg-primary-normal rounded-sm px-1.5">
              {currentValue.length}
            </span>
            <span className="text-neutral-gray text-base font-semibold">
              {placeholder}
            </span>
          </div>
        );
      }

      const selectedOption = options.find((opt) => opt.value === currentValue);
      return selectedOption?.preview || selectedOption?.label || placeholder;
    };

    const registerOptions = isUsingForm ? methods.register(name) : {};

    return (
      <div className="w-full">
        {label && (
          <div className="flex items-center gap-1">
            <label className="block text-base font-semibold mb-1.5">
              {label}
            </label>
            {required && (
              <span className="text-primary-normal self-start">*</span>
            )}
            {info && (
              <Info className="w-[10px] h-[10px] text-neutral-gray text-base font-semibold" />
            )}
          </div>
        )}

        {isUsingForm && (
          <input
            type="hidden"
            name={name}
            value={currentValue || ""}
            {...registerOptions}
          />
        )}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <ShadcnButton
              {...props}
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full justify-between font-normal text-left flex flex-col items-start h-auto min-h-[36px]",
                error ? "border-red-500" : "border-gray-300",
                disabled ? "opacity-50 cursor-not-allowed" : "",
                open ? "border-primary-normal" : "",
                className
              )}
              disabled={disabled}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between w-full items-center">
                <span className="text-black truncate">{getDisplayValue()}</span>
                <ChevronDown className="h-4 w-4 text-neutral-gray mt-0.5" />
              </div>
            </ShadcnButton>
          </PopoverTrigger>

          <PopoverContent
            className="w-[--radix-popover-trigger-width] z-[var(--z-popover)] p-0"
            align="start"
          >
            <Command shouldFilter={false}>
              {searchable && (
                <CommandInput
                  placeholder="Search options..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  className="border-none focus:ring-0"
                />
              )}
              <CommandList className="max-h-[200px] overflow-auto">
                <CommandEmpty>No options found.</CommandEmpty>
                <CommandGroup>
                  {filteredOptions.map((option) => {
                    const isSelected = multiple
                      ? Array.isArray(currentValue) &&
                      currentValue.includes(option.value)
                      : currentValue === option.value;

                    return (
                      <CommandItem
                        key={option.id || option.value}
                        onSelect={() => handleValueChange(option.value)}
                        className={`flex items-center gap-2 cursor-pointer ${isSelected ? "text-primary-normal font-bold bg-primary-soft" : ""}`}
                      >
                        {multiple && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => { }}
                            className="rounded accent-primary-normal"
                          />
                        )}
                        {option.preview ? (
                          <div className="mr-2">{option.preview}</div>
                        ) : (
                          <span>{option.label}</span>
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {error && (
          <p className="mt-1 text-sm text-danger-normal-hover">
            {error.message}
          </p>
        )}
      </div>
    );
  }
);
