import api from "./client";

/**
 * Receipts API Service
 */

/**
 * Scan a receipt image using AI
 * @param {string} image - Base64 encoded image data
 * @param {string} mimeType - Image type (image/jpeg, image/png, image/webp)
 */
export async function scanReceipt(image, mimeType) {
    return api.post("/receipts/scan", { image, mimeType });
}
