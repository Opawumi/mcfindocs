'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Folder } from '@/lib/types';
import { mockFolders } from '@/lib/mock-data';

interface FolderContextValue {
  currentFolderId: string | null;
  setCurrentFolderId: (folderId: string | null) => void;
  currentFolder: Folder | null;
  setCurrentFolder: (folder: Folder | null) => void;
  folders: Folder[];
  refreshFolders: () => void;
}

const FolderContext = createContext<FolderContextValue | undefined>(undefined);

interface FolderProviderProps {
  children: ReactNode;
}

export function FolderProvider({ children }: FolderProviderProps) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [folders, setFolders] = useState<Folder[]>(mockFolders);

  // Refresh folders from mock data (in real app, this would be an API call)
  const refreshFolders = () => {
    // Create a new array reference to trigger re-renders
    // The service modifies mockFolders in place, so we need a new reference
    setFolders([...mockFolders]);
    
    // Update current folder if it still exists
    if (currentFolderId) {
      const updatedFolder = mockFolders.find(f => f.id === currentFolderId);
      setCurrentFolder(updatedFolder || null);
    }
  };

  // Initial load and periodic refresh
  useEffect(() => {
    refreshFolders();
  }, []);

  return (
    <FolderContext.Provider
      value={{
        currentFolderId,
        setCurrentFolderId,
        currentFolder,
        setCurrentFolder,
        folders,
        refreshFolders,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
}

export function useFolderContext() {
  const context = useContext(FolderContext);
  if (context === undefined) {
    throw new Error('useFolderContext must be used within a FolderProvider');
  }
  return context;
}

