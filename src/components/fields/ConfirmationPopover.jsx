import { memo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

/**
 * Tooltip component that displays a popover with optional confirmation/cancellation actions.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - The element that triggers the tooltip/popover.
 * @param {string|React.ReactNode} props.content - The main content/message to display inside the tooltip.
 * @param {Function} [props.onConfirm] - Optional callback fired when the confirm button is clicked.
 * @param {Function} [props.onCancel] - Optional callback fired when the cancel button is clicked.
 * @param {string} [props.confirmText="Confirm"] - Text for the confirm button.
 * @param {string} [props.cancelText="Cancel"] - Text for the cancel button.
 * @param {string|React.ReactNode} [props.title] - Optional title to display at the top of the tooltip.
 * @returns {JSX.Element} Tooltip component with popover and optional actions.
 */


export const ConfirmationPopover = memo(({ children, content, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", title }) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    setOpen(false);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="cursor-pointer" >
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="left" sideOffset={10}>
        {title && <h4 className="font-medium mb-2">{title}</h4>}
        <div className="text-sm mb-3">{content}</div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button variant="default"  size="sm" onClick={handleConfirm}>
            {confirmText}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
});
