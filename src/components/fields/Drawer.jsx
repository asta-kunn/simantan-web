import React, { memo } from "react";

// Shadcn Components
import {
  Drawer as ShadcnDrawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button as ShadcnButton } from "@/components/ui/button";

export const Drawer = memo(
  ({ isOpen, onClose, title, description, children, footer }) => {
    return (
      <ShadcnDrawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
            {children && <div>{children}</div>}
          </DrawerHeader>
          <DrawerFooter>
            <ShadcnButton type="button">Submit</ShadcnButton>
            <ShadcnButton variant="outline" onClick={onClose}>
              Cancel
            </ShadcnButton>
          </DrawerFooter>
        </DrawerContent>
      </ShadcnDrawer>
    );
  }
);
