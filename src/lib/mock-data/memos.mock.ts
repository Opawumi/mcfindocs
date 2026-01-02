import { EMemo, MemoStatus, MemoPriority } from "../types";

/**
 * Generate mock e-memos
 */
export const mockMemos: EMemo[] = [
  {
    id: "memo-1",
    subject: "Q4 Performance Review Schedule",
    body: "<p>Dear Team,</p><p>This is to inform you that the Q4 performance reviews will be conducted from December 15-20, 2024. Please ensure you have completed your self-assessments by December 10th.</p><p>Best regards,<br/>HR Team</p>",
    senderId: "user-2",
    recipients: [
      {
        userId: "user-1",
        type: "to",
        isRead: true,
        readAt: "2024-12-02T10:15:00Z",
      },
      {
        userId: "user-3",
        type: "to",
        isRead: true,
        readAt: "2024-12-02T11:30:00Z",
      },
      { userId: "user-4", type: "to", isRead: false },
      {
        userId: "user-5",
        type: "cc",
        isRead: true,
        readAt: "2024-12-02T14:20:00Z",
      },
    ],
    attachments: [],
    priority: "high",
    status: "sent",
    dueDate: "2024-12-10T23:59:59Z",
    requiresResponse: true,
    requiresReadReceipt: true,
    requiresSignature: false,
    createdAt: "2024-12-01T09:00:00Z",
    sentAt: "2024-12-01T09:00:00Z",
    updatedAt: "2024-12-01T09:00:00Z",
    threadId: "thread-1",
  },
  {
    id: "memo-2",
    subject: "New Document Management System - NexusDocs",
    body: "<p>Hello Everyone,</p><p>We are excited to announce the launch of our new Enterprise Document Management System, <strong>NexusDocs</strong>. This system will streamline our document organization and improve collaboration across departments.</p><p>Training sessions will be scheduled next week. Please find the attached user guide for reference.</p><p>Thank you,<br/>IT Department</p>",
    senderId: "user-1",
    recipients: [
      {
        userId: "user-2",
        type: "to",
        isRead: true,
        readAt: "2024-11-26T08:45:00Z",
      },
      {
        userId: "user-3",
        type: "to",
        isRead: true,
        readAt: "2024-11-26T09:10:00Z",
      },
      {
        userId: "user-4",
        type: "to",
        isRead: true,
        readAt: "2024-11-26T09:25:00Z",
      },
      {
        userId: "user-5",
        type: "to",
        isRead: true,
        readAt: "2024-11-26T10:00:00Z",
      },
    ],
    attachments: [
      {
        id: "att-1",
        documentId: "doc-1",
        fileName: "nexusdocs-user-guide.pdf",
        fileSize: 1245678,
        fileType: "pdf",
        fileUrl: "/19-30gr039 Report.pdf",
      },
    ],
    priority: "normal",
    status: "sent",
    requiresResponse: false,
    requiresReadReceipt: false,
    requiresSignature: false,
    createdAt: "2024-11-25T16:30:00Z",
    sentAt: "2024-11-25T16:30:00Z",
    updatedAt: "2024-11-25T16:30:00Z",
    threadId: "thread-2",
  },
  {
    id: "memo-3",
    subject: "Urgent: Security Policy Update",
    body: "<p>URGENT NOTICE</p><p>Due to recent security concerns, we are implementing an updated security policy effective immediately. All employees must:</p><ul><li>Change their passwords within 24 hours</li><li>Enable two-factor authentication</li><li>Complete the security awareness training by Friday</li></ul><p>Failure to comply may result in account suspension.</p><p>Security Team</p>",
    senderId: "user-1",
    recipients: [
      {
        userId: "user-2",
        type: "to",
        isRead: true,
        readAt: "2024-12-08T08:05:00Z",
      },
      { userId: "user-3", type: "to", isRead: false },
      {
        userId: "user-4",
        type: "to",
        isRead: true,
        readAt: "2024-12-08T08:30:00Z",
      },
      { userId: "user-5", type: "to", isRead: false },
    ],
    attachments: [
      {
        id: "att-2",
        fileName: "security-policy-2024.pdf",
        fileSize: 856432,
        fileType: "pdf",
        fileUrl: "/19-30gr039 Report.pdf",
      },
    ],
    priority: "urgent",
    status: "sent",
    dueDate: "2024-12-13T23:59:59Z",
    requiresResponse: true,
    requiresReadReceipt: true,
    requiresSignature: true,
    createdAt: "2024-12-08T08:00:00Z",
    sentAt: "2024-12-08T08:00:00Z",
    updatedAt: "2024-12-08T08:00:00Z",
    threadId: "thread-3",
  },
  {
    id: "memo-4",
    subject: "Marketing Campaign Feedback Request",
    body: "<p>Hi Team,</p><p>I have attached the draft proposal for our Spring 2025 marketing campaign. Please review and provide your feedback by end of week.</p><p>Looking forward to your input!</p><p>Jane</p>",
    senderId: "user-3",
    recipients: [
      {
        userId: "user-1",
        type: "to",
        isRead: true,
        readAt: "2024-12-06T09:20:00Z",
      },
      { userId: "user-2", type: "cc", isRead: false },
    ],
    attachments: [
      {
        id: "att-3",
        documentId: "doc-3",
        fileName: "marketing-campaign-proposal.docx",
        fileSize: 856432,
        fileType: "docx",
        fileUrl: "/19-30gr039 Report.pdf",
      },
    ],
    priority: "normal",
    status: "sent",
    dueDate: "2024-12-13T23:59:59Z",
    requiresResponse: true,
    requiresReadReceipt: false,
    requiresSignature: false,
    createdAt: "2024-12-05T14:30:00Z",
    sentAt: "2024-12-05T14:30:00Z",
    updatedAt: "2024-12-05T14:30:00Z",
    threadId: "thread-4",
  },
  {
    id: "memo-5",
    subject: "Draft: Team Building Event",
    body: "<p>Planning a team building event for next month. Ideas welcome!</p>",
    senderId: "user-1",
    recipients: [],
    attachments: [],
    priority: "normal",
    status: "draft",
    requiresResponse: false,
    requiresReadReceipt: false,
    requiresSignature: false,
    createdAt: "2024-12-09T10:00:00Z",
    updatedAt: "2024-12-09T10:15:00Z",
    threadId: "thread-5",
  },
];

/**
 * Get memos by status
 */
export function getMemosByStatus(status: MemoStatus, userId: string): EMemo[] {
  if (status === "draft") {
    return mockMemos.filter(
      (memo) => memo.status === "draft" && memo.senderId === userId
    );
  }

  if (status === "sent") {
    return mockMemos.filter(
      (memo) => memo.status === "sent" && memo.senderId === userId
    );
  }

  // For inbox (received memos)
  return mockMemos.filter(
    (memo) =>
      memo.status === "sent" && memo.recipients.some((r) => r.userId === userId)
  );
}

/**
 * Get memo by ID
 */
export function getMemoById(id: string): EMemo | undefined {
  return mockMemos.find((memo) => memo.id === id);
}

/**
 * Get unread memos count
 */
export function getUnreadMemosCount(userId: string): number {
  return mockMemos.filter(
    (memo) =>
      memo.status === "sent" &&
      memo.recipients.some((r) => r.userId === userId && !r.isRead)
  ).length;
}

/**
 * Get memos by thread
 */
export function getMemosByThread(threadId: string): EMemo[] {
  return mockMemos.filter((memo) => memo.threadId === threadId);
}
