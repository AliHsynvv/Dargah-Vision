'use client'

import Header from '@/components/Header'
import Link from 'next/link'
import { Box, Sparkles, Grid3x3 } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'

const apps = [
  {
    tag: 'Memarlıq',
    title: '2D-dən 3D-yə Çevirmə',
    description:
      'Plan çertyojlarınızdan memarlıq texniki perspektiv kəsik renderləri yaradın.',
    href: '/apps/2d-to-3d',
    imageSrc: '/photos/3d floor plan.png',
    type: 'single',
  },
  {
    tag: 'İnteryer',
    title: 'AI İnteryer Dizayn',
    description: 'Təmiz, minimal üslubla AI dəstəkli interyer dizayn konseptləri yaradın.',
    href: '/apps/interior-design',
    imageSrc: '/photos/interier.png',
    type: 'single',
  },
  {
    tag: 'Planlaşdırma',
    title: 'Mebel Planı',
    description: 'Boş plan çertyojları üçün AI yerləşdirməsi ilə mebel düzümləri yaradın.',
    href: '/apps/furniture-plan',
    imageSrc: '/photos/furniture plan.png',
    type: 'single',
  },
  {
    tag: 'Planlaşdırma',
    title: 'Elektrik Planı',
    description: 'Prizlər, açarlar və işıqlandırma mövqeləri ilə elektrik sxemləri yaradın.',
    href: '/apps/electric-plan',
    imageSrc: '/photos/home1.png',
    type: 'single',
  },
  {
    tag: 'İnteryer',
    title: 'Referans Dizayn',
    description: 'Otağınızı referans şəklin əhval-ruhiyyəsi, materialları və işıqlandırması ilə uyğunlaşdırın.',
    href: '/apps/design-room-reference',
    beforeImage: '/photos/eroom.png',
    afterImage: '/photos/ref.png',
    type: 'beforeAfter',
  },
]

export default function AppsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-28 pb-20 px-6 max-w-6xl mx-auto">
        <section className="mb-12 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 text-xs text-white/60"
          >
            <Grid3x3 className="w-3.5 h-3.5" />
            <span>Tətbiqlər</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight"
          >
            Başlamaq istədiyiniz iş sahəsini seçin.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm sm:text-base text-white/60 max-w-2xl"
          >
            Plan çertyojlarını çevirin, interyer istiqamətlərini araşdırın və ya mebel diaqramları yaradın - hamısı bir yerdə.
          </motion.p>
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app, idx) => (
            <motion.div
              key={app.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="group flex flex-col border border-white/10 hover:border-white/30 rounded-3xl overflow-hidden bg-white/5 hover:bg-white/10 transition-all duration-500"
            >
              <div className="relative aspect-[4/3] p-4">
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white/5">
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
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                    </>
                  )}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[11px] uppercase tracking-[0.22em] text-white/60">
                    {app.tag}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold mb-2">{app.title}</h2>
                <p className="text-sm text-white/60 flex-1 mb-4">{app.description}</p>
                <Link
                  href={app.href}
                  className="inline-flex items-center gap-2 text-sm font-medium mt-auto group-hover:translate-x-1 transition-transform"
                >
                  <Sparkles className="w-4 h-4" />
                  Tətbiqi Aç
                  <Box className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </section>
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
      className="relative w-full h-full cursor-ew-resize select-none overflow-hidden bg-neutral-900 rounded-2xl"
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
        className="absolute inset-0 w-full h-full object-contain"
      />
      
      {/* Before Image (Clipped) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt="Before"
          className="absolute inset-0 h-full object-contain"
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
        Əvvəl
      </div>
      <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-[10px] font-medium uppercase tracking-wider z-10">
        Sonra
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
    </div>
  )
}
