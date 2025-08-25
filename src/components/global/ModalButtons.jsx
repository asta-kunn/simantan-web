import React from "react";
import { Button } from "@/components/ui/button";

const ModalButtons = ({
  onCancel,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "Confirm",
  cancelIcon = null,
  confirmIcon = null,
  disableConfirm = false,
  cancelClassName = "",
  confirmClassName = "",
  fullWidth = true,
}) => {
  const containerClasses = fullWidth
    ? "pt-6 mt-6 border-t border-dashed border-[#D2DEEB] w-full flex justify-between px-6"
    : "pt-6 mt-6 border-t border-dashed border-[#D2DEEB] flex justify-between px-6";

  return (
    <div className={containerClasses}>
      <Button
        variant="outline"
        onClick={onCancel}
        className={`flex items-center gap-2 border border-[#D2DEEB] rounded-md font-bold text-black ${cancelClassName}`}
      >
        {cancelIcon}
        {cancelText}
      </Button>
      
      <Button
        onClick={onConfirm}
        disabled={disableConfirm}
        className={`text-white flex items-center gap-2 ${
          disableConfirm
            ? 'bg-gray-400 hover:bg-gray-500' 
            : 'bg-gradient-to-r from-[#D32F2F] to-[#7F1710] hover:opacity-90'
        } ${confirmClassName}`}
      >
        {confirmText}
        {confirmIcon}
      </Button>
    </div>
  );
};

export default ModalButtons; 