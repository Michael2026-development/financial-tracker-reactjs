/**
 * API Services Index
 * Re-exports all API services for easy importing
 */

// Base client
export { api, apiRequest, ApiError } from "./client";

// Domain services
export * as transactionsApi from "./transactions";
export * as categoriesApi from "./categories";
export * as notificationsApi from "./notifications";
export * as receiptsApi from "./receipts";
export * as reportsApi from "./reports";
export * as settingsApi from "./settings";
