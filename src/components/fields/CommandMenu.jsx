import React, { memo, useState, useEffect } from "react";

// Shadcn Components
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export const CommandMenu = memo(() => {
  const [open, setOpen] = useState(false);

  // useEffect(() => {
  //   const down = (e) => {
  //     if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
  //       e.preventDefault();
  //       setOpen((open) => !open);
  //     }
  //   };
  //   document.addEventListener("keydown", down);
  //   return () => document.removeEventListener("keydown", down);
  // }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
});