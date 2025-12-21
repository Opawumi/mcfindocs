import { Document, DocumentStatus, Folder } from "../types";
import { mockFolders } from "./folders.mock";

/**
 * Generate mock documents
 */
export const mockDocuments: Document[] = [
  {
    id: "doc-1",
    name: "Employee Handbook 2024",
    fileName: "employee-handbook-2024.pdf",
    fileSize: 2458624,
    fileType: "pdf",
    fileUrl: "/19-30gr039 Report.pdf",
    categoryId: "cat-4",
    metadata: {
      title: "Employee Handbook 2024",
      description: "Comprehensive employee handbook for 2024",
      tags: ["handbook", "hr", "policies"],
      department: "Human Resources",
    },
    status: "published",
    currentVersion: 2,
    uploadedBy: "user-2",
    uploadedAt: "2024-01-15T09:00:00Z",
    lastModifiedBy: "user-2",
    lastModifiedAt: "2024-11-20T14:30:00Z",
    viewCount: 145,
    downloadCount: 67,
    isShared: true,
  },
  {
    id: "doc-2",
    name: "Q4 2024 Financial Report",
    fileName: "q4-2024-financial-report.xlsx",
    fileSize: 1245678,
    fileType: "xlsx",
    fileUrl: "/mock-files/q4-2024-financial-report.xlsx",
    categoryId: "cat-7-2",
    metadata: {
      title: "Q4 2024 Financial Report",
      description: "Quarterly financial report for Q4 2024",
      tags: ["finance", "report", "q4", "2024"],
      department: "Finance",
      project: "Financial Reporting",
    },
    status: "published",
    currentVersion: 1,
    uploadedBy: "user-5",
    uploadedAt: "2024-12-01T10:15:00Z",
    lastModifiedBy: "user-5",
    lastModifiedAt: "2024-12-01T10:15:00Z",
    viewCount: 34,
    downloadCount: 12,
    isShared: false,
  },
  {
    id: "doc-3",
    name: "Marketing Campaign Proposal",
    fileName: "marketing-campaign-proposal.docx",
    fileSize: 856432,
    fileType: "docx",
    fileUrl: "/mock-files/marketing-campaign-proposal.docx",
    categoryId: "cat-3-2",
    metadata: {
      title: "Marketing Campaign Proposal - Spring 2025",
      description: "Proposal for spring 2025 marketing campaign",
      tags: ["marketing", "campaign", "proposal"],
      department: "Marketing",
      project: "Spring Campaign 2025",
    },
    status: "draft",
    currentVersion: 3,
    uploadedBy: "user-3",
    uploadedAt: "2024-11-28T11:20:00Z",
    lastModifiedBy: "user-3",
    lastModifiedAt: "2024-12-05T16:45:00Z",
    viewCount: 8,
    downloadCount: 2,
    isShared: true,
  },
  {
    id: "doc-4",
    name: "Software Development Contract",
    fileName: "software-dev-contract-2024.pdf",
    fileSize: 3245678,
    fileType: "pdf",
    fileUrl: "/mock-files/software-dev-contract-2024.pdf",
    categoryId: "cat-8-1",
    metadata: {
      title: "Software Development Contract 2024",
      description: "Contract for software development services",
      tags: ["legal", "contract", "software"],
      department: "Legal",
    },
    status: "published",
    currentVersion: 1,
    uploadedBy: "user-1",
    uploadedAt: "2024-10-15T13:00:00Z",
    lastModifiedBy: "user-1",
    lastModifiedAt: "2024-10-15T13:00:00Z",
    viewCount: 23,
    downloadCount: 8,
    isShared: false,
  },
  {
    id: "doc-5",
    name: "Meeting Minutes - Nov 2024",
    fileName: "meeting-minutes-nov-2024.pdf",
    fileSize: 456789,
    fileType: "pdf",
    fileUrl: "/mock-files/meeting-minutes-nov-2024.pdf",
    categoryId: "cat-3-1",
    metadata: {
      title: "Leadership Meeting Minutes - November 2024",
      description: "Minutes from November leadership meeting",
      tags: ["meeting", "minutes", "leadership"],
      department: "Executive",
    },
    status: "published",
    currentVersion: 1,
    uploadedBy: "user-1",
    uploadedAt: "2024-11-30T15:30:00Z",
    lastModifiedBy: "user-1",
    lastModifiedAt: "2024-11-30T15:30:00Z",
    viewCount: 56,
    downloadCount: 23,
    isShared: true,
  },
];

/**
 * Get documents by category
 */
export function getDocumentsByCategory(categoryId: string): Document[] {
  return mockDocuments.filter((doc) => doc.categoryId === categoryId);
}

/**
 * Get documents by folder
 */
export function getDocumentsByFolder(folderId: string): Document[] {
  return mockDocuments.filter((doc) => doc.folderId === folderId);
}

/**
 * Get document by ID
 */
export function getDocumentById(id: string): Document | undefined {
  return mockDocuments.find((doc) => doc.id === id);
}

/**
 * Get user folders
 */
export function getUserFolders(userId: string): Folder[] {
  return mockFolders.filter(
    (folder) => folder.userId === userId && !folder.parentId
  );
}

/**
 * Get subfolders
 */
export function getSubfolders(parentId: string): Folder[] {
  return mockFolders.filter((folder) => folder.parentId === parentId);
}

/**
 * Get folder by ID
 */
export function getFolderById(id: string): Folder | undefined {
  return mockFolders.find((folder) => folder.id === id);
}
