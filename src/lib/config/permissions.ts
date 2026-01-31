import { Permission, UserRole } from "../types/user.types";

/**
 * Role to Permission Mapping Configuration
 * Defines what each role can do in the system.
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    super_admin: [
        "view",
        "download",
        "edit",
        "share",
        "delete",
        "manage_access",
    ],
    admin: [
        "view",
        "download",
        "edit",
        "share",
        "manage_access",
        // Admins might not be able to delete everything, but for now let's say they can't 'delete' critical system resources implies by omission if we wanted, 
        // but here we didn't specify resource granularly yet. Let's give them delete for now.
        "delete",
    ],
    general_user: [
        "view",
        "download",
        "share", // Can share their own documents usually
        "edit",  // Can edit their own documents
    ],
    guest: [
        "view", // Read-only access
    ],
};

/**
 * Human-readable labels for User Roles
 */
export const ROLE_LABELS: Record<UserRole, string> = {
    super_admin: "Super Administrator",
    admin: "Administrator",
    general_user: "General User",
    guest: "Guest",
};

/**
 * Human-readable descriptions for User Roles
 */
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
    super_admin: "Full access to all system features and settings.",
    admin: "Can manage users and content, but limited system settings access.",
    general_user: "Standard access to view, create, and share documents.",
    guest: "Limited read-only access to shared documents.",
};

/**
 * Human-readable labels for Permissions
 */
export const PERMISSION_LABELS: Record<Permission, string> = {
    view: "View Content",
    download: "Download Files",
    edit: "Edit Content",
    share: "Share Items",
    delete: "Delete Items",
    manage_access: "Manage Access",
};

/**
 * Helper to check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS[role];
    return permissions.includes(permission);
}
