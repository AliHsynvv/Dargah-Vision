import { NextRequest } from 'next/server'

const GEMINI_API_KEY = 'AIzaSyCNBLKPa3m2IIgVlBoedDj8wI6xDUjMkQA'
const GEMINI_MODEL = 'gemini-3-pro-image-preview'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

export const runtime = 'edge'

// Interior design styles with detailed prompts
const STYLE_PROMPTS: Record<string, string> = {
  modern: `Modern Interior Design Style:
- Clean lines and geometric shapes
- Neutral color palette with bold accent colors
- Open floor plans and minimal clutter
- Materials: glass, steel, concrete, polished surfaces
- Furniture: sleek, low-profile, functional
- Lighting: recessed, track lighting, statement pendants`,

  minimalist: `Minimalist Interior Design Style:
- "Less is more" philosophy
- Monochromatic or very limited color palette (whites, grays, blacks)
- Essential furniture only, no decorative clutter
- Clean, unadorned surfaces
- Hidden storage solutions
- Natural light emphasis, simple window treatments`,

  scandinavian: `Scandinavian Interior Design Style:
- Light, airy, and cozy (hygge)
- White walls with warm wood accents
- Neutral colors with soft pastels
- Natural materials: light wood, wool, linen, leather
- Functional yet beautiful furniture
- Plants and natural elements
- Soft, layered textiles`,

  industrial: `Industrial Interior Design Style:
- Exposed brick, concrete, and ductwork
- Raw, unfinished look
- Metal and wood combinations
- Dark color palette with metallic accents
- Vintage and repurposed furniture
- Edison bulbs and metal pendant lights
- Open spaces with high ceilings`,

  bohemian: `Bohemian Interior Design Style:
- Eclectic mix of patterns, colors, and textures
- Rich, warm colors (reds, oranges, purples, greens)
- Layered textiles: rugs, throws, pillows
- Global and vintage influences
- Plants everywhere
- Artistic and handcrafted items
- Relaxed, collected-over-time aesthetic`,

  contemporary: `Contemporary Interior Design Style:
- Current trends and modern aesthetics
- Neutral base with bold color accents
- Curved furniture and organic shapes
- Mix of textures and materials
- Statement art pieces
- Open, flowing spaces
- Sustainable and eco-friendly elements`,

  traditional: `Traditional Interior Design Style:
- Classic European influences
- Rich, warm colors (burgundy, navy, forest green)
- Ornate furniture with curved lines
- Symmetrical arrangements
- Luxurious fabrics: velvet, silk, brocade
- Crown moldings and wainscoting
- Antiques and heirlooms`,

  japandi: `Japandi Interior Design Style:
- Fusion of Japanese and Scandinavian design
- Wabi-sabi philosophy (beauty in imperfection)
- Neutral, earthy color palette
- Natural materials: wood, bamboo, stone, paper
- Minimalist but warm
- Craftsmanship and quality over quantity
- Zen-like calm and simplicity`,

  midcentury: `Mid-Century Modern Interior Design Style:
- 1950s-1960s aesthetic
- Organic curves and clean lines
- Bold colors and graphic patterns
- Iconic furniture pieces (Eames, Noguchi)
- Wood paneling and teak furniture
- Large windows and indoor-outdoor connection
- Retro-futuristic elements`,

  coastal: `Coastal Interior Design Style:
- Beach-inspired, relaxed atmosphere
- Light, breezy color palette (blues, whites, sandy tones)
- Natural textures: rattan, jute, driftwood
- Nautical accents (subtle, not themed)
- Light, airy fabrics
- Indoor-outdoor living
- Casual, comfortable furniture`,

  farmhouse: `Modern Farmhouse Interior Design Style:
- Rustic meets contemporary
- Neutral colors with black accents
- Shiplap walls and barn doors
- Reclaimed wood and vintage finds
- Comfortable, lived-in feel
- Apron sinks and open shelving
- Mix of old and new`,

  artdeco: `Art Deco Interior Design Style:
- 1920s-1930s glamour
- Bold geometric patterns
- Rich colors: gold, black, emerald, navy
- Luxurious materials: velvet, lacquer, mirrors
- Symmetry and repetition
- Statement lighting fixtures
- Opulent and theatrical`,
}

