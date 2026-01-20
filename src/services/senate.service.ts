import {
    Faculty,
    Department,
    FacultyFormData,
    DepartmentFormData,
} from "@/lib/types/senate.types";
import { mockFaculties, mockDepartments } from "@/lib/mock-data/senate.mock";
import { generateId } from "@/lib/utils";

// Simulate network delay
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get all faculties
 */
export async function getAllFaculties(): Promise<Faculty[]> {
    await sleep(200);
    return [...mockFaculties];
}

/**
 * Get faculty by ID
 */
export async function getFacultyById(id: string): Promise<Faculty | null> {
    await sleep(100);
    return mockFaculties.find((f) => f.id === id) || null;
}

/**
 * Create a new faculty
 */
export async function createFaculty(
    data: FacultyFormData
): Promise<Faculty> {
    await sleep(300);

    const newFaculty: Faculty = {
        id: `faculty-${generateId()}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    mockFaculties.push(newFaculty);
    return newFaculty;
}

/**
 * Update a faculty
 */
export async function updateFaculty(
    id: string,
    data: Partial<FacultyFormData>
): Promise<Faculty> {
    await sleep(300);

    const index = mockFaculties.findIndex((f) => f.id === id);
    if (index === -1) {
        throw new Error("Faculty not found");
    }

    mockFaculties[index] = {
        ...mockFaculties[index],
        ...data,
        updatedAt: new Date().toISOString(),
    };

    return mockFaculties[index];
}

/**
 * Delete a faculty
 */
export async function deleteFaculty(id: string): Promise<void> {
    await sleep(200);

    const index = mockFaculties.findIndex((f) => f.id === id);
    if (index === -1) {
        throw new Error("Faculty not found");
    }

    // Check if faculty has departments
    const hasDepartments = mockDepartments.some((d) => d.facultyId === id);
    if (hasDepartments) {
        throw new Error(
            "Cannot delete faculty with existing departments. Please delete or reassign departments first."
        );
    }

    mockFaculties.splice(index, 1);
}

/**
 * Get all departments
 */
export async function getAllDepartments(): Promise<Department[]> {
    await sleep(200);

    // Enrich departments with faculty names
    return mockDepartments.map((dept) => {
        const faculty = mockFaculties.find((f) => f.id === dept.facultyId);
        return {
            ...dept,
            facultyName: faculty?.name || "Unknown Faculty",
        };
    });
}

/**
 * Get departments by faculty ID
 */
export async function getDepartmentsByFaculty(
    facultyId: string
): Promise<Department[]> {
    await sleep(150);

    return mockDepartments
        .filter((d) => d.facultyId === facultyId)
        .map((dept) => {
            const faculty = mockFaculties.find((f) => f.id === dept.facultyId);
            return {
                ...dept,
                facultyName: faculty?.name || "Unknown Faculty",
            };
        });
}

/**
 * Get department by ID
 */
export async function getDepartmentById(
    id: string
): Promise<Department | null> {
    await sleep(100);

    const dept = mockDepartments.find((d) => d.id === id);
    if (!dept) return null;

    const faculty = mockFaculties.find((f) => f.id === dept.facultyId);
    return {
        ...dept,
        facultyName: faculty?.name || "Unknown Faculty",
    };
}

/**
 * Create a new department
 */
export async function createDepartment(
    data: DepartmentFormData
): Promise<Department> {
    await sleep(300);

    // Verify faculty exists
    const faculty = mockFaculties.find((f) => f.id === data.facultyId);
    if (!faculty) {
        throw new Error("Faculty not found");
    }

    const newDepartment: Department = {
        id: `dept-${generateId()}`,
        ...data,
        facultyName: faculty.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    mockDepartments.push(newDepartment);
    return newDepartment;
}

/**
 * Update a department
 */
export async function updateDepartment(
    id: string,
    data: Partial<DepartmentFormData>
): Promise<Department> {
    await sleep(300);

    const index = mockDepartments.findIndex((d) => d.id === id);
    if (index === -1) {
        throw new Error("Department not found");
    }

    // If faculty is being changed, verify it exists
    if (data.facultyId) {
        const faculty = mockFaculties.find((f) => f.id === data.facultyId);
        if (!faculty) {
            throw new Error("Faculty not found");
        }
        mockDepartments[index].facultyName = faculty.name;
    }

    mockDepartments[index] = {
        ...mockDepartments[index],
        ...data,
        updatedAt: new Date().toISOString(),
    };

    return mockDepartments[index];
}

/**
 * Delete a department
 */
export async function deleteDepartment(id: string): Promise<void> {
    await sleep(200);

    const index = mockDepartments.findIndex((d) => d.id === id);
    if (index === -1) {
        throw new Error("Department not found");
    }

    mockDepartments.splice(index, 1);
}
