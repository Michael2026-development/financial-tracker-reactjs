import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../db/index.js";
import { transaction, transactionItem } from "../db/schema.js";
import { CategoriesService } from "./categories.service.js";

export interface ScannedItem {
    name: string;
    quantity: number;
    price: number;
    total: number;
}

export interface ScanResult {
    success: boolean;
    data?: {
        storeName?: string;
        items: ScannedItem[];
        totalAmount: number;
        confidence: number;
    };
    error?: string;
}

export class ReceiptsService {
    private genAI: GoogleGenerativeAI;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY environment variable is required");
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    /**
     * Scan a receipt image and extract items
     */
    async scanReceipt(imageBuffer: Buffer, mimeType: string): Promise<ScanResult> {
        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `Analyze this receipt image and extract the following information in JSON format:
{
  "storeName": "name of the store/merchant",
  "items": [
    {
      "name": "item name",
      "quantity": 1,
      "price": 10000,
      "total": 10000
    }
  ],
  "totalAmount": 50000
}

Rules:
1. Extract all item names, quantities, unit prices (if visible), and totals
2. All prices should be in numeric format (no currency symbols)
3. If quantity is not visible, assume 1
4. Calculate total as quantity * price
5. Sum all items for totalAmount
6. Return ONLY valid JSON, no additional text

If you cannot read the receipt or extract items, return:
{"error": "Unable to extract items from receipt"}`;

            const imagePart = {
                inlineData: {
                    data: imageBuffer.toString("base64"),
                    mimeType,
                },
            };

            const result = await model.generateContent([prompt, imagePart]);
            const response = await result.response;
            const text = response.text();

            // Parse JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                return {
                    success: false,
                    error: "Failed to parse AI response",
                };
            }

            const parsed = JSON.parse(jsonMatch[0]);

            if (parsed.error) {
                return {
                    success: false,
                    error: parsed.error,
                };
            }

            return {
                success: true,
                data: {
                    storeName: parsed.storeName,
                    items: parsed.items || [],
                    totalAmount: parsed.totalAmount || 0,
                    confidence: 0.85, // Approximate confidence
                },
            };
        } catch (error) {
            console.error("Receipt scanning error:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Failed to scan receipt",
            };
        }
    }
}
