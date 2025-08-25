import errorIcon from "@/assets/icons/error.svg";
import successIcon from "@/assets/icons/success.svg";
import warningIcon from "@/assets/icons/warning.svg";
import { useUIStore } from "@/stores/uiStore";
import { memo, useCallback, useEffect, useState } from "react";

export const ConfirmationModal = memo(() => {
  const confirmationModal = useUIStore(state => state.confirmationModal);
  const closeConfirmationModal = useUIStore(state => state.closeConfirmationModal);
  const [countdown, setCountdown] = useState(null);

  // Handle close event (X button or escape key)
  const handleClose = useCallback(() => {
    if (typeof confirmationModal.onClose === 'function') {
      confirmationModal.onClose();
    } else {
      closeConfirmationModal();
    }
  }, [confirmationModal.onClose, closeConfirmationModal]);

  // ESC key close
  useEffect(() => {
    if (!confirmationModal.isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [confirmationModal.isOpen, handleClose]);

  // Auto close for success variant
  useEffect(() => {
    let timer;
    if (confirmationModal.isOpen && confirmationModal.variant === 'success' && !confirmationModal.footer) {
      const totalSeconds = 5;
      setCountdown(totalSeconds);

      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleClose();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCountdown(null);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [confirmationModal.isOpen, confirmationModal.variant, handleClose]);

  const getIcon = () => {
    switch (confirmationModal.variant) {
      case 'success':
        return successIcon;
      case 'error':
        return errorIcon;
      default:
        return warningIcon;
    }
  };

  if (!confirmationModal.isOpen) return null;

  // Prevent click outside to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      // Do nothing (prevent close on backdrop click)
      e.stopPropagation();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[var(--z-confirmation-modal)] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      onMouseDown={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 z-10 p-0 flex flex-col">
        {/* Header */}
        <div className="flex flex-col items-center justify-center px-4 pt-10">
          <img src={getIcon()} alt="icon" className="w-24 aspect-square mb-2" />
          <div className="text-xl font-bold text-center">{confirmationModal.title}</div>
          <div className="max-w-md text-sm text-muted-foreground text-center mt-1">
            {confirmationModal.description}
            {countdown !== null && (
              <div className="mt-1 text-xs font-medium">
                Closing in {countdown} second{countdown !== 1 ? 's' : ''}...
              </div>
            )}
          </div>
        </div>
        {/* Content */}
        <div className="text-center px-4 mt-4">{confirmationModal.content}</div>
        {/* Separator */}
        <div className={`my-4 border-t ${confirmationModal.footer ? "border-gray-200" : "border-transparent"}`} />
        {/* Footer */}
        {confirmationModal.footer && (
          <div className="px-4 pb-4">
            {confirmationModal.footer}
          </div>
        )}
        {/* Close button (X) */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close modal"
          tabIndex={0}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
});
