import { Router } from "express";
import { ReportsService } from "../services/reports.service";

const router = Router();
const service = new ReportsService();

/**
 * GET /api/reports/monthly
 * Get monthly expense summary
 */
router.get("/monthly", async (req, res, next) => {
    try {
        const year = req.query.year
            ? parseInt(req.query.year as string)
            : undefined;
        const month = req.query.month
            ? parseInt(req.query.month as string) - 1 // Convert to 0-indexed
            : undefined;
        const stats = await service.getMonthlyStats(req.user!.id, year, month);
        res.json(stats);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/reports/yearly
 * Get yearly expense summary
 */
router.get("/yearly", async (req, res, next) => {
    try {
        const year = req.query.year
            ? parseInt(req.query.year as string)
            : undefined;
        const stats = await service.getYearlyStats(req.user!.id, year);
        res.json(stats);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/reports/by-category
 * Get expenses grouped by category
 */
router.get("/by-category", async (req, res, next) => {
    try {
        const startDate = req.query.startDate as string | undefined;
        const endDate = req.query.endDate as string | undefined;
        const stats = await service.getByCategory(req.user!.id, startDate, endDate);
        res.json(stats);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/reports/trends
 * Get expense trends (comparison with previous period)
 */
router.get("/trends", async (req, res, next) => {
    try {
        const trends = await service.getTrends(req.user!.id);
        res.json(trends);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/reports/budget-status
 * Get budget status for all categories
 */
router.get("/budget-status", async (req, res, next) => {
    try {
        const status = await service.getBudgetStatus(req.user!.id);
        res.json(status);
    } catch (error) {
        next(error);
    }
});

export default router;
