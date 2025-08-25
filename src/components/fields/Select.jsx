import { memo, useEffect, useMemo, useState, useCallback } from "react";
import { ChevronDown, Info, X, Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { get, debounce } from "lodash";
import { motion } from "framer-motion";

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
 * Can be used with React Hook Form + Zod or standalone with onChange.
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Field name (required for React Hook Form)
 * @param {string} props.label - Label text
 * @param {Array} props.options - Array of options with label and value properties
 * @param {string} props.placeholder - Placeholder text
 * @param {function} props.onChange - Custom onChange handler for standalone usage
 * @param {function} props.onBlur - Custom onBlur handler
 * @param {string|Array} props.value - Current value (for standalone usage)
 * @param {boolean} props.disabled - Whether the select is disabled
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.required - Whether the field is required
 * @param {boolean} props.searchable - Whether the select is searchable
 * @param {boolean} props.multiple - Whether the select supports multiple selection
 * @param {function} props.onSearch - Function to call when search is performed, should return an array of options
 * @param {number} props.debounceTime - Debounce time in milliseconds for search API calls
 * @param {boolean} props.loading - Whether the options are being loaded
 * @returns {JSX.Element} Select component
 */
export const Select = memo(
  ({
    name,
    info,
    label,
    options = [],
    placeholder = "Select options...",
    onChange,
    value,
    disabled = false,
    className = "",
    required = false,
    searchable = false,
    multiple = false,
    onSearch = null,
    debounceTime = 300,
    loading = false,
    ...props
  }) => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [internalValue, setInternalValue] = useState(
      multiple ? (Array.isArray(value) ? value : []) : value || ""
    );
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const methods = useFormContext?.();
    const isUsingForm = !!(methods?.register && name);
    const error =
      name && methods?.formState?.errors
        ? get(methods.formState.errors, name)
        : undefined;

    // Use watch instead of getValues for reactivity
    const watchedValue = isUsingForm ? methods?.watch(name) : undefined;

    // Get current value based on form context or controlled value
    const currentValue = isUsingForm
      ? watchedValue
      : value !== undefined
        ? value
        : internalValue;

    useEffect(() => {
      setInternalValue(currentValue);
    }, [currentValue]);

    // Fetch initial options if onSearch is declared
    useEffect(() => {
      if (onSearch) {
        // Fetch with empty query for initial data
        fetchOnSearch("");
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onSearch]);

    // Create debounced search function
    const debouncedSearch = useCallback(
      debounce(async (query) => {
        if (onSearch) {
          fetchOnSearch(query);
        }
      }, debounceTime),
      [onSearch, debounceTime]
    );

    const fetchOnSearch = async (query = "") => {
      setIsSearching(true);
      try {
        const results = await onSearch(query);

        if (Array.isArray(results)) {
          setSearchResults(results);
        } else if (results?.data) {
          setSearchResults(results.data?.data || []);
        } else {
          console.warn(
            "onSearch should return an array of options or a valid response object"
          );
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error in search:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Handle search input change
    const handleSearchChange = (query) => {
      setSearchQuery(query);
      if (onSearch) {
        debouncedSearch(query);
      }
    };

    // Filter options based on search query when not using API search
    const filteredOptions = useMemo(() => {
      if (onSearch) {
        // If onSearch is declared, always use searchResults
        return searchResults;
      }
      if (!searchQuery || !searchable) return options;
      return options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [options, searchQuery, searchable, onSearch, searchResults]);

    // Handle value change
    const handleValueChange = (selectedOption) => {
      let newValues;

      if (multiple) {
        if (Array.isArray(currentValue)) {
          if (currentValue.includes(selectedOption.value)) {
            newValues = currentValue.filter(
              (val) => val !== selectedOption.value
            );
          } else {
            newValues = [...currentValue, selectedOption.value];
          }
        } else {
          newValues = [selectedOption.value];
        }
      } else {
        newValues = selectedOption.value;
        setOpen(false);
      }

      if (isUsingForm) {
        methods.setValue(name, newValues, { shouldValidate: true });
      } else {
        // Handle uncontrolled component when not using form
        if (value === undefined) {
          setInternalValue(newValues);
        }
      }

      if (onChange) {
        onChange(
          selectedOption.value,
          selectedOption.data ? { data: selectedOption.data } : undefined
        );
      }
    };

    // Remove selected item
    const handleRemoveItem = (valueToRemove, e) => {
      e.stopPropagation();

      const newValues = Array.isArray(currentValue)
        ? currentValue.filter((v) => v !== valueToRemove)
        : [];

      if (isUsingForm) {
        methods.setValue(name, newValues, { shouldValidate: true });
      } else {
        // Handle uncontrolled component when not using form
        if (value === undefined) {
          setInternalValue(newValues);
        }
      }

      if (onChange) {
        onChange(newValues);
      }
    };

    // Get display value for selected options
    const getDisplayValue = () => {
      // Use filteredOptions for display if onSearch is declared
      const displayOptions = onSearch ? filteredOptions : options;

      if (
        !currentValue ||
        (Array.isArray(currentValue) && currentValue.length === 0)
      ) {
        return <span className="text-neutral-gray">{placeholder}</span>;
      }

      if (multiple && Array.isArray(currentValue)) {
        return (
          <div className="flex flex-wrap items-center gap-1">
            {currentValue.map((value) => {
              const option = displayOptions.find((opt) => opt.value === value);
              if (!option) return null;
              return (
                <div
                  key={value}
                  className="flex items-center gap-1 bg-primary-soft text-primary-normal pl-2 pr-1 rounded-full w-[110px] truncate"
                >
                  <span className="flex-1 truncate">{option.label}</span>
                  <span
                    onClick={(e) => handleRemoveItem(value, e)}
                    className="rounded-full pr-1"
                  >
                    <span className="text-red font-semibold">X</span>
                  </span>
                </div>
              );
            })}
          </div>
        );
      }

      const selectedOption = displayOptions.find((opt) => opt.value === currentValue);
      return selectedOption
        ? selectedOption.preview
          ? selectedOption.preview
          : selectedOption.label
        : placeholder;
    };

    // Render selected value badges
    const renderSelectedBadges = () => {
      // Use filteredOptions for badges if onSearch is declared
      const displayOptions = onSearch ? filteredOptions : options;

      if (
        !multiple ||
        !Array.isArray(currentValue) ||
        currentValue.length === 0
      ) {
        return null;
      }

      return (
        <div className="flex flex-wrap gap-1 my-1 max-w-full overflow-hidden">
          {currentValue.map((value) => {
            const option = displayOptions.find((opt) => opt.value === value);
            if (!option) return null;

            return (
              <div
                key={`badge-${value}`}
                className="bg-primary-50 text-primary-600 flex items-center gap-2 px-2 py-1 rounded-md shadow-sm hover:bg-primary-100 transition-all duration-200 w-[100px] truncate"
              >
                <span className="flex-1 font-medium text-ellipsis">
                  {option.label}
                </span>
                <span
                  onClick={(e) => handleRemoveItem(value, e)}
                  className="rounded-full hover:bg-primary-200 p-0.5 transition-all duration-200"
                  aria-label={`Remove ${option.label}`}
                >
                  <X size={12} />
                </span>
              </div>
            );
          })}
        </div>
      );
    };

    // Create a hidden input for form registration to preserve value
    const registerOptions = isUsingForm ? methods.register(name) : {};

    return (
      <div className="w-full">
        {label && (
          <div className="flex items-center gap-1">
            <label className="block text-base font-medium mb-1.5">
              {label}
            </label>
            {required && (
              <span className="text-primary-normal self-start">*</span>
            )}
            {info && <Info className="w-[10px] h-[10px] text-neutral-gray" />}
          </div>
        )}

        {/* Hidden input to maintain form value */}
        {isUsingForm && (
          <input
            type="hidden"
            name={name}
            value={currentValue || ""}
            {...registerOptions}
          />
        )}

        <div className={cn("mb-2", className)}>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <ShadcnButton
                {...props}
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "w-full justify-between font-normal",
                  "text-left flex flex-col items-start",
                  "h-auto min-h-[36px]", // Make height adjust to content while ensuring minimum height
                  error ? "border-danger-normal" : "border-gray-300",
                  disabled ? "opacity-50 cursor-not-allowed" : "",
                  open ? "border-primary-normal" : "",
                  className
                )}
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="flex justify-between w-full items-center">
                  <span className="text-black truncate">
                    {getDisplayValue()}
                  </span>
                  <motion.div
                    initial={false}
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <ChevronDown className="h-4 w-4 shrink-0 text-neutral-gray mt-0.5" />
                  </motion.div>
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
                    onValueChange={handleSearchChange}
                    className="border-none focus:ring-0"
                  />
                )}
                <CommandList className="max-h-[200px] overflow-auto">
                  {isSearching || loading ? (
                    <div className="py-6 text-center text-sm text-neutral-gray flex flex-col items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Please Wait ...</span>
                    </div>
                  ) : (
                    <>
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
                              onSelect={() => handleValueChange(option)}
                              className={`flex items-center gap-2 cursor-pointer ${
                                isSelected
                                  ? "text-primary-normal font-bold bg-primary-soft hover:bg-primary-soft hover:text-primary-normal"
                                  : "hover:bg-primary-soft hover:text-primary-normal "
                              }`}
                            >
                              {multiple && (
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {}}
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
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {error && (
            <p className="mt-1 text-sm text-danger-normal font-normal italic">
              {error.message}
            </p>
          )}
        </div>
      </div>
    );
  }
);
