import api from "./client";

/**
 * Categories API Service
 */

/**
 * Get all categories for the authenticated user
 */
export async function getCategories() {
    return api.get("/categories");
}

/**
 * Get a single category by ID
 * @param {string} id - Category ID
 */
export async function getCategory(id) {
    return api.get(`/categories/${id}`);
}

/**
 * Create a new category
 * @param {Object} data - Category data
 * @param {string} data.name - Category name
 * @param {string} data.icon - Icon name (optional)
 * @param {string} data.color - Color (optional)
 * @param {number} data.monthlyBudget - Monthly budget amount
 */
export async function createCategory(data) {
    return api.post("/categories", data);
}

/**
 * Update a category
 * @param {string} id - Category ID
 * @param {Object} data - Updated data
 */
export async function updateCategory(id, data) {
    return api.put(`/categories/${id}`, data);
}

/**
 * Delete a category
 * @param {string} id - Category ID
 */
export async function deleteCategory(id) {
    return api.delete(`/categories/${id}`);
}

/**
 * Get monthly spent amount for a category
 * @param {string} id - Category ID
 */
export async function getCategorySpent(id) {
    return api.get(`/categories/${id}/spent`);
}
