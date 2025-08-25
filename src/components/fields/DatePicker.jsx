import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { get } from "lodash";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { memo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaInfoCircle } from "react-icons/fa";

// Shadcn Components
import { Button as ShadcnButton } from "@/components/ui/button";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const DatePicker = memo(
  ({
    label,
    minDate,
    maxDate,
    format = "DD MMMM YYYY",
    name,
    onChange,
    required = false,
    disabled = false,
    info,
    className,
    ...props
  }) => {
    const methods = useFormContext?.();
    const isUsingForm = !!(methods?.register && name);
    const value = isUsingForm ? methods.watch(name) : props.value;
    const error =
      name && methods?.formState?.errors
        ? get(methods.formState.errors, name)
        : undefined;

    const [open, setOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(value || new Date());

    const minDateObj = minDate ? new Date(minDate) : undefined;
    const maxDateObj = maxDate ? new Date(maxDate) : undefined;

    const handlePrevYear = () => {
      const newDate = new Date(currentDate);
      newDate.setFullYear(newDate.getFullYear() - 1);
      setCurrentDate(newDate);
    };

    const handleNextYear = () => {
      const newDate = new Date(currentDate);
      newDate.setFullYear(newDate.getFullYear() + 1);
      setCurrentDate(newDate);
    };

    const renderLabel = () => (
      <div className="flex items-center gap-1">
        <label className="block text-base font-medium mb-1.5">{label}</label>
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
      <div>
        {renderLabel()}
        <div className="mb-2">
          <div className="relative flex items-center group">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <ShadcnButton
                  className={[
                    "w-full justify-between text-black bg-white border shadow-sm hover:bg-white/80",
                    disabled
                      ? "border border-[#d2deeb] bg-gray-100 text-gray-400 font-semibold"
                      : error
                        ? "border-danger-normal text-black bg-gray-100"
                        : open
                          ? "border-primary-normal border-2 text-black bg-gray-100"
                          : "border border-[#d2deeb] group-hover:border-primary-normal group-focus-within:border-primary-normal group-focus-within:border-2 transition-all bg-gray-100",
                    className,
                  ].join(" ")}
                  disabled={disabled}
                >
                  {value ? dayjs(value).format(format) : "Pick a date"}
                  <Calendar
                    className={[
                      "ml-2 h-4 w-4",
                      open ? "text-primary-normal" : "",
                    ].join(" ")}
                  />
                </ShadcnButton>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 flex z-[var(--z-popover)]"
                align="start"
              >
                <div className="flex flex-col">
                  <div className="flex items-center justify-between px-3 py-2 border-b">
                    <div className="flex items-center gap-1">
                      <ShadcnButton
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={handlePrevYear}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </ShadcnButton>
                      <ShadcnButton
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => {
                          const newDate = new Date(currentDate);
                          newDate.setMonth(newDate.getMonth() - 1);
                          setCurrentDate(newDate);
                        }}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </ShadcnButton>
                    </div>
                    <div className="text-sm font-medium">
                      {dayjs(currentDate).format("MMMM YYYY")}
                    </div>
                    <div className="flex items-center gap-1">
                      <ShadcnButton
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => {
                          const newDate = new Date(currentDate);
                          newDate.setMonth(newDate.getMonth() + 1);
                          setCurrentDate(newDate);
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </ShadcnButton>
                      <ShadcnButton
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={handleNextYear}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </ShadcnButton>
                    </div>
                  </div>
                  <ShadcnCalendar
                    mode="single"
                    selected={value}
                    onSelect={(date) => {
                      if (isUsingForm) {
                        methods.setValue(name, date, { shouldValidate: true });
                      } else {
                        onChange && onChange(date);
                      }
                      setOpen(false);
                    }}
                    month={currentDate}
                    onMonthChange={setCurrentDate}
                    defaultMonth={value || undefined}
                    fromDate={minDateObj}
                    toDate={maxDateObj}
                    className="rounded-md border"
                    classNames={{
                      day_selected:
                        "bg-primary-normal text-white hover:bg-primary-normal hover:text-white focus:bg-primary-normal focus:text-white rounded-md",
                      day_today:
                        "bg-white text-black border-2 border-primary-normal rounded-md",
                      day: cn(
                        "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                        "hover:bg-tertiary-normal hover:text-black rounded-md",
                        "focus:bg-primary-normal focus:text-white rounded-md",
                        "disabled:bg-white disabled:text-disable-normal"
                      ),
                      head_cell:
                        "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                      cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      nav_button:
                        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-transparent",
                      caption: "hidden",
                      caption_label: "hidden",
                    }}
                  />
                </div>
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
      </div>
    );
  }
);
