import { Category } from "../types";

/**
 * Generate mock categories
 */
export const mockCategories: Category[] = [
  // Broad Categories (level 0)
  {
    id: "cat-1",
    name: "Recruitment",
    description: "All recruitment-related documents",
    level: 0,
    createdAt: "2023-01-10T10:00:00Z",
    updatedAt: "2023-01-10T10:00:00Z",
    createdBy: "user-1",
    documentCount: 45,
  },
  {
    id: "cat-2",
    name: "Templates",
    description: "Document templates for various purposes",
    level: 0,
    createdAt: "2023-01-10T10:05:00Z",
    updatedAt: "2023-01-10T10:05:00Z",
    createdBy: "user-1",
    documentCount: 28,
  },
  {
    id: "cat-3",
    name: "Internal Operations",
    description: "Internal operational documents",
    level: 0,
    createdAt: "2023-01-10T10:10:00Z",
    updatedAt: "2023-01-10T10:10:00Z",
    createdBy: "user-1",
    documentCount: 67,
  },
  {
    id: "cat-4",
    name: "Handbooks",
    description: "Employee and operational handbooks",
    level: 0,
    createdAt: "2023-01-10T10:15:00Z",
    updatedAt: "2023-01-10T10:15:00Z",
    createdBy: "user-1",
    documentCount: 12,
  },
  {
    id: "cat-5",
    name: "Resources",
    description: "General resources and reference materials",
    level: 0,
    createdAt: "2023-01-10T10:20:00Z",
    updatedAt: "2023-01-10T10:20:00Z",
    createdBy: "user-1",
    documentCount: 34,
  },
  {
    id: "cat-6",
    name: "Policies & Procedures",
    description: "Company policies and procedures",
    level: 0,
    createdAt: "2023-01-10T10:25:00Z",
    updatedAt: "2023-01-10T10:25:00Z",
    createdBy: "user-1",
    documentCount: 23,
  },
  {
    id: "cat-7",
    name: "Financials",
    description: "Financial documents and reports",
    level: 0,
    createdAt: "2023-01-10T10:30:00Z",
    updatedAt: "2023-01-10T10:30:00Z",
    createdBy: "user-1",
    documentCount: 89,
  },
  {
    id: "cat-8",
    name: "Legal",
    description: "Legal documents and contracts",
    level: 0,
    createdAt: "2023-01-10T10:35:00Z",
    updatedAt: "2023-01-10T10:35:00Z",
    createdBy: "user-1",
    documentCount: 56,
  },

  // Sub-Categories (level 1) - Recruitment
  {
    id: "cat-1-1",
    name: "CVs",
    description: "Candidate resumes and CVs",
    parentId: "cat-1",
    level: 1,
    createdAt: "2023-01-10T11:00:00Z",
    updatedAt: "2023-01-10T11:00:00Z",
    createdBy: "user-1",
    documentCount: 25,
  },
  {
    id: "cat-1-2",
    name: "Offer Letters",
    description: "Employment offer letters",
    parentId: "cat-1",
    level: 1,
    createdAt: "2023-01-10T11:05:00Z",
    updatedAt: "2023-01-10T11:05:00Z",
    createdBy: "user-1",
    documentCount: 20,
  },

  // Sub-Categories - Internal Operations
  {
    id: "cat-3-1",
    name: "Meeting Minutes",
    description: "Minutes from internal meetings",
    parentId: "cat-3",
    level: 1,
    createdAt: "2023-01-10T11:10:00Z",
    updatedAt: "2023-01-10T11:10:00Z",
    createdBy: "user-1",
    documentCount: 42,
  },
  {
    id: "cat-3-2",
    name: "Project Plans",
    description: "Project planning documents",
    parentId: "cat-3",
    level: 1,
    createdAt: "2023-01-10T11:15:00Z",
    updatedAt: "2023-01-10T11:15:00Z",
    createdBy: "user-1",
    documentCount: 25,
  },

  // Sub-Categories - Financials
  {
    id: "cat-7-1",
    name: "Invoices",
    description: "Company invoices",
    parentId: "cat-7",
    level: 1,
    createdAt: "2023-01-10T11:20:00Z",
    updatedAt: "2023-01-10T11:20:00Z",
    createdBy: "user-1",
    documentCount: 45,
  },
  {
    id: "cat-7-2",
    name: "Reports",
    description: "Financial reports",
    parentId: "cat-7",
    level: 1,
    createdAt: "2023-01-10T11:25:00Z",
    updatedAt: "2023-01-10T11:25:00Z",
    createdBy: "user-1",
    documentCount: 44,
  },

  // Sub-Categories - Legal
  {
    id: "cat-8-1",
    name: "Contracts",
    description: "Legal contracts and agreements",
    parentId: "cat-8",
    level: 1,
    createdAt: "2023-01-10T11:30:00Z",
    updatedAt: "2023-01-10T11:30:00Z",
    createdBy: "user-1",
    documentCount: 34,
  },
  {
    id: "cat-8-2",
    name: "Compliance",
    description: "Compliance documents",
    parentId: "cat-8",
    level: 1,
    createdAt: "2023-01-10T11:35:00Z",
    updatedAt: "2023-01-10T11:35:00Z",
    createdBy: "user-1",
    documentCount: 22,
  },
];

/**
 * Get broad categories (level 0)
 */
export function getBroadCategories(): Category[] {
  return mockCategories.filter((cat) => cat.level === 0);
}

/**
 * Get sub-categories for a parent category
 */
export function getSubCategories(parentId: string): Category[] {
  return mockCategories.filter((cat) => cat.parentId === parentId);
}

/**
 * Get category by ID
 */
export function getCategoryById(id: string): Category | undefined {
  return mockCategories.find((cat) => cat.id === id);
}

/**
 * Get category hierarchy (breadcrumb)
 */
export function getCategoryHierarchy(categoryId: string): Category[] {
  const hierarchy: Category[] = [];
  let currentCategory = getCategoryById(categoryId);

  while (currentCategory) {
    hierarchy.unshift(currentCategory);
    if (currentCategory.parentId) {
      currentCategory = getCategoryById(currentCategory.parentId);
    } else {
      break;
    }
  }

  return hierarchy;
}
