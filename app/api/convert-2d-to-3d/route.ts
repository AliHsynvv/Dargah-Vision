import { NextRequest } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
// Nano Banana Pro - Gemini 3 Pro Image Preview (best quality)
const GEMINI_MODEL = 'gemini-3-pro-image-preview'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    // Get raw body first for debugging
    const rawBody = await req.text()
    console.log('Raw request body:', rawBody)
    
    if (!rawBody) {
      return new Response(JSON.stringify({ error: 'Empty request body' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      })
    }

    let body: any
    try {
      body = JSON.parse(rawBody)
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr)
      return new Response(JSON.stringify({ error: 'Invalid JSON', rawBody: rawBody.substring(0, 200) }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      })
    }

    const { imageUrl } = body
    console.log('Received imageUrl:', imageUrl)

    if (!imageUrl || typeof imageUrl !== 'string') {
      return new Response(JSON.stringify({ error: 'No imageUrl provided', body }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      })
    }

    // Fetch the image from Supabase URL and convert to base64
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch image from URL' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      })
    }

    const imageBuffer = await imageResponse.arrayBuffer()
    const base64Image = arrayBufferToBase64(imageBuffer)
    const mimeType = imageResponse.headers.get('content-type') || 'image/png'

    // Call Gemini API with image generation request
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
                text: "Convert this 2D floor plan into a realistic 3D architectural floor plan visualization. Create a photorealistic 3D perspective view showing the interior with modern furniture, lighting, and materials. Keep the same layout but transform it into a beautiful 3D render with depth, shadows, and realistic textures. Generate an image.",
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
    console.error('API /convert-2d-to-3d error:', err)
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
