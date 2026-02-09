import { Router } from "express";
import { z } from "zod";
import { CategoriesService } from "../services/categories.service";

const router = Router();
const service = new CategoriesService();

// Validation schemas
const createCategorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    icon: z.string().optional(),
    color: z.string().optional(),
    monthlyBudget: z.number().min(0),
});

const updateCategorySchema = z.object({
    name: z.string().min(1).optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
    monthlyBudget: z.number().min(0).optional(),
});

/**
 * GET /api/categories
 * List all categories for the authenticated user
 */
router.get("/", async (req, res, next) => {
    try {
        const categories = await service.findAll(req.user!.id);
        res.json(categories);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/categories/:id
 * Get a single category by ID
 */
router.get("/:id", async (req, res, next) => {
    try {
        const category = await service.findById(req.params.id, req.user!.id);
        res.json(category);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/categories
 * Create a new category
 */
router.post("/", async (req, res, next) => {
    try {
        const data = createCategorySchema.parse(req.body);
        const category = await service.create(data, req.user!.id);
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/categories/:id
 * Update a category
 */
router.put("/:id", async (req, res, next) => {
    try {
        const data = updateCategorySchema.parse(req.body);
        const category = await service.update(req.params.id, data, req.user!.id);
        res.json(category);
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/categories/:id
 * Delete a category
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
 * GET /api/categories/:id/spent
 * Get monthly spent amount for a category
 */
router.get("/:id/spent", async (req, res, next) => {
    try {
        const spent = await service.getMonthlySpent(req.params.id, req.user!.id);
        res.json({ spent });
    } catch (error) {
        next(error);
    }
});

export default router;
