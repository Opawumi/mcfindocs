import { create } from "zustand";
import { User, UserSettings } from "../lib/types";
import { getCurrentUser, getDefaultUserSettings } from "../lib/mock-data";

interface AuthState {
  user: User | null;
  settings: UserSettings | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setSettings: (settings: UserSettings) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

/**
 * Auth Store
 * Manages authentication state and user information
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  settings: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
      settings: user ? getDefaultUserSettings(user.id) : null,
    });
  },

  setSettings: (settings) => {
    set({ settings });
  },

  login: async (email, password) => {
    set({ isLoading: true });

    try {
      // Mock login - in real implementation, call API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user = getCurrentUser();
      const settings = getDefaultUserSettings(user.id);

      set({
        user,
        settings,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    set({
      user: null,
      settings: null,
      isAuthenticated: false,
    });
  },

  updateSettings: (newSettings) => {
    const currentSettings = get().settings;
    if (currentSettings) {
      set({
        settings: {
          ...currentSettings,
          ...newSettings,
        },
      });
    }
  },
}));

// Initialize with mock user for development
if (typeof window !== "undefined") {
  useAuthStore.getState().setUser(getCurrentUser());
}
