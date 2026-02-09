import { eq, and, sql, desc } from "drizzle-orm";
import { db } from "../db";
import { category, transaction } from "../db/schema";
import { NotFoundError } from "../middleware/error.middleware";

export interface CreateCategoryDto {
    name: string;
    icon?: string;
    color?: string;
    monthlyBudget: number;
}

export interface UpdateCategoryDto {
    name?: string;
    icon?: string;
    color?: string;
    monthlyBudget?: number;
}

export class CategoriesService {
    /**
     * Get all categories for a user
     */
    async findAll(userId: string) {
        return await db.query.category.findMany({
            where: eq(category.userId, userId),
            orderBy: [desc(category.createdAt)],
        });
    }

    /**
     * Get a single category by ID
     */
    async findById(id: string, userId: string) {
        const result = await db.query.category.findFirst({
            where: and(eq(category.id, id), eq(category.userId, userId)),
        });

        if (!result) {
            throw new NotFoundError("Category not found");
        }

        return result;
    }

    /**
     * Create a new category
     */
    async create(data: CreateCategoryDto, userId: string) {
        const [result] = await db
            .insert(category)
            .values({
                userId,
                name: data.name,
                icon: data.icon || "category",
                color: data.color || "#10b981",
                monthlyBudget: data.monthlyBudget,
            })
            .returning();

        return result;
    }

    /**
     * Update a category
     */
    async update(id: string, data: UpdateCategoryDto, userId: string) {
        // Check if category exists and belongs to user
        await this.findById(id, userId);

        const [result] = await db
            .update(category)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(and(eq(category.id, id), eq(category.userId, userId)))
            .returning();

        return result;
    }

    /**
     * Delete a category
     */
    async delete(id: string, userId: string) {
        // Check if category exists and belongs to user
        await this.findById(id, userId);

        await db
            .delete(category)
            .where(and(eq(category.id, id), eq(category.userId, userId)));

        return { success: true };
    }

    /**
     * Get monthly spent amount for a category
     */
    async getMonthlySpent(categoryId: string, userId: string) {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const result = await db
            .select({
                total: sql<number>`COALESCE(SUM(${transaction.totalPrice}), 0)`,
            })
            .from(transaction)
            .where(
                and(
                    eq(transaction.categoryId, categoryId),
                    eq(transaction.userId, userId),
                    sql`${transaction.transactionDate} >= ${firstDayOfMonth.toISOString().split("T")[0]}`,
                    sql`${transaction.transactionDate} <= ${lastDayOfMonth.toISOString().split("T")[0]}`
                )
            );

        return result[0]?.total || 0;
    }
}
