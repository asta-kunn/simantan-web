import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/uiStore";
import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";

export const ProgressModal = memo(() => {
  const progressModal = useUIStore((state) => state.progressModal);

  return (
    <AnimatePresence>
      {progressModal.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`fixed inset-0 z-[var(--z-modal)] flex items-center justify-center`}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            key="progress-modal"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(`relative w-full mx-auto bg-white rounded-lg shadow-xl overflow-hidden max-w-md`)}
          >
            {/* Header */}
            <div className="flex items-center justify-center p-4 border-b border-gray-200">
              <div className="flex-1 flex flex-col gap-2">
                <h2 className="text-xl font-semibold text-gray-900">Uploading File</h2>
                <h6 className="text-sm text-gray-500">This may take a while, please don&apos;t close this window.</h6>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-4 max-h-[75vh]">
              <div className="flex flex-col gap-2">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary-normal transition-all duration-500 ease-in-out"
                    style={{ width: `${progressModal.progress}%` }}
                    animate={{ backgroundPosition: ["0% 0%", "100% 0%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <motion.div
                      className="h-full w-full"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear"
                      }}
                      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)" }}
                    />
                  </motion.div>
                </div>
                <div className="text-sm text-gray-600 text-right">{progressModal.progress}%</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});