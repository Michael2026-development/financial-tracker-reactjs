import { Router } from "express";
import { z } from "zod";
import { SettingsService } from "../services/settings.service";

const router = Router();
const service = new SettingsService();

// Validation schemas
const updateSettingsSchema = z.object({
    currency: z.string().optional(),
    language: z.string().optional(),
    budgetAlerts: z.boolean().optional(),
    weeklyReports: z.boolean().optional(),
    financeTips: z.boolean().optional(),
});

const updateProfileSchema = z.object({
    name: z.string().min(1).optional(),
    image: z.string().url().optional().nullable(),
});

/**
 * GET /api/settings
 * Get user settings
 */
router.get("/", async (req, res, next) => {
    try {
        const settings = await service.getSettings(req.user!.id);
        res.json(settings);
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/settings
 * Update user settings
 */
router.put("/", async (req, res, next) => {
    try {
        const data = updateSettingsSchema.parse(req.body);
        const settings = await service.updateSettings(req.user!.id, data);
        res.json(settings);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/settings/profile
 * Get user profile
 */
router.get("/profile", async (req, res, next) => {
    try {
        const profile = await service.getProfile(req.user!.id);
        res.json(profile);
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/settings/profile
 * Update user profile
 */
router.put("/profile", async (req, res, next) => {
    try {
        const data = updateProfileSchema.parse(req.body);
        const profile = await service.updateProfile(req.user!.id, data);
        res.json(profile);
    } catch (error) {
        next(error);
    }
});

export default router;
