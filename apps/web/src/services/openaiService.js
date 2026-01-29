/**
 * OpenAI GPT-4 Vision Service for Receipt Scanning
 * 
 * Uses OpenAI GPT-4 Vision API to extract receipt data from images
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions'

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
 * Parse OpenAI response to extract receipt data
 */
function parseOpenAIResponse(text) {
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
        console.error('Failed to parse OpenAI response:', error)
        throw new Error('Failed to parse AI response. Please try again.')
    }
}

/**
 * Scan receipt using OpenAI GPT-4 Vision
 * @param {File} imageFile - Receipt image file
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function scanReceiptWithOpenAI(imageFile) {
    if (!OPENAI_API_KEY) {
        console.error('OpenAI API key not configured')
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

        // Prepare the request
        const response = await fetch(OPENAI_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [{
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Analyze this receipt image and extract all items with their details.

Return ONLY a valid JSON object in this exact format (no markdown, no explanation):
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
- Return valid JSON only`
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:${mimeType};base64,${base64Image}`
                            }
                        }
                    ]
                }],
                max_tokens: 2000,
                temperature: 0.2
            })
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error('OpenAI API error:', errorData)
            throw new Error(errorData.error?.message || 'AI service error')
        }

        const result = await response.json()

        // Extract text from OpenAI response
        const generatedText = result.choices?.[0]?.message?.content

        if (!generatedText) {
            throw new Error('No response from AI')
        }

        // Parse the response
        const parsedData = parseOpenAIResponse(generatedText)

        return {
            success: true,
            data: {
                ...parsedData,
                scanDate: new Date().toISOString(),
                aiProvider: 'OpenAI GPT-4',
                confidence: 0.90 // OpenAI doesn't provide confidence, using default
            }
        }

    } catch (error) {
        console.error('OpenAI scan error:', error)
        return {
            success: false,
            error: error.message || 'Failed to scan receipt. Please try again.'
        }
    }
}
