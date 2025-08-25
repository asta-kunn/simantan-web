import React, { memo } from "react";

// Shadcn Components
import {
  Dialog as ShadcnDialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Dialog = memo(
  ({ isOpen, onClose, title, description, children, trigger, footer }) => {
    return (
      <ShadcnDialog open={isOpen} onOpenChange={onClose}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
          {footer && <DialogFooter>{footer}</DialogFooter>}
        </DialogContent>
      </ShadcnDialog>
    );
  }
);
