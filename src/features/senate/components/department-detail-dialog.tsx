'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Department } from '@/lib/types/senate.types';
import { useRouter } from 'next/navigation';
import { Mail, Pencil, Calendar, User, Building2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface DepartmentDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    department: Department | null;
    onEdit: (department: Department) => void;
}

export function DepartmentDetailDialog({
    open,
    onOpenChange,
    department,
    onEdit,
}: DepartmentDetailDialogProps) {
    const router = useRouter();

    if (!department) return null;

    const handleCreateMemo = () => {
        // Navigate to memo creation with department pre-filled
        router.push(`/dashboard/memos/create?department=${department.id}&departmentName=${encodeURIComponent(department.name)}&faculty=${department.facultyId}&facultyName=${encodeURIComponent(department.facultyName || '')}`);
    };

    const handleEdit = () => {
        onEdit(department);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{department.name}</DialogTitle>
                    <DialogDescription>
                        Department Code: <span className="font-semibold">{department.code}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Department Information */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Department Name
                            </label>
                            <p className="mt-1 text-gray-900">{department.name}</p>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Department Code
                            </label>
                            <p className="mt-1 text-gray-900">{department.code}</p>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Faculty
                            </label>
                            <div className="mt-1 flex items-center gap-2 text-gray-900">
                                <Building2 className="h-4 w-4 text-gray-500" />
                                {department.facultyName || '-'}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Head of Department
                            </label>
                            <div className="mt-1 flex items-center gap-2 text-gray-900">
                                <User className="h-4 w-4 text-gray-500" />
                                {department.headOfDepartment || '-'}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Created Date
                            </label>
                            <div className="mt-1 flex items-center gap-2 text-gray-900">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                {formatDate(department.createdAt)}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {department.description && (
                        <div>
                            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Description
                            </label>
                            <p className="mt-1 text-gray-900 whitespace-pre-wrap">{department.description}</p>
                        </div>
                    )}

                    {/* Additional Info */}
                    <div className="border-t pt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                                <span className="font-medium">Last Updated:</span>{' '}
                                {formatDate(department.updatedAt, 'MMM dd, yyyy HH:mm')}
                            </div>
                            <div>
                                <span className="font-medium">Department ID:</span> {department.id}
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex items-center justify-between sm:justify-between">
                    <Button
                        onClick={handleCreateMemo}
                        variant="outline"
                        className="gap-2"
                    >
                        <Mail className="h-4 w-4" />
                        Create Memo
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            onClick={handleEdit}
                            variant="outline"
                            className="gap-2"
                        >
                            <Pencil className="h-4 w-4" />
                            Edit
                        </Button>
                        <Button onClick={() => onOpenChange(false)}>
                            Close
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
