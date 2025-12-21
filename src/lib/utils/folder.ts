import type { Folder } from "../types";

export interface FolderWithChildren extends Folder {
  children?: FolderWithChildren[];
}

/**
 * Build a hierarchical folder tree from a flat array of folders
 */
export function buildFolderTree(folders: Folder[]): FolderWithChildren[] {
  const folderMap = new Map<string, FolderWithChildren>();
  const rootFolders: FolderWithChildren[] = [];

  // Create a map of all folders
  folders.forEach((folder) => {
    folderMap.set(folder.id, { ...folder, children: [] });
  });

  // Build the tree structure
  folders.forEach((folder) => {
    const folderNode = folderMap.get(folder.id)!;

    if (folder.parentId) {
      const parent = folderMap.get(folder.parentId);
      if (parent) {
        parent.children!.push(folderNode);
      }
    } else {
      rootFolders.push(folderNode);
    }
  });

  return rootFolders;
}

/**
 * Get all descendant folder IDs (including the folder itself)
 */
export function getAllFolderIds(folder: FolderWithChildren): string[] {
  const ids = [folder.id];

  if (folder.children) {
    folder.children.forEach((child) => {
      ids.push(...getAllFolderIds(child));
    });
  }

  return ids;
}
