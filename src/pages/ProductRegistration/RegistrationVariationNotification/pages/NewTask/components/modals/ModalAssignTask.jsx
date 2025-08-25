import { useState, useEffect } from "react";
import {
  Badge,
  Button,
  Checkbox,
  Form,
  Info,
  Input,
  Select,
  Sheet,
} from "@/components/Dexain";
import { useToast } from "@/hooks/use-toast";
import { useUIStore } from "@/stores/uiStore";
import { z } from "zod";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/** Icons */
import { SendHorizontal } from "lucide-react";

/** Hooks */
import { useGetUsers } from "@/hooks/master-data/useMasterData";
import { usePostAssignTask } from "@/pages/ProductRegistration/RegistrationVariationNotification/hooks/useTask";
import { CancelConfirmation } from "../CancelConfirmation";

export const AssignTaskModal = ({
  selectedChangeControls = [],
  productInfo = {},
  onRefetch,
  onClose,
  onFinish,
  onSwitchTab,
}) => {
  // UI Store and Toast
  const { toast } = useToast();
  const {
    openModal,
    addStack,
    closeStack,
    clearStacks,
    closeModal,
  } = useUIStore();

  /** Hooks Call */ 
  // filter cuman user yang role nya RA_OPS
  const { users: picRaOpsUsers, isLoading: isLoadingPicRaOpsUsers } = useGetUsers({
    ROLE_CODE: "RA_OPS",
  });

  
  const { mutateAsync: postAssignTask, isLoading: isLoadingPostAssignTask } =
    usePostAssignTask();

  // Registration type state - only one can be active at a time
  const [registrationType, setRegistrationType] = useState("");

  // Pre-fill registration type from selected change controls and prevent manual alteration
  useEffect(() => {
    if (selectedChangeControls && selectedChangeControls.length > 0) {
      // If multiple unique types exist, default to the first one found
      const uniqueTypes = [...new Set(selectedChangeControls.map(cc => cc.REGISTRATION_TYPE))];
      if (uniqueTypes.length > 0) {
        setRegistrationType(uniqueTypes[0]);
      }
    }
  }, [selectedChangeControls]);

  // Loading state for assignment
  const [isAssigning, setIsAssigning] = useState(false);

  // Form reset function
  const [formKey, setFormKey] = useState(0);

  // Cancel confirmation popup state
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  // Form methods for external submit trigger
  const formMethods = useForm({
    resolver: zodResolver(z.object({
      PIC_RA_USER_ID: z.string().min(1, "PIC is required"),
      REGISTRATION_TYPE: z.string().min(1, "Registration type is required"),
    })),
    defaultValues: {
      PIC_RA_USER_ID: "",
      REGISTRATION_TYPE: registrationType,
    },
  });

  // Sync registrationType with form
  useEffect(() => {
    formMethods.setValue("REGISTRATION_TYPE", registrationType);
  }, [registrationType, formMethods]);

  // Reset form when formKey changes (only reset when formKey changes, not registrationType)
  useEffect(() => {
    formMethods.reset({
      PIC_RA_USER_ID: "",
      REGISTRATION_TYPE: "",
    });
  }, [formKey, formMethods]);

  // Check if form has any data filled
  const hasFormData = () => {
    return registrationType !== "";
  };

  // Cancel confirmation popup functions
  const showCancelConfirmationPopup = () => {
    if (hasFormData()) {
      setShowCancelPopup(true);
    } else {
      // Directly close stack and modal if no data
      clearStacks();
      onClose();
    }
  };

  const handleCancelConfirm = () => {
    setShowCancelPopup(false);
    clearStacks();
    onClose();
  };

  const handleCancelCancel = () => {
    setShowCancelPopup(false);
  };

  // API calls
  // const assignTasksMutation = useMutation(assignTasks);

  const handleRegistrationTypeChange = (value) => {
    // Set new type
    setRegistrationType(value);
  };

  // Function to trigger form submission from external button
  const handleExternalSubmit = () => {
    formMethods.handleSubmit(handleSubmit)();
  };

  // Helper function to get selected PIC details
  const getSelectedPicDetails = (picId) => {
    const selectedOption = picRaOpsUsers.find((opt) => opt.value === picId);
    return selectedOption || {};
  };

  const handleSubmit = async (data) => {
    const selectedPic = picRaOpsUsers.find(
      (user) => user.USER_ID === data.PIC_RA_USER_ID
    );


    /** Open Stack for Confirm Data */
    addStack({
      title: "Sent Assignment to PIC RA?",
      description: "Please review again because this action cannot be undone.",
      variant: "warning",
      size: "md",
      confirmText: (
        <div className="flex items-center gap-2">
          Confirm
          <SendHorizontal className="size-4" />
        </div>
      ),
      onCancel: () => {
        closeStack();
      },
      onConfirm: async () => {
        closeStack();
        const selectedPic = picRaOpsUsers.find(
          (user) => user.USER_ID === data.PIC_RA_USER_ID
        );
        const picRaPosCode = selectedPic?.POSITION_CODE;
        
        const payload = {
          ...data,
          PIC_RA_POSITION_CODE: picRaPosCode,
          TASK_ID: selectedChangeControls.map((cc) =>
            parseInt(cc.TASK_ID)
          ),
        };

          
        onClose();
        clearStacks();
        try {
          const response = await postAssignTask(payload);
          
          if (onRefetch) onRefetch();
          if(onFinish) onFinish();
          // clear stacks
          
          addStack({
            title: "Successfully Add MA Submission",
            description:
              "Well done! The MA has now been assigned to the RA PIC.",
            variant: "success",
            size: "md",
            content: (
              <div className="max-h-[30vh] overflow-y-auto space-y-4">
                <div className="bg-tertiary-soft p-6 rounded-lg space-y-4">
                <div>
                    <span className="text-sm text-gray-400 block mb-1 text-left">
                      Submission ID
                    </span>
                    {/* ini dapetnya dari response.submision no */}
                    <div className="font-semibold text-gray-900 text-left text-sm">
                      {response.SUBMISSION_NO}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400 block mb-1 text-left">
                      Finished Product
                    </span>
                    <div className="font-semibold text-gray-900 text-left text-sm">
                      {productInfo.FINISHED_PRODUCT_DESCRIPTION}
                    </div>
                  </div>
      
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <span className="text-sm text-gray-400 block mb-1 text-left">
                        Marketing Authorization Holder
                      </span>
                      <div className="font-semibold text-gray-900 text-left text-sm">
                        {productInfo.NIE_MA_HOLDER}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400 block mb-1 text-left">
                        Manufacturing Site
                      </span>
                      <div className="font-semibold text-gray-900 text-left text-sm">
                        {productInfo.MANUFACTURING_SITE}
                      </div>
                    </div>
                  </div>
      
                  <div className="border-t border-gray-200 pt-4">
                  </div>
      
                  {/* PIC & Assign Date */}
                  <div className="grid grid-cols-2 gap-6 mt-[-4px]">
                    <div>
                      <span className="text-sm text-gray-400 block mb-1 text-left">PIC</span>
                      <div className="font-semibold text-gray-900 text-left text-sm">
                        {selectedPic.NAME}
                      </div>
                      <div className="text-sm text-primary-normal">
                        {selectedPic.email || selectedPic.EMAIL}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400 block mb-1 text-left">Assign Date</span>
                      <div className="font-semibold text-gray-900 text-left text-sm">
                        {new Date().toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            ),
            footer: (
              <div className="flex flex-col items-center gap-2 w-full">
                <div className="w-full font-bold">
                  <Button
                    className="w-full"
                    variant="outline"
                    color="primary"
                    onClick={() => {
                      clearStacks();
                    }}
                  >
                    Back to List New Task
                  </Button>
                </div>
                <div className="w-full font-bold">
                    <Button className="w-full"
                      onClick={() => {
                        clearStacks();
                        onClose();
                        onSwitchTab('SUBMISSION_MONITORING');
                      }}
                    >
                      Go to Submission Monitoring
                    </Button>
                </div>
                  
                </div>
              ),
            });
        } catch (error) {
          console.error(error);
          if (onFinish) onFinish();
          if (onRefetch) onRefetch();
        }
      },
      content: (
        <div className="space-y-4 max-h-[30vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="bg-tertiary-soft p-4 rounded-lg">
              <div className="space-y-3 text-lg">
                {/* Finished Product */}
                <div className="text-left">
                  <span className="text-sm text-gray-400 block mb-1">
                    Finished Product
                  </span>
                  <div className="font-semibold text-gray-900 text-sm">
                    {productInfo.FINISHED_PRODUCT_DESCRIPTION}
                  </div>
                </div>

                {/* MA Holder & Manufacturing Site */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-left">
                    <span className="text-sm text-gray-400 block mb-1">
                      Marketing Authorization Holder
                    </span>
                    <div className="font-semibold text-gray-900 text-sm">
                      {productInfo.NIE_MA_HOLDER}
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="text-sm text-gray-400 block mb-1">
                      Manufacturing Site
                    </span>
                    <div className="font-semibold text-gray-900 text-sm">
                      {productInfo.MANUFACTURING_SITE}
                    </div>
                  </div>
                </div>
                {/* separator line */}
                <hr className="border-gray-200" />

                {/* PIC */}
                <div className="text-left">
                  <span className="text-sm text-gray-400 block mb-1">PIC</span>
                  <div className="font-semibold text-gray-900 text-sm">
                    {selectedPic?.NAME || "N/A"}
                  </div>
                  <div className="text-sm text-primary-normal">
                    {selectedPic?.EMAIL || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    });
  };


  return (
    <div className="max-w-5xl mx-auto max-h-[80vh] overflow-hidden flex flex-col bg-white rounded-lg">
      {/* Header */}
      <div className="bg-tertiary-soft p-3 rounded-lg -mx-6">
        <div className="flex items-center gap-3 px-6">
          <span className="text-sm font-medium text-gray-600">
            Submission ID
          </span>
          <Badge
            variant="outline"
            className="bg-white text-gray-500 border-gray-300 text-xs"
          >
            Auto generated
          </Badge>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 min-h-0">
        <div className="px-6 py-6">
          <Form
            methods={formMethods}
            onSubmit={handleSubmit}
          >
            {/* Product Information */}
            <div className="space-y-8 mb-3">
              <div className="flex flex-col gap-4">
                <Info
                  label="Finished Product"
                  value={productInfo.FINISHED_PRODUCT_DESCRIPTION}
                  valueClassName="font-semibold"
                />

                <div className="grid grid-cols-3 gap-x-8">
                  <div>
                    <Info
                      label="Marketing Authorization Holder"
                      value={productInfo.NIE_MA_HOLDER}
                    />
                  </div>
                  <div>
                    <Info
                      label="Manufacturing Site"
                      value={productInfo.MANUFACTURING_SITE}
                    />
                  </div>
                  <div>
                    <Info label="Country" value={productInfo.COUNTRY} />
                  </div>
                  <div></div>
                </div>
              </div>
            </div>

            {/* Separator Line */}
            <hr className="border-gray-200 mb-6" />

            {/* Selected Change Controls */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold">
                {selectedChangeControls.length} Change Control(s) selected
              </h3>
              <div className="bg-tertiary-soft p-4 rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-2 text-left">Change Control</th>
                        <th className="py-2 text-left">Registration Method</th>
                        <th className="py-2 text-left">Task Source</th>
                        <th className="py-2 text-left">Create Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedChangeControls.map((cc, index) => (
                        <tr
                          key={cc.TASK_ID || cc.CC_NO || index}
                          className="border-b border-gray-200"
                        >
                          <td className="py-3">
                            <div className="font-medium text-primary-normal">
                              {cc.CC_NO}
                            </div>
                            <div className="text-gray-600">{cc.DETAILS}</div>
                          </td>
                          <td className="py-3 text-gray-600">
                            {cc.REGISTRATION_TYPE}
                          </td>
                          <td className="py-3 text-gray-600">{cc.SOURCE}</td>
                          <td className="py-3 text-gray-600">
                            {cc.CREATE_TASK_DATE}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Separator Line */}
            <hr className="border-gray-200 mb-6" />

            {/* Project Task Setup */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Project Task Setup</h3>

              {/* Registration Type Field */}
              <div className="grid grid-cols-2 gap-x-8 font-bold">
                <Input
                  label="Registration Type"
                  name="REGISTRATION_TYPE"
                  disabled
                  required
                />
                 
                {/* PIC Selection */}
                <div className="font-bold">
                  <Select
                    name="PIC_RA_USER_ID"
                    label="PIC"
                    searchable
                    placeholder={
                      isLoadingPicRaOpsUsers
                        ? "Loading..."
                        : "Select PIC RA Officer"
                    }
                    options={picRaOpsUsers?.map((user) => ({
                      value: user.USER_ID,
                      label: user.NAME,
                      preview: (
                        <div className="flex flex-col gap-1">
                          {user.NAME}
                          <div className="text-sm text-primary-normal font-bold">
                            {user.EMAIL}
                          </div>
                        </div>
                      ),
                    }))}
                    required
                    disabled={isLoadingPicRaOpsUsers}
                  />
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="border-t border-gray-200 px-6 py-4 flex justify-between bg-white">
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            onClick={showCancelConfirmationPopup}
            className="px-8"
          >
            Cancel
          </Button>
          
          {/* Cancel Confirmation Popup */}
          <CancelConfirmation
            show={showCancelPopup}
            onConfirm={handleCancelConfirm}
            onCancel={handleCancelCancel}
            title="Cancel Assignment"
            message="Unsaved assignment will be lost. Are you sure?"
            confirmText="Yes"
            cancelText="No"
          />
        </div>
        
        <Button
          type="button"
          onClick={handleExternalSubmit}
          className="px-8 inline-flex items-center gap-2"
          disabled={isAssigning}
        >
          Send Assignment
          <SendHorizontal className="w-5 h-5 pt-0.5" />
        </Button>
      </div>
    </div>
  );
};

