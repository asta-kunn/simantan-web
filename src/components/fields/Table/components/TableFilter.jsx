import React, { useRef, useState, useCallback, memo, useEffect } from "react";
import { Filter, Search, Calendar, Clock } from "lucide-react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

/** Import Testing Tools */
import { createTestIdProps } from "@/lib/utils";

const getFilterIcon = (type) => {
  switch (type) {
    case "text":
      return <Search className="h-4 w-4" />;
    case "date":
      return <Calendar className="h-4 w-4" />;
    case "datetime":
      return <Clock className="h-4 w-4" />;
    default:
      return <Filter className="h-4 w-4" />;
  }
};

const SearchInput = memo(({ value, onChange, placeholder }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex items-center mb-2 rounded-md border px-1">
      <Search className="h-4 w-4 mx-2 text-gray-400" />
      <ShadcnInput
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="border-0 shadow-none rounded-xl text-sm"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
});

const FilterContent = memo(
  ({
    col,
    filterConfig,
    applyFilter,
    resetFilter,
    setOpenFilter,
    columnFilters,
  }) => {
    const [localValue, setLocalValue] = useState(
      columnFilters?.[col.accessorKey] || ""
    );
    const initialValueRef = useRef(columnFilters?.[col.accessorKey] || "");
    const [isApplying, setIsApplying] = useState(false);

    useEffect(() => {
      if (columnFilters?.[col.accessorKey] !== undefined) {
        setLocalValue(columnFilters[col.accessorKey]);
      }
    }, [columnFilters, col.accessorKey]);

    const handleInputChange = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
      setLocalValue(e.target.value);
    }, []);

    const handleApplyFilter = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isApplying) return;

        try {
          setIsApplying(true);

          // Process value based on type
          let processedValue = localValue;

          // For string values, trim them
          if (typeof localValue === "string") {
            processedValue = localValue.trim();
          }

          console.log("Applying filter:", col.accessorKey, processedValue);

          applyFilter(col.accessorKey, processedValue);

          // Close the popover after applying
          setOpenFilter(null);
        } finally {
          setIsApplying(false);
        }
      },
      [col.accessorKey, applyFilter, localValue, setOpenFilter, isApplying]
    );

    const handleResetFilter = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isApplying) return;

        try {
          setIsApplying(true);
          const emptyValue = filterConfig.type === "checkbox" ? [] : "";

          setLocalValue(emptyValue);
          resetFilter(col.accessorKey);

          // Close the popover after resetting
          setOpenFilter(null);
        } finally {
          setIsApplying(false);
        }
      },
      [
        filterConfig.type,
        col.accessorKey,
        resetFilter,
        setOpenFilter,
        isApplying,
      ]
    );

    return (
      <div className="filter-content">
        <div className="mb-1 text-sm font-bold">{`Filter ${col.header}`}</div>

        {filterConfig.type === "text" && (
          <SearchInput
            value={localValue}
            onChange={handleInputChange}
            placeholder={`Search ${col.header}`}
            {...createTestIdProps(`table_filter_text_${col.accessorKey}`)}
          />
        )}

        {filterConfig.type === "select" && (
          <Select value={localValue} onValueChange={setLocalValue}>
            <SelectTrigger className="rounded-lg mb-2">
              <SelectValue
                placeholder={`Select ${col.header}`}
                {...createTestIdProps(`table_filter_select_${col.accessorKey}`)}
              />
            </SelectTrigger>
            <SelectContent className="rounded-md">
              {filterConfig.options?.map((opt) => (
                <SelectItem key={opt} value={opt} className="rounded-md">
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {filterConfig.type === "checkbox" && (
          <div className="flex flex-col gap-2 mb-2">
            {filterConfig.options?.map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 cursor-pointer"
              >
                <ShadcnCheckbox
                  checked={
                    Array.isArray(localValue) && localValue?.includes(opt)
                  }
                  onCheckedChange={(checked) => {
                    setLocalValue(
                      checked
                        ? [...(localValue || []), opt]
                        : (localValue || []).filter((v) => v !== opt)
                    );
                  }}
                  className="rounded-sm"
                  {...createTestIdProps(
                    `table_filter_checkbox_${col.accessorKey}_${opt}`
                  )}
                />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
        )}

        {(filterConfig.type === "date" || filterConfig.type === "datetime") && (
          <CalendarComponent
            mode="single"
            classNames={{
              day_selected:
                "bg-primary-normal text-white hover:bg-primary-normal hover:text-white focus:bg-primary-normal focus:text-white rounded-md",
              day_today:
                "bg-white text-black border-2 border-primary-normal rounded-md",
            }}
            onSelect={setLocalValue}
            className="rounded-md border mx-auto flex justify-center items-center"
            selected={
              localValue instanceof Date ? localValue : initialValueRef.current
            }
            initialFocus
            defaultMonth={localValue instanceof Date ? localValue : undefined}
            {...createTestIdProps(`table_filter_date_${col.accessorKey}`)}
          />
        )}

        <div className="flex justify-between gap-1 border-t pt-2">
          <ShadcnButton
            size="sm"
            variant="primary"
            onClick={handleApplyFilter}
            className="w-full rounded-lg bg-primary-normal text-white hover:bg-primary-normal-hover py-0 font-bold"
            {...createTestIdProps(
              `table_filter_button_apply_${col.accessorKey}`
            )}
          >
            Search
          </ShadcnButton>
          <ShadcnButton
            size="sm"
            variant="ghost"
            onClick={handleResetFilter}
            className="w-full rounded-lg py-0 font-bold"
            {...createTestIdProps(
              `table_filter_button_reset_${col.accessorKey}`
            )}
          >
            Reset
          </ShadcnButton>
        </div>
      </div>
    );
  }
);

export const TableFilter = memo(
  ({
    col,
    filterConfig,
    openFilter,
    columnFilters,
    applyFilter,
    resetFilter,
    setOpenFilter,
  }) => {
    const isOpen = openFilter === col.accessorKey;

    const handleOpenChange = (open) => {
      if (open) {
        setOpenFilter(col.accessorKey);
      } else {
        setOpenFilter(null);
      }
    };

    return (
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <ShadcnButton
            variant="ghost"
            size="icon"
            className={`h-4 w-4 p-0 ${columnFilters?.[col.accessorKey] ? "text-primary-normal hover:text-primary-normal-hover" : "text-neutral-gray hover:text-neutral-gray-hover"}`}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            {...createTestIdProps(
              `table_filter_button_${filterConfig.type}_${col.accessorKey}`
            )}
          >
            {getFilterIcon(filterConfig.type)}
          </ShadcnButton>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto min-w-[250px] p-4"
          align="end"
          side="bottom"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <FilterContent
            col={col}
            filterConfig={filterConfig}
            columnFilters={columnFilters}
            applyFilter={applyFilter}
            resetFilter={resetFilter}
            setOpenFilter={setOpenFilter}
          />
        </PopoverContent>
      </Popover>
    );
  }
);
