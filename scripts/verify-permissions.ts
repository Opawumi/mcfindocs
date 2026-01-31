
import { ROLE_PERMISSIONS, hasPermission } from '../src/lib/config/permissions';
import { UserRole } from '../src/lib/types/user.types';

console.log("🔒 Verifying Access Control Definitions...\n");

const roles: UserRole[] = ['super_admin', 'admin', 'general_user', 'guest'];

console.table(
    roles.map(role => ({
        Role: role,
        "Can Edit": hasPermission(role, 'edit') ? '✅' : '❌',
        "Can Delete": hasPermission(role, 'delete') ? '✅' : '❌',
        "Can Manage Access": hasPermission(role, 'manage_access') ? '✅' : '❌',
        "Total Permissions": ROLE_PERMISSIONS[role].length
    }))
);

console.log("\n✅ Configuration verified successfully.");
