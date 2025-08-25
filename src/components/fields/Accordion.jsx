import React, { memo, useState } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

/**
 * A collapsible accordion component with customizable header and content.
 * Supports both single and multiple selection modes.
 * 
 * @component
 * @example
 * // Basic usage (uncontrolled single mode)
 * <Accordion title="Basic Accordion" defaultOpen={false}>
 *   <div>Content goes here</div>
 * </Accordion>
 * 
 * @example
 * // Controlled single mode
 * const [value, setValue] = useState("");
 * <Accordion
 *   type="single"
 *   value={value}
 *   onValueChange={setValue}
 *   accordionId="my-accordion"
 *   title="Controlled Single Accordion"
 * >
 *   <div>Controlled content</div>
 * </Accordion>
 * 
 * @example
 * // Multiple mode
 * const [values, setValues] = useState([]);
 * <Accordion
 *   type="multiple"
 *   value={values}
 *   onValueChange={setValues}
 *   accordionId="my-accordion"
 *   title="Multiple Accordion"
 * >
 *   <div>Multiple content</div>
 * </Accordion>
 * 
 * @example  
 * // Legacy controlled accordion (backward compatible)
 * const [openStates, setOpenStates] = useState({});
 * const handleToggle = (accordionId, isOpen) => {
 *   setOpenStates(prev => ({ ...prev, [accordionId]: isOpen }));
 * };
 * 
 * <Accordion
 *   accordionId="my-accordion"
 *   openStates={openStates}
 *   onToggle={handleToggle}
 *   title="Legacy Controlled Accordion"
 * >
 *   <div>Legacy controlled content</div>
 * </Accordion>
 * 
 * @param {Object} props - The component props
 * @param {"single"|"multiple"} [props.type="single"] - The accordion selection mode
 * @param {string|string[]} [props.value] - Current value(s) - string for single, array for multiple
 * @param {Function} [props.onValueChange] - Callback for value changes
 * @param {string} [props.accordionId] - Unique identifier for this accordion item
 * @param {React.ReactNode} [props.icon] - Optional icon element to display before the title
 * @param {string|React.ReactNode} props.title - The accordion header title
 * @param {React.ReactNode[]} [props.rightHeaderItems=[]] - Optional array of elements to display on the right side of header
 * @param {React.ReactNode} props.children - The content to be displayed when accordion is expanded
 * @param {boolean} [props.defaultOpen=false] - Whether the accordion should be open by default (uncontrolled mode)
 * @param {string} [props.className=''] - Additional CSS classes to apply to the root element
 * @param {boolean} [props.separator=false] - Whether to show a separator line
 * @param {boolean} [props.disabled=false] - Whether the accordion should be disabled
 * @param {Object} [props.openStates] - Legacy: Object containing open states for controlled accordions
 * @param {Function} [props.onToggle] - Legacy: Callback function for controlled accordion toggle
 * @param {string} [props.openItemClassName] - Custom className for accordion item when open
 * @param {string} [props.closedItemClassName] - Custom className for accordion item when closed
 * @param {string} [props.openHeaderClassName] - Custom className for accordion header when open
 * @param {string} [props.closedHeaderClassName] - Custom className for accordion header when closed
 * @returns {React.ReactElement} The rendered accordion component
 */

