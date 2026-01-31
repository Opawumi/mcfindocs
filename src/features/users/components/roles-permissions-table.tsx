import {
    ROLE_PERMISSIONS,
    ROLE_LABELS,
    ROLE_DESCRIPTIONS,
    PERMISSION_LABELS
} from '@/lib/config/permissions';
import { Permission, UserRole } from '@/lib/types/user.types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RolesPermissionsTable() {
    const roles = Object.keys(ROLE_PERMISSIONS) as UserRole[];
    // Get all unique permissions from the labels to ensure we show everything
    // (Assuming PERMISSION_LABELS contains all available permissions)
    const allPermissions = Object.keys(PERMISSION_LABELS) as Permission[];

    return (
        <div className="space-y-8">
            {/* Roles Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {roles.map((role) => (
                    <Card key={role} className="flex flex-col">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-medium">{ROLE_LABELS[role]}</CardTitle>
                            <CardDescription className="text-xs font-mono bg-muted px-2 py-1 rounded w-fit">
                                {role}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm text-muted-foreground">
                                {ROLE_DESCRIPTIONS[role]}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Permissions Matrix */}
            <Card>
                <CardHeader>
                    <CardTitle>Permissions Matrix</CardTitle>
                    <CardDescription>
                        Detailed breakdown of access rights for each role.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Permission</TableHead>
                                    {roles.map((role) => (
                                        <TableHead key={role} className="text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="font-semibold">{ROLE_LABELS[role]}</span>
                                            </div>
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allPermissions.map((permission) => (
                                    <TableRow key={permission}>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>{PERMISSION_LABELS[permission]}</span>
                                                <span className="text-xs text-muted-foreground font-mono">
                                                    {permission}
                                                </span>
                                            </div>
                                        </TableCell>
                                        {roles.map((role) => {
                                            const hasAccess = ROLE_PERMISSIONS[role].includes(permission);
                                            return (
                                                <TableCell key={`${role}-${permission}`} className="text-center">
                                                    <div className={cn(
                                                        "flex items-center justify-center w-8 h-8 rounded-full mx-auto",
                                                        hasAccess
                                                            ? "bg-primary/10 text-primary"
                                                            : "bg-muted text-muted-foreground/50"
                                                    )}>
                                                        {hasAccess ? (
                                                            <Check className="h-4 w-4" />
                                                        ) : (
                                                            <X className="h-4 w-4" />
                                                        )}
                                                    </div>
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
