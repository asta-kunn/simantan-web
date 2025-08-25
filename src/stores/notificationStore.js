import { create } from "zustand";
import { devtools } from "zustand/middleware";

/**
 * Define the initial state so we can easily reuse it for resetting.
 */
const initialState = {
  notifications: [],
};

/**
 * Global notification store – holds list pushed from websocket & API.
 */
const useNotificationStore = create(
  devtools((set, get) => ({
    ...initialState, // Spread the initial state here

    /** Replace entire list (e.g., initial fetch) */
    setNotifications: (list) =>
      set(() => {
        const arr = Array.isArray(list) ? list : [];
        const map = new Map();
        for (const item of arr) {
          if (!item) continue;
          const id = item.id == null ? undefined : String(item.id);
          if (!id) continue;
          map.set(id, { ...item, id });
        }
        return { notifications: Array.from(map.values()) };
      }),

    /** Prepend / upsert single notification (from websocket) */
    addNotification: (notif) =>
      set((state) => {
        if (!notif) return {};
        const id = notif.id == null ? undefined : String(notif.id);
        if (!id) return {};
        const filtered = state.notifications.filter((n) => String(n.id) !== id);
        return { notifications: [{ ...notif, id }, ...filtered] };
      }),

    /** Mark one notification as read locally */
    markReadLocal: (id) =>
      set((state) => {
        const target = id == null ? undefined : String(id);
        if (!target) return {};
        return {
          notifications: state.notifications.map((n) =>
            String(n.id) === target ? { ...n, read: true } : n
          ),
        };
      }),

    /** Mark all as read locally */
    markAllReadLocal: () =>
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      })),

    /**
     * NEW: Action to reset the store to its initial state.
     */
    reset: () => {
      set(initialState);
    },
  }))
);

export default useNotificationStore;