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
  const [folders, setFolders] = useState<Folder[]>([]);

  // Refresh folders from API (fetches real document counts from database)
  const refreshFolders = async () => {
    try {
      const response = await fetch('/api/folders');
      if (response.ok) {
        const data = await response.json();
        setFolders(data.folders || []);

        // Update current folder if it still exists
        if (currentFolderId) {
          const updatedFolder = (data.folders || []).find((f: Folder) => f.id === currentFolderId);
          setCurrentFolder(updatedFolder || null);
        }
      } else {
        console.error('Failed to fetch folders');
        // Fallback to mock data if API fails
        setFolders(mockFolders);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
      // Fallback to mock data if API fails
      setFolders(mockFolders);
    }
  };

  // Initial load
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

