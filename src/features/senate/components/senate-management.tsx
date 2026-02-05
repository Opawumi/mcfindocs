'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Eye, Pencil, Trash2, Plus } from 'lucide-react';
import { Faculty, Department, FacultyFormData, DepartmentFormData } from '@/lib/types/senate.types';
import {
    getAllFaculties,
    getAllDepartments,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from '@/services/senate.service';
import { FacultyFormDialog } from './faculty-form-dialog';
import { DepartmentFormDialog } from './department-form-dialog';
import { FacultyDetailDialog } from './faculty-detail-dialog';
import { DepartmentDetailDialog } from './department-detail-dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type TabType = 'faculty' | 'department';

export function SenateManagement() {
    const [activeTab, setActiveTab] = useState<TabType>('department');
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dialog states
    const [facultyDialogOpen, setFacultyDialogOpen] = useState(false);
    const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
    const [facultyDetailOpen, setFacultyDetailOpen] = useState(false);
    const [departmentDetailOpen, setDepartmentDetailOpen] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

    // Delete confirmation states
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ type: TabType; id: string; name: string } | null>(null);

    // Load data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [facultiesData, departmentsData] = await Promise.all([
                getAllFaculties(),
                getAllDepartments(),
            ]);
            setFaculties(facultiesData);
            setDepartments(departmentsData);
        } catch (error) {
            toast.error('Failed to load data');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Faculty handlers
    const handleAddFaculty = () => {
        setSelectedFaculty(null);
        setFacultyDialogOpen(true);
    };

    const handleEditFaculty = (faculty: Faculty) => {
        setSelectedFaculty(faculty);
        setFacultyDialogOpen(true);
    };

    const handleViewFaculty = (faculty: Faculty) => {
        setSelectedFaculty(faculty);
        setFacultyDetailOpen(true);
    };

    const handleSubmitFaculty = async (data: FacultyFormData) => {
        setIsSubmitting(true);
        try {
            if (selectedFaculty) {
                await updateFaculty(selectedFaculty.id, data);
                toast.success('Faculty updated successfully');
            } else {
                await createFaculty(data);
                toast.success('Faculty created successfully');
            }
            setFacultyDialogOpen(false);
            loadData();
        } catch (error) {
            toast.error('Failed to save faculty');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Department handlers
    const handleAddDepartment = () => {
        setSelectedDepartment(null);
        setDepartmentDialogOpen(true);
    };

    const handleEditDepartment = (department: Department) => {
        setSelectedDepartment(department);
        setDepartmentDialogOpen(true);
    };

    const handleViewDepartment = (department: Department) => {
        setSelectedDepartment(department);
        setDepartmentDetailOpen(true);
    };

    const handleSubmitDepartment = async (data: DepartmentFormData) => {
        setIsSubmitting(true);
        try {
            if (selectedDepartment) {
                await updateDepartment(selectedDepartment.id, data);
                toast.success('Department updated successfully');
            } else {
                await createDepartment(data);
                toast.success('Department created successfully');
            }
            setDepartmentDialogOpen(false);
            loadData();
        } catch (error: any) {
            toast.error(error.message || 'Failed to save department');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete handlers
    const handleDeleteClick = (type: TabType, id: string, name: string) => {
        setItemToDelete({ type, id, name });
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;

        setIsSubmitting(true);
        try {
            if (itemToDelete.type === 'faculty') {
                await deleteFaculty(itemToDelete.id);
                toast.success('Faculty deleted successfully');
            } else {
                await deleteDepartment(itemToDelete.id);
                toast.success('Department deleted successfully');
            }
            setDeleteDialogOpen(false);
            setItemToDelete(null);
            loadData();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete item');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-48 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-shrink-0">
                <div className="p-4">
                    <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                        E-Senate
                    </h2>
                    <div className="space-y-1">
                        <button
                            onClick={() => setActiveTab('faculty')}
                            className={cn(
                                'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                activeTab === 'faculty'
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            )}
                        >
                            Faculty
                        </button>
                        <button
                            onClick={() => setActiveTab('department')}
                            className={cn(
                                'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                activeTab === 'department'
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            )}
                        >
                            Department
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium flex items-center gap-2 transition-colors">
                        <span>←</span>
                        Log Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-gray-50 dark:bg-gray-900/50">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {activeTab === 'faculty' ? 'Faculty Management' : 'Department Management'}
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {activeTab === 'faculty'
                                    ? 'Manage academic faculties'
                                    : 'Manage departments across faculties'}
                            </p>
                        </div>
                        <Button
                            onClick={activeTab === 'faculty' ? handleAddFaculty : handleAddDepartment}
                            className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 dark:shadow-none"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add {activeTab === 'faculty' ? 'Faculty' : 'Department'}
                        </Button>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                        {isLoading ? (
                            <div className="p-12 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">Loading...</p>
                            </div>
                        ) : activeTab === 'faculty' ? (
                            <Table>
                                <TableHeader className="bg-gray-50/50 dark:bg-gray-900/50">
                                    <TableRow className="border-gray-200 dark:border-gray-700">
                                        <TableHead className="w-12 font-semibold text-gray-700 dark:text-gray-300">#</TableHead>
                                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">FACULTY NAME</TableHead>
                                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">CODE</TableHead>
                                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">DEAN</TableHead>
                                        <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300">ACTION</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {faculties.length === 0 ? (
                                        <TableRow className="border-gray-200 dark:border-gray-700">
                                            <TableCell colSpan={5} className="text-center py-12 text-gray-500 dark:text-gray-400">
                                                No faculties found. Create your first faculty to get started.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        faculties.map((faculty, index) => (
                                            <TableRow key={faculty.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 border-gray-200 dark:border-gray-700">
                                                <TableCell className="font-medium text-gray-600 dark:text-gray-400">{index + 1}</TableCell>
                                                <TableCell className="font-medium text-gray-900 dark:text-white uppercase tracking-tight">{faculty.name}</TableCell>
                                                <TableCell className="text-gray-600 dark:text-gray-400 font-mono text-xs">{faculty.code}</TableCell>
                                                <TableCell className="text-gray-600 dark:text-gray-400">{faculty.dean || '-'}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-primary hover:text-primary/90 hover:bg-primary/10 dark:hover:bg-primary/20"
                                                            onClick={() => handleViewFaculty(faculty)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                            onClick={() => handleEditFaculty(faculty)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                            onClick={() => handleDeleteClick('faculty', faculty.id, faculty.name)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        ) : (
                            <Table>
                                <TableHeader className="bg-gray-50/50 dark:bg-gray-900/50">
                                    <TableRow className="border-gray-200 dark:border-gray-700">
                                        <TableHead className="w-12 font-semibold text-gray-700 dark:text-gray-300">#</TableHead>
                                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">DEPARTMENT NAME</TableHead>
                                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">FACULTY NAME</TableHead>
                                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">EMPLOYEE NAME</TableHead>
                                        <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300">ACTION</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {departments.length === 0 ? (
                                        <TableRow className="border-gray-200 dark:border-gray-700">
                                            <TableCell colSpan={5} className="text-center py-12 text-gray-500 dark:text-gray-500">
                                                No departments found. Create your first department to get started.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        departments.map((department, index) => (
                                            <TableRow key={department.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 border-gray-200 dark:border-gray-700">
                                                <TableCell className="font-medium text-gray-600 dark:text-gray-400">{index + 1}</TableCell>
                                                <TableCell className="font-medium text-gray-900 dark:text-white uppercase tracking-tight">{department.name}</TableCell>
                                                <TableCell className="text-gray-600 dark:text-gray-400">{department.facultyName}</TableCell>
                                                <TableCell className="text-gray-600 dark:text-gray-400">{department.headOfDepartment || '-'}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-primary hover:text-primary/90 hover:bg-primary/10 dark:hover:bg-primary/20"
                                                            onClick={() => handleViewDepartment(department)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                            onClick={() => handleEditDepartment(department)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                            onClick={() => handleDeleteClick('department', department.id, department.name)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </div>
            </div>

            {/* Dialogs */}
            <FacultyFormDialog
                open={facultyDialogOpen}
                onOpenChange={setFacultyDialogOpen}
                faculty={selectedFaculty}
                onSubmit={handleSubmitFaculty}
                isLoading={isSubmitting}
            />

            <DepartmentFormDialog
                open={departmentDialogOpen}
                onOpenChange={setDepartmentDialogOpen}
                department={selectedDepartment}
                faculties={faculties}
                onSubmit={handleSubmitDepartment}
                isLoading={isSubmitting}
            />

            <FacultyDetailDialog
                open={facultyDetailOpen}
                onOpenChange={setFacultyDetailOpen}
                faculty={selectedFaculty}
                onEdit={handleEditFaculty}
            />

            <DepartmentDetailDialog
                open={departmentDetailOpen}
                onOpenChange={setDepartmentDetailOpen}
                department={selectedDepartment}
                onEdit={handleEditDepartment}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="dark:bg-gray-900 dark:border-gray-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="dark:text-white">Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription className="dark:text-gray-400">
                            This will permanently delete <strong className="dark:text-gray-200">{itemToDelete?.name}</strong>.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting} className="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            disabled={isSubmitting}
                            className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                        >
                            {isSubmitting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
