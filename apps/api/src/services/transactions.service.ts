import { eq, and, sql, desc, like, or } from "drizzle-orm";
import { db } from "../db";
import { transaction, transactionItem } from "../db/schema";
import { NotFoundError } from "../middleware/error.middleware";

export interface CreateTransactionItemDto {
    productNumber: number;
    name: string;
    description?: string;
    location?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface CreateTransactionDto {
    categoryId: string;
    sessionId?: string;
    description: string;
    totalPrice: number;
    transactionDate: string;
    items: CreateTransactionItemDto[];
}

export interface UpdateTransactionDto {
    categoryId?: string;
    description?: string;
    totalPrice?: number;
    transactionDate?: string;
}

export interface TransactionFilters {
    categoryId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
}

export class TransactionsService {
    /**
     * Get all transactions for a user with optional filters
     */
    async findAll(userId: string, filters: TransactionFilters = {}) {
        const conditions = [eq(transaction.userId, userId)];

        if (filters.categoryId) {
            conditions.push(eq(transaction.categoryId, filters.categoryId));
        }

        if (filters.startDate) {
            conditions.push(
                sql`${transaction.transactionDate} >= ${filters.startDate}`
            );
        }

        if (filters.endDate) {
            conditions.push(
                sql`${transaction.transactionDate} <= ${filters.endDate}`
            );
        }

        const results = await db.query.transaction.findMany({
            where: and(...conditions),
            with: {
                items: true,
                category: true,
            },
            orderBy: [desc(transaction.transactionDate), desc(transaction.createdAt)],
            limit: filters.limit || 100,
            offset: filters.offset || 0,
        });

        return results;
    }

    /**
     * Get a single transaction by ID with items
     */
    async findById(id: string, userId: string) {
        const result = await db.query.transaction.findFirst({
            where: and(eq(transaction.id, id), eq(transaction.userId, userId)),
            with: {
                items: true,
                category: true,
            },
        });

        if (!result) {
            throw new NotFoundError("Transaction not found");
        }

        return result;
    }

    /**
     * Create a new transaction with items
     */
    async create(data: CreateTransactionDto, userId: string) {
        // Create transaction
        const [newTransaction] = await db
            .insert(transaction)
            .values({
                userId,
                categoryId: data.categoryId,
                sessionId: data.sessionId,
                description: data.description,
                totalPrice: data.totalPrice,
                transactionDate: data.transactionDate,
            })
            .returning();

        // Create transaction items
        if (data.items && data.items.length > 0) {
            await db.insert(transactionItem).values(
                data.items.map((item) => ({
                    transactionId: newTransaction.id,
                    productNumber: item.productNumber,
                    name: item.name,
                    description: item.description,
                    location: item.location,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    totalPrice: item.totalPrice,
                }))
            );
        }

        // Return transaction with items
        return this.findById(newTransaction.id, userId);
    }

    /**
     * Update a transaction
     */
    async update(id: string, data: UpdateTransactionDto, userId: string) {
        // Check if transaction exists and belongs to user
        await this.findById(id, userId);

        const [result] = await db
            .update(transaction)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(and(eq(transaction.id, id), eq(transaction.userId, userId)))
            .returning();

        return this.findById(result.id, userId);
    }

    /**
     * Delete a transaction
     */
    async delete(id: string, userId: string) {
        // Check if transaction exists and belongs to user
        await this.findById(id, userId);

        // Items are deleted by cascade
        await db
            .delete(transaction)
            .where(and(eq(transaction.id, id), eq(transaction.userId, userId)));

        return { success: true };
    }

    /**
     * Delete a single item from a transaction
     */
    async deleteItem(transactionId: string, itemId: string, userId: string) {
        // Check if transaction exists and belongs to user
        const txn = await this.findById(transactionId, userId);

        // Check if item exists
        const item = txn.items.find((i) => i.id === itemId);
        if (!item) {
            throw new NotFoundError("Transaction item not found");
        }

        // Delete the item
        await db.delete(transactionItem).where(eq(transactionItem.id, itemId));

        // If no items left, delete the transaction
        if (txn.items.length === 1) {
            await this.delete(transactionId, userId);
            return { success: true, transactionDeleted: true };
        }

        // Recalculate total
        const newTotal = txn.items
            .filter((i) => i.id !== itemId)
            .reduce((sum, i) => sum + i.totalPrice, 0);

        await db
            .update(transaction)
            .set({ totalPrice: newTotal, updatedAt: new Date() })
            .where(eq(transaction.id, transactionId));

        return { success: true, transactionDeleted: false };
    }

    /**
     * Search transactions
     */
    async search(query: string, userId: string) {
        const results = await db.query.transaction.findMany({
            where: and(
                eq(transaction.userId, userId),
                like(transaction.description, `%${query}%`)
            ),
            with: {
                items: true,
                category: true,
            },
            orderBy: [desc(transaction.transactionDate)],
            limit: 50,
        });

        return results;
    }

    /**
     * Get recent transactions
     */
    async getRecent(userId: string, limit = 5) {
        return this.findAll(userId, { limit });
    }
}
