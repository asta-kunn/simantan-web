import { create } from "zustand";

const appName = import.meta.env.VITE_APP_NAME;

const generalStore = create((set) => ({
  isError: false,
  errorData: [],
  errorTitle: null,
  errorDescription: null,
  isLoading: false,
  isSidebarOpen: localStorage.getItem(`sidebar${appName}`) || false,
  isSidebarMobileOpen: false,
  toggleSidebar: () => {
    set((state) => {
      const newSidebarState = !state.isSidebarOpen;
      localStorage.setItem(`sidebar${appName}`, newSidebarState);
      return { isSidebarOpen: newSidebarState };
    });
  },
  toggleSidebarMobile: () => {
    set((state) => {
      const newSidebarState = !state.isSidebarMobileOpen;
      localStorage.setItem(`sidebar${appName}`, newSidebarState);
      localStorage.setItem(`sidebarMobile${appName}`, newSidebarState);
      return {
        isSidebarMobileOpen: newSidebarState,
        isSidebarOpen: newSidebarState,
      };
    });
  },
  setSidebarOpen: (open) => {
    set({ isSidebarOpen: open, isSidebarMobileOpen: open });
    localStorage.setItem(`sidebar${appName}`, open);
    localStorage.setItem(`sidebarMobile${appName}`, open);
  },
  closeSidebar: () => {
    set({ isSidebarOpen: false, isSidebarMobileOpen: false });
    localStorage.setItem(`sidebar${appName}`, false);
    localStorage.setItem(`sidebarMobile${appName}`, false);
  },
  setLoading: (loading) => {
    set((state) => ({ isLoading: loading }));
  },
  setError: (error) => {
    set({
      isError: true,
      errorData: error.data,
      errorTitle: error.title,
      errorDescription: error.description,
    });
  },
  clearError: () => {
    set({
      isError: false,
      errorData: [],
      errorTitle: null,
      errorDescription: null,
    });
  },
}));

export default generalStore;
