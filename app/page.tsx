'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, Box, Sparkles, ArrowRight, Grid3x3, Home as HomeIcon, Layers } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Floating Grid Lines */}
        <motion.div
          animate={{
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 left-0 w-full h-full opacity-5"
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </motion.div>

        {/* 3D Geometric Shapes */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 right-10 w-64 h-64 opacity-5"
        >
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50,10 L90,30 L90,70 L50,90 L10,70 L10,30 Z" fill="none" stroke="white" strokeWidth="0.5"/>
            <path d="M50,10 L50,50 L10,70" fill="none" stroke="white" strokeWidth="0.5"/>
            <path d="M50,50 L90,70" fill="none" stroke="white" strokeWidth="0.5"/>
            <path d="M50,50 L90,30" fill="none" stroke="white" strokeWidth="0.5"/>
          </svg>
        </motion.div>

        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-40 left-10 w-48 h-48 opacity-5"
        >
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="60" height="60" fill="none" stroke="white" strokeWidth="0.5"/>
            <path d="M20,20 L50,5 L80,20" fill="none" stroke="white" strokeWidth="0.5"/>
            <path d="M80,20 L95,50 L80,80" fill="none" stroke="white" strokeWidth="0.5"/>
            <path d="M50,5 L50,35" fill="none" stroke="white" strokeWidth="0.5"/>
            <path d="M50,35 L80,20" fill="none" stroke="white" strokeWidth="0.5"/>
          </svg>
        </motion.div>

        {/* Blueprint-style Lines */}
        <motion.div
          animate={{
            x: [0, 100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />

        <motion.div
          animate={{
            x: [100, 0, 100],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />

        {/* Floating Architectural Elements */}
        <motion.div
          animate={{
            y: [0, 30, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 right-1/4 w-32 h-32 opacity-10"
        >
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="0.5"/>
            <path d="M50,10 L50,90 M10,50 L90,50" stroke="white" strokeWidth="0.5"/>
          </svg>
        </motion.div>

        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/3 w-40 h-40 opacity-10"
        >
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,15 90,85 10,85" fill="none" stroke="white" strokeWidth="0.5"/>
            <path d="M50,15 L50,85 M25,57.5 L75,57.5" stroke="white" strokeWidth="0.5"/>
          </svg>
        </motion.div>

        {/* Construction Grid Points */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 text-sm rounded-full"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Dəstəkli İnteryer Dizayn</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tight max-w-5xl mx-auto">
              Plan Çertyojlarını{' '}
              <span className="text-white/50">Yaşayış Məkanlarına</span> Çevirin
            </h1>

            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              2D plan çertyojlarını AI gücü ilə heyrətamiz 3D modellərə və fotorealistik interyer dizaynlara çevirin
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex gap-4 justify-center pt-4"
            >
              <a
                href="#apps"
                className="group px-8 py-4 bg-white text-black font-medium text-lg flex items-center gap-2 hover:bg-white/90 transition-all duration-300 hover:shadow-2xl hover:shadow-white/20 rounded-full"
              >
                Yaratmağa Başla
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                href="/dashboard"
                className="px-8 py-4 border border-white/20 font-medium text-lg hover:bg-white/5 transition-all duration-300 rounded-full"
              >
                Nümunələrə Bax
              </Link>
            </motion.div>
          </motion.div>

          {/* Feature Cards Grid */}
          {/* (Previous small feature grid removed for a cleaner hero. The main app cards below now explain the flow.) */}
        </div>
      </section>

      {/* Visual Flow: 2D Plan -> 3D Plan -> Interior */}
      <section className="relative py-24 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 space-y-3"
          >
            <h2 className="text-4xl md:text-5xl font-bold">Plandan Reallığa</h2>
            <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto">
              Layihənizin sadə 2D çertyojdan mebelli 3D interyerə necə çevrildiyini görün.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
            {/* 2D Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full md:w-1/3"
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-white/5">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/photos/furniture plan.png"
                    alt="2D floor plan"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                  />
                </div>
                <div className="flex items-center justify-between px-4 py-3 text-xs md:text-sm">
                  <span className="uppercase tracking-[0.2em] text-white/60">2D PLAN</span>
                  <span className="text-white/40">Çertyoj</span>
                </div>
              </div>
            </motion.div>

            {/* Arrow */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-center"
            >
              <div className="flex md:flex-col items-center gap-2 text-white/40">
                <motion.div
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center bg-white/5"
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
                <span className="text-[10px] md:text-[11px] uppercase tracking-[0.25em]">
                  to
                </span>
              </div>
            </motion.div>

            {/* 3D Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-full md:w-1/3"
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-white/5">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/photos/3d floor plan.png"
                    alt="3D floor plan"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                  />
                </div>
                <div className="flex items-center justify-between px-4 py-3 text-xs md:text-sm">
                  <span className="uppercase tracking-[0.2em] text-white/60">3D MODEL</span>
                  <span className="text-white/40">Həcm</span>
                </div>
              </div>
            </motion.div>

            {/* Arrow */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center"
            >
              <div className="flex md:flex-col items-center gap-2 text-white/40">
                <motion.div
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center bg-white/5"
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
                <span className="text-[10px] md:text-[11px] uppercase tracking-[0.25em]">
                  to
                </span>
              </div>
            </motion.div>

            {/* Interior Render */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full md:w-1/3"
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-white/5">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/photos/interier.png"
                    alt="Interior render"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                  />
                </div>
                <div className="flex items-center justify-between px-4 py-3 text-xs md:text-sm">
                  <span className="uppercase tracking-[0.2em] text-white/60">İNTERYER</span>
                  <span className="text-white/40">Fotorealist</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Card Style */}
      <section id="apps" className="relative py-32 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-20"
          >
            <h2 className="text-5xl font-bold">Məkanınızı Üç Addımda Dəyişdirin</h2>
            <p className="text-xl text-white/60">Plan çertyojundan interyer dizayna AI dəstəkli iş axını</p>
          </motion.div>

          <AppCarousel />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-24 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold">Sadə və şəffaf qiymətlər</h2>
            <p className="text-white/60 text-sm md:text-base">
              Yalnız yaratdığınız şəkillər üçün ödəyin. Gizli ödənişlər yoxdur.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Başlanğıc */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col border border-white/15 rounded-3xl bg-white/5 p-8 space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Başlanğıc</h3>
                <p className="text-white/50 text-sm">İş axınını sınamaq üçün ideal.</p>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold">$15</div>
                <div className="text-xs uppercase tracking-[0.25em] text-white/50">
                  25 şəkil
                </div>
              </div>
              <div className="space-y-2 text-sm text-white/60 flex-1">
                <p>• 25-ə qədər render</p>
                <p>• Bütün tətbiqlərə tam giriş</p>
                <p>• Standart emal sürəti</p>
              </div>
              <button className="mt-4 w-full py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-all duration-300">
                Başlanğıc Seç
              </button>
            </motion.div>

            {/* Pro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="flex flex-col border border-white rounded-3xl bg-white text-black p-8 space-y-6 shadow-2xl shadow-white/10 relative overflow-hidden"
            >
              <div className="absolute inset-x-8 -top-5 flex justify-center">
                <span className="px-4 py-1 rounded-full text-[11px] font-medium tracking-[0.18em] bg-black text-white uppercase">
                  Ən Populyar
                </span>
              </div>
              <div className="space-y-2 pt-4">
                <h3 className="text-xl font-semibold">Pro</h3>
                <p className="text-black/60 text-sm">Dizaynerlər və kiçik studiyalar üçün.</p>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold">$29</div>
                <div className="text-xs uppercase tracking-[0.25em] text-black/60">
                  60 şəkil
                </div>
              </div>
              <div className="space-y-2 text-sm text-black/70 flex-1">
                <p>• 60-a qədər render</p>
                <p>• Prioritet emal</p>
                <p>• Kommersiya istifadəsi</p>
              </div>
              <button className="mt-4 w-full py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-black/90 transition-all duration-300">
                Pro Seç
              </button>
            </motion.div>

            {/* Studiya */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col border border-white/15 rounded-3xl bg-white/5 p-8 space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Studiya</h3>
                <p className="text-white/50 text-sm">Agentliklər və peşəkarlar üçün ən yaxşısı.</p>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold">$49</div>
                <div className="text-xs uppercase tracking-[0.25em] text-white/50">
                  120 şəkil
                </div>
              </div>
              <div className="space-y-2 text-sm text-white/60 flex-1">
                <p>• 120-yə qədər render</p>
                <p>• Ən yüksək prioritet növbə</p>
                <p>• Komanda istifadəsi daxildir</p>
              </div>
              <button className="mt-4 w-full py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-all duration-300">
                Studiya Seç
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center space-y-8 border border-white/20 p-16 rounded-3xl"
        >
          <h2 className="text-5xl font-bold">Məkanınızı Dəyişdirməyə Hazırsınız?</h2>
          <p className="text-xl text-white/60">
            Bu gün plan çertyojlarınızdan gözəl 3D interyer dizaynlar yaratmağa başlayın
          </p>
          <a
            href="#apps"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black font-medium text-lg hover:bg-white/90 transition-all duration-300 hover:shadow-2xl hover:shadow-white/20 rounded-full"
          >
            İndi Başla
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-white/40 text-sm">
          <p>© 2024 Dargah Vision. Bütün hüquqlar qorunur.</p>
        </div>
      </footer>
    </main>
  )
}

type AppCardConfig = {
  tag: string
  title: string
  description: string
  icon: React.ReactNode
  href: string
  imageSrc?: string
}

function AppCarousel() {
  const cards: AppCardConfig[] = [
    {
      tag: 'Memarlıq',
      title: '2D-dən 3D-yə Çevirmə',
      description: 'Plan çertyojlarınızdan memarlıq texniki perspektiv kəsik renderləri yaradın',
      icon: <Box className="w-16 h-16" />,
      href: '/apps/2d-to-3d',
      imageSrc: '/photos/3d floor plan.png',
    },
    {
      tag: 'İnteryer',
      title: 'AI İnteryer Dizayn',
      description: 'Təmiz, minimal üslubla AI dəstəkli interyer dizayn konseptləri yaradın',
      icon: <Sparkles className="w-16 h-16" />,
      href: '/apps/interior-design',
      imageSrc: '/photos/interier.png',
    },
    {
      tag: 'Planlaşdırma',
      title: 'Mebel Planı',
      description: 'Boş plan çertyojları üçün AI yerləşdirməsi ilə mebel düzümləri yaradın',
      icon: <Grid3x3 className="w-16 h-16" />,
      href: '/apps/furniture-plan',
      imageSrc: '/photos/furniture plan.png',
    },
    {
      tag: 'İnteryer',
      title: 'Referans Dizayn',
      description: 'Otağınızı referans şəklin əhval-ruhiyyəsi, materialları və işıqlandırması ilə uyğunlaşdırın',
      icon: <Layers className="w-16 h-16" />,
      href: '/apps/design-room-reference',
      imageSrc: '/photos/ref.png',
    },
  ]

  const [index, setIndex] = useState(0)
  const visible = 3
  const total = cards.length

  const next = () => setIndex((prev) => (prev + 1) % total)
  const prev = () => setIndex((prev) => (prev - 1 + total) % total)

  useEffect(() => {
    if (total <= visible) return
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % total)
    }, 5000)
    return () => clearInterval(id)
  }, [total])

  const visibleCards = Array.from({ length: Math.min(visible, total) }, (_, i) => {
    const idx = (index + i) % total
    return cards[idx]
  })

  return (
    <div className="relative">
      <motion.div
        key={index}
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -60 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="grid md:grid-cols-3 gap-6"
      >
        {visibleCards.map((card, i) => (
          <FeatureAppCard
            key={`${card.title}-${i}`}
            tag={card.tag}
            title={card.title}
            description={card.description}
            icon={card.icon}
            delay={0.1 + i * 0.05}
            href={card.href}
            imageSrc={card.imageSrc}
          />
        ))}
      </motion.div>

      {/* Controls & Indicators */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={prev}
          className="w-10 h-10 rounded-full border border-white/20 hover:bg-white/10 transition-colors flex items-center justify-center"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
        
        {/* Dots */}
        <div className="flex gap-2">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === index ? 'bg-white w-6' : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-10 h-10 rounded-full border border-white/20 hover:bg-white/10 transition-colors flex items-center justify-center"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  delay 
}: { 
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="group p-8 border border-white/10 hover:border-white/30 transition-all duration-500 hover:shadow-xl hover:shadow-white/5 rounded-2xl"
    >
      <div className="w-12 h-12 mb-6 text-white group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-white/60 leading-relaxed">{description}</p>
    </motion.div>
  )
}

function FeatureAppCard({
  tag,
  title,
  description,
  icon,
  delay,
  href,
  imageSrc
}: {
  tag: string
  title: string
  description: string
  icon: React.ReactNode
  delay: number
  href: string
  imageSrc?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="group flex flex-col border border-white/10 hover:border-white/30 transition-all duration-500 overflow-hidden hover:shadow-2xl hover:shadow-white/5 rounded-2xl"
    >
      {/* Large Image Area */}
      <div className="aspect-[4/3] bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center relative overflow-hidden">
        {imageSrc ? (
          <>
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </>
        ) : (
          <>
            <div className="text-white/20 group-hover:scale-110 group-hover:text-white/30 transition-all duration-500">
              {icon}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-1">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-white/10 text-xs font-medium uppercase tracking-wider mb-4 rounded-full">
            {tag}
          </span>
        </div>
        
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-white/60 leading-relaxed mb-6 flex-1">{description}</p>
        
        <Link
          href={href}
          className="group/btn inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium hover:bg-white/90 transition-all duration-300 hover:shadow-lg hover:shadow-white/20 self-start rounded-full"
        >
          <Sparkles className="w-4 h-4" />
          Tətbiqi Aç
        </Link>
      </div>
    </motion.div>
  )
}

