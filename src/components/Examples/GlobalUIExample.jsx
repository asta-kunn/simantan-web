import React, { useCallback } from "react";
import { useUIStore } from "@/stores/uiStore";
import { Button } from "@/components/Dexain";

/**
 * Example component demonstrating how to use global UI components
 */
export const GlobalUIExample = () => {
  // Get open functions from the UI store with separate selectors
  const openConfirmationModal = useUIStore(state => state.openConfirmationModal);
  const openSheet = useUIStore(state => state.openSheet);

  const handleopenConfirmationModal = useCallback(() => {
    openConfirmationModal({
      title: "Confirmation",
      description: "Are you sure you want to proceed with this action?",
      content: (
        <div className="text-center py-4">
          <p>This action cannot be undone.</p>
        </div>
      ),
      onConfirm: () => {
        console.log("User confirmed the action");
        // Perform the confirmed action
      },
      onCancel: () => {
        console.log("User cancelled the action");
        // Handle cancellation
      },
    });
  }, [openConfirmationModal]);

  const handleOpenSheet = useCallback(() => {
    openSheet({
      title: "User Details",
      description: "View and edit user information",
      position: "right", // 'right', 'left', 'top', 'bottom'
      size: 100,
      content: (
        <div className="py-4">
          <p>User information would be displayed here.</p>
          <form className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                defaultValue="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                defaultValue="john.doe@example.com"
              />
            </div>
          </form>
        </div>
      ),
    });
  }, [openSheet]);

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Global UI Components Example</h2>

      <div className="space-y-2">
        <p>Click the buttons below to open global UI components:</p>

        <div className="flex space-x-4">
          <Button onClick={handleopenConfirmationModal}>Open Modal</Button>
          <Button onClick={handleOpenSheet}>Open Sheet</Button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-medium mb-2">Usage Instructions:</h3>
        <p className="text-sm">
          You can open these global components from anywhere in your application
          by importing the useUIStore hook and calling the openConfirmationModal or openSheet functions.
        </p>
        <pre className="bg-gray-800 text-white p-4 rounded mt-2 text-xs overflow-auto">
          {`import { useUIStore } from "@/stores/uiStore";

// Inside your component - use separate selectors
const openConfirmationModal = useUIStore(state => state.openConfirmationModal);
const openSheet = useUIStore(state => state.openSheet);

// To open a modal
openConfirmationModal({
  title: "Confirmation",
  description: "Are you sure?",
  content: <p>Content goes here</p>,
  onConfirm: () => console.log("Confirmed"),
  onCancel: () => console.log("Cancelled"),
});

// To open a sheet
openSheet({
  title: "Details",
  description: "View information",
  content: <p>Content goes here</p>,
  position: "right",
  size: 400,
});`}
        </pre>
      </div>
    </div>
  );
}; 