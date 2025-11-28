import { NextRequest } from 'next/server'

const GEMINI_API_KEY = 'AIzaSyCNBLKPa3m2IIgVlBoedDj8wI6xDUjMkQA'
const GEMINI_MODEL = 'gemini-2.0-flash'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

export const runtime = 'edge'

// Professional prompt wrapper for interior design concepts
function wrapPrompt(userPrompt: string): string {
  return `You are a world-class interior designer and architect. Based on the following user description, create a comprehensive and professional interior design concept.

USER'S VISION:
"${userPrompt}"

Please provide a detailed design concept in the following JSON format (respond ONLY with valid JSON, no markdown):
{
  "title": "A creative, catchy title for this design concept (max 50 chars)",
  "subtitle": "A brief professional summary of the design approach (max 150 chars)",
  "description": "Detailed description of the overall design vision and atmosphere (2-3 sentences)",
  "style": "The primary interior design style (e.g., Modern, Scandinavian, Industrial, etc.)",
  "colorPalette": {
    "primary": "Main color with hex code",
    "secondary": "Secondary color with hex code", 
    "accent": "Accent color with hex code",
    "neutral": "Neutral/base color with hex code"
  },
  "materials": ["List of 4-5 key materials to be used"],
  "furniture": ["List of 5-6 essential furniture pieces with brief descriptions"],
  "lighting": {
    "natural": "Description of natural lighting approach",
    "artificial": "Description of artificial lighting plan",
    "ambient": "Ambient/mood lighting suggestions"
  },
  "zones": ["List of 3-4 functional zones in the space"],
  "focalPoints": ["2-3 main focal points or statement pieces"],
  "mood": "The overall mood/atmosphere (e.g., Cozy & Warm, Sleek & Modern, etc.)",
  "tags": ["5-6 relevant design tags"],
  "tips": ["3-4 professional tips for implementing this design"]
}

Important guidelines:
- Be specific and practical in your recommendations
- Consider functionality alongside aesthetics
- Suggest realistic, achievable design elements
- Maintain coherence between all design elements
- Use professional interior design terminology`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prompt } = body

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Prompt tələb olunur' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      })
    }

    const wrappedPrompt = wrapPrompt(prompt.trim())

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
                text: wrappedPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 2048,
        },
      }),
    })

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error('Gemini API error:', errorText)
      return new Response(
        JSON.stringify({ error: 'Gemini API xətası', details: errorText }),
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
        JSON.stringify({ error: 'Gemini-dən cavab alınmadı' }),
        {
          status: 500,
          headers: { 'content-type': 'application/json' },
        }
      )
    }

    const textContent = candidates[0]?.content?.parts?.[0]?.text
    if (!textContent) {
      return new Response(
        JSON.stringify({ error: 'Gemini cavabında mətn tapılmadı' }),
        {
          status: 500,
          headers: { 'content-type': 'application/json' },
        }
      )
    }

    // Parse the JSON response from Gemini
    let designConcept
    try {
      // Remove any markdown code blocks if present
      let cleanedText = textContent.trim()
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.slice(7)
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.slice(3)
      }
      if (cleanedText.endsWith('```')) {
        cleanedText = cleanedText.slice(0, -3)
      }
      cleanedText = cleanedText.trim()
      
      designConcept = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Raw text:', textContent)
      // If JSON parsing fails, create a structured response from the text
      designConcept = {
        title: prompt.slice(0, 50),
        subtitle: 'AI tərəfindən yaradılmış dizayn konsepti',
        description: textContent.slice(0, 300),
        style: 'Modern',
        colorPalette: {
          primary: '#2C3E50',
          secondary: '#ECF0F1',
          accent: '#E74C3C',
          neutral: '#BDC3C7'
        },
        materials: ['Təbii ağac', 'Metal', 'Şüşə', 'Parça'],
        furniture: ['Əsas oturacaq', 'Səhəng masası', 'Saxlama vahidləri'],
        lighting: {
          natural: 'Böyük pəncərələrdən maksimum təbii işıq',
          artificial: 'LED işıqlandırma sistemi',
          ambient: 'Gizli LED zolaqları'
        },
        zones: ['Oturma zonası', 'İş zonası', 'İstirahət zonası'],
        focalPoints: ['Əsas divar', 'İşıqlandırma elementi'],
        mood: 'Müasir və rahat',
        tags: ['Modern', 'Minimal', 'Funksional', 'Rahat'],
        tips: ['Təbii işıqdan istifadə edin', 'Rəng harmoniyasını qoruyun']
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      concept: designConcept 
    }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })

  } catch (err) {
    console.error('API /create-design error:', err)
    return new Response(JSON.stringify({ error: 'Daxili xəta', details: String(err) }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }
}

