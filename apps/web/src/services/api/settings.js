import api from "./client";

/**
 * Settings API Service
 */

/**
 * Get user settings
 */
export async function getSettings() {
    return api.get("/settings");
}

/**
 * Update user settings
 * @param {Object} data - Settings data
 * @param {string} data.currency - Currency code (optional)
 * @param {string} data.language - Language code (optional)
 * @param {boolean} data.budgetAlerts - Enable budget alerts (optional)
 * @param {boolean} data.weeklyReports - Enable weekly reports (optional)
 * @param {boolean} data.financeTips - Enable finance tips (optional)
 */
export async function updateSettings(data) {
    return api.put("/settings", data);
}

/**
 * Get user profile
 */
export async function getProfile() {
    return api.get("/settings/profile");
}

/**
 * Update user profile
 * @param {Object} data - Profile data
 * @param {string} data.name - User name (optional)
 * @param {string} data.image - Profile image URL (optional)
 */
export async function updateProfile(data) {
    return api.put("/settings/profile", data);
}
