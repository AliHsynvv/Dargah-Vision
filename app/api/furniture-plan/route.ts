import { NextRequest } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
// Nano Banana Pro - Gemini 3 Pro Image Preview (best quality for image generation)
const GEMINI_MODEL = 'gemini-3-pro-image-preview'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { imageUrl, style } = body

    if (!imageUrl || typeof imageUrl !== 'string') {
      return new Response(JSON.stringify({ error: 'No image URL provided' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      })
    }

    // Fetch the image and convert to base64
    const imageResponse = await fetch(imageUrl)

    if (!imageResponse.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch image' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      })
    }

    const imageBuffer = await imageResponse.arrayBuffer()
    const base64Image = arrayBufferToBase64(imageBuffer)
    const mimeType = imageResponse.headers.get('content-type') || 'image/png'

    // Build the prompt based on style
    const stylePrompt = style ? `The furniture style should be ${style}.` : 'Use modern, functional furniture.'

    const prompt = `You are an expert interior designer and architect. I'm providing an empty 2D floor plan.

Please generate a new 2D floor plan image that shows furniture placement. The output should be:
1. A clean, professional 2D architectural floor plan
2. Show furniture symbols/icons in their proper positions (beds, sofas, tables, chairs, desks, wardrobes, etc.)
3. Keep the same room layout, walls, doors, and windows from the original
4. Add appropriate furniture for each room type (bedroom gets bed + nightstands, living room gets sofa + coffee table, etc.)
5. Use standard architectural symbols for furniture
6. Maintain proper scale and proportions
7. Include furniture labels if helpful
${stylePrompt}

Generate a clean, black and white 2D floor plan with furniture layout. The style should be professional architectural drawing.`

    // Call Gemini API
    const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Image,
                },
              },
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 64,
          maxOutputTokens: 8192,
          responseModalities: ["image", "text"],
        },
      }),
    })

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error('Gemini API error:', errorText)
      return new Response(
        JSON.stringify({ error: 'Gemini API error', status: geminiResponse.status, details: errorText }),
        {
          status: 500,
          headers: { 'content-type': 'application/json' },
        }
      )
    }

    const geminiData = await geminiResponse.json()
    
    // Extract image from response
    const candidates = geminiData.candidates
    if (!candidates || candidates.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No response from Gemini', data: geminiData }),
        {
          status: 500,
          headers: { 'content-type': 'application/json' },
        }
      )
    }

    const parts = candidates[0]?.content?.parts
    if (!parts || parts.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No parts in Gemini response', data: geminiData }),
        {
          status: 500,
          headers: { 'content-type': 'application/json' },
        }
      )
    }

    // Find the image part in the response
    for (const part of parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data
        const imageMimeType = part.inlineData.mimeType || 'image/png'
        const dataUrl = `data:${imageMimeType};base64,${imageData}`
        
        return new Response(JSON.stringify({ imageUrl: dataUrl }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      }
    }

    // If no image found, return text response for debugging
    const textPart = parts.find((p: any) => p.text)
    return new Response(
      JSON.stringify({ 
        error: 'No image in response', 
        text: textPart?.text || 'No text either',
        data: geminiData 
      }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      }
    )

  } catch (err) {
    console.error('API /furniture-plan error:', err)
    return new Response(JSON.stringify({ error: 'Internal error', details: String(err) }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }
}

// Helper function to convert ArrayBuffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

