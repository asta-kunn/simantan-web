import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Table, Button } from "@/components/Dexain";
import { SendHorizontal, Trash2 } from "lucide-react";
// import { useCcDetailSheet } from "../../../components/sheets/CcDetailSheet";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/uiStore";
import { AssignTaskModal } from "./modals/ModalAssignTask";
import { useDeleteTask } from "../../../hooks/useTask";

const TableTask = ({
  changeControls = [],
  onAssign,
  productInfo = {},
  disabled = false,
  onSelectionChange,
  onRefetch,
  persistedSelection = [],
  onSwitchTab,
  accordionId,
}) => {
  // Start with empty selection and let user interact normally
  const [selectedIds, setSelectedIds] = useState([]);
  // const { openCcDetailSheet } = useCcDetailSheet();
  const { addStack, closeStack } = useUIStore();
  const { mutate: deleteTask } = useDeleteTask();
  
  // Helper function to get consistent ID from change control object
  const getChangeControlId = (cc) => {
    return cc.TASK_ID || cc.id || cc.CC_NO;
  };

  // Check if all items are selected
  const allSelected = changeControls.length > 0 && selectedIds.length === changeControls.length;

  // Handle select all functionality
  const handleSelectAllChange = useCallback(() => {
    if (disabled) return;

    if (allSelected) {
      setSelectedIds([]);
    } else {
      const allIds = changeControls.map((cc) => getChangeControlId(cc));
      setSelectedIds(allIds);
    }
  }, [disabled, allSelected, changeControls]);

  // Handle individual row selection
  const handleSelectionChange = useCallback((value, itemId) => {
    if (disabled) return;

    setSelectedIds((prev) => {
      const isSelected = prev.includes(itemId);
      const newSelection = isSelected
        ? prev.filter((x) => x !== itemId)
        : [...prev, itemId];
      return newSelection;
    });
  }, [disabled]);

  // Function to handle delete confirmation
  const handleDeleteConfirm = useCallback(async (ccData) => {
    const ccNoToDelete = encodeURIComponent(ccData.CC_NO);
    
    deleteTask(ccNoToDelete, {
      onSuccess: async () => {
        await onRefetch?.();
        
        // Show success modal after refetch
        addStack({
          type: "modal",
          title: `Successfully Delete Change Control`,
          description: `Well done! The Change Control with CC No. ${ccData.CC_NO} has been deleted successfully.`,
          variant: "success",
          isConfirm: true,
        });
       
      },
      onError: (error) => {
        onRefetch?.();
      }
    });
  }, [deleteTask, addStack, closeStack, onRefetch]);

  // Function to show delete confirmation modal
  const handleDeleteClick = useCallback((ccData) => {
    addStack({
      title: "Are you Sure to Delete this Change Control?",
      description: "Please review again because this action cannot be undone.",
      variant: "warning",
      size: "md",
      content: (
        <div className="space-y-4 max-h-[30vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="bg-tertiary-soft p-4 rounded-lg">
              <div className="space-y-3 text-lg">
                {/* Finished Product */}
                <div className="text-left">
                  <span className="text-sm text-gray-400 block mb-1">
                    Change Control No.
                  </span>
                  <div className="font-semibold text-gray-900 text-sm">
                    {ccData.CC_NO}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <span className="text-sm text-gray-400 block mb-1 text-left">
                      Change Type
                    </span>
                    <div className="font-semibold text-gray-900 text-left text-sm">
                      {ccData.CHANGE_TYPE}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400 block mb-1 text-left">
                      Registration Type
                    </span>
                    <div className="font-semibold text-gray-900 text-left text-sm">
                      {ccData.REGISTRATION_TYPE}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400 block mb-1 text-left">
                      Task Source
                    </span>
                    <div className="font-semibold text-gray-900 text-left text-sm">
                      {ccData.SOURCE}
                    </div>
                  </div>
                </div>
                <hr className="border-gray-200" />
                <div className="text-left">
                  <span className="text-sm text-gray-400 block mb-1">Created Task Date</span>
                  <div className="font-semibold text-gray-900 text-sm">
                    {ccData.CREATE_TASK_DATE}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      onCancel: () => {
        closeStack();
      },
      onConfirm: async () => {
        closeStack();
        handleDeleteConfirm(ccData);
      }
      
    });
  }, [addStack, closeStack, handleDeleteConfirm]);

  // Initialize with persisted selection only once on mount
  React.useEffect(() => {
    if (persistedSelection && persistedSelection.length > 0) {
      setSelectedIds(persistedSelection);
    }
  }, []); // Empty dependency array - only run once

  // Notify parent when selection changes
  React.useEffect(() => {
    onSelectionChange(selectedIds.length > 0, selectedIds);
  }, [selectedIds]);

  // FIXED: Prevent event propagation to avoid accordion toggle
  const handleCcClick = useCallback((ccData, event) => {
    if (disabled) return;
    
    // Prevent event from bubbling up to accordion toggle
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Enable this when we have running project sheet
    // openCcDetailSheet(ccData, productInfo);
  }, [disabled]);

  // Function to open assignment modal
  const handleAssignClick = useCallback(() => {
    if (disabled) return;

    const selectedChangeControls = changeControls.filter((cc) =>
      selectedIds.includes(getChangeControlId(cc))
    );

    // **START: New logic to check for different registration methods**
    if (selectedChangeControls.length > 1) {
      const firstRegistrationType = selectedChangeControls[0].REGISTRATION_TYPE;
      const allSameType = selectedChangeControls.every(
        (cc) => cc.REGISTRATION_TYPE === firstRegistrationType
      );

      if (!allSameType) {
        addStack({
          title: "Inconsistent Registration Method",
          description: "Tasks with different registration methods cannot be assigned together. Please select tasks that share the same registration method.",
          variant: "warning",
          onCancel: () => {
            closeStack();
          },
        });
        return; // Stop the function here
      }
    }
    // **END: New logic**

    addStack({
      type: "modal",
      title: "Assign Task to PIC",
      description: "",
      size: "3xl",
      content: (
        <AssignTaskModal
          selectedChangeControls={selectedChangeControls}
          productInfo={productInfo}
          onRefetch={onRefetch}
          onClose={closeStack}
          onFinish={() => setSelectedIds([])}
          onSwitchTab={onSwitchTab}
        />
      ),
    });
  }, [disabled, changeControls, selectedIds, addStack, onRefetch, closeStack, onSwitchTab, productInfo]);

  // Define table columns using the global Table component structure
  const columns = useMemo(() => [
    {
      accessorKey: "CC_NO",
      header: "Change Control Details",
      filter: "text",
      cell: ({ row }) => {
        const { CC_NO, DETAILS } = row.original;
        return (
          <div className="flex flex-col">
            <span
              className={cn(
                "font-medium text-sm",
                disabled
                  ? "text-gray-400"
                  : "text-primary-normal cursor-pointer hover:underline"
              )}
              onClick={
                !disabled ? (e) => handleCcClick(row.original, e) : undefined
              }
            >
              {CC_NO}
            </span>
            <span
              className={cn(
                "text-sm",
                disabled ? "text-gray-400" : "text-gray-700"
              )}
            >
              {DETAILS}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "REGISTRATION_TYPE",
      filter: "text",
      header: "Registration Method",
      cell: ({ row }) => (
        <span className={disabled ? "text-gray-400" : ""}>
          {row.original.REGISTRATION_TYPE}
        </span>
      ),
    },
    {
      accessorKey: "SOURCE",
      header: "Task Source",
      filter: "text",
      cell: ({ row }) => (
        <span className={disabled ? "text-gray-400" : ""}>
          {row.original.SOURCE}
        </span>
      ),
    },
    {
      accessorKey: "CREATE_TASK_DATE",
      header: "Create Task Date",
      filter: "date",
      cell: ({ row }) => (
        <span className={disabled ? "text-gray-400" : ""}>
          {row.original.CREATE_TASK_DATE}
        </span>
      ),
    },
  ], [disabled, handleCcClick]);

  // Define actions for the table
  const actions = useMemo(() => [
    {
      icon: <Trash2 className="text-primary-normal w-4 h-4" />,
      label: "Delete",
      onClick: (rowData) => {
        if (!disabled) {
          handleDeleteClick(rowData);
        }
      },
      tooltip: "Delete Change Control"
    }
  ], [disabled, handleDeleteClick]);

  // Selection banner content
  const selectionBannerContent = useMemo(() => {
    if (selectedIds.length === 0 || disabled) return null;

    return (
      <>
        <span className="font-semibold text-sm">
          {selectedIds.length} Change Control
          {selectedIds.length > 1 && "s"} selected ready to assign
        </span>
        <Button
          icon={<SendHorizontal className="w-4 h-4" />}
          className="bg-primary-normal hover:bg-danger-dark text-white text-sm font-bold px-4 py-1.5 rounded-lg"
          onClick={handleAssignClick}
          disabled={disabled}
        >
          Assign Task
        </Button>
      </>
    );
  }, [selectedIds.length, disabled, handleAssignClick]);

  return (
    <div className="w-full h-full">
      <div className="w-full [&_.border]:border-0 [&_.rounded-md]:rounded-none [&_.overflow-visible]:overflow-visible [&_div.relative]:w-full [&_table]:w-full [&_.border.rounded-md]:!border-0 [&_.border.rounded-md]:!rounded-none">
        <Table
          data={changeControls}
          columns={columns}
          actions={actions}
          actionType="button"
          actionVariant="icon"
          pagination={changeControls.length > 10}
          pageSize={10}
          // Custom selection pattern
          selectedIds={selectedIds}
          onSelectionChange={handleSelectionChange}
          allSelected={allSelected}
          onSelectAllChange={handleSelectAllChange}
          getItemId={getChangeControlId}
          // Selection banner
          enableSelectionBanner={true}
          selectionBannerContent={selectionBannerContent}
          // Basic settings
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default TableTask;