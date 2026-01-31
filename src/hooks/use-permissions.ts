import { useCallback } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Permission, UserRole } from '@/lib/types/user.types';
import { ROLE_PERMISSIONS, hasPermission } from '@/lib/config/permissions';

export function usePermissions() {
    const { user } = useAuthStore();

    /**
     * Check if the current user has a specific permission
     */
    const can = useCallback((permission: Permission): boolean => {
        if (!user) return false;
        return hasPermission(user.role, permission);
    }, [user]);

    /**
     * Check if the current user has a specific role or one of a list of roles
     */
    const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
        if (!user) return false;
        if (Array.isArray(role)) {
            return role.includes(user.role);
        }
        return user.role === role;
    }, [user]);

    /**
     * Get all permissions for the current user
     */
    const getRolePermissions = useCallback((): Permission[] => {
        if (!user) return [];
        return ROLE_PERMISSIONS[user.role] || [];
    }, [user]);

    return {
        user,
        role: user?.role,
        can,
        hasRole,
        permissions: getRolePermissions(),
        isAuthenticated: !!user
    };
}
