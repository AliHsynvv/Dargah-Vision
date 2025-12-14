'use client'

import Header from '@/components/Header'
import Link from 'next/link'
import { Box, Sparkles, Grid3x3, ArrowRight, Layers, Home, Building2, Palette, Zap, PenTool } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'

const apps = [
  {
    id: '2d-plan',
    tag: 'Planning',
    title: '2D Plan Creator',
    description: 'Enter dimensions, select room type, and let AI generate a professional 2D floor plan for you.',
    href: '/apps/2d-plan-creator',
    imageSrc: '/photos/furniture plan.png',
    icon: <PenTool className="w-6 h-6" />,
    color: 'from-blue-500/20 to-cyan-500/20',
    type: 'single',
  },
  {
    id: '2d-to-3d',
    tag: 'Architecture',
    title: '2D to 3D Conversion',
    description: 'Transform your floor plans into stunning 3D architectural perspective renders.',
    href: '/apps/2d-to-3d',
    imageSrc: '/photos/3d floor plan.png',
    icon: <Box className="w-6 h-6" />,
    color: 'from-purple-500/20 to-pink-500/20',
    type: 'single',
  },
  {
    id: 'interior',
    tag: 'Interior',
    title: 'AI Interior Design',
    description: 'Create stunning interior design concepts with clean, minimal aesthetics powered by AI.',
    href: '/apps/interior-design',
    imageSrc: '/photos/interier.png',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'from-amber-500/20 to-orange-500/20',
    type: 'single',
    featured: true,
  },
  {
    id: 'furniture',
    tag: 'Planning',
    title: 'Furniture Plan',
    description: 'Generate optimal furniture layouts for empty floor plans with AI-powered placement.',
    href: '/apps/furniture-plan',
    imageSrc: '/photos/furniture plan.png',
    icon: <Layers className="w-6 h-6" />,
    color: 'from-green-500/20 to-emerald-500/20',
    type: 'single',
  },
  {
    id: 'reference',
    tag: 'Interior',
    title: 'Reference Design',
    description: 'Match your room to the mood, materials, and lighting of a reference image.',
    href: '/apps/design-room-reference',
    beforeImage: '/photos/eroom.png',
    afterImage: '/photos/ref.png',
    icon: <Palette className="w-6 h-6" />,
    color: 'from-rose-500/20 to-red-500/20',
    type: 'beforeAfter',
  },
  {
    id: 'create',
    tag: 'AI Generation',
    title: 'Create from Prompt',
    description: 'Describe your dream space in words and watch AI bring it to life with stunning visuals.',
    href: '/create',
    imageSrc: '/photos/home1.png',
    icon: <Zap className="w-6 h-6" />,
    color: 'from-indigo-500/20 to-violet-500/20',
    type: 'single',
    featured: true,
  },
]

export default function AppsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
      </div>

      <main className="relative pt-28 pb-20 px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <section className="mb-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5"
          >
            <Grid3x3 className="w-4 h-4" />
            <span className="text-sm">AI Tools & Applications</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl"
          >
            Choose Your{' '}
            <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              Creative Tool
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-lg text-white/50 max-w-2xl"
          >
            Transform floor plans, explore interior directions, and create stunning designs — all powered by AI.
          </motion.p>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-8 pt-4"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-white/60">6 AI Tools Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-sm text-white/60">Instant Generation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-sm text-white/60">Professional Quality</span>
            </div>
          </motion.div>
        </section>

        {/* Apps Grid */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app, idx) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
              className={`group relative flex flex-col rounded-3xl overflow-hidden border transition-all duration-500 ${app.featured
                ? 'border-white/30 bg-gradient-to-br from-white/10 to-white/5 hover:border-white/50'
                : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                }`}
            >
              {/* Featured Badge */}
              {app.featured && (
                <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-white text-black text-[10px] font-semibold uppercase tracking-wider">
                  Popular
                </div>
              )}

              {/* Image Area */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${app.color} opacity-50`} />
                {app.type === 'beforeAfter' ? (
                  <BeforeAfterSlider
                    beforeImage={app.beforeImage!}
                    afterImage={app.afterImage!}
                  />
                ) : (
                  <>
                    <Image
                      src={app.imageSrc!}
                      alt={app.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  </>
                )}

                {/* Icon Badge */}
                <div className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                  {app.icon}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[10px] uppercase tracking-[0.2em] text-white/60 font-medium">
                    {app.tag}
                  </span>
                </div>

                <h2 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">
                  {app.title}
                </h2>

                <p className="text-sm text-white/50 flex-1 mb-6 leading-relaxed">
                  {app.description}
                </p>

                <Link
                  href={app.href}
                  className="inline-flex items-center justify-between w-full px-5 py-3 rounded-xl bg-white/10 hover:bg-white hover:text-black transition-all duration-300 group/btn"
                >
                  <span className="font-medium text-sm">Open App</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Bottom CTA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl border border-white/10 bg-white/5">
            <p className="text-white/60">Can&apos;t find what you need?</p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Create from Prompt
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  )
}

function BeforeAfterSlider({ beforeImage, afterImage }: { beforeImage: string; afterImage: string }) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return

    const container = e.currentTarget
    const rect = container.getBoundingClientRect()

    let clientX: number
    if ('touches' in e) {
      clientX = e.touches[0].clientX
    } else {
      clientX = e.clientX
    }

    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  return (
    <div
      className="relative w-full h-full cursor-ew-resize select-none overflow-hidden bg-neutral-900"
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMove}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
      onTouchMove={handleMove}
    >
      {/* After Image (Background) */}
      <img
        src={afterImage}
        alt="After"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt="Before"
          className="absolute inset-0 h-full object-cover"
          style={{ width: `${100 / (sliderPosition / 100)}%`, maxWidth: 'none' }}
        />
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Slider Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="flex items-center gap-0.5">
            <svg className="w-3 h-3 text-black rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-[10px] font-medium uppercase tracking-wider z-10">
        Before
      </div>
      <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-[10px] font-medium uppercase tracking-wider z-10">
        After
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
    </div>
  )
}
