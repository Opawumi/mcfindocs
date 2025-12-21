// Folder types for personal organization

export interface UserFolder {
  id: string;
  name: string;
  parentId: string | null;
  userId: string; // Owner of this folder
  createdAt: string;
  updatedAt: string;
  level: number;
}

export interface FolderDocument {
  id: string;
  folderId: string;
  documentId: string; // Reference to document in Categories
  addedAt: string;
  addedBy: string;
}

export interface UserFolderWithChildren extends UserFolder {
  children?: UserFolderWithChildren[];
  documentCount?: number;
}
