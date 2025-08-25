import React, { useCallback } from "react";
import { useUIStore } from "@/stores/uiStore";
import { Button } from "@/components/Dexain";

/**
 * A simple example showing how to use the global UI components from anywhere
 */
export const SimpleButtonExample = () => {
  // Use direct selector to avoid creating new objects
  const openConfirmationModal = useUIStore(state => state.openConfirmationModal);

  const handleClick = useCallback(() => {
    openConfirmationModal({
      title: "Simple Example",
      description: "This modal was opened from a simple button component",
      content: <p>You can open modals and sheets from anywhere in your app!</p>,
      onConfirm: () => console.log("User confirmed"),
    });
  }, [openConfirmationModal]);

  return (
    <Button onClick={handleClick}>
      Open Global Modal
    </Button>
  );
}; 