import type { Folder, FolderDocument } from "../types";

export const mockFolders: Folder[] = [
  {
    id: "folder-1",
    name: "My Projects",
    parentId: undefined,
    userId: "user-1",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    documentCount: 0,
    subfolderCount: 2,
  },
  {
    id: "folder-2",
    name: "Q4 2024",
    parentId: "folder-1",
    userId: "user-1",
    createdAt: "2024-10-01T09:00:00Z",
    updatedAt: "2024-12-01T14:30:00Z",
    documentCount: 3,
    subfolderCount: 0,
  },
  {
    id: "folder-3",
    name: "Q1 2025",
    parentId: "folder-1",
    userId: "user-1",
    createdAt: "2024-12-01T09:00:00Z",
    updatedAt: "2024-12-01T09:00:00Z",
    documentCount: 1,
    subfolderCount: 0,
  },
  {
    id: "folder-4",
    name: "Personal",
    parentId: undefined,
    userId: "user-1",
    createdAt: "2024-02-10T11:00:00Z",
    updatedAt: "2024-11-20T16:45:00Z",
    documentCount: 2,
    subfolderCount: 0,
  },
  {
    id: "folder-5",
    name: "Important",
    parentId: undefined,
    userId: "user-1",
    createdAt: "2024-03-05T08:30:00Z",
    updatedAt: "2024-12-05T10:15:00Z",
    documentCount: 4,
    subfolderCount: 0,
  },
];

export const mockFolderDocuments: FolderDocument[] = [
  // Q4 2024 folder documents
  {
    id: "fd-1",
    folderId: "folder-2",
    documentId: "doc-1", // Q4 2024 Financial Report
    addedAt: "2024-12-01T14:30:00Z",
    addedBy: "user-1",
  },
  {
    id: "fd-2",
    folderId: "folder-2",
    documentId: "doc-2", // Employee Handbook 2024
    addedAt: "2024-10-15T09:20:00Z",
    addedBy: "user-1",
  },
  {
    id: "fd-3",
    folderId: "folder-2",
    documentId: "doc-3", // Marketing Strategy
    addedAt: "2024-11-10T11:45:00Z",
    addedBy: "user-1",
  },
  // Q1 2025 folder documents
  {
    id: "fd-4",
    folderId: "folder-3",
    documentId: "doc-4", // Budget Proposal
    addedAt: "2024-12-01T09:15:00Z",
    addedBy: "user-1",
  },
  // Personal folder documents
  {
    id: "fd-5",
    folderId: "folder-4",
    documentId: "doc-5", // Training Materials
    addedAt: "2024-11-20T16:45:00Z",
    addedBy: "user-1",
  },
  {
    id: "fd-6",
    folderId: "folder-4",
    documentId: "doc-6", // Meeting Notes
    addedAt: "2024-09-15T10:30:00Z",
    addedBy: "user-1",
  },
  // Important folder documents
  {
    id: "fd-7",
    folderId: "folder-5",
    documentId: "doc-1", // Q4 2024 Financial Report (also in Important)
    addedAt: "2024-12-05T10:15:00Z",
    addedBy: "user-1",
  },
  {
    id: "fd-8",
    folderId: "folder-5",
    documentId: "doc-7", // Contract Template
    addedAt: "2024-08-20T14:00:00Z",
    addedBy: "user-1",
  },
  {
    id: "fd-9",
    folderId: "folder-5",
    documentId: "doc-8", // Policy Document
    addedAt: "2024-07-10T09:30:00Z",
    addedBy: "user-1",
  },
  {
    id: "fd-10",
    folderId: "folder-5",
    documentId: "doc-9", // Project Proposal
    addedAt: "2024-06-05T15:20:00Z",
    addedBy: "user-1",
  },
];
