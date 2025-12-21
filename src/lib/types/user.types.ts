/**
 * User role types
 */
export type UserRole = "super_admin" | "admin" | "general_user" | "guest";

/**
 * Permission types
 */
export type Permission =
  | "view"
  | "download"
  | "edit"
  | "share"
  | "delete"
  | "manage_access";

/**
 * User interface
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  jobTitle?: string;
  department?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  isActive: boolean;
}

/**
 * User group interface
 */
export interface UserGroup {
  id: string;
  name: string;
  description?: string;
  memberIds: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * User settings interface
 */
export interface UserSettings {
  userId: string;
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    inApp: boolean;
    newDocument: boolean;
    documentShared: boolean;
    newMemo: boolean;
    memoReply: boolean;
    mentions: boolean;
  };
  defaultView: "category" | "my_folders";
}

/**
 * User profile update data
 */
export interface UserProfileUpdate {
  name?: string;
  jobTitle?: string;
  department?: string;
  profilePicture?: string;
}

/**
 * User creation data
 */
export interface CreateUserData {
  email: string;
  name: string;
  role: UserRole;
  jobTitle?: string;
  department?: string;
  password: string;
}
