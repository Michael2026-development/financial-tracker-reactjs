import api from "./client";

/**
 * Reports API Service
 */

/**
 * Get monthly expense summary
 * @param {number} year - Year (optional)
 * @param {number} month - Month 1-12 (optional)
 */
export async function getMonthlyStats(year, month) {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());

    const query = params.toString();
    return api.get(`/reports/monthly${query ? `?${query}` : ""}`);
}

/**
 * Get yearly expense summary
 * @param {number} year - Year (optional)
 */
export async function getYearlyStats(year) {
    const query = year ? `?year=${year}` : "";
    return api.get(`/reports/yearly${query}`);
}

/**
 * Get expenses grouped by category
 * @param {string} startDate - Start date (YYYY-MM-DD, optional)
 * @param {string} endDate - End date (YYYY-MM-DD, optional)
 */
export async function getByCategory(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const query = params.toString();
    return api.get(`/reports/by-category${query ? `?${query}` : ""}`);
}

/**
 * Get expense trends (comparison with previous period)
 */
export async function getTrends() {
    return api.get("/reports/trends");
}

/**
 * Get budget status for all categories
 */
export async function getBudgetStatus() {
    return api.get("/reports/budget-status");
}
