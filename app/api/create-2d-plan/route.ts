import { NextRequest } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
const GEMINI_MODEL = 'gemini-3-pro-image-preview'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

export const runtime = 'edge'

// Room type descriptions for better AI understanding
const roomDescriptions: Record<string, string> = {
  bedroom: 'bedroom with bed placement area, wardrobe space, nightstands, and proper circulation paths',
  living: 'living room with sofa arrangement, coffee table, TV unit area, and comfortable seating layout',
  kitchen: 'kitchen with countertops, cooking area, sink, refrigerator space, and storage cabinets',
  bathroom: 'bathroom with toilet, sink/vanity, shower or bathtub area, and proper drainage locations',
  office: 'home office with desk placement, chair space, bookshelf area, and computer setup zone',
  kids: 'children\'s room with bed, play area, study desk, and toy storage space',
  gym: 'home gym with exercise equipment zones, free weights area, and proper spacing for movement',
  garage: 'garage with vehicle parking space, storage areas, and workbench zone',
  garden: 'garden/terrace layout with plant beds, seating area, and pathway planning',
  custom: 'custom room with flexible furniture arrangement and functional zones',
}

// Style descriptions
const styleDescriptions: Record<string, string> = {
  modern: 'clean lines, open spaces, contemporary furniture placement',
  minimalist: 'essential furniture only, maximum open space, simple layout',
  classic: 'traditional furniture arrangement, symmetrical design, elegant spacing',
  scandinavian: 'functional layout, cozy corners, natural flow between areas',
  industrial: 'open plan feel, practical zones, raw aesthetic spacing',
  luxury: 'spacious arrangement, premium furniture placement, grand proportions',
}

function generateProfessionalPrompt(params: {
  roomType: string
  roomName: string
  width: number
  height: number
  doors: number
  windows: number
  style: string
  additionalNotes?: string
}): string {
  const { roomType, roomName, width, height, doors, windows, style, additionalNotes } = params
  
  const roomDesc = roomDescriptions[roomType] || roomDescriptions.custom
  const styleDesc = styleDescriptions[style] || styleDescriptions.modern
  
  let prompt = `You are a professional architect and interior designer specializing in 2D floor plan creation.

CREATE A DETAILED 2D FLOOR PLAN with the following specifications:

ROOM DETAILS:
- Room Type: ${roomName}
- Dimensions: ${width} meters (width) × ${height} meters (length)
- Total Area: ${(width * height).toFixed(1)} square meters
- Number of Doors: ${doors}
- Number of Windows: ${windows}
- Design Style: ${style} (${styleDesc})

ROOM DESCRIPTION:
This should be a ${roomDesc}.

CRITICAL REQUIREMENTS FOR THE 2D PLAN:
1. Draw a TOP-DOWN VIEW floor plan (bird's eye view)
2. Use CLEAN BLACK LINES on WHITE/LIGHT BACKGROUND
3. Show WALLS as THICK BLACK LINES
4. Mark DOORS with standard architectural door swing symbols
5. Mark WINDOWS with standard architectural window symbols (parallel lines)
6. Include FURNITURE LAYOUT appropriate for the room type
7. Add DIMENSION LINES showing ${width}m × ${height}m
8. Use PROPER ARCHITECTURAL SYMBOLS and conventions
9. Label key furniture and features
10. Maintain ACCURATE SCALE and PROPORTIONS

STYLE GUIDELINES:
- Professional architectural drawing style
- Clean, minimalist line work
- Clear labeling
- Proper spacing and circulation paths
- Furniture sized appropriately for the room dimensions

The output should look like a professional architectural 2D floor plan that could be used for construction or interior design purposes.`

  if (additionalNotes) {
    prompt += `

USER'S ADDITIONAL REQUIREMENTS:
"${additionalNotes}"

Please incorporate these specific requests into the floor plan design.`
  }

  prompt += `

Generate a single, high-quality 2D floor plan image.`

  return prompt
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { roomType, roomName, width, height, doors, windows, style, additionalNotes } = body

    // Validate required fields
    if (!roomType || typeof roomType !== 'string') {
      return new Response(JSON.stringify({ error: 'Room type is required' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      })
    }

    if (!width || !height || width <= 0 || height <= 0) {
      return new Response(JSON.stringify({ error: 'Valid dimensions are required' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      })
    }

    // Generate professional prompt
    const prompt = generateProfessionalPrompt({
      roomType,
      roomName: roomName || roomType,
      width: Number(width),
      height: Number(height),
      doors: Number(doors) || 1,
      windows: Number(windows) || 1,
      style: style || 'modern',
      additionalNotes,
    })

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
          responseModalities: ['image', 'text'],
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
    console.error('API /create-2d-plan error:', err)
    return new Response(JSON.stringify({ error: 'Internal error', details: String(err) }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }
}

