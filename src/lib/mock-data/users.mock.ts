import { User, UserRole, UserSettings } from "../types";
import { generateId } from "../utils";

/**
 * Generate mock users
 */
export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "admin@nexusdocs.com",
    name: "Sarah Johnson",
    role: "super_admin",
    jobTitle: "System Administrator",
    department: "IT",
    profilePicture: undefined,
    createdAt: "2023-01-15T10:00:00Z",
    updatedAt: "2024-12-01T14:30:00Z",
    lastLogin: "2024-12-09T09:15:00Z",
    isActive: true,
  },
  {
    id: "user-2",
    email: "john.doe@nexusdocs.com",
    name: "John Doe",
    role: "admin",
    jobTitle: "HR Manager",
    department: "Human Resources",
    profilePicture: undefined,
    createdAt: "2023-02-20T11:00:00Z",
    updatedAt: "2024-11-28T16:45:00Z",
    lastLogin: "2024-12-08T15:30:00Z",
    isActive: true,
  },
  {
    id: "user-3",
    email: "jane.smith@nexusdocs.com",
    name: "Jane Smith",
    role: "general_user",
    jobTitle: "Marketing Specialist",
    department: "Marketing",
    profilePicture: undefined,
    createdAt: "2023-03-10T09:30:00Z",
    updatedAt: "2024-12-05T10:20:00Z",
    lastLogin: "2024-12-09T08:45:00Z",
    isActive: true,
  },
  {
    id: "user-4",
    email: "mike.wilson@nexusdocs.com",
    name: "Mike Wilson",
    role: "general_user",
    jobTitle: "Software Developer",
    department: "Engineering",
    profilePicture: undefined,
    createdAt: "2023-04-05T13:00:00Z",
    updatedAt: "2024-12-03T11:10:00Z",
    lastLogin: "2024-12-09T07:30:00Z",
    isActive: true,
  },
  {
    id: "user-5",
    email: "emily.brown@nexusdocs.com",
    name: "Emily Brown",
    role: "general_user",
    jobTitle: "Financial Analyst",
    department: "Finance",
    profilePicture: undefined,
    createdAt: "2023-05-12T14:15:00Z",
    updatedAt: "2024-11-30T09:50:00Z",
    lastLogin: "2024-12-08T16:20:00Z",
    isActive: true,
  },
];

/**
 * Get current user (mock)
 */
export function getCurrentUser(): User {
  return mockUsers[0]; // Return super admin for now
}

/**
 * Get user by ID
 */
export function getUserById(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id);
}

/**
 * Get user by email
 */
export function getUserByEmail(email: string): User | undefined {
  return mockUsers.find((user) => user.email === email);
}

/**
 * Get default user settings
 */
export function getDefaultUserSettings(userId: string): UserSettings {
  return {
    userId,
    theme: "system",
    language: "en",
    timezone: "UTC",
    notifications: {
      email: true,
      inApp: true,
      newDocument: true,
      documentShared: true,
      newMemo: true,
      memoReply: true,
      mentions: true,
    },
    defaultView: "category",
  };
}
