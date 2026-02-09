/**
 * Receipt Scanner Service
 * 
 * Integrates with Google Gemini AI Vision for receipt scanning
 */

import { scanReceiptWithGemini } from './geminiAI'

// Development mode flag - set to true to use mock data
const USE_MOCK_DATA = false  // ✅ DISABLED - Using real Gemini AI

// Simulated processing delay (ms) for mock mode
const PROCESSING_DELAY = 2000

/*
// Mock receipt data templates for development/demo
const mockReceiptTemplates = [
    {
        storeName: 'Supermarket ABC',
        items: [
            { name: 'Beras 5kg (Premium)', quantity: 1, price: 75000 },
            { name: 'Minyak Goreng 2L', quantity: 2, price: 34000 },
            { name: 'Ayam Potong 2kg', quantity: 1, price: 82000 },
            { name: 'Sabun & Detergen Package', quantity: 1, price: 125000 },
            { name: 'Buah & Sayur', quantity: 1, price: 400000 }
        ]
    },
    // ... items
]

/!**
 * Mock receipt analysis (for development)
 *!/
async function analyzeMockReceipt(imageFile) {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, PROCESSING_DELAY))

    return {
        success: true,
        data: {
            storeName: "Mock Store",
            items: [],
            totalAmount: 0,
            aiProvider: 'Mock (Development)',
            confidence: 1.0
        }
    }
}
*/

/**
 * Analyze a receipt image and extract items
 * @param {File} imageFile - The receipt image file
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function analyzeReceipt(imageFile) {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(imageFile.type)) {
        return {
            success: false,
            error: 'Invalid file type. Please upload JPG, PNG, or WebP image.'
        }
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (imageFile.size > maxSize) {
        return {
            success: false,
            error: 'File too large. Maximum size is 10MB.'
        }
    }

    // Always use valid Gemini AI
    return scanReceiptWithGemini(imageFile)
}

/**
 * Get image preview URL for uploaded file
 * @param {File} file - Image file
 * @returns {string} Object URL for preview
 */
export function getImagePreview(file) {
    return URL.createObjectURL(file)
}

/**
 * Revoke image preview URL to free memory
 * @param {string} url - Preview URL to revoke
 */
export function revokeImagePreview(url) {
    if (url) {
        URL.revokeObjectURL(url)
    }
}
