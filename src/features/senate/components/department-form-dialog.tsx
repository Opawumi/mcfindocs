'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Department, DepartmentFormData, Faculty } from '@/lib/types/senate.types';

interface DepartmentFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    department?: Department | null;
    faculties: Faculty[];
    onSubmit: (data: DepartmentFormData) => void;
    isLoading?: boolean;
}

export function DepartmentFormDialog({
    open,
    onOpenChange,
    department,
    faculties,
    onSubmit,
    isLoading,
}: DepartmentFormDialogProps) {
    const [formData, setFormData] = useState<DepartmentFormData>({
        name: department?.name || '',
        code: department?.code || '',
        facultyId: department?.facultyId || '',
        headOfDepartment: department?.headOfDepartment || '',
        description: department?.description || '',
    });

    useEffect(() => {
        if (department) {
            setFormData({
                name: department.name,
                code: department.code,
                facultyId: department.facultyId,
                headOfDepartment: department.headOfDepartment || '',
                description: department.description || '',
            });
        }
    }, [department]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleClose = () => {
        setFormData({
            name: '',
            code: '',
            facultyId: '',
            headOfDepartment: '',
            description: '',
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {department ? 'Edit Department' : 'Add Department'}
                    </DialogTitle>
                    <DialogDescription>
                        {department
                            ? 'Update the department information below.'
                            : 'Create a new department by filling in the details below.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Department Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, name: e.target.value }))
                            }
                            placeholder="e.g., Biology"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="code">Department Code *</Label>
                        <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))
                            }
                            placeholder="e.g., BIO"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="faculty">Faculty *</Label>
                        <Select
                            value={formData.facultyId}
                            onValueChange={(value) =>
                                setFormData((prev) => ({ ...prev, facultyId: value }))
                            }
                            required
                        >
                            <SelectTrigger id="faculty">
                                <SelectValue placeholder="Select faculty" />
                            </SelectTrigger>
                            <SelectContent>
                                {faculties.map((faculty) => (
                                    <SelectItem key={faculty.id} value={faculty.id}>
                                        {faculty.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="headOfDepartment">Head of Department</Label>
                        <Input
                            id="headOfDepartment"
                            value={formData.headOfDepartment}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, headOfDepartment: e.target.value }))
                            }
                            placeholder="e.g., Dr. Jane Smith"
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, description: e.target.value }))
                            }
                            placeholder="Brief description of the department"
                            rows={3}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || !formData.facultyId}>
                            {isLoading ? 'Saving...' : department ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
