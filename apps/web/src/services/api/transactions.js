import api from "./client";

/**
 * Transactions API Service
 */

/**
 * Get all transactions with optional filters
 * @param {Object} filters - Optional filters
 * @param {string} filters.categoryId - Filter by category
 * @param {string} filters.startDate - Start date (YYYY-MM-DD)
 * @param {string} filters.endDate - End date (YYYY-MM-DD)
 * @param {number} filters.limit - Max results
 * @param {number} filters.offset - Offset for pagination
 */
export async function getTransactions(filters = {}) {
    const params = new URLSearchParams();

    if (filters.categoryId) params.append("categoryId", filters.categoryId);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());

    const query = params.toString();
    return api.get(`/transactions${query ? `?${query}` : ""}`);
}

/**
 * Search transactions
 * @param {string} query - Search query
 */
export async function searchTransactions(query) {
    return api.get(`/transactions/search?q=${encodeURIComponent(query)}`);
}

/**
 * Get recent transactions
 * @param {number} limit - Number of transactions to fetch
 */
export async function getRecentTransactions(limit = 5) {
    return api.get(`/transactions/recent?limit=${limit}`);
}

/**
 * Get a single transaction by ID
 * @param {string} id - Transaction ID
 */
export async function getTransaction(id) {
    return api.get(`/transactions/${id}`);
}

/**
 * Create a new transaction
 * @param {Object} data - Transaction data
 * @param {string} data.categoryId - Category UUID
 * @param {string} data.description - Description
 * @param {number} data.totalPrice - Total price
 * @param {string} data.transactionDate - Date (YYYY-MM-DD)
 * @param {Array} data.items - Transaction items
 */
export async function createTransaction(data) {
    return api.post("/transactions", data);
}

/**
 * Update a transaction
 * @param {string} id - Transaction ID
 * @param {Object} data - Updated data
 */
export async function updateTransaction(id, data) {
    return api.put(`/transactions/${id}`, data);
}

/**
 * Delete a transaction
 * @param {string} id - Transaction ID
 */
export async function deleteTransaction(id) {
    return api.delete(`/transactions/${id}`);
}

/**
 * Delete a single item from a transaction
 * @param {string} transactionId - Transaction ID
 * @param {string} itemId - Item ID
 */
export async function deleteTransactionItem(transactionId, itemId) {
    return api.delete(`/transactions/${transactionId}/items/${itemId}`);
}
