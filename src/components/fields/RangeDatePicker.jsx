import React, { memo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
import { Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { FaInfoCircle } from "react-icons/fa";

// Utils
import { isEmpty } from "@/lib/utils";

// Shadcn Components
import { Button as ShadcnButton } from "@/components/ui/button";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const RangeDatePicker = memo(
  ({ label, format = "DD MMMM YYYY", name, onChange, required = false, disabled = false, info, ...props }) => {
    const methods = useFormContext?.();
    const isUsingForm = !!(methods?.register && name);
    const value = isUsingForm ? methods.watch(name) : props.value;
    const error = methods?.formState?.errors?.[name];

    const [open, setOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(value?.from || new Date());

    const renderLabel = () => (
      <div className="flex items-center gap-1">
        <label className="block text-base font-medium mb-1">{label}</label>
        {required && <span className="text-primary-normal">*</span>}
        {info && (
          <span className="relative group ml-1">
            <FaInfoCircle className="text-disable-normal w-4 h-4 cursor-pointer" />
            <span className="absolute left-1/2 z-10 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition whitespace-nowrap min-w-[120px] text-center">
              {info}
            </span>
          </span>
        )}
      </div>
    );

    return (
      <div className="mb-2">
        {renderLabel()}
        <div className="relative flex items-center group">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <ShadcnButton 
                className={[
                  "w-full text-black bg-white border shadow-sm hover:bg-white/80 justify-between",
                  disabled
                    ? "border border-[#d2deeb] bg-gray-100 text-gray-400 font-semibold"
                    : error
                      ? "border-danger-normal text-black bg-gray-100"
                      : open
                        ? "border-primary-normal border-2 text-black bg-gray-100"
                        : "border border-[#d2deeb] group-hover:border-primary-normal group-focus-within:border-primary-normal group-focus-within:border-2 transition-all bg-gray-100",
                ].join(" ")}
                disabled={disabled}
              >
                {value?.from
                  ? value.to
                    ? `${dayjs(value.from).format(format || "LL")} - ${dayjs(
                        value.to
                      ).format(format || "LL")}`
                    : dayjs(value.from).format(format || "LL")
                  : "Pick a date range"}
                <Calendar className={["ml-2 h-4 w-4", open ? "text-primary-normal" : ""].join(" ")} />
              </ShadcnButton>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <ShadcnCalendar
                mode="range"
                month={currentDate}
                onMonthChange={setCurrentDate}
                defaultMonth={value?.from}
                selected={value}
                onSelect={(range) => {
                  if (isUsingForm) {
                    methods.setValue(name, range);
                  } else {
                    onChange && onChange(range);
                  }
                  if (range?.from && range?.to) {
                    setOpen(false);
                  }
                }}
                numberOfMonths={2}
                className="rounded-md border"
                classNames={{
                  day_selected: "bg-primary-normal text-white hover:bg-primary-normal hover:text-white focus:bg-primary-normal focus:text-white rounded-md",
                  day_today: "bg-white text-black border-2 border-primary-normal rounded-md",
                  day_range_middle: "bg-primary-soft !text-black rounded-none",
                  day: cn(
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                    "hover:bg-tertiary-normal hover:text-black rounded-md",
                    "focus:bg-primary-normal focus:text-white rounded-md",
                    "disabled:bg-white disabled:text-disable-normal"
                  ),
                  head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                  cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-transparent",
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
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
