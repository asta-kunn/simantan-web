import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/uiStore";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { memo, useEffect } from "react";

export const Modal = memo(() => {
  const modal = useUIStore((state) => state.modal);
  const closeModal = useUIStore((state) => state.closeModal);
  const closeable = useUIStore((state) => state.modal.closeable);

  // Handle ESC key press to close modal if closeable
  const handleEscKeyDown = (e) => {
    if (e.key === "Escape" && closeable) {
      closeModal();
    }
  };

  /** Add event listener for ESC key when modal is open */
  useEffect(() => {
    if (modal.isOpen) {
      document.addEventListener("keydown", handleEscKeyDown);
    }

    /** Clean up event listener when component unmounts or modal closes */
    return () => {
      document.removeEventListener("keydown", handleEscKeyDown);
    };
  }, [modal.isOpen, closeable]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeable) {
      closeModal();
    }
  };

  const handleCloseModal = () => closeModal();

  return (
    <AnimatePresence>
      {modal.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`fixed inset-0 z-[var(--z-modal)] flex items-center justify-center ${modal.zIndex}`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
          />

          {/* Modal */}
          <motion.div
            key={modal.title + dayjs().unix()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(`relative w-full mx-auto bg-white rounded-lg shadow-xl overflow-hidden`, "max-w-" + modal.size, modal.className)}
          >
            {/* Header */}
            {(modal.title || closeable) && (
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex-1">
                  {modal.title && (
                    <h2 className="text-xl font-semibold text-gray-900">
                      {modal.title}
                    </h2>
                  )}
                  {modal.description && (
                    <p className="mt-1 text-sm text-gray-600">
                      {modal.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleCloseModal}
                  className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="overflow-y-auto p-4 max-h-[75vh]">
              {modal.content}
            </div>

            {/* Footer */}
            {modal.footer && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                {modal.footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
