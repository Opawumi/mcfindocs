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
import dbConnect from "@/lib/db";
import Memo from "@/models/Memo";

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

  // For now, let's mix real memos into documents if we want, or keeps separate.
  // The user asked for "Recent Activity" mostly.
  // Getting full list of documents from Memos + others is complex.
  // Let's stick to mock for the main list unless requested, but update the "Activity" and "Counts".
  let filteredDocuments = [...mockDocuments];

  // ... (rest of getDocuments logic kept as is for now or implied)
  // To avoid replacing the whole file, I will just return the original file content for this part if I can't target cleanly.
  // Actually, I'll just change the imports and the specific functions I need.

  // Returning control to tool use... 
  // I will just add the imports now.


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
  await dbConnect();
  return Memo.countDocuments({});
}

/**
 * Get shared documents count
 */
export async function getSharedDocumentsCount(userId: string): Promise<number> {
  await dbConnect();
  // We assume userId is the email here
  return Memo.countDocuments({
    $and: [
      { from: { $ne: userId } }, // Not sent by me
      { $or: [{ to: userId }, { cc: userId }] } // Sent to me or CC'd
    ]
  });
}

/**
 * Get recent activity
 */
export async function getRecentActivity(limit: number = 5): Promise<Document[]> {
  await dbConnect();

  const memos = await Memo.find({})
    .sort({ updatedAt: -1 })
    .limit(limit)
    .lean();

  return memos.map((memo: any) => ({
    id: memo._id.toString(),
    name: memo.subject, // Map subject to name
    fileName: `${memo.subject}.memo`, // Synthetic filename
    fileSize: memo.message ? memo.message.length * 2 : 0, // Approx size
    fileType: 'memo',
    fileUrl: `/dashboard/memos/inbox/${memo._id}`, // Navigate to detail
    categoryId: 'memos',
    folderId: 'inbox',
    metadata: {
      title: memo.subject,
      description: memo.message ? memo.message.substring(0, 100) : '',
      createdAt: new Date(memo.createdAt).toISOString(),
      updatedAt: new Date(memo.updatedAt).toISOString()
    },
    status: memo.status === 'approved' ? 'published' : 'draft',
    currentVersion: 1,
    uploadedBy: memo.fromName || memo.from, // Show sender
    uploadedAt: new Date(memo.createdAt).toISOString(),
    lastModifiedBy: memo.approvedByName || memo.fromName || memo.from,
    lastModifiedAt: new Date(memo.updatedAt).toISOString(),
    viewCount: 0,
    downloadCount: 0,
    isShared: (memo.to && memo.to.length > 1) || (memo.cc && memo.cc.length > 0)
  }));
}
