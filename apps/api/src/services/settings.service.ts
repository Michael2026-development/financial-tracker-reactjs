import { eq } from "drizzle-orm";
import { db } from "../db";
import { userSettings, user } from "../db/schema";
import { NotFoundError } from "../middleware/error.middleware";

export interface UpdateSettingsDto {
    currency?: string;
    language?: string;
    budgetAlerts?: boolean;
    weeklyReports?: boolean;
    financeTips?: boolean;
}

export interface UpdateProfileDto {
    name?: string;
    image?: string;
}

export class SettingsService {
    /**
     * Get user settings (create if not exists)
     */
    async getSettings(userId: string) {
        let settings = await db.query.userSettings.findFirst({
            where: eq(userSettings.userId, userId),
        });

        // Create default settings if not exists
        if (!settings) {
            const [newSettings] = await db
                .insert(userSettings)
                .values({ userId })
                .returning();
            settings = newSettings;
        }

        return settings;
    }

    /**
     * Update user settings
     */
    async updateSettings(userId: string, data: UpdateSettingsDto) {
        // Get or create settings
        await this.getSettings(userId);

        const [result] = await db
            .update(userSettings)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(userSettings.userId, userId))
            .returning();

        return result;
    }

    /**
     * Get user profile
     */
    async getProfile(userId: string) {
        const profile = await db.query.user.findFirst({
            where: eq(user.id, userId),
        });

        if (!profile) {
            throw new NotFoundError("User not found");
        }

        // Don't return sensitive data
        return {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            image: profile.image,
            emailVerified: profile.emailVerified,
            createdAt: profile.createdAt,
        };
    }

    /**
     * Update user profile
     */
    async updateProfile(userId: string, data: UpdateProfileDto) {
        const [result] = await db
            .update(user)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(user.id, userId))
            .returning();

        if (!result) {
            throw new NotFoundError("User not found");
        }

        return {
            id: result.id,
            name: result.name,
            email: result.email,
            image: result.image,
            emailVerified: result.emailVerified,
        };
    }
}
