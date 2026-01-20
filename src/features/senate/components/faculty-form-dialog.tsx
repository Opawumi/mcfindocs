'use client';

import { useState } from 'react';
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
import { Faculty, FacultyFormData } from '@/lib/types/senate.types';

interface FacultyFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    faculty?: Faculty | null;
    onSubmit: (data: FacultyFormData) => void;
    isLoading?: boolean;
}

export function FacultyFormDialog({
    open,
    onOpenChange,
    faculty,
    onSubmit,
    isLoading,
}: FacultyFormDialogProps) {
    const [formData, setFormData] = useState<FacultyFormData>({
        name: faculty?.name || '',
        code: faculty?.code || '',
        description: faculty?.description || '',
        dean: faculty?.dean || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleClose = () => {
        setFormData({
            name: '',
            code: '',
            description: '',
            dean: '',
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {faculty ? 'Edit Faculty' : 'Add Faculty'}
                    </DialogTitle>
                    <DialogDescription>
                        {faculty
                            ? 'Update the faculty information below.'
                            : 'Create a new faculty by filling in the details below.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Faculty Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, name: e.target.value }))
                            }
                            placeholder="e.g., Science"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="code">Faculty Code *</Label>
                        <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))
                            }
                            placeholder="e.g., SCI"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="dean">Dean</Label>
                        <Input
                            id="dean"
                            value={formData.dean}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, dean: e.target.value }))
                            }
                            placeholder="e.g., Prof. John Doe"
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
                            placeholder="Brief description of the faculty"
                            rows={3}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : faculty ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
