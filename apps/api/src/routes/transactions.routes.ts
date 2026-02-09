import { Router } from "express";
import { z } from "zod";
import { TransactionsService } from "../services/transactions.service.js";

const router = Router();
const service = new TransactionsService();

// Validation schemas
const transactionItemSchema = z.object({
    productNumber: z.number(),
    name: z.string().min(1),
    description: z.string().optional(),
    location: z.string().optional(),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
    totalPrice: z.number().min(0),
});

const createTransactionSchema = z.object({
    categoryId: z.string().uuid(),
    sessionId: z.string().optional(),
    description: z.string().min(1),
    totalPrice: z.number().min(0),
    transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    items: z.array(transactionItemSchema).optional().default([]),
});

const updateTransactionSchema = z.object({
    categoryId: z.string().uuid().optional(),
    description: z.string().min(1).optional(),
    totalPrice: z.number().min(0).optional(),
    transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

/**
 * GET /api/transactions
 * List all transactions with optional filters
 */
router.get("/", async (req, res, next) => {
    try {
        const filters = {
            categoryId: req.query.categoryId as string | undefined,
            startDate: req.query.startDate as string | undefined,
            endDate: req.query.endDate as string | undefined,
            limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
            offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
        };
        const transactions = await service.findAll(req.user!.id, filters);
        res.json(transactions);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/transactions/search
 * Search transactions
 */
router.get("/search", async (req, res, next) => {
    try {
        const query = req.query.q as string;
        if (!query) {
            return res.json([]);
        }
        const transactions = await service.search(query, req.user!.id);
        res.json(transactions);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/transactions/recent
 * Get recent transactions
 */
router.get("/recent", async (req, res, next) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
        const transactions = await service.getRecent(req.user!.id, limit);
        res.json(transactions);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/transactions/:id
 * Get a single transaction by ID
 */
router.get("/:id", async (req, res, next) => {
    try {
        const transaction = await service.findById(req.params.id, req.user!.id);
        res.json(transaction);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/transactions
 * Create a new transaction with items
 */
router.post("/", async (req, res, next) => {
    try {
        const data = createTransactionSchema.parse(req.body);
        const transaction = await service.create(data, req.user!.id);
        res.status(201).json(transaction);
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/transactions/:id
 * Update a transaction
 */
router.put("/:id", async (req, res, next) => {
    try {
        const data = updateTransactionSchema.parse(req.body);
        const transaction = await service.update(req.params.id, data, req.user!.id);
        res.json(transaction);
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/transactions/:id
 * Delete a transaction
 */
router.delete("/:id", async (req, res, next) => {
    try {
        const result = await service.delete(req.params.id, req.user!.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/transactions/:id/items/:itemId
 * Delete a single item from a transaction
 */
router.delete("/:id/items/:itemId", async (req, res, next) => {
    try {
        const result = await service.deleteItem(
            req.params.id,
            req.params.itemId,
            req.user!.id
        );
        res.json(result);
    } catch (error) {
        next(error);
    }
});

export default router;
