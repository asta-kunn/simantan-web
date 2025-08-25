import { Button } from "@/components/Dexain";
import { useUIStore } from "@/stores/uiStore";
import { ComponentExample } from "./ComponentExample";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

export const ComponentSlot = ({ containerClassName, textClassName, subTextClassName }) => (
  <div className={cn("flex flex-col justify-center items-center gap-1 w-full h-full bg-info-normal/25 border-dashed border-2 border-info-normal rounded-md", containerClassName)}>
    <h4 className={cn("font-bold text-xl text-info-normal", textClassName)}>[Component Slot]</h4>
    <p className={cn("text-sm text-info-normal", subTextClassName)}>Swap instance to change the component.</p>
  </div>
)

export const ComponentSlotImage = ({ containerClassName }) => (
  <div className={cn("flex flex-col justify-center items-center gap-1 w-full h-full bg-info-normal/25 border-dashed border-2 border-info-normal rounded-md", containerClassName)}>
    <ImageIcon className="size-12 text-info-normal" />
  </div>
)

const ModalExample = () => {
  const { openConfirmationModal, closeConfirmationModal } = useUIStore();

  const openDefaultModal = (variant = "default", onOk = () => alert("Clicked Here!")) => {
    openConfirmationModal({
      title: "Basic Modal",
      description: "Hello, this is a modal description.",
      variant,
      footer: (
        <div className="w-full flex justify-between gap-2">
          <Button color="tertiary" variant="outline" onClick={closeConfirmationModal}>Cancel</Button>
          <Button onClick={onOk}>Confirm</Button>
        </div>
      )
    });
  };

  const openConfirmationModalWithContent = (variant = "success", onOk = () => alert("Clicked Here!")) => {
    openConfirmationModal({
      title: "Success Modal",
      variant,
      description: "Hello, this is a modal description.",
      content: <ComponentSlot containerClassName="h-36" />,
      footer: (
        <div className="w-full flex justify-between gap-2">
          <Button color="tertiary" variant="outline" onClick={closeConfirmationModal}>Cancel</Button>
          <Button onClick={onOk}>Confirm</Button>
        </div>
      )
    });
  };

  const stepModalOptions = [
    {
      title: "Step 1: Basic Information",
      description: "Enter basic details",
      variant: "error",
      content: <ComponentSlot containerClassName="h-24" />,
      onOk: () => alert("Form read successfully!"),
    },
    {
      title: "Step 2: Additional Details",
      description: "Provide additional information",
      variant: "warning",
      content: <ComponentSlot containerClassName="h-48" />,
      onOk: () => alert("Form reviewed successfully!"),
    },
    {
      title: "Step 3: Review & Submit",
      description: "Review and confirm your information",
      variant: "success",
      content: <ComponentSlot containerClassName="h-36" />,
      onOk: () => alert("Form submitted successfully!"),
    }
  ];

  const openStepModal = async (options, index = 0) => {
    closeConfirmationModal();
    await new Promise(resolve => setTimeout(resolve, 250));

    const isLastStep = index === options.length - 1;
    const currentStep = index + 1;
    const totalSteps = options.length;

    openConfirmationModal({
      ...options[index],
      description: (
        <div className="space-y-2">
          <p>{options[index].description}</p>
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </p>
        </div>
      ),
      footer: (
        <div className="w-full flex justify-between gap-2">
          <div className="flex gap-2">
            <Button
              color="tertiary"
              variant="outline"
              onClick={closeConfirmationModal}
            >
              Cancel
            </Button>
            {index > 0 && (
              <Button
                color="tertiary"
                variant="outline"
                onClick={() => openStepModal(options, index - 1)}
              >
                Previous
              </Button>
            )}
          </div>
          <Button
            onClick={() => {
              options[index].onOk();
              openStepModal(options, index + 1)
            }}
          >
            {isLastStep ? 'Submit' : 'Next'}
          </Button>
        </div>
      )
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Modal</h2>
        <i className="text-gray-400 text-lg">
          A modal dialog component that interrupts the user with important content and expects a response.
        </i>
      </div>

      <div className="space-y-4">
        <ComponentExample
          title="Basic Modal"
          description="Simple modal with title, description, content and footer buttons"
          code={`import { useUIStore } from "@/stores/uiStore";

const openConfirmationModal = useUIStore(state => state.openConfirmationModal);

openConfirmationModal({
  title: "Basic Modal",
  variant: "default",
  description: "This is a basic modal example",
  footer: (
    <div className="flex justify-end gap-2">
      <Button variant="secondary">Cancel</Button>
      <Button>Confirm</Button>
    </div>
  )
});

openConfirmationModal({
  title: "Basic Modal",
  variant: "success",
  description: "This is a basic modal example",
  footer: (
    <div className="flex justify-end gap-2">
      <Button variant="secondary">Cancel</Button>
      <Button>Confirm</Button>
    </div>
  )
});

openConfirmationModal({
  title: "Basic Modal",
  variant: "error",
  description: "This is a basic modal example",
  footer: (
    <div className="flex justify-end gap-2">  
      <Button variant="secondary">Cancel</Button>
      <Button>Confirm</Button>
    </div>
  )
});`}
        >
          <div className="flex gap-2">
            <Button onClick={() => openDefaultModal("default")}>Open Default Modal</Button>
            <Button onClick={() => openDefaultModal("success", () => alert("Success!!!"))}>Open Success Modal</Button>
            <Button onClick={() => openDefaultModal("error", () => alert("Error!!!"))}>Open Error Modal</Button>
          </div>
        </ComponentExample>

        <ComponentExample
          title="Modal with Content"
          description="Modal with content"
          code={`import { useUIStore } from "@/stores/uiStore";

const openConfirmationModal = useUIStore(state => state.openConfirmationModal);

openConfirmationModal({
  title: "Success Modal",
  variant: "success",
  description: "Operation completed successfully", 
  content: "Your changes have been saved",
  footer: (
    <div className="flex justify-end">
      <Button>Close</Button>
    </div>
  )
});`
          }
        >
          <div className="flex gap-2">
            <Button onClick={() => openConfirmationModalWithContent("default")}>Open Default Modal</Button>
            <Button onClick={() => openConfirmationModalWithContent("success", () => alert("Success!!!"))}>Open Success Modal</Button>
            <Button onClick={() => openConfirmationModalWithContent("error", () => alert("Error!!!"))}>Open Error Modal</Button>
            <Button onClick={() => openStepModal(stepModalOptions)}>Open Step Modal</Button>
          </div>
        </ComponentExample>

        <div className="mt-12 border rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-medium mb-4">Props Reference</h3>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">title</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td className="px-6 py-4 text-sm text-gray-500">The title displayed at the top of the modal</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">description</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Secondary text displayed below the title</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">content</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ReactNode</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td className="px-6 py-4 text-sm text-gray-500">The main content of the modal</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">footer</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ReactNode</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Content displayed at the bottom of the modal, typically action buttons</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">variant</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">'default' | 'success' | 'error' | 'warning'</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">'warning'</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Controls the icon and style of the modal</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">onConfirm</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">function</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Callback function called when modal is confirmed</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">onCancel</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">function</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Callback function called when modal is cancelled</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalExample;