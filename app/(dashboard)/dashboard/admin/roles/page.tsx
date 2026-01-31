import { RolesPermissionsTable } from '@/features/users/components/roles-permissions-table';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RolesAndPermissionsPage() {
    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/admin/users">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">User Access Rights & Definitions</h1>
                    <p className="text-muted-foreground">
                        View system roles and their assigned permissions.
                    </p>
                </div>
            </div>

            <RolesPermissionsTable />
        </div>
    );
}
