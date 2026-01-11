import { create } from "zustand";
import { Notification as AppNotification } from "../lib/types";

interface UIState {
  // Sidebar
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;

  // Theme
  theme: "light" | "dark" | "system";

  // Notifications
  notifications: AppNotification[];
  unreadNotificationsCount: number;

  // Modals
  activeModal: string | null;
  modalData: any;

  // Loading states
  globalLoading: boolean;

  // Document category selection
  selectedCategoryId: string | null;

  // Folder selection
  selectedFolderId: string | null;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (isCollapsed: boolean) => void;

  setTheme: (theme: "light" | "dark" | "system") => void;

  addNotification: (notification: AppNotification) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;

  openModal: (modalId: string, data?: any) => void;
  closeModal: () => void;

  setGlobalLoading: (isLoading: boolean) => void;

  setSelectedCategoryId: (categoryId: string | null) => void;
  setSelectedFolderId: (folderId: string | null) => void;
}

/**
 * UI Store
 * Manages global UI state
 */
export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  isSidebarOpen: true,
  isSidebarCollapsed: false,
  theme: "system",
  notifications: [],
  unreadNotificationsCount: 0,
  activeModal: null,
  modalData: null,
  globalLoading: false,
  selectedCategoryId: null,
  selectedFolderId: null,

  // Sidebar actions
  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  setSidebarOpen: (isOpen) => {
    set({ isSidebarOpen: isOpen });
  },

  toggleSidebarCollapse: () => {
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed }));
  },

  setSidebarCollapsed: (isCollapsed) => {
    set({ isSidebarCollapsed: isCollapsed });
  },

  // Theme actions
  setTheme: (theme) => {
    set({ theme });

    // Apply theme to document
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;

      if (theme === "dark") {
        root.classList.add("dark");
      } else if (theme === "light") {
        root.classList.remove("dark");
      } else {
        // System theme
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        if (prefersDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    }
  },

  // Notification actions
  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadNotificationsCount: state.unreadNotificationsCount + 1,
    }));

    // Trigger Browser Notification
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.message,
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(notification.title, {
              body: notification.message,
            });
          }
        });
      }
    }
  },

  markNotificationAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id
          ? { ...n, isRead: true, readAt: new Date().toISOString() }
          : n
      ),
      unreadNotificationsCount: Math.max(0, state.unreadNotificationsCount - 1),
    }));
  },

  clearNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadNotificationsCount: state.notifications.find(
        (n) => n.id === id && !n.isRead
      )
        ? state.unreadNotificationsCount - 1
        : state.unreadNotificationsCount,
    }));
  },

  clearAllNotifications: () => {
    set({ notifications: [], unreadNotificationsCount: 0 });
  },

  // Modal actions
  openModal: (modalId, data) => {
    set({ activeModal: modalId, modalData: data });
  },

  onCloseModal: () => {
    set({ activeModal: null, modalData: null });
  },

  closeModal: () => {
    set({ activeModal: null, modalData: null });
  },

  // Loading actions
  setGlobalLoading: (isLoading) => {
    set({ globalLoading: isLoading });
  },

  // Category selection actions
  setSelectedCategoryId: (categoryId) => {
    set({ selectedCategoryId: categoryId });
  },

  setSelectedFolderId: (folderId) => {
    set({ selectedFolderId: folderId });
  },
}));

// Initialize theme on load
if (typeof window !== "undefined") {
  const savedTheme = localStorage.getItem("theme") as
    | "light"
    | "dark"
    | "system"
    | null;
  if (savedTheme) {
    useUIStore.getState().setTheme(savedTheme);
  }
}

// Save theme to localStorage when it changes
useUIStore.subscribe((state) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("theme", state.theme);
  }
});
