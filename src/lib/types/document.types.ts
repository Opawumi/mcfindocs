import { Permission, User } from "./user.types";

/**
 * Document status
 */
export type DocumentStatus = "draft" | "published" | "archived";

/**
 * Category interface
 */
export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  level: number; // 0 for broad category, 1 for sub-category
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  documentCount?: number;
}

/**
 * Document metadata interface
 */
export interface DocumentMetadata {
  title: string;
  description?: string;
  tags?: string[];
  department?: string;
  project?: string;
  customFields?: Record<string, any>;
}

/**
 * Document version interface
 */
export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  versionNotes?: string;
  isCurrent: boolean;
}

/**
 * Document access rule interface
 */
export interface DocumentAccessRule {
  id: string;
  documentId?: string;
  categoryId?: string;
  userId?: string;
  groupId?: string;
  permissions: Permission[];
  createdAt: string;
  createdBy: string;
}

/**
 * Document note interface
 */
export interface DocumentNote {
  id: string;
  documentId: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Document interface
 */
export interface Document {
  id: string;
  name: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  categoryId?: string;
  folderId?: string;
  metadata: DocumentMetadata;
  status: DocumentStatus;
  currentVersion: number;
  uploadedBy: string;
  uploadedAt: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
  viewCount: number;
  downloadCount: number;
  isShared: boolean;
  notes?: DocumentNote[];
}

/**
 * Document upload data
 */
export interface DocumentUploadData {
  file: File;
  name?: string;
  categoryId?: string;
  folderId?: string;
  metadata: DocumentMetadata;
  versionNotes?: string;
}

/**
 * Document update data
 */
export interface DocumentUpdateData {
  name?: string;
  categoryId?: string;
  folderId?: string;
  metadata?: Partial<DocumentMetadata>;
  status?: DocumentStatus;
}

/**
 * Document share data
 */
export interface DocumentShareData {
  documentId: string;
  userIds?: string[];
  groupIds?: string[];
  permissions: Permission[];
  expiresAt?: string;
  message?: string;
}

/**
 * External share link
 */
export interface ExternalShareLink {
  id: string;
  documentId: string;
  token: string;
  url: string;
  password?: string;
  expiresAt?: string;
  maxDownloads?: number;
  downloadCount: number;
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}

/**
 * Document filter options
 */
export interface DocumentFilters {
  categoryId?: string;
  folderId?: string;
  fileType?: string;
  uploadedBy?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  status?: DocumentStatus;
  searchQuery?: string;
}

/**
 * Folder interface
 */
export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  documentCount?: number;
  subfolderCount?: number;
}

/**
 * Folder creation data
 */
export interface CreateFolderData {
  name: string;
  parentId?: string;
}

/**
 * Folder-Document relationship (for personal folder organization)
 */
export interface FolderDocument {
  id: string;
  folderId: string;
  documentId: string; // Reference to document
  addedAt: string;
  addedBy: string;
}
