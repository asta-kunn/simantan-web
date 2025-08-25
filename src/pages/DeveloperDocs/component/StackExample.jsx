import React from "react";
import { ComponentExample } from "./ComponentExample";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/uiStore";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

/**
 * Stack component documentation and examples
 */
const StackExample = () => {
  const { addStack, clearStacks } = useUIStore();

  // Helper function to create confirmation modal
  const showConfirmationModal = (variant = "warning") => {
    addStack({
      type: "modal",
      isConfirm: true,
      variant,
      title: "Confirmation Required",
      description: "This action requires your confirmation to proceed.",
    });
  };

  // Helper function to create alert modal
  const showAlertModal = (size = "md") => {
    addStack({
      type: "modal",
      title: "Information Alert",
      description: "This is an informational alert message.",
      size,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            This is an example of an alert modal that provides information to the user.
          </p>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
              <div className="text-sm text-blue-700">
                Additional information can be displayed here with proper styling.
              </div>
            </div>
          </div>
        </div>
      ),
      footer: (
        <div className="flex justify-end">
          <Button onClick={() => clearStacks()}>
            Got it
          </Button>
        </div>
      ),
    });
  };

  // Helper function to create sheet
  const showSheet = (position = "right", size = "md") => {
    addStack({
      type: "sheet",
      position,
      size,
      title: "Sheet Example",
      description: "This is a sliding sheet panel",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Sheets are useful for displaying information or forms without taking the user away from the current context.
          </p>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="text-sm">
              This sheet appears from the {position} side with {size} size.
            </div>
          </div>
        </div>
      ),
      confirmText: "Save",
      cancelText: "Cancel",
      onConfirm: () => {
        alert("Sheet action confirmed!");
        clearStacks();
      },
      onCancel: () => clearStacks()
    });
  };

  // Helper function to create stacked modals
  const showStackedModals = () => {
    // First modal
    addStack({
      type: "modal",
      title: "First Modal",
      description: "This is the first modal in the stack.",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Click the button below to open a second modal on top of this one.
          </p>
          <Button
            onClick={() => {
              // Second modal
              addStack({
                type: "modal",
                isConfirm: true,
                variant: "success",
                title: "Second Modal",
                description: "This modal is stacked on top of the first one.",
                content: (
                  <div className="text-sm text-gray-600">
                    You can open multiple modals and they will stack properly with backdrop management.
                  </div>
                ),
                confirmText: "Complete",
                cancelText: "Close All",
                onConfirm: () => {
                  alert("Success action completed!");
                  clearStacks();
                },
                onCancel: () => clearStacks()
              });
            }}
          >
            Open Second Modal
          </Button>
        </div>
      ),
      footer: (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => clearStacks()}>
            Close
          </Button>
        </div>
      ),
    });
  };

  return (
    <>
      <div className="space-y-2 mb-2">
        <h2 className="text-2xl font-bold mb-0">Stacks (Modals & Sheets)</h2>
        <i className="text-gray-400 text-lg">
          A powerful modal and sheet system that supports stacking, animations, and various types of content.
        </i>
      </div>

      <div className="space-y-4">
        {/* Basic Confirmation Modals */}
        <ComponentExample
          title="Confirmation Modals"
          description="Confirmation modals with different variants and styles"
          code={`import { useUIStore } from "@/stores/uiStore";
import { Button } from "@/components/ui/button";

const { addStack, clearStacks } = useUIStore();

const showConfirmationModal = (variant = "warning") => {
  addStack({
    type: "modal",
    isConfirm: true,
    variant,
    title: "Confirmation Required",
    description: "This action requires your confirmation to proceed.",
    content: (
      <div className="text-sm text-gray-600">
        Are you sure you want to continue?
      </div>
    ),
    confirmText: "Confirm",
    cancelText: "Cancel",
    onConfirm: () => {
      alert(\`\${variant} action confirmed!\`);
      clearStacks();
    },
    onCancel: () => clearStacks()
  });
};`}
        >
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => showConfirmationModal("warning")}
              variant="filled"
              color="warning"
              icon={<AlertCircle className="h-4 w-4" />}
            >
              Warning Modal
            </Button>
            <Button
              onClick={() => showConfirmationModal("success")}
              variant="filled"
              color="success"
              icon={<CheckCircle className="h-4 w-4" />}
            >
              Success Modal
            </Button>
            <Button
              onClick={() => showConfirmationModal("error")}
              variant="filled"
              color="danger"
              icon={<XCircle className="h-4 w-4" />}
            >
              Error Modal
            </Button>
          </div>
        </ComponentExample>

        {/* Alert Modals */}
        <ComponentExample
          title="Alert Modals"
          description="Informational alert modals with different sizes"
          code={`import { useUIStore } from "@/stores/uiStore";

const { addStack } = useUIStore();

const showAlertModal = (size = "md") => {
  addStack({
    type: "modal",
    title: "Information Alert",
    description: "This is an informational alert message.",
    size,
    content: (
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          Alert content goes here...
        </p>
      </div>
    ),
    footer: (
      <div className="flex justify-end">
        <Button onClick={() => clearStacks()}>
          Got it
        </Button>
      </div>
    ),
  });
};`}
        >
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => showAlertModal("sm")}
              variant="outline"
            >
              Small Alert
            </Button>
            <Button
              onClick={() => showAlertModal("md")}
              variant="outline"
            >
              Medium Alert
            </Button>
            <Button
              onClick={() => showAlertModal("lg")}
              variant="outline"
            >
              Large Alert
            </Button>
          </div>
        </ComponentExample>

        {/* Sheet Examples */}
        <ComponentExample
          title="Sheet Examples"
          description="Sliding panels that appear from different sides of the screen"
          code={`import { useUIStore } from "@/stores/uiStore";

const { addStack } = useUIStore();

const showSheet = (position = "right", size = "md") => {
  addStack({
    type: "sheet",
    position,
    size,
    title: "Sheet Example",
    description: "This is a sliding sheet panel",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          Sheets are useful for displaying information or forms.
        </p>
      </div>
    ),
    confirmText: "Save",
    cancelText: "Cancel",
    onConfirm: () => {
      alert("Sheet action confirmed!");
      clearStacks();
    },
    onCancel: () => clearStacks()
  });
};`}
        >
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => showSheet("right", "md")}
              variant="filled"
              color="primary"
            >
              Right Sheet
            </Button>
            <Button
              onClick={() => showSheet("left", "md")}
              variant="filled"
              color="secondary"
            >
              Left Sheet
            </Button>
            <Button
              onClick={() => showSheet("bottom", "lg")}
              variant="filled"
              color="info"
            >
              Bottom Sheet
            </Button>
          </div>
        </ComponentExample>

        {/* Stacked Modals */}
        <ComponentExample
          title="Stacked Modals"
          description="Multiple modals that can be opened on top of each other"
          code={`import { useUIStore } from "@/stores/uiStore";

const { addStack } = useUIStore();

const showStackedModals = () => {
  // First modal
  addStack({
    type: "modal",
    title: "First Modal",
    content: (
      <Button onClick={() => {
        // Second modal stacked on top
        addStack({
          type: "modal",
          isConfirm: true,
          title: "Second Modal",
          // ... modal configuration
        });
      }}>
        Open Second Modal
      </Button>
    ),
  });
};`}
        >
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={showStackedModals}
              variant="filled"
              color="primary"
            >
              Open Stacked Modals
            </Button>
            <Button
              onClick={() => clearStacks()}
              variant="outline"
              color="secondary"
            >
              Clear All Stacks
            </Button>
          </div>
        </ComponentExample>

        {/* Stack Management */}
        <ComponentExample
          title="Stack Management"
          description="Methods for managing the modal stack"
          code={`import { useUIStore } from "@/stores/uiStore";

const { addStack, closeStack, clearStacks } = useUIStore();

// Add a new modal to the stack
addStack({ type: "modal", title: "New Modal" });

// Close the topmost modal
closeStack();

// Close a specific modal by ID
closeStack(modalId);

// Clear all modals from the stack
clearStacks();`}
        >
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => addStack({
                type: "modal",
                title: "Quick Alert",
                content: <p>This is a quick alert message.</p>,
                footer: <Button onClick={() => clearStacks()}>Close</Button>
              })}
              variant="soft"
              color="info"
            >
              Add to Stack
            </Button>
            <Button
              onClick={() => clearStacks()}
              variant="soft"
              color="secondary"
            >
              Clear Stack
            </Button>
          </div>
        </ComponentExample>

        {/* Stack Props */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Stack Props</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prop</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">type</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"modal" | "sheet"</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"modal"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Type of stack to display</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">isConfirm</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">boolean</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">false</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Whether the modal is a confirmation dialog</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">title</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">""</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Title of the modal or sheet</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">description</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">""</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Description text below the title</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">content</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ReactNode</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">null</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Main content of the modal or sheet</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">footer</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ReactNode</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">null</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Footer content (usually buttons)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">confirmText</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"Confirm"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Text for the confirm button</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">cancelText</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"Cancel"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Text for the cancel button</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">onConfirm</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">function</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Function called when confirm button is clicked</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">onCancel</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">function</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Function called when cancel button is clicked</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">variant</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"warning" | "success" | "error"</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"warning"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Visual variant for confirmation modals</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">size</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"sm" | "md" | "lg"</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"md"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Size of the modal or sheet</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">position</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"left" | "right" | "bottom"</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"right"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Position from which the sheet appears (sheet only)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">id</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string | number</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">auto-generated</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Unique identifier for the stack item</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">isLoading</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">boolean</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">false</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Shows loading state on confirm button</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Store Methods */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Store Methods</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameters</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">addStack</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">stackProps: Object</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Add a new modal or sheet to the stack</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">closeStack</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">id?: string | number</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Close a specific stack item or the topmost one</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">clearStacks</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">none</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Clear all items from the stack</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default StackExample;