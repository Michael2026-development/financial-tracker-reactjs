/**
 * Base API Client
 * Handles all HTTP requests to the backend with credentials for cookie-based auth
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<any>} - Response data
 */
export async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}/api${endpoint}`;

    const config = {
        ...options,
        credentials: "include", // Include cookies for session auth
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        const error = await response.json().catch(() => ({
            message: response.statusText,
        }));
        throw new ApiError(response.status, error.message || "An error occurred");
    }

    return response.json();
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = "ApiError";
    }
}

// HTTP method helpers
export const api = {
    get: (endpoint) => apiRequest(endpoint, { method: "GET" }),

    post: (endpoint, data) =>
        apiRequest(endpoint, {
            method: "POST",
            body: JSON.stringify(data)
        }),

    put: (endpoint, data) =>
        apiRequest(endpoint, {
            method: "PUT",
            body: JSON.stringify(data)
        }),

    delete: (endpoint) => apiRequest(endpoint, { method: "DELETE" }),
};

export default api;
