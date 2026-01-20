import { Folder } from "../lib/types";
import {
  mockFolders,
  getUserFolders,
  getSubfolders,
  getFolderById,
} from "../lib/mock-data";
import { sleep } from "../lib/utils";

/**
 * Folder Service
 * Handles all folder-related operations
 * Currently uses mock data - will be replaced with real API calls
 */

/**
 * Get user's folders
 */
export async function getMyFolders(userId: string): Promise<Folder[]> {
  await sleep(300);
  return getUserFolders(userId);
}

/**
 * Get subfolders
 */
export async function getFolderSubfolders(parentId: string): Promise<Folder[]> {
  await sleep(300);
  return getSubfolders(parentId);
}

/**
 * Get a single folder by ID
 */
export async function getFolder(id: string): Promise<Folder | null> {
  await sleep(200);
  return getFolderById(id) || null;
}

/**
 * Create a new folder
 */
export async function createFolder(data: {
  name: string;
  parentId?: string;
}): Promise<Folder> {
  await sleep(400);

  const newFolder: Folder = {
    id: `folder-${Date.now()}`,
    name: data.name,
    parentId: data.parentId,
    userId: "user-1", // Mock current user
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    documentCount: 0,
    subfolderCount: 0,
  };

  mockFolders.push(newFolder);
  return newFolder;
}

/**
 * Update a folder
 */
export async function updateFolder(
  id: string,
  data: { name: string }
): Promise<Folder> {
  await sleep(300);

  const folder = getFolderById(id);
  if (!folder) {
    throw new Error("Folder not found");
  }

  const updatedFolder: Folder = {
    ...folder,
    name: data.name,
    updatedAt: new Date().toISOString(),
  };

  const index = mockFolders.findIndex((f) => f.id === id);
  if (index !== -1) {
    mockFolders[index] = updatedFolder;
  }

  return updatedFolder;
}

/**
 * Delete a folder
 */
export async function deleteFolder(id: string): Promise<void> {
  await sleep(300);

  const index = mockFolders.findIndex((f) => f.id === id);
  if (index !== -1) {
    // In real implementation, check for documents and subfolders
    mockFolders.splice(index, 1);
  }
}

/**
 * Move a document to a folder
 */
export async function moveDocumentToFolder(
  documentId: string,
  folderId: string
): Promise<void> {
  await sleep(300);

  // In real implementation, this would update the document's folderId
  console.log("Moving document to folder:", { documentId, folderId });
}

/**
 * Get count of user's folders
 */
export async function getMyFoldersCount(userId: string): Promise<number> {
  await sleep(100);
  const folders = getUserFolders(userId);
  return folders.length;
}
