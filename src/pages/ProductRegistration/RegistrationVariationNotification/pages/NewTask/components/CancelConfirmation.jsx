import React from "react";
import { Button } from "@/components/Dexain";
import warningIcon from "@/assets/icons/warning.svg";

/**
 * CancelConfirmation - A reusable cancel confirmation popup component
 * 
 * Usage example:
 * <CancelConfirmation
 *   show={showPopup}
 *   onConfirm={() => console.log("Confirmed")}
 *   onCancel={() => console.log("Cancelled")}
 *   title="Cancel Task"
 *   message="Are you sure you want to cancel?"
 *   confirmText="Yes, Cancel"
 *   cancelText="No, Keep"
 *   className="custom-class"
 *   tailPosition="left" // or "right"
 *   customTailPosition={60} // custom position in pixels from right edge (optional)
 * />
 */
export const CancelConfirmation = ({ 
  show, 
  onConfirm, 
  onCancel,
  title = "Cancel",
  message = "Unsaved data will be lost. Are you sure?",
  confirmText = "Yes",
  cancelText = "No",
  className = "",
  tailPosition = "left", // "left" for left tail (bubble to right), "right" for right tail (bubble to left)
  customTailPosition = null // custom position for tail in pixels from right edge
}) => {
  if (!show) return null;

  const getTailStyles = () => {
    if (customTailPosition !== null) {
      // Use custom positioning
      return {
        className: "",
        style: { right: `${customTailPosition}px` }
      };
    }
    
    // Use default positioning
    return {
      className: tailPosition === "right" ? "right-4" : "left-4",
      style: {}
    };
  };

  const tailStyles = getTailStyles();
  
  return (
    <div className={`absolute bottom-full mb-1 w-64 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-100 p-4 z-[9999] animate-in fade-in-0 zoom-in-95 duration-200 ${className}`}>
      {/* Chat bubble tail - triangle pointing to button */}
      {tailPosition === "left" ? (
        // Left tail (bubble positioned to the right of trigger)
        <>
          <div 
            className={`absolute top-full w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[10px] border-t-white drop-shadow-sm ${tailStyles.className}`}
            style={tailStyles.style}
          ></div>
          <div 
            className={`absolute top-full w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[10px] border-t-gray-100 transform translate-y-[1px] ${tailStyles.className}`}
            style={tailStyles.style}
          ></div>
        </>
      ) : (
        // Right tail (bubble positioned to the left of trigger)
        <>
          <div 
            className={`absolute top-full w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[10px] border-t-white drop-shadow-sm ${tailStyles.className}`}
            style={tailStyles.style}
          ></div>
          <div 
            className={`absolute top-full w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[10px] border-t-gray-100 transform translate-y-[1px] ${tailStyles.className}`}
            style={tailStyles.style}
          ></div>
        </>
      )}
      
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          {/* buat dia agak naik sejajar dengan cancel */}
          <div className="pb-[7px]">
            <img src={warningIcon} alt="warning" className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-0.5">{title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {message}
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={onCancel}
            className="px-4 py-1.5 text-xs h-8 rounded-lg border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className="px-4 py-1.5 text-xs h-8 bg-gradient-to-r from-danger-normal text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
