import { Button } from "@/components/fields/Button";
import { Sheet as ShadcnSheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ComponentSlot } from "@/pages/Dashboard/component/ryu";

/**
 * Sheet component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Component children
 * @param {"sm" | "md" | "lg" | "xl" | "xxl" | "full"} props.width - Sheet width
 * @param {"top" | "bottom" | "left" | "right"} props.side - Sheet side
 * @param {string} props.description - Sheet description
 * @param {string} props.primaryButton - Primary button label
 * @param {string} props.secondaryButton - Secondary button label
 * @param {function} props.onOk - On ok callback
 * @param {function} props.onCancel - On cancel callback
 * @param {"between" | "start" | "end"} props.buttonPositions - Button positions
 */
const Sheet = ({
  children,
  width = "lg",
  description = "",
  triggerText = "Open Sheet",
  primaryButton,
  secondaryButton,
  onOk,
  onCancel,
  buttonPositions = "between",
  ...props
}) => {
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
    <ShadcnSheet>
      <SheetTrigger asChild>
        <Button>{triggerText}</Button>
      </SheetTrigger>
      <SheetContent className={!["top", "bottom"].includes(props.side) ? desktopWidthClasses[width] : ""} {...props}>
        <SheetHeader>
          <SheetTitle>Title</SheetTitle>
          {description && <SheetDescription>
            {description}
          </SheetDescription>}
        </SheetHeader>
        <div
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="grid gap-4 my-4 overflow-y-auto h-[calc(100vh-160px)]"
        >
          {children ? children : (
            <ComponentSlot />
          )}
        </div>
        <SheetFooter>
          <div className={`w-full gap-2 ${buttonPositionsClasses[buttonPositions]}`}>
            {secondaryButton && <Button variant="outline" onClick={onCancel}>{secondaryButton}</Button>}
            {primaryButton && <Button onClick={onOk}>{primaryButton}</Button>}
          </div>
        </SheetFooter>
      </SheetContent>
    </ShadcnSheet>
  );
};

export default Sheet;