// Room type specific furniture and layout guidelines
const ROOM_TYPE_PROMPTS: Record<string, string> = {
  bedroom: `ROOM TYPE: Bedroom
Essential furniture to include:
- Bed (appropriate size for room)
- Nightstands on both sides
- Dresser or chest of drawers
- Wardrobe or closet organization
- Bedside lamps
- Optional: vanity, reading chair, bench at foot of bed
Layout: Bed as focal point, symmetrical nightstand placement`,

  livingroom: `ROOM TYPE: Living Room
Essential furniture to include:
- Sofa or sectional as main seating
- Coffee table
- TV unit or entertainment center
- Armchairs or accent chairs
- Side tables
- Floor or table lamps
- Optional: bookshelf, console table
Layout: Conversation-friendly arrangement, TV viewing angles considered`,

  kitchen: `ROOM TYPE: Kitchen
Essential elements to include:
- Cabinets (upper and lower)
- Countertops
- Sink and faucet
- Stove/cooktop and oven
- Refrigerator
- Kitchen island or breakfast bar (if space allows)
- Pendant lights over island/counter
- Optional: open shelving, bar stools
Layout: Work triangle (sink-stove-fridge) efficiency`,

  bathroom: `ROOM TYPE: Bathroom
Essential elements to include:
- Vanity with sink
- Mirror (large, well-lit)
- Toilet
- Shower or bathtub (or both)
- Towel racks/hooks
- Storage cabinets or shelving
- Proper lighting (vanity lights)
Layout: Functional flow, privacy considerations`,

  diningroom: `ROOM TYPE: Dining Room
Essential furniture to include:
- Dining table (appropriate size)
- Dining chairs (matching or complementary)
- Sideboard or buffet
- Chandelier or pendant light over table
- Optional: bar cart, display cabinet
Layout: Table centered, adequate space for chair movement`,

  office: `ROOM TYPE: Home Office
Essential furniture to include:
- Desk (appropriate size for work)
- Ergonomic office chair
- Bookshelves or storage units
- Task lighting (desk lamp)
- Filing cabinet or storage
- Optional: guest chair, credenza
Layout: Desk positioned for natural light, organized workspace`,

  kidsroom: `ROOM TYPE: Kids Room
Essential furniture to include:
- Bed (age-appropriate)
- Desk and chair for study
- Wardrobe or closet
- Toy storage (bins, shelves)
- Bookshelf
- Playful lighting
- Optional: reading nook, play area
Layout: Safe, functional, room to play`,

  nursery: `ROOM TYPE: Nursery
Essential furniture to include:
- Crib
- Changing table/dresser
- Comfortable nursing/rocking chair
- Storage for baby items
- Soft lighting (dimmable)
- Bookshelf for books and toys
Layout: Crib away from windows, easy access to essentials`,

  guestroom: `ROOM TYPE: Guest Room
Essential furniture to include:
- Comfortable bed (queen preferred)
- Nightstands with lamps
- Dresser or luggage rack
- Mirror
- Comfortable seating
- Adequate closet space
Layout: Welcoming, hotel-like comfort`,

  studio: `ROOM TYPE: Studio Apartment
Essential elements to include:
- Multi-functional furniture
- Bed or sofa bed
- Dining area
- Workspace
- Storage solutions
- Room dividers or zoning
Layout: Clear zones for sleeping, living, working`,
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { imageUrl, style, roomType } = body

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

    // Get style-specific prompt
    const stylePrompt = STYLE_PROMPTS[style] || STYLE_PROMPTS['modern']
    const roomTypePrompt = ROOM_TYPE_PROMPTS[roomType] || ''

    const prompt = `You are a world-class interior designer. Transform this room photo into a stunning interior design visualization.

DESIGN STYLE TO APPLY:
${stylePrompt}

${roomTypePrompt ? roomTypePrompt : ''}

CRITICAL INSTRUCTIONS:
1. PRESERVE THE EXACT ROOM DIMENSIONS - Keep the same room size, shape, walls, ceiling height
2. PRESERVE THE EXACT POSITIONS of windows, doors, and architectural features
3. The room must look IDENTICAL in size and structure - only the interior design changes
4. Apply the specified design style with appropriate furniture and decor
5. Use the style's color palette, materials, and lighting
6. Make it photorealistic with proper lighting and shadows
7. The result should look like a professional interior design magazine photo

IMPORTANT: The room dimensions and architecture must remain EXACTLY the same. Only redesign the interior elements (furniture, colors, materials, decor) while keeping the room structure identical.`

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
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
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

    // Find the image part
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
    console.error('API /interior-design error:', err)
    return new Response(JSON.stringify({ error: 'Internal error', details: String(err) }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

