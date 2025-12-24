import { create } from "zustand";
import { Document, Category, Folder } from "../lib/types";

interface DocumentState {
  // Selected items
  selectedDocuments: string[];
  selectedCategory: string | null;
  selectedFolder: string | null;

  // View mode
  viewMode: "list" | "grid";

  // Current view
  currentView: "category" | "my_folders";

  // Actions
  setSelectedDocuments: (documentIds: string[]) => void;
  toggleDocumentSelection: (documentId: string) => void;
  clearSelection: () => void;

  setSelectedCategory: (categoryId: string | null) => void;
  setSelectedFolder: (folderId: string | null) => void;

  setViewMode: (mode: "list" | "grid") => void;
  setCurrentView: (view: "category" | "my_folders") => void;
}

/**
 * Document Store
 * Manages document-related UI state
 */
export const useDocumentStore = create<DocumentState>((set, get) => ({
  // Initial state
  selectedDocuments: [],
  selectedCategory: null,
  selectedFolder: null,
  viewMode: "list",
  currentView: "category",

  // Selection actions
  setSelectedDocuments: (documentIds) => {
    set({ selectedDocuments: documentIds });
  },

  toggleDocumentSelection: (documentId) => {
    set((state) => {
      const isSelected = state.selectedDocuments.includes(documentId);
      return {
        selectedDocuments: isSelected
          ? state.selectedDocuments.filter((id) => id !== documentId)
          : [...state.selectedDocuments, documentId],
      };
    });
  },

  clearSelection: () => {
    set({ selectedDocuments: [] });
  },

  // Navigation actions
  setSelectedCategory: (categoryId) => {
    set({ selectedCategory: categoryId, selectedFolder: null });
  },

  setSelectedFolder: (folderId) => {
    set({ selectedFolder: folderId, selectedCategory: null });
  },

  // View actions
  setViewMode: (mode) => {
    set({ viewMode: mode });
  },

  setCurrentView: (view) => {
    set({ currentView: view });
  },
}));
