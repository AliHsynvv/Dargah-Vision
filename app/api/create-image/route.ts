import { NextRequest } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!
const GEMINI_MODEL = 'gemini-3-pro-image-preview'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

export const runtime = 'edge'

// Professional prompt wrapper for design image generation
function wrapPrompt(userPrompt: string, hasReferenceImage: boolean, designType: 'interior' | 'exterior'): string {
    const isExterior = designType === 'exterior'

    if (hasReferenceImage) {
        if (isExterior) {
            return `You are a world-class architectural designer and visualization artist. Based on the user's prompt and the reference image provided, create a stunning photorealistic exterior architectural visualization.

USER'S VISION:
"${userPrompt}"

CRITICAL INSTRUCTIONS:
1. Use the reference image as inspiration for the design
2. Create a photorealistic exterior architectural rendering
3. Apply professional lighting with realistic sky and sunlight
4. The result should look like a high-end architectural visualization
5. Include appropriate landscaping, outdoor furniture, and styling based on the prompt
6. Ensure the exterior feels cohesive and professionally designed
7. Pay attention to materials, textures, and architectural details
8. Include realistic environment elements like trees, plants, pathways

Generate a single, stunning exterior design image that brings the user's vision to life.`
        }

        return `You are a world-class interior designer and visualization artist. Based on the user's prompt and the reference image provided, create a stunning photorealistic interior design visualization.

USER'S VISION:
"${userPrompt}"

CRITICAL INSTRUCTIONS:
1. Use the reference image as inspiration for the design
2. Create a photorealistic interior design rendering
3. Apply professional lighting, materials, and textures
4. The result should look like a high-end architectural visualization
5. Include appropriate furniture, decor, and styling based on the prompt
6. Ensure the space feels cohesive and professionally designed
7. Pay attention to color harmony, spatial balance, and visual flow

Generate a single, stunning interior design image that brings the user's vision to life.`
    }

    if (isExterior) {
        return `You are a world-class architectural designer and visualization artist. Based on the user's description, create a stunning photorealistic exterior architectural visualization.

USER'S VISION:
"${userPrompt}"

CRITICAL INSTRUCTIONS:
1. Create a photorealistic exterior architectural rendering
2. Apply professional lighting with realistic sky, sunlight, and shadows
3. Use high-quality materials and textures for building facades
4. The result should look like a high-end architectural magazine photo
5. Include appropriate landscaping, outdoor elements, and styling
6. Ensure the exterior feels cohesive, balanced, and professionally designed
7. Pay attention to architectural proportions, materials, and details
8. Add realistic environment elements like vegetation, water features, outdoor lighting

Generate a single, stunning exterior design image that brings the user's vision to life.`
    }

    return `You are a world-class interior designer and visualization artist. Based on the user's description, create a stunning photorealistic interior design visualization.

USER'S VISION:
"${userPrompt}"

CRITICAL INSTRUCTIONS:
1. Create a photorealistic interior design rendering
2. Apply professional lighting with natural and artificial light sources
3. Use high-quality materials and textures
4. The result should look like a high-end architectural magazine photo
5. Include appropriate furniture, decor, and styling
6. Ensure the space feels cohesive, balanced, and professionally designed
7. Pay attention to color harmony, spatial balance, and visual flow
8. Add subtle details like plants, books, art pieces to make it feel lived-in

Generate a single, stunning interior design image that brings the user's vision to life.`
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { prompt, referenceImage, designType = 'interior' } = body

        if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
            return new Response(JSON.stringify({ error: 'Prompt is required' }), {
                status: 400,
                headers: { 'content-type': 'application/json' },
            })
        }

        const hasReferenceImage = !!referenceImage
        const wrappedPrompt = wrapPrompt(prompt.trim(), hasReferenceImage, designType)

        // Build the parts array
        const parts: any[] = []

        // Add reference image if provided
        if (referenceImage && typeof referenceImage === 'string') {
            // Extract base64 data and mime type from data URL
            const matches = referenceImage.match(/^data:([^;]+);base64,(.+)$/)
            if (matches) {
                const mimeType = matches[1]
                const base64Data = matches[2]
                parts.push({
                    inlineData: {
                        mimeType: mimeType,
                        data: base64Data,
                    },
                })
            }
        }

        // Add the text prompt
        parts.push({
            text: wrappedPrompt,
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
                        parts: parts,
                    },
                ],
                generationConfig: {
                    temperature: 1,
                    topP: 0.95,
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

        const parts_response = candidates[0]?.content?.parts
        if (!parts_response || parts_response.length === 0) {
            return new Response(
                JSON.stringify({ error: 'No parts found in Gemini response', data: geminiData }),
                {
                    status: 500,
                    headers: { 'content-type': 'application/json' },
                }
            )
        }

        // Find the image part
        for (const part of parts_response) {
            if (part.inlineData) {
                const imageData = part.inlineData.data
                const imageMimeType = part.inlineData.mimeType || 'image/png'
                const dataUrl = `data:${imageMimeType};base64,${imageData}`

                return new Response(JSON.stringify({
                    success: true,
                    imageUrl: dataUrl
                }), {
                    status: 200,
                    headers: { 'content-type': 'application/json' },
                })
            }
        }

        // If no image found, return any text response
        const textPart = parts_response.find((p: any) => p.text)
        return new Response(
            JSON.stringify({
                error: 'Failed to generate image',
                text: textPart?.text || 'No response received',
                data: geminiData,
            }),
            {
                status: 500,
                headers: { 'content-type': 'application/json' },
            }
        )

    } catch (err) {
        console.error('API /create-image error:', err)
        return new Response(JSON.stringify({ error: 'Internal error', details: String(err) }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        })
    }
}
