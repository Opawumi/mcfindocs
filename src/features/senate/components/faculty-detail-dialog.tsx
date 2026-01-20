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
import { Faculty } from '@/lib/types/senate.types';
import { useRouter } from 'next/navigation';
import { Mail, Pencil, Calendar, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface FacultyDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    faculty: Faculty | null;
    onEdit: (faculty: Faculty) => void;
}

export function FacultyDetailDialog({
    open,
    onOpenChange,
    faculty,
    onEdit,
}: FacultyDetailDialogProps) {
    const router = useRouter();

    if (!faculty) return null;

    const handleCreateMemo = () => {
        // Navigate to memo creation with faculty pre-filled
        router.push(`/dashboard/memos/create?faculty=${faculty.id}&facultyName=${encodeURIComponent(faculty.name)}`);
    };

    const handleEdit = () => {
        onEdit(faculty);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{faculty.name}</DialogTitle>
                    <DialogDescription>
                        Faculty Code: <span className="font-semibold">{faculty.code}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Faculty Information */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Faculty Name
                            </label>
                            <p className="mt-1 text-gray-900">{faculty.name}</p>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Faculty Code
                            </label>
                            <p className="mt-1 text-gray-900">{faculty.code}</p>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Dean
                            </label>
                            <div className="mt-1 flex items-center gap-2 text-gray-900">
                                <User className="h-4 w-4 text-gray-500" />
                                {faculty.dean || '-'}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Created Date
                            </label>
                            <div className="mt-1 flex items-center gap-2 text-gray-900">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                {formatDate(faculty.createdAt)}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {faculty.description && (
                        <div>
                            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Description
                            </label>
                            <p className="mt-1 text-gray-900 whitespace-pre-wrap">{faculty.description}</p>
                        </div>
                    )}

                    {/* Additional Info */}
                    <div className="border-t pt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                                <span className="font-medium">Last Updated:</span>{' '}
                                {formatDate(faculty.updatedAt, 'MMM dd, yyyy HH:mm')}
                            </div>
                            <div>
                                <span className="font-medium">Faculty ID:</span> {faculty.id}
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
