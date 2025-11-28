import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FloorPlan AI - Transform 2D Floor Plans into 3D Interior Designs',
  description: 'AI-powered platform to convert 2D floor plans into stunning 3D models and interior designs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  )
}

