import {
  EMemo,
  CreateMemoData,
  MemoDraftData,
  MemoReplyData,
  MemoForwardData,
  MemoFilters,
  PaginatedResult,
} from "../lib/types";
import {
  mockMemos,
  getMemosByStatus,
  getMemoById,
  getUnreadMemosCount,
  getMemosByThread,
} from "../lib/mock-data";
import { sleep } from "../lib/utils";
import dbConnect from "@/lib/db";
import Memo from "@/models/Memo";

/**
 * Memo Service
 * Handles all e-memo-related operations
 * Currently uses mock data - will be replaced with real API calls
 */

/**
 * Get memos with optional filters and pagination
 */
export async function getMemos(
  type: "inbox" | "outbox" | "drafts",
  userId: string,
  filters?: MemoFilters,
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResult<EMemo>> {
  await sleep(300);

  let filteredMemos: EMemo[] = [];

  // Get memos by type
  if (type === "inbox") {
    filteredMemos = getMemosByStatus("sent", userId).filter((memo) =>
      memo.recipients.some((r) => r.userId === userId)
    );
  } else if (type === "outbox") {
    filteredMemos = getMemosByStatus("sent", userId);
  } else {
    filteredMemos = getMemosByStatus("draft", userId);
  }

  // Apply filters
  if (filters) {
    if (filters.priority) {
      filteredMemos = filteredMemos.filter(
        (memo) => memo.priority === filters.priority
      );
    }

    if (filters.senderId) {
      filteredMemos = filteredMemos.filter(
        (memo) => memo.senderId === filters.senderId
      );
    }

    if (filters.hasAttachments !== undefined) {
      filteredMemos = filteredMemos.filter(
        (memo) => memo.attachments.length > 0 === filters.hasAttachments
      );
    }

    if (filters.isUnread && type === "inbox") {
      filteredMemos = filteredMemos.filter((memo) =>
        memo.recipients.some((r) => r.userId === userId && !r.isRead)
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filteredMemos = filteredMemos.filter(
        (memo) =>
          memo.subject.toLowerCase().includes(query) ||
          memo.body.toLowerCase().includes(query)
      );
    }
  }

  // Pagination
  const totalItems = filteredMemos.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = filteredMemos.slice(startIndex, endIndex);

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
 * Get a single memo by ID
 */
export async function getMemo(id: string): Promise<EMemo | null> {
  await sleep(200);
  return getMemoById(id) || null;
}

/**
 * Send a new memo
 */
export async function sendMemo(data: CreateMemoData): Promise<EMemo> {
  await sleep(500);

  const newMemo: EMemo = {
    id: `memo-${Date.now()}`,
    subject: data.subject,
    body: data.body,
    senderId: "user-1", // Mock current user
    recipients: [
      ...data.recipientIds.to.map((userId) => ({
        userId,
        type: "to" as const,
        isRead: false,
      })),
      ...(data.recipientIds.cc || []).map((userId) => ({
        userId,
        type: "cc" as const,
        isRead: false,
      })),
      ...(data.recipientIds.bcc || []).map((userId) => ({
        userId,
        type: "bcc" as const,
        isRead: false,
      })),
    ],
    attachments: data.attachments || [],
    priority: data.priority || "normal",
    status: "sent",
    dueDate: data.dueDate,
    requiresResponse: data.requiresResponse || false,
    requiresReadReceipt: data.requiresReadReceipt || false,
    requiresSignature: data.requiresSignature || false,
    createdAt: new Date().toISOString(),
    sentAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    threadId: `thread-${Date.now()}`,
  };

  mockMemos.push(newMemo);
  return newMemo;
}

/**
 * Save a memo as draft
 */
export async function saveDraft(data: MemoDraftData): Promise<EMemo> {
  await sleep(300);

  if (data.id) {
    // Update existing draft
    const existingMemo = getMemoById(data.id);
    if (existingMemo) {
      const updatedMemo: EMemo = {
        ...existingMemo,
        subject: data.subject || existingMemo.subject,
        body: data.body || existingMemo.body,
        updatedAt: new Date().toISOString(),
      };

      const index = mockMemos.findIndex((m) => m.id === data.id);
      if (index !== -1) {
        mockMemos[index] = updatedMemo;
      }

      return updatedMemo;
    }
  }

  // Create new draft
  const newDraft: EMemo = {
    id: `memo-draft-${Date.now()}`,
    subject: data.subject || "",
    body: data.body || "",
    senderId: "user-1",
    recipients: [],
    attachments: data.attachments || [],
    priority: data.priority || "normal",
    status: "draft",
    requiresResponse: false,
    requiresReadReceipt: false,
    requiresSignature: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    threadId: `thread-${Date.now()}`,
  };

  mockMemos.push(newDraft);
  return newDraft;
}

/**
 * Reply to a memo
 */
export async function replyToMemo(data: MemoReplyData): Promise<EMemo> {
  await sleep(500);

  const originalMemo = getMemoById(data.parentMemoId);
  if (!originalMemo) {
    throw new Error("Original memo not found");
  }

  const recipients = data.replyToAll
    ? [
      { userId: originalMemo.senderId, type: "to" as const, isRead: false },
      ...originalMemo.recipients
        .filter((r) => r.userId !== "user-1")
        .map((r) => ({ ...r, isRead: false })),
    ]
    : [{ userId: originalMemo.senderId, type: "to" as const, isRead: false }];

  const replyMemo: EMemo = {
    id: `memo-${Date.now()}`,
    subject: `RE: ${originalMemo.subject}`,
    body: data.body,
    senderId: "user-1",
    recipients,
    attachments: data.attachments || [],
    priority: originalMemo.priority,
    status: "sent",
    requiresResponse: false,
    requiresReadReceipt: false,
    requiresSignature: false,
    createdAt: new Date().toISOString(),
    sentAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    parentMemoId: data.parentMemoId,
    threadId: originalMemo.threadId,
  };

  mockMemos.push(replyMemo);
  return replyMemo;
}

/**
 * Forward a memo
 */
export async function forwardMemo(data: MemoForwardData): Promise<EMemo> {
  await sleep(500);

  const originalMemo = getMemoById(data.originalMemoId);
  if (!originalMemo) {
    throw new Error("Original memo not found");
  }

  const forwardedMemo: EMemo = {
    id: `memo-${Date.now()}`,
    subject: `FWD: ${originalMemo.subject}`,
    body: `${data.additionalMessage || ""}\n\n--- Forwarded Message ---\n${originalMemo.body
      }`,
    senderId: "user-1",
    recipients: [
      ...data.recipientIds.to.map((userId) => ({
        userId,
        type: "to" as const,
        isRead: false,
      })),
      ...(data.recipientIds.cc || []).map((userId) => ({
        userId,
        type: "cc" as const,
        isRead: false,
      })),
    ],
    attachments: originalMemo.attachments,
    priority: originalMemo.priority,
    status: "sent",
    requiresResponse: false,
    requiresReadReceipt: false,
    requiresSignature: false,
    createdAt: new Date().toISOString(),
    sentAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    threadId: `thread-${Date.now()}`,
  };

  mockMemos.push(forwardedMemo);
  return forwardedMemo;
}

/**
 * Mark memo as read
 */
export async function markMemoAsRead(
  memoId: string,
  userId: string
): Promise<void> {
  await sleep(200);

  const memo = getMemoById(memoId);
  if (memo) {
    const recipient = memo.recipients.find((r) => r.userId === userId);
    if (recipient) {
      recipient.isRead = true;
      recipient.readAt = new Date().toISOString();
    }
  }
}

/**
 * Delete a memo
 */
export async function deleteMemo(id: string): Promise<void> {
  await sleep(300);

  const index = mockMemos.findIndex((m) => m.id === id);
  if (index !== -1) {
    mockMemos.splice(index, 1);
  }
}

/**
 * Get unread memos count
 */
export async function getUnreadCount(userId: string): Promise<number> {
  await dbConnect();
  // using userId as email
  return Memo.countDocuments({
    to: userId,
    status: 'pending' // or { $in: ['pending', 'initiated'] }
  });
}
