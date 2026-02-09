import { eq, and, sql, desc } from "drizzle-orm";
import { db } from "../db/index.js";
import { transaction, category } from "../db/schema.js";

export interface BudgetStatus {
    categoryId: string;
    categoryName: string;
    icon: string;
    color: string;
    monthlyBudget: number;
    spent: number;
    remaining: number;
    percentage: number;
    status: "SAFE" | "WARNING" | "DANGER";
}

export class ReportsService {
    /**
     * Get monthly expense summary
     */
    async getMonthlyStats(userId: string, year?: number, month?: number) {
        const now = new Date();
        const targetYear = year ?? now.getFullYear();
        const targetMonth = month ?? now.getMonth();

        const firstDayOfMonth = new Date(targetYear, targetMonth, 1);
        const lastDayOfMonth = new Date(targetYear, targetMonth + 1, 0);

        const transactions = await db.query.transaction.findMany({
            where: and(
                eq(transaction.userId, userId),
                sql`${transaction.transactionDate} >= ${firstDayOfMonth.toISOString().split("T")[0]}`,
                sql`${transaction.transactionDate} <= ${lastDayOfMonth.toISOString().split("T")[0]}`
            ),
        });

        const totalExpense = transactions.reduce((sum, t) => sum + t.totalPrice, 0);

        return {
            year: targetYear,
            month: targetMonth + 1, // 1-indexed for API response
            totalExpense,
            transactionCount: transactions.length,
        };
    }

    /**
     * Get yearly expense summary
     */
    async getYearlyStats(userId: string, year?: number) {
        const targetYear = year ?? new Date().getFullYear();

        const firstDayOfYear = new Date(targetYear, 0, 1);
        const lastDayOfYear = new Date(targetYear, 11, 31);

        const transactions = await db.query.transaction.findMany({
            where: and(
                eq(transaction.userId, userId),
                sql`${transaction.transactionDate} >= ${firstDayOfYear.toISOString().split("T")[0]}`,
                sql`${transaction.transactionDate} <= ${lastDayOfYear.toISOString().split("T")[0]}`
            ),
        });

        const totalExpense = transactions.reduce((sum, t) => sum + t.totalPrice, 0);

        // Group by month
        const monthlyBreakdown = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            total: 0,
            count: 0,
        }));

        transactions.forEach((t) => {
            const date = new Date(t.transactionDate);
            const monthIndex = date.getMonth();
            monthlyBreakdown[monthIndex].total += t.totalPrice;
            monthlyBreakdown[monthIndex].count += 1;
        });

        return {
            year: targetYear,
            totalExpense,
            transactionCount: transactions.length,
            monthlyBreakdown,
        };
    }

    /**
     * Get expenses grouped by category
     */
    async getByCategory(
        userId: string,
        startDate?: string,
        endDate?: string
    ) {
        const conditions = [eq(transaction.userId, userId)];

        if (startDate) {
            conditions.push(sql`${transaction.transactionDate} >= ${startDate}`);
        }

        if (endDate) {
            conditions.push(sql`${transaction.transactionDate} <= ${endDate}`);
        }

        const transactions = await db.query.transaction.findMany({
            where: and(...conditions),
            with: {
                category: true,
            },
        });

        // Group by category
        const categoryTotals = new Map<
            string,
            { category: typeof category.$inferSelect; total: number; count: number }
        >();

        transactions.forEach((t) => {
            const existing = categoryTotals.get(t.categoryId);
            if (existing) {
                existing.total += t.totalPrice;
                existing.count += 1;
            } else {
                categoryTotals.set(t.categoryId, {
                    category: t.category,
                    total: t.totalPrice,
                    count: 1,
                });
            }
        });

        return Array.from(categoryTotals.values()).map((item) => ({
            categoryId: item.category.id,
            categoryName: item.category.name,
            icon: item.category.icon,
            color: item.category.color,
            totalExpense: item.total,
            transactionCount: item.count,
        }));
    }

    /**
     * Get expense trends (comparison with previous period)
     */
    async getTrends(userId: string) {
        const now = new Date();

        // Current month
        const currentMonthStats = await this.getMonthlyStats(userId);

        // Previous month
        const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const prevMonthYear =
            now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        const prevMonthStats = await this.getMonthlyStats(
            userId,
            prevMonthYear,
            prevMonth
        );

        // Calculate trend
        const monthlyTrend =
            prevMonthStats.totalExpense > 0
                ? ((currentMonthStats.totalExpense - prevMonthStats.totalExpense) /
                    prevMonthStats.totalExpense) *
                100
                : 0;

        // Current year
        const currentYearStats = await this.getYearlyStats(userId);

        // Previous year
        const prevYearStats = await this.getYearlyStats(
            userId,
            now.getFullYear() - 1
        );

        // Calculate yearly trend
        const yearlyTrend =
            prevYearStats.totalExpense > 0
                ? ((currentYearStats.totalExpense - prevYearStats.totalExpense) /
                    prevYearStats.totalExpense) *
                100
                : 0;

        return {
            currentMonth: currentMonthStats,
            previousMonth: prevMonthStats,
            monthlyTrend: Math.round(monthlyTrend * 100) / 100,
            currentYear: currentYearStats,
            previousYear: prevYearStats,
            yearlyTrend: Math.round(yearlyTrend * 100) / 100,
        };
    }

    /**
     * Get budget status for all categories
     */
    async getBudgetStatus(userId: string): Promise<BudgetStatus[]> {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Get all categories
        const categories = await db.query.category.findMany({
            where: eq(category.userId, userId),
        });

        // Get all transactions for current month
        const transactions = await db.query.transaction.findMany({
            where: and(
                eq(transaction.userId, userId),
                sql`${transaction.transactionDate} >= ${firstDayOfMonth.toISOString().split("T")[0]}`,
                sql`${transaction.transactionDate} <= ${lastDayOfMonth.toISOString().split("T")[0]}`
            ),
        });

        // Calculate spending per category
        const spendingByCategory = new Map<string, number>();
        transactions.forEach((t) => {
            const existing = spendingByCategory.get(t.categoryId) || 0;
            spendingByCategory.set(t.categoryId, existing + t.totalPrice);
        });

        return categories.map((cat) => {
            const spent = spendingByCategory.get(cat.id) || 0;
            const remaining = cat.monthlyBudget - spent;
            const percentage =
                cat.monthlyBudget > 0
                    ? Math.round((spent / cat.monthlyBudget) * 100)
                    : 0;

            let status: "SAFE" | "WARNING" | "DANGER" = "SAFE";
            if (percentage >= 100) {
                status = "DANGER";
            } else if (percentage >= 80) {
                status = "WARNING";
            }

            return {
                categoryId: cat.id,
                categoryName: cat.name,
                icon: cat.icon,
                color: cat.color,
                monthlyBudget: cat.monthlyBudget,
                spent,
                remaining,
                percentage,
                status,
            };
        });
    }
}
