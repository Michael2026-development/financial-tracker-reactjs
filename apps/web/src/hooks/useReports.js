import { useQuery } from "@tanstack/react-query";
import {
    getMonthlyStats,
    getYearlyStats,
    getByCategory,
    getTrends,
    getBudgetStatus,
} from "@/services/api/reports";

// Query keys
export const reportKeys = {
    all: ["reports"],
    monthly: (year, month) => [...reportKeys.all, "monthly", year, month],
    yearly: (year) => [...reportKeys.all, "yearly", year],
    byCategory: (startDate, endDate) => [...reportKeys.all, "by-category", startDate, endDate],
    trends: () => [...reportKeys.all, "trends"],
    budgetStatus: () => [...reportKeys.all, "budget-status"],
};

/**
 * Fetch monthly expense stats
 */
export function useMonthlyStats(year, month) {
    return useQuery({
        queryKey: reportKeys.monthly(year, month),
        queryFn: () => getMonthlyStats(year, month),
    });
}

/**
 * Fetch yearly expense stats
 */
export function useYearlyStats(year) {
    return useQuery({
        queryKey: reportKeys.yearly(year),
        queryFn: () => getYearlyStats(year),
    });
}

/**
 * Fetch expenses grouped by category
 */
export function useExpensesByCategory(startDate, endDate) {
    return useQuery({
        queryKey: reportKeys.byCategory(startDate, endDate),
        queryFn: () => getByCategory(startDate, endDate),
    });
}

/**
 * Fetch expense trends
 */
export function useExpenseTrends() {
    return useQuery({
        queryKey: reportKeys.trends(),
        queryFn: getTrends,
    });
}

/**
 * Fetch budget status for all categories
 */
export function useBudgetStatus() {
    return useQuery({
        queryKey: reportKeys.budgetStatus(),
        queryFn: getBudgetStatus,
    });
}
