import { NextRequest } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = join(process.cwd(), 'app', 'photos', ...params.path)
    const file = await readFile(filePath)
    
    const ext = params.path[params.path.length - 1].split('.').pop()?.toLowerCase()
    const contentType = ext === 'png' ? 'image/png' 
      : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg'
      : ext === 'webp' ? 'image/webp'
      : 'application/octet-stream'
    
    return new Response(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    return new Response('Not found', { status: 404 })
  }
}

