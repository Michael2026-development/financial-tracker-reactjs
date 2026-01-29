/**
 * Receipt Scanner Service
 * 
 * Integrates with Tesseract.js OCR for receipt scanning (FREE)
 */

import { scanReceiptWithTesseract } from './tesseractOCR'

// Development mode flag - set to true to use mock data
const USE_MOCK_DATA = false

// Simulated processing delay (ms) for mock mode
const PROCESSING_DELAY = 2000

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
    {
        storeName: 'Indomaret',
        items: [
            { name: 'Susu Ultra 1L', quantity: 2, price: 18500 },
            { name: 'Roti Tawar', quantity: 1, price: 15000 },
            { name: 'Telur 10 butir', quantity: 1, price: 28000 },
            { name: 'Air Mineral 600ml', quantity: 6, price: 3500 }
        ]
    },
    {
        storeName: 'Alfamart',
        items: [
            { name: 'Snack Chips', quantity: 3, price: 12000 },
            { name: 'Minuman Kopi', quantity: 2, price: 8000 },
            { name: 'Mie Instan', quantity: 5, price: 3500 }
        ]
    }
]

/**
 * Mock receipt analysis (for development)
 */
async function analyzeMockReceipt(imageFile) {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, PROCESSING_DELAY))

    // Return random mock data
    const template = mockReceiptTemplates[Math.floor(Math.random() * mockReceiptTemplates.length)]

    // Add unique IDs and calculate totals
    const items = template.items.map((item, index) => ({
        id: `mock-${Date.now()}-${index}`,
        name: item.name,
        description: `Scanned from ${template.storeName}`,
        location: template.storeName,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
        category: 'groceries'
    }))

    return {
        success: true,
        data: {
            storeName: template.storeName,
            scanDate: new Date().toISOString(),
            items: items,
            totalAmount: items.reduce((sum, item) => sum + item.total, 0),
            aiProvider: 'Mock (Development)',
            confidence: 1.0
        }
    }
}

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

    // Use mock data in development mode or real OCR in production
    if (USE_MOCK_DATA) {
        console.log('Using mock receipt data (development mode)')
        return analyzeMockReceipt(imageFile)
    } else {
        console.log('Using Tesseract.js OCR for receipt scanning')
        return scanReceiptWithTesseract(imageFile)
    }
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
 * Cleanup image preview URL
 * @param {string} url - Object URL to revoke
 */
export function revokeImagePreview(url) {
    URL.revokeObjectURL(url)
}