export const Accordion = memo(
  ({
    accordionId = null,
    type = "single",
    value: controlledValue,
    onValueChange: controlledOnValueChange,
    icon = null,
    title,
    rightHeaderItems = [],
    children,
    defaultOpen = false,
    className = "",
    separator = false,
    disabled = false,
    // Legacy props for backward compatibility
    openStates = {},
    onToggle = null,
    openItemClassName = "",
    closedItemClassName = "",
    openHeaderClassName = "",
    closedHeaderClassName = "",
    ...props
  }) => {
    // Generate internal item ID
    const itemId = accordionId || "accordion-item";
    
    // Handle legacy controlled mode (backward compatibility)
    const isLegacyControlled = accordionId && onToggle && openStates;
    
    // Handle new controlled mode
    const isNewControlled = controlledValue !== undefined && controlledOnValueChange;
    
    // Local state for uncontrolled mode
    const [localValue, setLocalValue] = useState(() => {
      if (type === "single") {
        return defaultOpen ? itemId : "";
      } else {
        return defaultOpen ? [itemId] : [];
      }
    });

    // Determine current value and setter
    let currentValue, setValue;
    
    if (isLegacyControlled) {
      // Legacy mode - convert between old and new API
      const isOpen = openStates[accordionId] || false;
      currentValue = type === "single" ? (isOpen ? itemId : "") : (isOpen ? [itemId] : []);
      setValue = (newValue) => {
        if (type === "single") {
          onToggle(accordionId, newValue === itemId);
        } else {
          onToggle(accordionId, Array.isArray(newValue) && newValue.includes(itemId));
        }
      };
    } else if (isNewControlled) {
      // New controlled mode
      currentValue = controlledValue;
      setValue = controlledOnValueChange;
    } else {
      // Uncontrolled mode
      currentValue = localValue;
      setValue = setLocalValue;
    }

    // Determine if this accordion is open
    const isOpen = type === "single" 
      ? currentValue === itemId 
      : Array.isArray(currentValue) && currentValue.includes(itemId);

    // Default item classes
    const defaultOpenItemClass = "border-gray-200 rounded-md";
    const defaultClosedItemClass = "border-gray-200 rounded-md";
    
    // Default header classes  
    const defaultOpenHeaderClass = "rounded-md";
    const defaultClosedHeaderClass = "rounded-md";

    // Determine final classes
    const itemClassName = isOpen 
      ? (openItemClassName || defaultOpenItemClass)
      : (closedItemClassName || defaultClosedItemClass);
      
    const headerClassName = isOpen
      ? (openHeaderClassName || defaultOpenHeaderClass) 
      : (closedHeaderClassName || defaultClosedHeaderClass);

    return (
      <AccordionPrimitive.Root
        type={type}
        collapsible={type === "single" ? true : undefined}
        value={currentValue}
        onValueChange={setValue}
        className={cn("w-full", className)}
        {...props}
      >
        <AccordionPrimitive.Item
          value={itemId}
          className={cn(
            "border mb-2 transition-all duration-300 bg-white",
            itemClassName,
            disabled && "opacity-50 pointer-events-none"
          )}
        >
          <AccordionPrimitive.Header className="w-full">
            <div
              className={cn(
                "flex w-full items-center px-4 py-2 text-base font-semibold transition-colors duration-300 border-0 bg-white group focus:outline-none appearance-none cursor-default text-gray-900",
                headerClassName
              )}
            >
              {/* Icon */}
              {icon && (
                <div className="mr-2 flex items-center text-lg">{icon}</div>
              )}

              {/* Title */}
              <div className="flex-1 text-left w-full">
                {typeof title === "string" ? (
                  <span className="font-bold text-lg">{title}</span>
                ) : (
                  title
                )}
              </div>

              {/* Right Header Items */}
              {Array.isArray(rightHeaderItems) &&
                rightHeaderItems.map((item, idx) => (
                  <div key={idx} className="ml-2 flex items-center">
                    {item}
                  </div>
                ))}

              {/* Separator */}
              {separator && (
                <div
                  className="mx-3 w-px bg-gray-300 rounded self-stretch"
                  style={{ minHeight: 24, alignSelf: "stretch" }}
                />
              )}

              {/* Chevron Trigger */}
              <AccordionPrimitive.Trigger
                className={cn(
                  "h-8 w-8 flex items-center justify-center ml-2 text-black transition-transform duration-200 rounded cursor-pointer",
                  isOpen && "rotate-180"
                )}
                aria-expanded={isOpen}
                tabIndex={0}
                style={{ minWidth: 32, minHeight: 32 }}
              >
                <ChevronDown className="h-5 w-5" />
              </AccordionPrimitive.Trigger>
            </div>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="bg-white border-t-0 rounded-b-md">
            {children}
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      </AccordionPrimitive.Root>
    );
  }
);
