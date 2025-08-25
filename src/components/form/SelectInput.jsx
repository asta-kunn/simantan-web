import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

export function SelectInput({
  items,
  value: externalValue,
  changeValue,
  className,
  loading,
}) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(externalValue || "");

  React.useEffect(() => {
    if (externalValue !== undefined) {
      setInternalValue(externalValue);
    }
  }, [externalValue]);

  const displayValue =
    items.find((item) => item.value === internalValue)?.label ||
    "Select item...";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          {displayValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-max p-0">
        <Command>
          <CommandInput placeholder="Search item..." className="h-9" />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup className="w-[300px]">
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  disabled={loading}
                  onSelect={(currentValue) => {
                    const newValue =
                      currentValue === internalValue ? "" : currentValue;
                    setInternalValue(newValue);
                    if (changeValue) {
                      changeValue(newValue);
                    }
                    setOpen(false);
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      internalValue === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
