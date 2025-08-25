import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

import { useUIStore } from "@/stores/uiStore";

export const Modal = memo(() => {
  const modal = useUIStore((state) => state.modal);
  const closeModal = useUIStore((state) => state.closeModal);
  const closeable = useUIStore((state) => state.modal.closeable);

  return (
    <Dialog
      key={modal.isOpen ? modal.title + Math.random() : undefined}
      open={modal.isOpen}
      onOpenChange={closeModal}
    >
      <DialogContent
        {...(!closeable
          ? {
              onPointerDownOutside: (e) => e.preventDefault(),
              onEscapeKeyDown: (e) => e.preventDefault(),
            }
          : {})}
        className={cn("p-0 overflow-y-auto", modal.className)}
      >
        <DialogHeader className="flex flex-col px-4 pt-4">
          <DialogTitle className="text-xl">{modal.title}</DialogTitle>
          {modal.description && (
            <DialogDescription>{modal.description}</DialogDescription>
          )}
        </DialogHeader>
        <Separator />
        <div className="px-4 max-h-[75vh] overflow-y-auto">{modal.content}</div>
        {modal.footer && (
          <>
            <Separator />
            <DialogFooter className="px-4 pb-4">{modal.footer}</DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
});
