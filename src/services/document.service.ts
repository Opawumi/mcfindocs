import {
  Document,
  DocumentUploadData,
  DocumentUpdateData,
  DocumentShareData,
  DocumentFilters,
  PaginatedResult,
  DocumentVersion,
  DocumentAccessRule,
  Permission,
} from "../lib/types";
import {
  mockDocuments,
  getDocumentsByCategory,
  getDocumentsByFolder,
  getDocumentById,
} from "../lib/mock-data";
import { sleep } from "../lib/utils";

/**
 * Document Service
 * Handles all document-related operations
 * Currently uses mock data - will be replaced with real API calls
 */

/**
 * Get documents with optional filters and pagination
 */
export async function getDocuments(
  filters?: DocumentFilters,
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResult<Document>> {
  await sleep(300); // Simulate network delay

  let filteredDocuments = [...mockDocuments];

  // Apply filters
  if (filters) {
    if (filters.categoryId) {
      filteredDocuments = getDocumentsByCategory(filters.categoryId);
    }

    if (filters.folderId) {
      filteredDocuments = getDocumentsByFolder(filters.folderId);
    }

    if (filters.fileType) {
      filteredDocuments = filteredDocuments.filter(
        (doc) => doc.fileType === filters.fileType
      );
    }

    if (filters.uploadedBy) {
      filteredDocuments = filteredDocuments.filter(
        (doc) => doc.uploadedBy === filters.uploadedBy
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      filteredDocuments = filteredDocuments.filter((doc) =>
        filters.tags!.some((tag) => doc.metadata.tags?.includes(tag))
      );
    }

    if (filters.status) {
      filteredDocuments = filteredDocuments.filter(
        (doc) => doc.status === filters.status
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filteredDocuments = filteredDocuments.filter(
        (doc) =>
          doc.name.toLowerCase().includes(query) ||
          doc.metadata.title.toLowerCase().includes(query) ||
          doc.metadata.description?.toLowerCase().includes(query)
      );
    }
  }

  // Pagination
  const totalItems = filteredDocuments.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = filteredDocuments.slice(startIndex, endIndex);

  return {
    items,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  };
}

/**
 * Get a single document by ID
 */
export async function getDocument(id: string): Promise<Document | null> {
  await sleep(200);
  return getDocumentById(id) || null;
}

/**
 * Upload a new document
 */
export async function uploadDocument(
  data: DocumentUploadData
): Promise<Document> {
  await sleep(1000); // Simulate upload time

  const newDocument: Document = {
    id: `doc-${Date.now()}`,
    name: data.name || data.file.name,
    fileName: data.file.name,
    fileSize: data.file.size,
    fileType: data.file.name.split(".").pop() || "unknown",
    fileUrl: `/mock-files/${data.file.name}`,
    categoryId: data.categoryId,
    folderId: data.folderId,
    metadata: data.metadata,
    status: "published",
    currentVersion: 1,
    uploadedBy: "user-1", // Mock current user
    uploadedAt: new Date().toISOString(),
    lastModifiedBy: "user-1",
    lastModifiedAt: new Date().toISOString(),
    viewCount: 0,
    downloadCount: 0,
    isShared: false,
  };

  mockDocuments.push(newDocument);
  return newDocument;
}

/**
 * Update a document
 */
export async function updateDocument(
  id: string,
  data: DocumentUpdateData
): Promise<Document> {
  await sleep(300);

  const document = getDocumentById(id);
  if (!document) {
    throw new Error("Document not found");
  }

  const updatedDocument: Document = {
    ...document,
    ...data,
    metadata: {
      ...document.metadata,
      ...data.metadata,
    },
    lastModifiedBy: "user-1",
    lastModifiedAt: new Date().toISOString(),
  };

  const index = mockDocuments.findIndex((doc) => doc.id === id);
  if (index !== -1) {
    mockDocuments[index] = updatedDocument;
  }

  return updatedDocument;
}

/**
 * Delete a document
 */
export async function deleteDocument(id: string): Promise<void> {
  await sleep(300);

  const index = mockDocuments.findIndex((doc) => doc.id === id);
  if (index !== -1) {
    mockDocuments.splice(index, 1);
  }
}

/**
 * Share a document
 */
export async function shareDocument(data: DocumentShareData): Promise<void> {
  await sleep(400);

  const document = getDocumentById(data.documentId);
  if (!document) {
    throw new Error("Document not found");
  }

  // In real implementation, this would create access rules in the backend
  console.log("Document shared:", data);
}

/**
 * Get document version history
 */
export async function getDocumentVersions(
  documentId: string
): Promise<DocumentVersion[]> {
  await sleep(300);

  // Mock version history
  return [
    {
      id: `version-${documentId}-2`,
      documentId,
      versionNumber: 2,
      fileUrl: "/19-30gr039 Report.pdf",
      fileName: "document-v2.pdf",
      fileSize: 1234567,
      uploadedBy: "user-1",
      uploadedAt: "2024-11-20T14:30:00Z",
      versionNotes: "Updated content and formatting",
      isCurrent: true,
    },
    {
      id: `version-${documentId}-1`,
      documentId,
      versionNumber: 1,
      fileUrl: "/19-30gr039 Report.pdf",
      fileName: "document-v1.pdf",
      fileSize: 1123456,
      uploadedBy: "user-2",
      uploadedAt: "2024-01-15T09:00:00Z",
      versionNotes: "Initial version",
      isCurrent: false,
    },
  ];
}

/**
 * Get document access rules
 */
export async function getDocumentAccessRules(
  documentId: string
): Promise<DocumentAccessRule[]> {
  await sleep(300);

  // Mock access rules
  return [
    {
      id: `rule-${documentId}-1`,
      documentId,
      userId: "user-2",
      permissions: ["view", "download", "edit"],
      createdAt: new Date().toISOString(),
      createdBy: "user-1",
    },
  ];
}

/**
 * Update document access rules
 */
export async function updateDocumentAccessRules(
  documentId: string,
  rules: Omit<DocumentAccessRule, "id" | "createdAt" | "createdBy">[]
): Promise<void> {
  await sleep(400);

  // In real implementation, this would update access rules in the backend
  console.log("Access rules updated:", { documentId, rules });
}

/**
 * Download a document
 */
export async function downloadDocument(id: string): Promise<void> {
  await sleep(200);

  const document = getDocumentById(id);
  if (!document) {
    throw new Error("Document not found");
  }

  // In real implementation, this would trigger a file download
  console.log("Downloading document:", document.fileName);

  // Update download count
  document.downloadCount++;
}

/**
 * Get total documents count
 */
export async function getTotalDocumentsCount(): Promise<number> {
  await sleep(200);
  return mockDocuments.length;
}

/**
 * Get shared documents count
 */
export async function getSharedDocumentsCount(userId: string): Promise<number> {
  await sleep(200);
  return mockDocuments.filter(doc => 
    doc.sharedWith?.some(share => share.userId === userId)
  ).length;
}

/**
 * Get recent activity
 */
export async function getRecentActivity(limit: number = 5): Promise<Document[]> {
  await sleep(300);
  return [...mockDocuments]
    .sort((a, b) => new Date(b.lastModifiedAt).getTime() - new Date(a.lastModifiedAt).getTime())
    .slice(0, limit);
}
