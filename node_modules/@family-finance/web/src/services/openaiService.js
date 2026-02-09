/**
 * OpenAI GPT-4 Vision Service for Receipt Scanning
 * 
 * Uses GPT-4 Vision API to extract receipt data from images
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
            resolve(reader.result)
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
        console.error('Failed to parse OpenAI response:', error)
        console.log('Raw response text:', text)
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
            error: 'AI service not configured. Please add VITE_OPENAI_API_KEY to .env file.'
        }
    }

    try {
        console.log('Starting OpenAI GPT-4 Vision scan...')

        // Convert image to base64
        const base64Image = await fileToBase64(imageFile)

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

        // Make API request to OpenAI
        const response = await fetch(OPENAI_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: prompt
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: base64Image
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 2000,
                temperature: 0.3
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

        console.log('OpenAI response received:', generatedText.substring(0, 200) + '...')

        // Parse the response
        const parsedData = parseOpenAIResponse(generatedText)

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
                aiProvider: 'OpenAI GPT-4o Mini',
                confidence: 0.95
            }
        }

    } catch (error) {
        console.error('OpenAI scan error:', error)

        // More helpful error messages
        let errorMessage = 'Failed to scan receipt. Please try again.'

        if (error.message?.includes('API key')) {
            errorMessage = 'Invalid API key. Please check your OpenAI API configuration.'
        } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
            errorMessage = 'API quota exceeded. Please try again later.'
        } else if (error.message?.includes('parse')) {
            errorMessage = 'Could not understand receipt format. Please try a clearer image.'
        }

        return {
            success: false,
            error: errorMessage
        }
    }
}
