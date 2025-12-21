import {
  User,
  CreateUserData,
  UserSettings,
  AuditLogEntry,
  AuditLogFilters,
  PaginatedResult,
} from "../lib/types";
import {
  mockUsers,
  getUserById,
  getDefaultUserSettings,
} from "../lib/mock-data";
import { sleep } from "../lib/utils";

/**
 * Admin Service
 * Handles all admin-related operations
 * Currently uses mock data - will be replaced with real API calls
 */

/**
 * Get all users
 */
export async function getUsers(): Promise<User[]> {
  await sleep(300);
  return [...mockUsers];
}

/**
 * Get a single user by ID
 */
export async function getUser(id: string): Promise<User | null> {
  await sleep(200);
  return getUserById(id) || null;
}

/**
 * Create a new user
 */
export async function createUser(data: CreateUserData): Promise<User> {
  await sleep(500);

  const newUser: User = {
    id: `user-${Date.now()}`,
    email: data.email,
    name: data.name,
    role: data.role,
    jobTitle: data.jobTitle,
    department: data.department,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  };

  mockUsers.push(newUser);
  return newUser;
}

/**
 * Update a user
 */
export async function updateUser(
  id: string,
  data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
): Promise<User> {
  await sleep(300);

  const user = getUserById(id);
  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser: User = {
    ...user,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const index = mockUsers.findIndex((u) => u.id === id);
  if (index !== -1) {
    mockUsers[index] = updatedUser;
  }

  return updatedUser;
}

/**
 * Delete/deactivate a user
 */
export async function deleteUser(id: string): Promise<void> {
  await sleep(300);

  const user = getUserById(id);
  if (user) {
    user.isActive = false;
    user.updatedAt = new Date().toISOString();
  }
}

/**
 * Get audit logs
 */
export async function getAuditLogs(
  filters?: AuditLogFilters,
  page: number = 1,
  pageSize: number = 50
): Promise<PaginatedResult<AuditLogEntry>> {
  await sleep(400);

  // Mock audit logs
  const mockAuditLogs: AuditLogEntry[] = [
    {
      id: "audit-1",
      userId: "user-1",
      userName: "Sarah Johnson",
      action: "document.upload",
      resourceType: "document",
      resourceId: "doc-1",
      resourceName: "Employee Handbook 2024",
      details: { fileSize: 2458624, categoryId: "cat-4" },
      ipAddress: "192.168.1.100",
      timestamp: "2024-12-09T10:30:00Z",
    },
    {
      id: "audit-2",
      userId: "user-2",
      userName: "John Doe",
      action: "memo.send",
      resourceType: "memo",
      resourceId: "memo-1",
      resourceName: "Q4 Performance Review Schedule",
      details: { recipientCount: 4, priority: "high" },
      ipAddress: "192.168.1.101",
      timestamp: "2024-12-09T09:00:00Z",
    },
    {
      id: "audit-3",
      userId: "user-1",
      userName: "Sarah Johnson",
      action: "user.create",
      resourceType: "user",
      resourceId: "user-5",
      resourceName: "Emily Brown",
      details: { role: "general_user", department: "Finance" },
      ipAddress: "192.168.1.100",
      timestamp: "2024-12-08T14:15:00Z",
    },
    {
      id: "audit-4",
      userId: "user-3",
      userName: "Jane Smith",
      action: "document.share",
      resourceType: "document",
      resourceId: "doc-3",
      resourceName: "Marketing Campaign Proposal",
      details: {
        sharedWith: ["user-1", "user-2"],
        permissions: ["view", "edit"],
      },
      ipAddress: "192.168.1.102",
      timestamp: "2024-12-08T11:20:00Z",
    },
  ];

  let filteredLogs = [...mockAuditLogs];

  // Apply filters
  if (filters) {
    if (filters.userId) {
      filteredLogs = filteredLogs.filter(
        (log) => log.userId === filters.userId
      );
    }

    if (filters.action) {
      filteredLogs = filteredLogs.filter(
        (log) => log.action === filters.action
      );
    }

    if (filters.resourceType) {
      filteredLogs = filteredLogs.filter(
        (log) => log.resourceType === filters.resourceType
      );
    }

    if (filters.resourceId) {
      filteredLogs = filteredLogs.filter(
        (log) => log.resourceId === filters.resourceId
      );
    }
  }

  // Pagination
  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = filteredLogs.slice(startIndex, endIndex);

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
