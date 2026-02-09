import { eq, and, desc } from "drizzle-orm";
import { db } from "../db/index.js";
import { notification } from "../db/schema.js";
import { NotFoundError } from "../middleware/error.middleware.js";

export interface CreateNotificationDto {
    title: string;
    message: string;
    icon?: string;
}

export class NotificationsService {
    /**
     * Get all notifications for a user
     */
    async findAll(userId: string) {
        return await db.query.notification.findMany({
            where: eq(notification.userId, userId),
            orderBy: [desc(notification.createdAt)],
        });
    }

    /**
     * Create a new notification
     */
    async create(data: CreateNotificationDto, userId: string) {
        const [result] = await db
            .insert(notification)
            .values({
                userId,
                title: data.title,
                message: data.message,
                icon: data.icon || "notifications",
            })
            .returning();

        return result;
    }

    /**
     * Mark a notification as read
     */
    async markAsRead(id: string, userId: string) {
        const existing = await db.query.notification.findFirst({
            where: and(eq(notification.id, id), eq(notification.userId, userId)),
        });

        if (!existing) {
            throw new NotFoundError("Notification not found");
        }

        const [result] = await db
            .update(notification)
            .set({ read: true })
            .where(and(eq(notification.id, id), eq(notification.userId, userId)))
            .returning();

        return result;
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(userId: string) {
        await db
            .update(notification)
            .set({ read: true })
            .where(eq(notification.userId, userId));

        return { success: true };
    }

    /**
     * Delete a notification
     */
    async delete(id: string, userId: string) {
        const existing = await db.query.notification.findFirst({
            where: and(eq(notification.id, id), eq(notification.userId, userId)),
        });

        if (!existing) {
            throw new NotFoundError("Notification not found");
        }

        await db
            .delete(notification)
            .where(and(eq(notification.id, id), eq(notification.userId, userId)));

        return { success: true };
    }

    /**
     * Get unread count
     */
    async getUnreadCount(userId: string): Promise<number> {
        const results = await db.query.notification.findMany({
            where: and(eq(notification.userId, userId), eq(notification.read, false)),
        });

        return results.length;
    }
}
