import { Router } from "express";
import { NotificationsService } from "../services/notifications.service.js";

const router = Router();
const service = new NotificationsService();

/**
 * GET /api/notifications
 * List all notifications for the authenticated user
 */
router.get("/", async (req, res, next) => {
    try {
        const notifications = await service.findAll(req.user!.id);
        res.json(notifications);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/notifications/unread-count
 * Get count of unread notifications
 */
router.get("/unread-count", async (req, res, next) => {
    try {
        const count = await service.getUnreadCount(req.user!.id);
        res.json({ count });
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/notifications/:id/read
 * Mark a notification as read
 */
router.put("/:id/read", async (req, res, next) => {
    try {
        const notification = await service.markAsRead(req.params.id, req.user!.id);
        res.json(notification);
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/notifications/read-all
 * Mark all notifications as read
 */
router.put("/read-all", async (req, res, next) => {
    try {
        const result = await service.markAllAsRead(req.user!.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/notifications/:id
 * Delete a notification
 */
router.delete("/:id", async (req, res, next) => {
    try {
        const result = await service.delete(req.params.id, req.user!.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

export default router;
