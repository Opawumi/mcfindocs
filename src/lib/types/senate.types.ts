/**
 * Faculty type definition
 */
export interface Faculty {
    id: string;
    name: string;
    code: string;
    description?: string;
    dean?: string; // Employee name or ID
    createdAt: string;
    updatedAt: string;
}

/**
 * Department type definition
 */
export interface Department {
    id: string;
    name: string;
    code: string;
    facultyId: string;
    facultyName?: string; // For display purposes
    headOfDepartment?: string; // Employee name or ID
    description?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Form data for creating/editing faculty
 */
export interface FacultyFormData {
    name: string;
    code: string;
    description?: string;
    dean?: string;
}

/**
 * Form data for creating/editing department
 */
export interface DepartmentFormData {
    name: string;
    code: string;
    facultyId: string;
    headOfDepartment?: string;
    description?: string;
}
