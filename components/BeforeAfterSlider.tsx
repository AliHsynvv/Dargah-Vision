'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Grid3x3, Box } from 'lucide-react'

interface BeforeAfterSliderProps {
  beforeLabel?: string
  afterLabel?: string
}

export default function BeforeAfterSlider({
  beforeLabel = '2D Floor Plan',
  afterLabel = '3D Interior'
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.min(Math.max(percentage, 0), 100))
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.min(Math.max(percentage, 0), 100))
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging])

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black overflow-hidden select-none border border-white/20"
    >
      {/* Before Image (Left) */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Grid3x3 className="w-24 h-24 mx-auto mb-4 text-white/20" />
            <div className="text-white/40 font-medium">{beforeLabel}</div>
          </div>
        </div>
      </div>

      {/* After Image (Right) - Clipped */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10"
        style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Box className="w-24 h-24 mx-auto mb-4 text-white/30" />
            <div className="text-white/60 font-medium">{afterLabel}</div>
          </div>
        </div>
      </div>

      {/* Slider Line & Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10"
        style={{ left: `${sliderPosition}%` }}
      >
        <motion.div
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl cursor-ew-resize flex items-center justify-center"
        >
          <div className="flex gap-1">
            <div className="w-0.5 h-4 bg-black" />
            <div className="w-0.5 h-4 bg-black" />
          </div>
        </motion.div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/80 backdrop-blur-sm text-xs font-medium border border-white/20">
        BEFORE
      </div>
      <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/80 backdrop-blur-sm text-xs font-medium border border-white/20">
        AFTER
      </div>
    </div>
  )
}

