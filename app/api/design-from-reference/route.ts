import { NextRequest } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
// Nano Banana Pro - Gemini 3 Pro Image Preview (best quality for image generation)
const GEMINI_MODEL = 'gemini-3-pro-image-preview'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

export const runtime = 'edge'

// Professional prompt wrapper for interior design
function wrapPromptProfessionally(userPrompt?: string): string {
  const basePrompt = `You are a world-class interior designer and 3D visualization artist with expertise in photorealistic rendering. You have been trained in:
- Architectural visualization and photorealistic rendering
- Color theory and spatial harmony
- Material textures and lighting design
- Modern and classic interior design principles

I'm providing two images:
1. First image: This is the room I want to redesign (the target space)
2. Second image: This is a reference room showing the style, mood, and aesthetic I want to achieve

YOUR TASK:
Generate a stunning, photorealistic interior design visualization that transforms the first room to match the style of the reference image.

IMPORTANT GUIDELINES:
- PRESERVE the basic architectural layout, room dimensions, windows, and doors from the first image
- TRANSFER the design elements from the reference: furniture style, color palette, lighting mood, textures, materials, and decorative elements
- Ensure the generated image is PHOTOREALISTIC with proper lighting, shadows, and reflections
- Maintain spatial coherence and realistic proportions
- Apply professional interior design principles for visual harmony`

  if (userPrompt && userPrompt.trim()) {
    return `${basePrompt}

USER'S SPECIFIC DESIGN PREFERENCES:
"${userPrompt.trim()}"

Please incorporate the user's specific requests while maintaining the overall style transfer from the reference image. Prioritize their preferences when making design decisions.

Generate a single, high-quality photorealistic image of the redesigned room.`
  }

  return `${basePrompt}

Generate a single, high-quality photorealistic image of the redesigned room that perfectly blends the original space with the reference style.`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { roomImageUrl, referenceImageUrl, userPrompt } = body

    if (!roomImageUrl || typeof roomImageUrl !== 'string') {
      return new Response(JSON.stringify({ error: 'No room image URL provided' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      })
    }

    if (!referenceImageUrl || typeof referenceImageUrl !== 'string') {
      return new Response(JSON.stringify({ error: 'No reference image URL provided' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      })
    }

    // Fetch both images and convert to base64
    const [roomResponse, referenceResponse] = await Promise.all([
      fetch(roomImageUrl),
      fetch(referenceImageUrl),
    ])

    if (!roomResponse.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch room image' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      })
    }

    if (!referenceResponse.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch reference image' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      })
    }

    const [roomBuffer, referenceBuffer] = await Promise.all([
      roomResponse.arrayBuffer(),
      referenceResponse.arrayBuffer(),
    ])

    const roomBase64 = arrayBufferToBase64(roomBuffer)
    const referenceBase64 = arrayBufferToBase64(referenceBuffer)
    
    const roomMimeType = roomResponse.headers.get('content-type') || 'image/png'
    const referenceMimeType = referenceResponse.headers.get('content-type') || 'image/png'

    // Call Gemini API with both images
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
                  mimeType: roomMimeType,
                  data: roomBase64,
                },
              },
              {
                inlineData: {
                  mimeType: referenceMimeType,
                  data: referenceBase64,
                },
              },
              {
                text: wrapPromptProfessionally(userPrompt),
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
    console.error('API /design-from-reference error:', err)
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

