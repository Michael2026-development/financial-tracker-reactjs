/**
 * Google Gemini AI Service for Receipt Scanning
 * 
 * Uses Google Gemini Vision API to extract receipt data from images
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent'

/**
 * Convert File to base64 string
 */
async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            const base64 = reader.result.split(',')[1]
            resolve(base64)
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
        // Try to find JSON in the response
        const jsonMatch = text.match(/\{[\s\S]*\}/)
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
            category: 'groceries'
        }))

        return {
            storeName: data.storeName || data.store || 'Unknown Store',
            items: items,
            totalAmount: items.reduce((sum, item) => sum + item.total, 0),
            rawResponse: data
        }
    } catch (error) {
        console.error('Failed to parse Gemini response:', error)
        throw new Error('Failed to parse AI response. Please try again.')
    }
}

/**
 * Scan receipt using Google Gemini AI
 * @param {File} imageFile - Receipt image file
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function scanReceiptWithGemini(imageFile) {
    if (!GEMINI_API_KEY) {
        console.error('Gemini API key not configured')
        return {
            success: false,
            error: 'AI service not configured. Please contact administrator.'
        }
    }

    try {
        // Convert image to base64
        const base64Image = await fileToBase64(imageFile)

        // Determine MIME type
        const mimeType = imageFile.type || 'image/jpeg'

        // Prepare the prompt
        const prompt = `Analyze this receipt image and extract all items with their details.

Return ONLY a valid JSON object in this exact format (no additional text):
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
- Return valid JSON only, no markdown or explanation`

        // Make API request to Gemini
        const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: mimeType,
                                data: base64Image
                            }
                        }
                    ]
                }],
                generationConfig: {
                    temperature: 0.4,
                    topK: 32,
                    topP: 1,
                    maxOutputTokens: 2048,
                }
            })
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error('Gemini API error:', errorData)
            throw new Error(errorData.error?.message || 'AI service error')
        }

        const result = await response.json()

        // Extract text from Gemini response
        const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text

        if (!generatedText) {
            throw new Error('No response from AI')
        }

        // Parse the response
        const parsedData = parseGeminiResponse(generatedText)

        return {
            success: true,
            data: {
                ...parsedData,
                scanDate: new Date().toISOString(),
                aiProvider: 'Google Gemini',
                confidence: 0.85 // Gemini doesn't provide confidence, using default
            }
        }

    } catch (error) {
        console.error('Gemini scan error:', error)
        return {
            success: false,
            error: error.message || 'Failed to scan receipt. Please try again.'
        }
    }
}
