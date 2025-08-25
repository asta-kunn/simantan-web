import { createContext, useContext, useState, useCallback } from "react";

// Create context
const ConfirmContext = createContext();

export function ConfirmProvider({ children }) {
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setConfirmConfig({
        isOpen: true,
        title: options.title || "Confirm",
        message: options.message || "Are you sure?",
        onConfirm: () => {
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
          resolve(false);
        },
      });
    });
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {confirmConfig.isOpen && (
        <div className="confirm-dialog">
          <div className="confirm-dialog-content">
            <h2>{confirmConfig.title}</h2>
            <p>{confirmConfig.message}</p>
            <div className="confirm-dialog-actions">
              <button onClick={confirmConfig.onCancel}>Cancel</button>
              <button onClick={confirmConfig.onConfirm}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

// Custom hook to use the confirm dialog
export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
}
