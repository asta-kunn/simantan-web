import { useUIStore } from "@/stores/uiStore";
import { memo } from "react";

// Utils

// Shadcn Components
import {
  Sheet as ShadcnSheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ComponentSlot } from "@/pages/Dashboard/component/ryu";
import { Button } from "@/components/fields/Button";

/**
 * Sheet component that uses the UI store
 * When this component is mounted, it will be available to be triggered from anywhere
 * in the application using the useUIStore hook.
 */
export const Sheet = memo(() => {
  // Get sheet state and close function from UI store with separate selectors
  // This avoids returning a new object on each render
  const sheet = useUIStore((state) => state.sheet);
  const closeSheet = useUIStore((state) => state.closeSheet);

  const desktopWidthClasses = {
    sm: "w-1/4",
    md: "w-1/3",
    lg: "w-1/2",
    xl: "w-2/3",
    xxl: "w-3/4",
    full: "w-full"
  };

  const buttonPositionsClasses = {
    between: "flex justify-between",
    start: "flex justify-start",
    end: "flex justify-end"
  };

  return (
    // <ShadcnSheet open={sheet.isOpen} onOpenChange={closeSheet}>
    //   <SheetContent
    //     forceMount
    //     className={cn(
    //       sheet.size
    //         ? `max-w-[${sheet.size}px] md:max-w-[${sheet.size + 200}px] `
    //         : "",
    //       "overflow-y-auto" // Make sheet content scrollable
    //     )}
    //   >
    //     <SheetHeader>
    //       <SheetTitle>{sheet.title}</SheetTitle>
    //       {sheet.description && (
    //         <SheetDescription>{sheet.description}</SheetDescription>
    //       )}
    //     </SheetHeader>
    //     <div className="py-4">
    //       <FocusScope contain={false}>{sheet.content}</FocusScope>
    //     </div>
    //   </SheetContent>
    // </ShadcnSheet>
    <ShadcnSheet open={sheet.isOpen} onOpenChange={closeSheet}>
      <SheetContent className={!["top", "bottom"].includes(sheet.position) ? desktopWidthClasses[sheet.width] : ""}>
        <SheetHeader>
          <SheetTitle>{sheet.title}</SheetTitle>
          {sheet.description && <SheetDescription>
            {sheet.description}
          </SheetDescription>}
        </SheetHeader>
        <div
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="grid gap-4 my-4 overflow-y-auto h-[calc(100vh-160px)]"
        >
          {sheet.children ? sheet.children : (
            <ComponentSlot />
          )}
        </div>
        <SheetFooter>
          <div className={`w-full gap-2 ${buttonPositionsClasses[sheet.buttonPositions]}`}>
            {sheet.secondaryButton && <Button variant="outline" onClick={sheet.onCancel}>{sheet.secondaryButton}</Button>}
            {sheet.primaryButton && <Button onClick={sheet.onOk}>{sheet.primaryButton}</Button>}
          </div>
        </SheetFooter>
      </SheetContent>
    </ShadcnSheet>
  );
});
