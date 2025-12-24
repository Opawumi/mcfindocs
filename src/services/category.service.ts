import { Category } from "../lib/types";
import {
  mockCategories,
  getBroadCategories,
  getSubCategories,
  getCategoryById,
  getCategoryHierarchy,
} from "../lib/mock-data";
import { sleep } from "../lib/utils";

/**
 * Category Service
 * Handles all category-related operations
 * Currently uses mock data - will be replaced with real API calls
 */

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  await sleep(300);
  return [...mockCategories];
}

/**
 * Get broad categories (level 0)
 */
export async function getBroadCategoriesList(): Promise<Category[]> {
  await sleep(300);
  return getBroadCategories();
}

/**
 * Get sub-categories for a parent category
 */
export async function getSubCategoriesList(
  parentId: string
): Promise<Category[]> {
  await sleep(300);
  return getSubCategories(parentId);
}

/**
 * Get a single category by ID
 */
export async function getCategory(id: string): Promise<Category | null> {
  await sleep(200);
  return getCategoryById(id) || null;
}

/**
 * Get category hierarchy (breadcrumb)
 */
export async function getCategoryBreadcrumb(
  categoryId: string
): Promise<Category[]> {
  await sleep(200);
  return getCategoryHierarchy(categoryId);
}

/**
 * Create a new category
 */
export async function createCategory(data: {
  name: string;
  description?: string;
  parentId?: string;
}): Promise<Category> {
  await sleep(400);

  const newCategory: Category = {
    id: `cat-${Date.now()}`,
    name: data.name,
    description: data.description,
    parentId: data.parentId,
    level: data.parentId ? 1 : 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "user-1", // Mock current user
    documentCount: 0,
  };

  mockCategories.push(newCategory);
  return newCategory;
}

/**
 * Update a category
 */
export async function updateCategory(
  id: string,
  data: { name?: string; description?: string }
): Promise<Category> {
  await sleep(300);

  const category = getCategoryById(id);
  if (!category) {
    throw new Error("Category not found");
  }

  const updatedCategory: Category = {
    ...category,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const index = mockCategories.findIndex((cat) => cat.id === id);
  if (index !== -1) {
    mockCategories[index] = updatedCategory;
  }

  return updatedCategory;
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string): Promise<void> {
  await sleep(300);

  const index = mockCategories.findIndex((cat) => cat.id === id);
  if (index !== -1) {
    // In real implementation, check for documents and sub-categories
    mockCategories.splice(index, 1);
  }
}
