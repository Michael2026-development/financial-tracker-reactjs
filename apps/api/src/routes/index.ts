import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";

import categoriesRoutes from "./categories.routes";
import transactionsRoutes from "./transactions.routes";
import reportsRoutes from "./reports.routes";
import notificationsRoutes from "./notifications.routes";
import settingsRoutes from "./settings.routes";
import receiptsRoutes from "./receipts.routes";

const router = Router();

// All routes require authentication
router.use("/categories", requireAuth, categoriesRoutes);
router.use("/transactions", requireAuth, transactionsRoutes);
router.use("/reports", requireAuth, reportsRoutes);
router.use("/notifications", requireAuth, notificationsRoutes);
router.use("/settings", requireAuth, settingsRoutes);
router.use("/receipts", requireAuth, receiptsRoutes);

// Health check endpoint (no auth required)
router.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
