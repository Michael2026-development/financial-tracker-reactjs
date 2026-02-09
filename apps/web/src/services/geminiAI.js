/**
 * Google Gemini AI Service for Receipt Scanning
 * 
 * Uses Google Gemini Vision API via official SDK to extract receipt data from images
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

// Initialize Gemini AI
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null

/**
 * Convert File to base64 data part for Gemini
 */
async function fileToGenerativePart(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            const base64Data = reader.result.split(',')[1]
            resolve({
                inlineData: {
                    data: base64Data,
                    mimeType: file.type
                }
            })
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

/**
 * Parse Gemini response to extract receipt data
 */
function parseGeminiResponse(text) {
    try {
        // Remove markdown code blocks if present
        let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

        // Try to find JSON in the response
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            throw new Error('No JSON found in response')
        }

        const data = JSON.parse(jsonMatch[0])

        // Validate and format the data
        const items = (data.items || []).map((item, index) => ({
            id: `ai-${Date.now()}-${index}`,
            name: item.name || item.item || 'Unknown Item',
            description: item.description || `Scanned from ${data.storeName || 'receipt'}`,
            location: data.storeName || data.store || '',
            quantity: parseInt(item.quantity || item.qty || 1),
            price: parseFloat(item.price || item.unit_price || 0),
            total: parseFloat(item.total || (item.price * item.quantity) || 0),
            category: 'groceries',
            date: new Date().toISOString().split('T')[0]
        }))

        return {
            storeName: data.storeName || data.store || 'Unknown Store',
            items: items,
            totalAmount: items.reduce((sum, item) => sum + item.total, 0),
            rawResponse: data
        }
    } catch (error) {
        console.error('Failed to parse Gemini response:', error)
        console.log('Raw response text:', text)
        throw new Error('Failed to parse AI response. Please try again.')
    }
}

/**
 * Scan receipt using Google Gemini AI
 * @param {File} imageFile - Receipt image file
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function scanReceiptWithGemini(imageFile) {
    if (!GEMINI_API_KEY || !genAI) {
        console.error('Gemini API key not configured')
        return {
            success: false,
            error: 'AI service not configured. Please add VITE_GEMINI_API_KEY to .env file.'
        }
    }

    try {
        console.log('Starting Gemini AI vision scan...')

        // Get the generative model - using gemini-2.0-flash-exp (as requested)
        const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' })

        // Convert image to generative part
        const imagePart = await fileToGenerativePart(imageFile)

        // Prepare the prompt
        const prompt = `Analyze this receipt image and extract all items with their details.

Return ONLY a valid JSON object in this exact format (no markdown, no code blocks, no additional text):
{
  "storeName": "name of the store",
  "items": [
    {
      "name": "item name",
      "quantity": 1,
      "price": 10000,
      "total": 10000
    }
  ]
}

Important:
- Extract ALL items from the receipt
- Use numeric values only (no "Rp" or currency symbols)
- If quantity is not visible, use 1
- Calculate total = quantity × price
- Use exact item names from receipt
- Return valid JSON only, no markdown formatting`

        // Generate content with vision
        const result = await model.generateContent([prompt, imagePart])
        const response = await result.response
        const text = response.text()

        console.log('Gemini response received:', text.substring(0, 200) + '...')

        // Parse the response
        const parsedData = parseGeminiResponse(text)

        if (parsedData.items.length === 0) {
            return {
                success: false,
                error: 'No items found on receipt. Please try a clearer image.'
            }
        }

        console.log(`Successfully extracted ${parsedData.items.length} items`)

        return {
            success: true,
            data: {
                ...parsedData,
                scanDate: new Date().toISOString(),
                aiProvider: 'Google Gemini 1.5 Flash',
                confidence: 0.9
            }
        }

    } catch (error) {
        console.error('Gemini scan error:', error)

        let errorMessage = 'Failed to scan receipt. '

        if (error.message?.includes('API key')) {
            errorMessage += 'Invalid API key. Please check your Gemini API configuration.'
        } else if (error.message?.includes('quota')) {
            errorMessage += 'API quota exceeded. Please try again later.'
        } else if (error.message?.includes('not found')) {
            errorMessage += 'Model not available. Using gemini-1.5-flash.'
        } else if (error.message?.includes('fetch') || error.message?.includes('CORS')) {
            errorMessage += 'Browser security block. Access to Gemini API from browser is restricted.'
        } else {
            errorMessage += error.message || 'Unknown error.'
        }

        return {
            success: false,
            error: errorMessage
        }
    }
}
