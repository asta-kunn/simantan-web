import { create } from "zustand";

/**
 * Global UI store for managing modal, sheet, and other UI components
 * @typedef {Object} UIStore
 * @property {Object} modal - Modal state
 * @property {boolean} modal.isOpen - Whether the modal is open
 * @property {string} modal.title - Modal title
 * @property {string} modal.description - Modal description
 * @property {React.ReactNode} modal.content - Modal content
 * @property {Function} modal.onConfirm - Modal confirm callback
 * @property {Function} modal.onCancel - Modal cancel callback
 * @property {Object} modal.buttons - Custom buttons configuration
 * @property {Object} sheet - Sheet state
 * @property {boolean} sheet.isOpen - Whether the sheet is open
 * @property {string} sheet.title - Sheet title
 * @property {string} sheet.description - Sheet description
 * @property {React.ReactNode} sheet.content - Sheet content
 * @property {string} sheet.position - Sheet position (right, left, top, bottom)
 * @property {number} sheet.size - Sheet size in pixels
 * @property {Function} openModal - Open modal function
 * @property {Function} closeModal - Close modal function
 * @property {Function} openSheet - Open sheet function
 * @property {Function} closeSheet - Close sheet function
 */

export const useUIStore = create((set) => ({
  stacks: [],
  stackLoading: false,
  closingStacks: [], // Array to track stacks that are animating out

  modal: {
    isOpen: false,
    closeable: true,
    zIndex: "",
    className: "",
    size: "",
    title: null,
    description: null,
    content: null,
    footer: null,
    onConfirm: () => { },
    onCancel: () => { },
    hideButtons: false,
    steps: [],
  },

  // Confirmation modal state
  confirmationModal: {
    isOpen: false,
    variant: "default",
    title: "Modal Title",
    description: "Hello, this is a modal description.",
    content: null,
    footer: null,
    onConfirm: () => { },
    onCancel: () => { },
    onClose: null, // Handle close event (X button or escape key)
    hideButtons: false,
    steps: [],
  },

  // Sheet state
  sheet: {
    isOpen: false,
    children: null,
    width: "lg",
    position: "right",
    title: "",
    description: "",
    primaryButton: null,
    secondaryButton: null,
    onOk: null,
    onCancel: null,
    buttonPositions: "between",
  },

  // Loading state
  loader: {
    isLoading: false,
  },

  // Progress state
  progressModal: {
    isOpen: false,
    progress: 0,
  },

  addStack: (props = {}) => {
    let id = 0;
    set((state) => {
      id = state.stacks.length + 1;
      return {
        stacks: [...state.stacks, { id, ...props }],
      };
    });
    return id;
  },

  closeStack: (id) => {
    set((state) => {
      // If no id provided, mark the last stack as closing
      if (id === undefined) {
        const lastStack = state.stacks[state.stacks.length - 1];
        if (lastStack && !state.closingStacks.includes(lastStack.id)) {
          return {
            closingStacks: [...state.closingStacks, lastStack.id],
          };
        }
        return state;
      }

      // Mark specific stack as closing
      if (!state.closingStacks.includes(id)) {
        return {
          closingStacks: [...state.closingStacks, id],
        };
      }
      return state;
    });
  },

  // New function to actually remove the stack after animation completes
  removeStackAfterAnimation: (id) =>
    set((state) => ({
      stacks: state.stacks.filter((stack) => stack.id !== id),
      closingStacks: state.closingStacks.filter((closingId) => closingId !== id),
    })),

  clearStacks: () => set({ stacks: [], closingStacks: [] }),

  setStackLoading: (bool) => set({ stackLoading: bool }),

  /**
   * Open the modal
   * @param {Object} modalProps - Modal properties
   * @param {string} modalProps.title - Modal title
   * @param {string} modalProps.description - Modal description
   * @param {React.ReactNode} modalProps.content - Modal content
   * @param {Function} modalProps.onConfirm - Modal confirm callback
   * @param {Function} modalProps.onCancel - Modal cancel callback
   * @param {boolean} modalProps.hideButtons - Whether to hide the default buttons
   */
  openModal: (modalProps) => {
    set((state) => ({
      modal: {
        ...state.modal,
        isOpen: true,
        closeable: modalProps.closeable || false,
        content: modalProps.content || null,
        footer: modalProps.footer || null,
        ...modalProps,
      },
    }));
  },

  /**
   * Close the modal
   */
  closeModal: () => {
    set((state) => ({
      modal: {
        ...state.modal,
        isOpen: false,
        steps: [],
        title: null,
        description: null,
        zIndex: "z-[999]",
      },
    }));
  },

  /**
   * Open the confirmation modal
   * @param {Object} confirmationModalProps - Confirmation modal properties
   * @param {string} confirmationModalProps.title - Confirmation modal title
   * @param {string} confirmationModalProps.description - Confirmation modal description
   * @param {React.ReactNode} confirmationModalProps.content - Confirmation modal content
   * @param {Function} confirmationModalProps.onConfirm - Confirmation modal confirm callback
   * @param {Function} confirmationModalProps.onCancel - Confirmation modal cancel callback
   * @param {Function} confirmationModalProps.onClose - Confirmation modal close callback (X button or escape key)
   * @param {boolean} confirmationModalProps.hideButtons - Whether to hide the default buttons
   */
  openConfirmationModal: (confirmationModalProps) => {
    set((state) => ({
      confirmationModal: {
        ...state.confirmationModal,
        isOpen: true,
        content: confirmationModalProps.content || null,
        ...confirmationModalProps,
      },
    }));
  },

  /**
   * Close the confirmation modal
   */
  closeConfirmationModal: () => {
    set((state) => ({
      confirmationModal: {
        ...state.confirmationModal,
        isOpen: false,
        steps: [],
        onClose: null, // Reset onClose callback
        variant: "default",
        footer: null,
      },
    }));
  },

  /**
   * Open the sheet
   * @param {Object} sheetProps - Sheet properties
   * @param {string} sheetProps.title - Sheet title
   * @param {string} sheetProps.description - Sheet description
   * @param {React.ReactNode} sheetProps.content - Sheet content
   * @param {string} sheetProps.position - Sheet position (right, left, top, bottom)
   * @param {number} sheetProps.size - Sheet size in pixels
   */
  openSheet: (sheetProps) => {
    set((state) => ({
      sheet: {
        ...state.sheet,
        isOpen: true,
        children: sheetProps.children || null,
        ...sheetProps,
      },
    }));
  },

  /**
   * Close the sheet
   */
  closeSheet: () => {
    set((state) => ({
      sheet: {
        ...state.sheet,
        isOpen: false,
      },
    }));
  },

  setLoader: (bool) =>
    set((state) => ({
      loader: {
        ...state.loader,
        isLoading: bool,
      },
    })),

  openProgressModal: () => {
    set((state) => ({
      progressModal: {
        ...state.progressModal,
        isOpen: true,
      },
    }));
  },

  closeProgressModal: () => {
    set((state) => ({
      progressModal: {
        ...state.progressModal,
        isOpen: false,
        progress: 0,
      },
    }));
  },

  setProgress: (progress) => {
    set((state) => ({
      progressModal: {
        ...state.progressModal,
        progress,
      },
    }));
  },
}));
