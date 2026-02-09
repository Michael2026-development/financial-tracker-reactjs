/**
 * Tesseract.js OCR Service for Receipt Scanning
 * 
 * Uses Tesseract.js (free, open-source OCR) to extract text from receipt images
 * Then parses the text to extract structured data
 */

import Tesseract from 'tesseract.js'

/**
 * Parse OCR text to extract receipt data
 * Enhanced version with better pattern matching
 */
function parseReceiptText(text) {
    console.log('Raw OCR text:', text)

    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)

    // Try to find store name (usually first few lines, before items)
    let storeName = 'Unknown Store'
    for (let i = 0; i < Math.min(5, lines.length); i++) {
        const line = lines[i].trim()
        // Store names are usually longer and don't have prices
        if (line.length > 5 &&
            !/\d{1,3}[.,]\d{3}/.test(line) &&
            !/total|subtotal|tax|pajak|tunai|kembalian|cashier/i.test(line)) {
            storeName = line
            break
        }
    }

    const items = []
    const seenPrices = new Set() // Avoid duplicate items

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        // Skip obvious header/footer lines
        if (line.length < 3) continue
        if (/^-+$|^=+$|^\*+$/.test(line)) continue // Separator lines
        if (/total|subtotal|tax|pajak|tunai|kembalian|cashier|terima kasih|thank you|nama|kasir|struk/i.test(line)) continue
        if (/^\d{1,2}\/\d{1,2}\/\d{2,4}/.test(line)) continue // Date lines
        if (/^\d{2}:\d{2}/.test(line)) continue // Time lines

        // Multiple price pattern attempts for Indonesian receipts
        const pricePatterns = [
            /(?:Rp\.?\s*)?(\d{1,3}(?:[.,]\d{3})+)(?:[.,]\d{2})?/gi,  // Rp 15.000 or 15,000
            /(\d{4,7})\s*$/g,  // Simple number at end of line (15000) - FIXED: added 'g' flag
        ]

        let priceMatch = null

        for (const pattern of pricePatterns) {
            const matches = [...line.matchAll(pattern)]
            if (matches.length > 0) {
                priceMatch = matches[matches.length - 1] // Take last match (usually the price)
                break
            }
        }

        if (priceMatch) {
            const priceStr = priceMatch[1].replace(/[.,]/g, '')
            const price = parseInt(priceStr)

            // Reasonable price range for items (100 to 10 million)
            if (price >= 100 && price <= 10000000) {

                // Skip if we've seen this exact price (likely duplicate line)
                const priceKey = `${price}`
                if (seenPrices.has(priceKey)) continue

                // Extract quantity if present
                const qtyPatterns = [
                    /^(\d+)\s*[xX×]\s*/,  // "2 x Item" or "2x Item"
                    /^(\d+)\s+/,           // "2 Item" (number at start)
                ]

                let quantity = 1
                let qtyMatch = null
                for (const pattern of qtyPatterns) {
                    qtyMatch = line.match(pattern)
                    if (qtyMatch) {
                        quantity = parseInt(qtyMatch[1])
                        if (quantity > 0 && quantity < 100) break // Valid quantity
                        quantity = 1 // Reset if unreasonable
                        qtyMatch = null
                    }
                }

                // Extract item name
                let itemName = line.substring(0, priceMatch.index).trim()

                // Clean up item name
                itemName = itemName.replace(/^\d+\s*[xX×]\s*/, '') // Remove quantity prefix
                itemName = itemName.replace(/^\d+\s+/, '') // Remove leading numbers
                itemName = itemName.replace(/Rp\.?\s*$/i, '') // Remove trailing Rp
                itemName = itemName.replace(/\s+/g, ' ') // Normalize spaces
                itemName = itemName.trim()

                // Validate item name
                if (itemName.length >= 2 && !/^[\d\s.,]+$/.test(itemName)) {

                    // Calculate unit price
                    const unitPrice = quantity > 1 ? Math.round(price / quantity) : price

                    items.push({
                        id: `ocr-${Date.now()}-${items.length}`,
                        name: itemName,
                        description: `Scanned from ${storeName}`,
                        location: storeName,
                        quantity: quantity,
                        price: unitPrice,
                        total: price,
                        category: 'groceries'
                    })

                    seenPrices.add(priceKey)
                }
            }
        }
    }

    const totalAmount = items.reduce((sum, item) => sum + item.total, 0)

    console.log(`Extracted ${items.length} items from receipt`)

    return {
        storeName,
        items,
        totalAmount,
        rawLines: lines // Include for debugging
    }
}

/**
 * Scan receipt using Tesseract.js OCR
 * @param {File} imageFile - Receipt image file
 * @param {Function} onProgress - Progress callback (progress: 0-100)
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function scanReceiptWithTesseract(imageFile, onProgress = null) {
    try {
        console.log('Starting Tesseract OCR...')

        // Create Tesseract worker
        const worker = await Tesseract.createWorker('eng+ind', 1, {
            logger: (m) => {
                if (m.status === 'recognizing text' && onProgress) {
                    onProgress(Math.round(m.progress * 100))
                }
            }
        })

        // Perform OCR
        const { data: { text } } = await worker.recognize(imageFile)

        // Terminate worker
        await worker.terminate()

        console.log('OCR completed, parsing text...')

        // Parse extracted text
        const parsedData = parseReceiptText(text)

        if (parsedData.items.length === 0) {
            return {
                success: false,
                error: 'Could not extract items from receipt. Please try a clearer image or add items manually.'
            }
        }

        return {
            success: true,
            data: {
                ...parsedData,
                scanDate: new Date().toISOString(),
                aiProvider: 'Tesseract.js OCR',
                confidence: 0.75, // OCR confidence
                rawText: text // Include raw text for debugging
            }
        }

    } catch (error) {
        console.error('Tesseract OCR error:', error)
        return {
            success: false,
            error: error.message || 'Failed to scan receipt. Please try again.'
        }
    }
}
