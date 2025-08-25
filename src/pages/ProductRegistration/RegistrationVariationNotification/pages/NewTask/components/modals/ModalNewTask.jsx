import React, { useState, useEffect, useCallback, useRef } from "react";
// impor use memo
import { useMemo } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, SendHorizontal } from "lucide-react";
import { z } from "zod";
import { Button, Input, Select, SuggestionInput } from "@/components/Dexain";
import dayjs from "dayjs";

import { useToast } from "@/hooks/use-toast";
import { useUIStore } from "@/stores/uiStore";
import {
  useGetCountries,
  useGetFinishedProducts,
  useGetChangeType,
} from "@/hooks/master-data/useMasterData";
import { usePostNewTask } from "@/pages/ProductRegistration/RegistrationVariationNotification/hooks/useTask";
import { CancelConfirmation } from "../CancelConfirmation";

/** Services */
import { getFinishedProducts } from "@/services/master-data.service";

// Schema validation
const ChangeControlSchema = z.object({
  ccNo: z.string().nonempty("CC No is required").transform(val => val.toUpperCase()),
  changeType: z.string().nonempty("Change Type is required"),
  registrationType: z.string().nonempty("Registration Type is required"),
});

const NewSubmissionSchema = z.object({
  finishedProduct: z.string().nonempty("Finished Product is required"),
  marketingAuthorizationHolder: z
    .string()
    .nonempty("Marketing Authorization Holder is required"),
  manufacturingSite: z.string().nonempty("Manufacturing Site is required"),
  country: z.string().nonempty("Country is required"),
  changeControls: z
    .array(ChangeControlSchema)
    .min(1, "At least one Change Control is required"),
});

const defaultValues = {
  finishedProduct: "",
  marketingAuthorizationHolder: "",
  manufacturingSite: "",
  country: "",
  changeControls: [{ ccNo: "", changeType: "", registrationType: "" }],
};

const registrationTypeOptions = [
  { value: "Reg Variation", label: "Reg Variation" },
  { value: "Reg Notification", label: "Reg Notification" },
];

