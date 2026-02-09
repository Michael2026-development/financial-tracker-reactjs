import { Router } from "express";
import { ReceiptsService } from "../services/receipts.service";

const router = Router();
const service = new ReceiptsService();

/**
 * POST /api/receipts/scan
 * Upload and scan a receipt image
 * Expects multipart/form-data with 'receipt' file field
 */
router.post("/scan", async (req, res, next) => {
    try {
        // Check if file was uploaded
        // Note: This requires multer or similar middleware to handle file uploads
        // For now, we'll expect base64 encoded image in request body
        const { image, mimeType } = req.body;

        if (!image || !mimeType) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Image and mimeType are required",
            });
        }

        // Validate mime type
        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!validTypes.includes(mimeType)) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Invalid image type. Supported: JPEG, PNG, WebP",
            });
        }

        // Decode base64 image
        const imageBuffer = Buffer.from(image, "base64");

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (imageBuffer.length > maxSize) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Image too large. Maximum size is 10MB",
            });
        }

        const result = await service.scanReceipt(imageBuffer, mimeType);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

export default router;
