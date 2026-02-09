import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";

import categoriesRoutes from "./categories.routes.js";
import transactionsRoutes from "./transactions.routes.js";
import reportsRoutes from "./reports.routes.js";
import notificationsRoutes from "./notifications.routes.js";
import settingsRoutes from "./settings.routes.js";
import receiptsRoutes from "./receipts.routes.js";

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