export const ModalNewTask = ({ open, onOpenChange, onSave, onRefetch }) => {
  // States
  const [changeTypeOptions, setChangeTypeOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIngredient, setActiveIngredient] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState({});
  const [deleteButtonPosition, setDeleteButtonPosition] = useState({});
  const deleteButtonRefs = useRef({});
  const modalRef = useRef(null);

  const { toast } = useToast();
  const { addStack, closeStack, clearStacks, closeModal, openModal } =
    useUIStore();

  // API Mutations - following approval detail pattern
  const { mutateAsync: postNewTaskAsync, isPending: isPendingPostNewTask } =
    usePostNewTask();

  const { countries, isLoading: isLoadingCountries } = useGetCountries();
  const { finishedProductsData, isLoading: isLoadingProducts } =
    useGetFinishedProducts(searchQuery);
  const { changeTypeData, isLoading: isLoadingChangeType } = useGetChangeType();

  // Form setup
  const methods = useForm({
    resolver: zodResolver(NewSubmissionSchema),
    defaultValues,
    mode: "onSubmit", // Trigger validation only on submit
  });

  const {
    handleSubmit,
    formState: { isValid, errors, isSubmitted },
    reset,
    setValue,
    trigger,
    watch,
  } = methods;

  // Watch form values to check if form has any data
  const formValues = watch();
  const { fields, append, remove } = useFieldArray({
    name: "changeControls",
    control: methods.control,
  });

  // Fetch change type data - like fetchDataDetailTask pattern
  const fetchChangeTypeData = useCallback(async () => {
    if (changeTypeData && Array.isArray(changeTypeData)) {
      const changeTypeOpts = changeTypeData.map((changeType) => ({
        value: changeType.SUBCATEGORY,
        label: changeType.SUBCATEGORY,
      }));
      setChangeTypeOptions(changeTypeOpts);
    }
  }, [changeTypeData]);


  const handleOnSearchFinishedProduct = useCallback(async (query) => {
    try {
      const result = await getFinishedProducts(query, 'Y');
      if (result) {
        return result.map((item, index) => ({
          id: index,
          value: item.ITEM_MASTER_DESCRIPTION,
          label: item.ITEM_MASTER_DESCRIPTION,
          data: item,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  }, []);


  // Check if form has any data filled
  const hasFormData = () => {
    if (!formValues) return false;

    // Check if any main field has value
    if (
      formValues.finishedProduct ||
      formValues.marketingAuthorizationHolder ||
      formValues.manufacturingSite ||
      formValues.country
    ) {
      return true;
    }

    // Check if any change control has value
    if (formValues.changeControls && formValues.changeControls.length > 0) {
      return formValues.changeControls.some(
        (cc) => cc.ccNo || cc.changeType || cc.registrationType
      );
    }

    return false;
  };

  // cancel confirmation popup
  const showCancelConfirmationPopup = () => {
    // Only show popup if form has data
    if (hasFormData()) {
      setShowCancelPopup(true);
    } else {
      // Directly close stack and modal if no data
      clearStacks();
      onOpenChange(false);
      reset();
      setShowDeleteConfirmation({});
      setDeleteButtonPosition({});
    }
  };

  const handleCancelConfirm = () => {
    setShowCancelPopup(false);
    onOpenChange(false);
    reset();
    setShowDeleteConfirmation({});
    setDeleteButtonPosition({});
    // Clear any existing stacks
    clearStacks();
  };

  const handleCancelCancel = () => {
    setShowCancelPopup(false);
  };

  // Check if a specific change control row has data
  const hasChangeControlData = (index) => {
    const changeControls = formValues.changeControls;
    if (!changeControls || !changeControls[index]) return false;
    
    const cc = changeControls[index];
    return cc.ccNo || cc.changeType || cc.registrationType;
  };

  // Handle delete change control with confirmation
  const handleDeleteChangeControl = (index) => {
    if (hasChangeControlData(index)) {
      // Get button position relative to modal container
      const buttonElement = deleteButtonRefs.current[index];
      const modalContainer = modalRef.current;
      
      if (buttonElement && modalContainer) {
        const buttonRect = buttonElement.getBoundingClientRect();
        const modalRect = modalContainer.getBoundingClientRect();
        
        // Calculate position to align popup with trash icon
        const buttonCenterX = buttonRect.left + (buttonRect.width / 2);
        const popupWidth = 256; // w-64 = 16rem = 256px
        
        // Position popup so it appears to the left of the button
        const popupLeft = buttonCenterX - modalRect.left - popupWidth + 24; // Adjust for better positioning
        
        // Calculate tail position from right edge of popup to point to button center
        const tailFromRight = 16; // Keep tail 16px from right edge
        
        setDeleteButtonPosition({
          [index]: {
            top: buttonRect.bottom - modalRect.top - 24, // Move up 4px
            left: popupLeft,
            tailPosition: tailFromRight,
          }
        });
      }
      
      // Close all other popups and open this one
      setShowDeleteConfirmation({ [index]: true });
    } else {
      remove(index);
    }
  };

  const handleDeleteConfirm = (index) => {
    remove(index);
    setShowDeleteConfirmation({});
    setDeleteButtonPosition({});
  };

  const handleDeleteCancel = (index) => {
    setShowDeleteConfirmation({});
    setDeleteButtonPosition({});
  };

  // Get manufacturing site options - updated for new structure
  const manufacturingSiteOptions =
    selectedProduct?.MANUFACTURING_SITES?.map((site) => ({
      value: site,
      label: site,
    })) || [];

  // Get active ingredient options for display
  const activeIngredientOptions = useMemo(() => {
    if (!selectedProduct?.ACTIVE_INGREDIENTS) return [];

    return selectedProduct.ACTIVE_INGREDIENTS.map((ingredient) => ({
      value: ingredient,
      label: `${ingredient}`,
    }));
  }, [selectedProduct]);

  // Submit handler - memoize with useCallback
  const handleFormSubmit = useCallback(
    async (data) => {
      // Trigger validation for all fields including nested array fields
      const isFormValid = await trigger();

      // Also specifically trigger validation for changeControls array
      await trigger("changeControls");

      if (!isFormValid) {
        return;
      }

      if (!selectedProduct) {
        toast.error("Please select a finished product");
        return;
      }

      // Keep the main modal open in the background
      addStack({
        title: "Save New Task?",
        description:
          "Please review again because this action cannot be undone.",
        variant: "warning",
        size: "md",
        confirmText: (
          <div className="flex items-center gap-2">
            Confirm
            <SendHorizontal className="size-4" />
          </div>
        ),
        isLoading: isPendingPostNewTask,
        onCancel: () => {
          closeStack();
        },
        onConfirm: async () => {
          await submitToAPIWithoutClosingModal(data);
        },
        content: (
          <div className="space-y-4 max-h-[30vh] overflow-y-auto">
            <div className="bg-tertiary-soft p-6 rounded-lg">
              <label className="block text-sm text-gray-400   text-left">
                Finished Product <span className="text-primary-normal">*</span>
              </label>
              <div className="font-semibold text-gray-900 text-left text-sm">
                {selectedProduct.ITEM_MASTER_CODE} -{" "}
                {selectedProduct.ITEM_MASTER_NAME}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="text-sm text-gray-400 block mb-1 text-left">
                    Marketing Authorization Holder
                  </span>
                  <div className="font-semibold text-gray-900 text-left text-sm">
                    {data.marketingAuthorizationHolder}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-400 block mb-1 text-left">
                    Manufacturing Site
                  </span>
                  <div className="font-semibold text-gray-900 text-left text-sm">
                    {data.manufacturingSite}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <span className="text-sm text-gray-400 block mb-3 text-left">
                  List of Change Control
                </span>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      {data.changeControls.map((cc, index) => (
                        <tr
                          key={index}
                          className={
                            index !== data.changeControls.length - 1
                              ? "border-b border-gray-200"
                              : ""
                          }
                        >
                          <td className="p-4 border-r border-gray-200">
                            <div className="font-semibold text-gray-900 text-left text-sm">
                              {cc.ccNo}
                            </div>
                            <div className="text-sm text-gray-500 text-left">
                              {cc.changeType}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-gray-900 text-left text-sm">
                              {cc.registrationType}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ),
      });
    },
    [
      selectedProduct,
      toast,
      addStack,
      closeStack,
      trigger,
      isPendingPostNewTask,
    ]
  );

  // API submission - following approval detail pattern
  const submitToAPIWithoutClosingModal = useCallback(
    async (data) => {
      const apiData = {
        // Use old field names for API compatibility but new data structure
        FINISHED_PRODUCT_ID: selectedProduct.ITEM_MASTER_ID,
        FINISHED_PRODUCT_NAME: selectedProduct.ITEM_MASTER_NAME,
        FINISHED_PRODUCT_CODE: selectedProduct.ITEM_MASTER_CODE,
        FINISHED_PRODUCT_DESCRIPTION: `${selectedProduct.ITEM_MASTER_CODE} - ${selectedProduct.ITEM_MASTER_NAME}`,
        MARKETING_AUTHORIZATION_HOLDER: data.marketingAuthorizationHolder,
        MANUFACTURING_SITE: data.manufacturingSite,
        COUNTRY: data.country,
        CHANGE_CONTROL: data.changeControls.map((cc) => ({
          CC_NO: cc.ccNo,
          CHANGE_TYPE: cc.changeType,
          REGISTRATION_TYPE: cc.registrationType,
        })),
      };

      try {
        await postNewTaskAsync(apiData);
        // Close the confirmation stack first since API call succeeded
        onOpenChange();

        closeStack();
        onRefetch();
        clearStacks();
        closeModal();

        // Refetch data
        // if (onRefetch) {
        //   onRefetch();
        // }
        // Success modal - provide options to continue or go back
        addStack({
          title: "Successfully Add MA Submission",
          description: "Well done! The MA has now been assigned to the RA PIC.",
          variant: "success",
          size: "md",
          content: (
            <div className="space-y-4 max-h-[30vh] overflow-y-auto">
              <div className="bg-tertiary-soft p-6 rounded-lg space-y-4">
                <div>
                  <label className="block text-lg text-gray-400 font-medium mb-2 text-left">
                    Finished Product{" "}
                    <span className="text-primary-normal">*</span>
                  </label>
                  <div className="font-semibold text-lg text-gray-900 text-left">
                    {selectedProduct.ITEM_MASTER_CODE} -{" "}
                    {selectedProduct.ITEM_MASTER_NAME}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-lg text-gray-400 block mb-1 text-left">
                      Marketing Authorization Holder
                    </span>
                    <div className="font-semibold text-lg text-gray-900 text-left">
                      {data.marketingAuthorizationHolder}
                    </div>
                  </div>
                  <div>
                    <span className="text-lg text-gray-400 block mb-1 text-left">
                      Manufacturing Site
                    </span>
                    <div className="font-semibold text-lg text-gray-900 text-left">
                      {data.manufacturingSite}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <span className="text-lg text-gray-400 block mb-3 text-left">
                    List of Change Control
                  </span>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        {data.changeControls.map((cc, index) => (
                          <tr
                            key={index}
                            className={
                              index !== data.changeControls.length - 1
                                ? "border-b border-gray-200"
                                : ""
                            }
                          >
                            <td className="p-4 border-r border-gray-200">
                              <div className="font-semibold text-base text-gray-900 text-left">
                                {cc.ccNo}
                              </div>
                              <div className="text-base text-gray-500 text-left">
                                {cc.changeType}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-semibold text-base text-gray-900 text-left">
                                {cc.registrationType}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-lg text-gray-400 block mb-1 text-left">
                      Task Source
                    </span>
                    <div className="font-semibold text-lg text-gray-900 text-left">
                      Innolife PLM
                    </div>
                  </div>
                  <div>
                    <span className="text-lg text-gray-400 block mb-1 text-left">
                      Task Created Date
                    </span>
                    <div className="font-semibold text-lg text-gray-900 text-left">
                      {dayjs().format("DD MMMM YYYY")}
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
                    closeModal();
                    onOpenChange(false); // Close the initial modal
                    reset();
                    if (onSave) onSave();
                  }}
                >
                  Back to List New Task
                </Button>
              </div>
            </div>
          ),
        });
      } catch (error) {
        // refetch
        onRefetch();
        closeStack();
      }
    },
    [
      selectedProduct,
      postNewTaskAsync,
      addStack,
      clearStacks,
      closeModal,
      closeStack,
      reset,
      onSave,
      onRefetch,
      onOpenChange,
    ]
  );

  // Effects - like DetailTaskTechnicalService (only run when modal opens)
  useEffect(() => {
    if (open) {
      fetchChangeTypeData();
    } else {
      // Reset states when modal closes
      setSelectedProduct(null);
      setSearchQuery("");
      setShowDeleteConfirmation({});
      setDeleteButtonPosition({});
      // reset();
    }
  }, [open, fetchChangeTypeData]);

  // Separate effect to handle change type data updates
  useEffect(() => {
    if (changeTypeData && Array.isArray(changeTypeData)) {
      fetchChangeTypeData();
    }
  }, [changeTypeData, fetchChangeTypeData]);

  // Check if countries mutation is loading
  const isLoading = isLoadingCountries || isLoadingChangeType;

  if (isLoading) {
    return (
      <div className="px-6 py-6 flex-1 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-gray-200 border-t-primary-normal mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={modalRef} className="flex flex-col h-full max-h-[80vh] relative">
      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-2">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              {/* Finished Product */}
              <div>
                <Select
                  name="finishedProduct"
                  label="Finished Product"
                  placeholder="Search for finished product..."
                  onSearch={handleOnSearchFinishedProduct}
                  searchable={true}
                  onChange={async (value, { data }) => {
                    setSelectedProduct(data);
                    setValue(
                      "marketingAuthorizationHolder",
                      data.MARKETING_AUTHORIZATION_HOLDER_NAME
                    );
                    // Auto-select first manufacturing site if only one option
                    if (data.MANUFACTURING_SITES && data.MANUFACTURING_SITES.length === 1) {
                      setValue("manufacturingSite", data.MANUFACTURING_SITES[0]);
                    } else {
                      setValue("manufacturingSite", "");
                    }
                    setValue("country", data.COUNTRY);
                    setValue(
                      "activeIngredient",
                      data.ACTIVE_INGREDIENTS.map(
                        (ingredient) => ingredient
                      )
                    );
                    setActiveIngredient(data.ACTIVE_INGREDIENTS);
                    
                    // Clear validation errors for auto-filled fields (only after form has been submitted)
                    if (isSubmitted) {
                      await trigger("marketingAuthorizationHolder");
                      await trigger("country");
                      // Only trigger manufacturingSite if it was auto-filled
                      if (data.MANUFACTURING_SITES && data.MANUFACTURING_SITES.length === 1) {
                        await trigger("manufacturingSite");
                      }
                    }
                  }}
                  required
                />
              </div>

              {/* MA Holder & MFG Site */}
              <div className="grid grid-cols-2 gap-4">
                <Select
                  name="marketingAuthorizationHolder"
                  label="Marketing Authorization Holder"
                  placeholder="Auto-filled"
                  options={
                    selectedProduct
                      ? [
                          {
                            value:
                              selectedProduct.MARKETING_AUTHORIZATION_HOLDER_NAME,
                            label:
                              selectedProduct.MARKETING_AUTHORIZATION_HOLDER_NAME,
                          },
                        ]
                      : []
                  }
                  required
                  disabled={true}
                  className="[&_button]:bg-tertiary-soft [&_button]:border-tertiary-soft"
                />

                <Select
                  name="manufacturingSite"
                  label="Manufacturing Site"
                  placeholder={
                    manufacturingSiteOptions.length === 1
                      ? "Auto-filled"
                      : "Select"
                  }
                  options={manufacturingSiteOptions}
                  searchable={manufacturingSiteOptions.length > 1}
                  required
                  disabled={manufacturingSiteOptions.length === 1}
                  className={
                    manufacturingSiteOptions.length === 1
                      ? "[&_button]:bg-tertiary-soft [&_button]:border-tertiary-soft"
                      : ""
                  }
                  onChange={async (value) => {
                    // Clear error when user selects value (only after form has been submitted)
                    if (isSubmitted && value) {
                      await trigger("manufacturingSite");
                    }
                  }}
                />
              </div>

              {/* Country - Auto-filled from product data */}
              <div>
                <Select
                  name="country"
                  label="Country"
                  placeholder="Auto-filled"
                  options={
                    selectedProduct
                      ? [
                          {
                            value: selectedProduct.COUNTRY,
                            label: selectedProduct.COUNTRY,
                          },
                        ]
                      : []
                  }
                  required
                  disabled={true}
                  className="[&_button]:bg-tertiary-soft [&_button]:border-tertiary-soft"
                />
              </div>

                {/* Active Ingredient - Display only */}
                <div>
                  <label className="block text-base font-medium mb-4">Active Ingredient</label>
                  <div className="bg-tertiary-soft border border-tertiary-soft rounded-lg p-4">
                    <ul className="list-disc list-inside">
                      {activeIngredientOptions.map((ingredient) => (
                        <li key={ingredient.value} className="text-base">
                          {ingredient.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              {/* Change Control */}
              <div>
                <label className="block text-base font-medium mb-4">
                  Change Control <span className="text-primary-normal">*</span>
                </label>

                <div className="bg-tertiary-soft rounded-lg p-4 space-y-4">
                  {/* Headers */}
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                    <div className="flex-1">
                      CC No <span className="text-primary-normal">*</span>
                    </div>
                    <div className="flex-1">
                      Change Type <span className="text-primary-normal">*</span>
                    </div>
                    <div className="flex-1">
                      Registration Type{" "}
                      <span className="text-primary-normal">*</span>
                    </div>
                    <div className="flex-none w-12">
                      {/* small column for trash icon */}
                    </div>
                  </div>

                  {/* Dynamic Fields */}
                  <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
                    {fields.map((field, i) => (
                      <div key={field.id} className="flex items-center gap-3">
                        {/* CC No */}
                        <div className="w-44 mb-[4px]">
                          <Input
                            name={`changeControls.${i}.ccNo`}
                            placeholder="Input CC No" 
                            className="h-9 bg-white w-full"
                            onInput={(e) => {
                              // Store cursor position
                              const cursorPos = e.target.selectionStart;
                              
                              // Force uppercase
                              const value = e.target.value;
                              const upperValue = value.toUpperCase();
                              e.target.value = upperValue;
                              
                              // Restore cursor position
                              e.target.setSelectionRange(cursorPos, cursorPos);
                            }}
                            onChange={async (e) => {
                              // Store cursor position
                              const cursorPos = e.target.selectionStart;
                              
                              // Convert to uppercase and update form
                              const upperValue = e.target.value.toUpperCase();
                              setValue(`changeControls.${i}.ccNo`, upperValue);
                              
                              // Restore cursor position
                              e.target.setSelectionRange(cursorPos, cursorPos);
                              
                              // Clear error when user types (only after form has been submitted)
                              if (isSubmitted && upperValue) {
                                await trigger(`changeControls.${i}.ccNo`);
                              }
                            }}
                          />
                        </div>

                        {/* Change Type  buat lebih panjang*/} 
                        <div className="w-44 ml-3">
                          <Select
                            name={`changeControls.${i}.changeType`}
                            placeholder="Select"
                            options={changeTypeOptions}
                            className="[&_button]:bg-white w-full"
                            onChange={async (value) => {
                              // Clear error when user selects value (only after form has been submitted)
                              if (isSubmitted && value) {
                                await trigger(`changeControls.${i}.changeType`);
                              }
                            }}
                          />
                        </div>

                        {/* Registration Type dari kiri kasih jarak*/}
                        <div className="w-44 ml-3">
                          <Select
                            name={`changeControls.${i}.registrationType`}
                            placeholder="Select"
                            options={registrationTypeOptions}
                            className="[&_button]:bg-white w-full"
                            onChange={async (value) => {
                              // Clear error when user selects value (only after form has been submitted)
                              if (isSubmitted && value) {
                                await trigger(
                                  `changeControls.${i}.registrationType`
                                );
                              }
                            }}
                          />
                        </div>

                        {/* Remove button (small fixed width) */}
                        <div className="flex-none w-12 flex justify-center">
                          {fields.length > 1 && (
                            <button
                              ref={(el) => deleteButtonRefs.current[i] = el}
                              type="button"
                              onClick={() => handleDeleteChangeControl(i)}
                              className="text-primary-normal hover:text-primary-dark transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add More Button */}
                  <button
                    type="button"
                    onClick={() =>
                      append({ ccNo: "", changeType: "", registrationType: "" })
                    }
                    className="inline-flex items-center text-sm font-medium hover:text-danger-dark transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1 text-danger-normal" /> Add
                    More
                  </button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>

      {/* Delete Confirmation Popup - positioned outside overflow container */}
      {Object.keys(showDeleteConfirmation).map((index) => {
        const position = deleteButtonPosition[parseInt(index)];
        if (!position || !showDeleteConfirmation[index]) return null;
        
        return (
          <div
            key={index}
            className="absolute z-[9999]"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            <CancelConfirmation
              show={true}
              onConfirm={() => handleDeleteConfirm(parseInt(index))}
              onCancel={() => handleDeleteCancel(parseInt(index))}
              title="Delete Change Control"
              message="Are you sure you want to delete this change control?"
              confirmText="Yes"
              cancelText="No"
              className=""
              tailPosition="right"
              customTailPosition={position.tailPosition}
            />
          </div>
        );
      })}

      {/* Fixed Footer */}
      <div className="flex-shrink-0 w-full px-6 py-4 flex justify-between items-center border-t border-gray-200 bg-white relative">
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
            title="Cancel"
            message="Unsaved data will be lost. Are you sure?"
            confirmText="Yes"
            cancelText="No"
            className="left-0"
            tailPosition="left"
          />
        </div>

        <Button
          type="submit"
          onClick={handleSubmit(handleFormSubmit)}
          disabled={isPendingPostNewTask}
          className="px-8 inline-flex items-center gap-2"
        >
          Save
          <SendHorizontal className="w-5 h-5 pt-0.5" />
        </Button>
      </div>
    </div>
  );
};
