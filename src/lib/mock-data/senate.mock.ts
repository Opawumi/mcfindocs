import { Faculty, Department } from "@/lib/types/senate.types";

/**
 * Mock Faculties
 */
export const mockFaculties: Faculty[] = [
    {
        id: "faculty-1",
        name: "Science",
        code: "SCI",
        description: "Faculty of Science",
        dean: "Prof. Sarah Johnson",
        createdAt: "2023-01-15T10:00:00Z",
        updatedAt: "2024-12-01T14:30:00Z",
    },
    {
        id: "faculty-2",
        name: "Arts",
        code: "ARTS",
        description: "Faculty of Arts",
        dean: "Prof. Michael Chen",
        createdAt: "2023-02-10T09:00:00Z",
        updatedAt: "2024-11-20T11:15:00Z",
    },
    {
        id: "faculty-3",
        name: "Engineering",
        code: "ENG",
        description: "Faculty of Engineering",
        dean: "Prof. David Williams",
        createdAt: "2023-03-05T08:30:00Z",
        updatedAt: "2024-10-15T16:45:00Z",
    },
    {
        id: "faculty-4",
        name: "Medicine",
        code: "MED",
        description: "Faculty of Medicine",
        dean: "Dr. Emily Brown",
        createdAt: "2023-04-12T10:15:00Z",
        updatedAt: "2024-09-30T13:20:00Z",
    },
];

/**
 * Mock Departments
 */
export const mockDepartments: Department[] = [
    {
        id: "dept-1",
        name: "Bio",
        code: "BIO",
        facultyId: "faculty-1",
        facultyName: "Science",
        headOfDepartment: "Dr. Jane Smith",
        description: "Department of Biology",
        createdAt: "2023-05-10T09:00:00Z",
        updatedAt: "2024-12-01T10:30:00Z",
    },
    {
        id: "dept-2",
        name: "PharmaCeutical",
        code: "PHARM",
        facultyId: "faculty-2",
        facultyName: "Arts",
        headOfDepartment: "Dr. Robert Johnson",
        description: "Department of Pharmaceutical Sciences",
        createdAt: "2023-06-15T11:20:00Z",
        updatedAt: "2024-11-15T14:45:00Z",
    },
    {
        id: "dept-3",
        name: "Chemistry",
        code: "CHEM",
        facultyId: "faculty-1",
        facultyName: "Science",
        headOfDepartment: "Prof. Alice Brown",
        description: "Department of Chemistry",
        createdAt: "2023-07-20T08:45:00Z",
        updatedAt: "2024-10-20T09:15:00Z",
    },
    {
        id: "dept-4",
        name: "Physics",
        code: "PHY",
        facultyId: "faculty-1",
        facultyName: "Science",
        headOfDepartment: "Dr. Thomas Lee",
        description: "Department of Physics",
        createdAt: "2023-08-25T10:30:00Z",
        updatedAt: "2024-09-25T11:50:00Z",
    },
    {
        id: "dept-5",
        name: "Computer Science",
        code: "CS",
        facultyId: "faculty-3",
        facultyName: "Engineering",
        headOfDepartment: "Dr. Lisa Wang",
        description: "Department of Computer Science",
        createdAt: "2023-09-10T09:15:00Z",
        updatedAt: "2024-08-30T15:20:00Z",
    },
];
