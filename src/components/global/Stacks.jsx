import { useUIStore } from "@/stores/uiStore";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useEffect, useState } from "react";

import { Button } from "@/components/Dexain";

import errorIcon from "@/assets/icons/error.svg";
import successIcon from "@/assets/icons/success.svg";
import warningIcon from "@/assets/icons/warning.svg";

import { Loader2, X } from "lucide-react";

const getIcon = (variant) => {
  switch (variant) {
    case "success":
      return successIcon;
    case "error":
      return errorIcon;
    default:
      return warningIcon;
  }
};

const Modal = memo(
  ({
    container = true,
    isConfirm = false,
    size = "md",
    title,
    description,
    clearStacks,
    closeStack,
    content,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    onClose,
    variant,
    isLoading: externalIsLoading = false,
    footerSeparator = true,
    footer,
    isClosing,
  }) => {
    const [internalIsLoading, setInternalIsLoading] = useState(false);
    const isLoading = externalIsLoading || internalIsLoading;
    const [progress, setProgress] = useState(100);

    useEffect(() => {
      let timer;
      let interval;
      if (variant === "success" && !onConfirm && !footer) {
        // Animate progress bar for 5 seconds
        const duration = 3000;
        const intervalMs = 25;
        let elapsed = 0;
        setProgress(100);

        interval = setInterval(() => {
          elapsed += intervalMs;
          setProgress(Math.max(0, 100 - (elapsed / duration) * 100));
        }, intervalMs);

        timer = setTimeout(() => {
          clearInterval(interval);
          clearStacks();
        }, duration);

        return () => {
          clearTimeout(timer);
          clearInterval(interval);
        };
      }
      // Reset progress if not autoclosing
      setProgress(100);
      return undefined;
    }, [variant, clearStacks, onConfirm]);

    return (
      <motion.div
        className={`relative bg-white rounded-lg shadow-xl max-w-${size} w-full mx-4 z-10 p-0 flex flex-col`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={
          isClosing ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }
        }
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        {/* Header */}
        {variant ? (
          <div
            className={`flex flex-col items-center justify-center px-4 pt-10 ${isConfirm ? "mb-10" : "mb-0"}`}
          >
            <motion.img
              src={getIcon(variant)}
              alt="icon"
              className="w-24 aspect-square mb-2"
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.15, delay: 0.05 }}
            />
            <motion.div
              className="text-xl font-bold text-center"
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.15, delay: 0.1 }}
            >
              {title}
            </motion.div>
            {description && (
              <motion.div
                className="max-w-md text-sm text-muted-foreground text-center mt-1"
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.15 }}
              >
                {description}
              </motion.div>
            )}

            <div className="absolute top-3 right-3">
              {/* Close button (X) */}
              <button
                onClick={() => {
                  if (variant === "success") {
                    clearStacks();
                  } else {
                    if (onClose) {
                      onClose();
                    } else {
                      closeStack();
                    }
                  }
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
            <div>
              {title && (
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-gray-600">{description}</p>
              )}
            </div>
            <div>
              {/* Close button (X) */}
              <button
                onClick={() => (onClose ? onClose() : closeStack())}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {content && (
          <motion.div
            className={`${container ? "px-4 my-4" : ""} max-h-[80vh] overflow-y-auto`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, delay: 0.15 }}
          >
            {content}
          </motion.div>
        )}

        {/* Animated Progress Bar for autoclose */}
        {variant === "success" && !onConfirm && !footer && (
          <div className="w-full h-1.5 bg-gray-200 rounded-b-lg overflow-hidden">
            <div
              className="h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600 transition-all duration-100 rounded-b-lg"
              style={{
                width: `${progress}%`,
                transition: "width 0.1s linear",
                boxShadow: "0 1px 3px rgba(0, 255, 0, 0.2)",
              }}
            />
          </div>
        )}

        {footer && footerSeparator ? (
          <motion.div
            className="my-4 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, delay: 0.2 }}
          />
        ) : null}

        {/* Footer */}
        {footer && (
          <>
            <motion.div
              className="px-4 pb-4"
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.15, delay: 0.25 }}
            >
              {footer}
            </motion.div>
          </>
        )}

        {(onConfirm || onCancel) && (
          <>
            <motion.div
              className="my-4 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15, delay: 0.2 }}
            />
            <motion.div
              className="px-4 pb-4"
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.15, delay: 0.25 }}
            >
              <div className="flex gap-2 justify-between">
                <div className="flex-start">
                  {onCancel && (
                    <Button
                      variant="outline"
                      color="tertiary"
                      disabled={isLoading}
                      onClick={onCancel || closeStack}
                    >
                      {cancelText || "Cancel"}
                    </Button>
                  )}
                </div>

                <div className="flex-end">
                  {onConfirm && (
                    <Button
                      disabled={isLoading}
                      onClick={async () => {
                        if (!externalIsLoading) {
                          setInternalIsLoading(true);
                        }
                        try {
                          await onConfirm();
                        } catch (error) {
                          console.error("Error in onConfirm:", error);
                        } finally {
                          if (!externalIsLoading) {
                            setInternalIsLoading(false);
                          }
                        }
                      }}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2 w-[100px]">
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                      ) : (
                        confirmText || "Confirm"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    );
  }
);

