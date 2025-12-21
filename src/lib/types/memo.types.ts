/**
 * E-Memo priority levels
 */
export type MemoPriority = "normal" | "high" | "urgent";

/**
 * E-Memo status
 */
export type MemoStatus = "draft" | "sent" | "read" | "archived";

/**
 * E-Memo recipient interface
 */
export interface MemoRecipient {
  userId: string;
  type: "to" | "cc" | "bcc";
  readAt?: string;
  isRead: boolean;
}

/**
 * E-Memo attachment interface
 */
export interface MemoAttachment {
  id: string;
  documentId?: string; // If attaching from NexusDocs
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
}

/**
 * E-Memo interface
 */
export interface EMemo {
  id: string;
  subject: string;
  body: string;
  senderId: string;
  recipients: MemoRecipient[];
  attachments: MemoAttachment[];
  priority: MemoPriority;
  status: MemoStatus;
  dueDate?: string;
  requiresResponse: boolean;
  requiresReadReceipt: boolean;
  requiresSignature: boolean;
  createdAt: string;
  sentAt?: string;
  updatedAt: string;
  parentMemoId?: string; // For replies
  threadId?: string; // For grouping related memos
}

/**
 * E-Memo creation data
 */
export interface CreateMemoData {
  subject: string;
  body: string;
  recipientIds: {
    to: string[];
    cc?: string[];
    bcc?: string[];
  };
  attachments?: MemoAttachment[];
  priority?: MemoPriority;
  dueDate?: string;
  requiresResponse?: boolean;
  requiresReadReceipt?: boolean;
  requiresSignature?: boolean;
}

/**
 * E-Memo draft data
 */
export interface MemoDraftData extends Partial<CreateMemoData> {
  id?: string;
}

/**
 * E-Memo reply data
 */
export interface MemoReplyData {
  parentMemoId: string;
  body: string;
  attachments?: MemoAttachment[];
  replyToAll?: boolean;
}

/**
 * E-Memo forward data
 */
export interface MemoForwardData {
  originalMemoId: string;
  recipientIds: {
    to: string[];
    cc?: string[];
  };
  additionalMessage?: string;
}

/**
 * E-Memo filter options
 */
export interface MemoFilters {
  status?: MemoStatus;
  priority?: MemoPriority;
  senderId?: string;
  dateFrom?: string;
  dateTo?: string;
  hasAttachments?: boolean;
  isUnread?: boolean;
  searchQuery?: string;
}