const Sheet = memo(
  ({
    position = "right",
    size = "md",
    title,
    description,
    closeStack,
    content,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    onClose,
    isLoading: externalIsLoading = false,
    isClosing,
  }) => {
    const [internalIsLoading, setInternalIsLoading] = useState(false);
    const isLoading = externalIsLoading || internalIsLoading;

    const sizeClasses = {
      sm: "w-[320px]",
      md: "w-[384px]",
      lg: "w-[512px]",
      xl: "w-[640px]",
      "2xl": "w-[768px]",
      "3xl": "w-[896px]",
      "4xl": "w-[1024px]",
      "5xl": "w-[1280px]",
      full: "w-full",
    };

    return (
      <motion.div
        className={`fixed z-50 flex flex-col pointer-events-auto ${
          position === "left"
            ? "inset-y-0 left-0"
            : position === "right"
              ? "inset-y-0 right-0"
              : position === "top"
                ? "inset-x-0 top-0"
                : "inset-x-0 bottom-0"
        }`}
        initial={
          position === "left"
            ? { x: "-100%" }
            : position === "right"
              ? { x: "100%" }
              : position === "top"
                ? { y: "-100%" }
                : { y: "100%" }
        }
        animate={
          isClosing
            ? position === "left"
              ? { x: "-100%" }
              : position === "right"
                ? { x: "100%" }
                : position === "top"
                  ? { y: "-100%" }
                  : { y: "100%" }
            : position === "left" || position === "right"
              ? { x: 0 }
              : { y: 0 }
        }
        exit={
          position === "left"
            ? { x: "-100%" }
            : position === "right"
              ? { x: "100%" }
              : position === "top"
                ? { y: "-100%" }
                : { y: "100%" }
        }
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        <div
          className={`${sizeClasses[size] || sizeClasses.md} h-full bg-white rounded-tl-lg shadow-lg overflow-hidden flex flex-col`}
        >
          <div className="flex items-center justify-between p-4 border-b w-full">
            <div>
              {title && <h3 className="text-lg font-medium">{title}</h3>}
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            <button
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onClose) {
                  try {
                    await onClose();
                  } catch (error) {
                    console.error("Error in onClose:", error);
                  }
                } else {
                  closeStack();
                }
              }}
              className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">{content}</div>

          {(onConfirm || onCancel) && (
            <div className="flex items-center justify-end gap-2 p-4 border-t">
              {onCancel && (
                <Button
                  variant="outline"
                  color="tertiary"
                  onClick={onCancel || closeStack}
                >
                  {cancelText || "Cancel"}
                </Button>
              )}

              {onConfirm && (
                <Button
                  disabled={isLoading}
                  onClick={async () => {
                    if (!externalIsLoading) {
                      setInternalIsLoading(true);
                    }
                    try {
                      await onConfirm();
                    } catch (error) {
                      console.error("Error in onConfirm:", error);
                    } finally {
                      if (!externalIsLoading) {
                        setInternalIsLoading(false);
                      }
                    }
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2 w-[100px]">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  ) : (
                    confirmText || "Confirm"
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  }
);

export const Stacks = () => {
  const {
    stacks,
    closeStack,
    clearStacks,
    closingStacks,
    removeStackAfterAnimation,
  } = useUIStore();

  if (!stacks || stacks.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <AnimatePresence>
        {stacks.map((stack, idx) => {
          const baseZ = 1000 + idx;
          const isClosing = closingStacks.includes(stack.id);

          const handleBackdropClick = (e) => {
            if (e.target === e.currentTarget && stack.closeable) {
              clearStacks();
            }
          };

          // If stack is closing, we still render it but it will animate out
          return (
            <motion.div
              key={stack.id || idx}
              className="fixed inset-0 flex items-center justify-center"
              style={{
                zIndex: baseZ,
                pointerEvents: idx === stacks.length - 1 ? "auto" : "none",
              }}
              aria-modal="true"
              role="dialog"
              initial={{ opacity: 0 }}
              animate={{ opacity: isClosing ? 0 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onAnimationComplete={(definition) => {
                // When the closing animation completes, remove the stack
                if (isClosing && definition.opacity === 0) {
                  removeStackAfterAnimation(stack.id);
                }
              }}
            >
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: isClosing ? 0 : 1 }}
                exit={{ opacity: 0 }}
                onMouseDown={handleBackdropClick}
                onClick={handleBackdropClick}
              />
              {stack.type === "sheet" ? (
                <Sheet
                  position={stack.position || "right"}
                  size={stack.size || "md"}
                  title={stack.title || "Confirmation"}
                  description={stack.description}
                  closeStack={() => closeStack(stack.id)}
                  clearStacks={clearStacks}
                  content={stack.content}
                  confirmText={stack.confirmText}
                  cancelText={stack.cancelText}
                  onConfirm={stack.onConfirm}
                  onCancel={stack.onCancel}
                  variant={stack.variant}
                  isLoading={stack.isLoading}
                  onClose={stack.onClose}
                  isClosing={isClosing}
                />
              ) : (
                <Modal
                  container={stack.container}
                  isConfirm={stack.isConfirm}
                  size={stack.size || "md"}
                  title={stack.title || "Confirmation"}
                  description={stack.description}
                  closeStack={closeStack}
                  clearStacks={clearStacks}
                  content={stack.content}
                  confirmText={stack.confirmText}
                  cancelText={stack.cancelText}
                  onConfirm={stack.onConfirm}
                  onCancel={stack.onCancel}
                  variant={stack.variant}
                  isLoading={stack.isLoading}
                  footerSeparator={stack.footerSeparator}
                  footer={stack.footer}
                  onClose={stack.onClose}
                  isClosing={isClosing}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
