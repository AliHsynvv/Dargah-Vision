'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, Box, Home as HomeIcon, Layers, Grid3x3, Play, Star, Users, Zap, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'

// Flip Card Component
function FlipCard({
  frontImage,
  frontTitle,
  frontSubtitle,
  backTitle,
  backDescription,
  backHref,
  delay = 0,
}: {
  frontImage: string
  frontTitle: string
  frontSubtitle: string
  backTitle: string
  backDescription: string
  backHref: string
  delay?: number
}) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="relative h-[450px] perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        className="relative w-full h-full preserve-3d cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Side */}
        <div
          className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden border border-white/10"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="relative w-full h-full">
            <Image
              src={frontImage}
              alt={frontTitle}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-2">{frontSubtitle}</p>
              <h3 className="text-2xl font-bold text-white">{frontTitle}</h3>
            </div>
            <div className="absolute top-4 right-4">
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
              >
                <Play className="w-4 h-4 text-white fill-white" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div
          className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden border border-white/20 bg-gradient-to-br from-white/10 to-white/5"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="relative w-full h-full p-8 flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{backTitle}</h3>
              <p className="text-white/60 leading-relaxed">{backDescription}</p>
            </div>
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all self-start group"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Stats Counter with counting animation
function StatCounter({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          // Animate count from 0 to value
          const duration = 2000 // 2 seconds
          const steps = 60
          const increment = value / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= value) {
              setCount(value)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value, hasAnimated])

  return (
    <div className="text-center" ref={ref}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="text-5xl md:text-6xl font-bold text-white mb-2"
      >
        {count}{suffix}
      </motion.div>
      <p className="text-white/50 text-sm uppercase tracking-[0.2em]">{label}</p>
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <Header />

      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
        <motion.div
          animate={{ opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/20 bg-white/5"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm text-white/70">AI-Powered Design Platform</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
                Transform Your{' '}
                <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                    Spaces
                  </span>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="absolute bottom-2 left-0 right-0 h-3 bg-white/10 -z-0 origin-left"
                  />
                </span>{' '}
                Into Reality
              </h1>

              <p className="text-xl text-white/50 max-w-lg leading-relaxed">
                Create photorealistic 3D models and professional interior designs from 2D floor plans. With just one click.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/create"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-full hover:shadow-2xl hover:shadow-white/20 transition-all duration-300"
                >
                  <Sparkles className="w-5 h-5" />
                  Start Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 font-medium rounded-full hover:bg-white/5 transition-all duration-300"
                >
                  <Play className="w-5 h-5" />
                  How It Works
                </a>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 border-2 border-black flex items-center justify-center text-xs font-medium"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-white/50">1000+ satisfied users</p>
                </div>
              </div>
            </motion.div>

            {/* Right - Hero Image Stack */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[500px] hidden lg:block"
            >
              {/* Stacked Images */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-0 right-0 w-[320px] h-[240px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
              >
                <Image
                  src="/photos/interier.png"
                  alt="Interior Design"
                  fill
                  className="object-cover"
                />
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-32 left-0 w-[280px] h-[200px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
              >
                <Image
                  src="/photos/3d floor plan.png"
                  alt="3D Floor Plan"
                  fill
                  className="object-cover"
                />
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-0 right-12 w-[300px] h-[220px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
              >
                <Image
                  src="/photos/home1.png"
                  alt="Home Design"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20"
              >
                <span className="text-sm font-medium">✨ AI Powered</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-6 border-y border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter value={10} suffix="K+" label="Images Created" />
            <StatCounter value={98} suffix="%" label="Satisfaction" />
            <StatCounter value={50} suffix="+" label="Design Styles" />
            <StatCounter value={24} suffix="/7" label="Support" />
          </div>
        </div>
      </section>

      {/* Flip Cards Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60">
              Features
            </span>
            <h2 className="text-4xl md:text-6xl font-bold">
              Everything in One Platform
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Hover over the cards to discover our powerful features
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FlipCard
              frontImage="/photos/3d floor plan.png"
              frontTitle="2D to 3D"
              frontSubtitle="Architecture"
              backTitle="3D Conversion"
              backDescription="Convert your floor plans into professional 3D models in seconds. Get volumetric visualization."
              backHref="/apps/2d-to-3d"
              delay={0}
            />
            <FlipCard
              frontImage="/photos/interier.png"
              frontTitle="AI Interior"
              frontSubtitle="Design"
              backTitle="Interior Design"
              backDescription="Create photorealistic interior designs with AI power. 50+ style options available."
              backHref="/apps/interior-design"
              delay={0.1}
            />
            <FlipCard
              frontImage="/photos/furniture plan.png"
              frontTitle="Furniture Plan"
              frontSubtitle="Planning"
              backTitle="Smart Placement"
              backDescription="AI automatically calculates optimal furniture placement for your room."
              backHref="/apps/furniture-plan"
              delay={0.2}
            />
            <FlipCard
              frontImage="/photos/home1.png"
              frontTitle="Exterior"
              frontSubtitle="Outdoor View"
              backTitle="Exterior Design"
              backDescription="Design the exterior of your building. Facade, garden, and landscape."
              backHref="/create"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative py-32 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20 space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold">How It Works?</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Get professional results in just 3 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Upload',
                description: 'Upload your floor plan or reference image',
                icon: <Box className="w-8 h-8" />,
              },
              {
                step: '02',
                title: 'Customize',
                description: 'Select your style, colors, and materials',
                icon: <Layers className="w-8 h-8" />,
              },
              {
                step: '03',
                title: 'Generate',
                description: 'AI creates professional results in seconds',
                icon: <Sparkles className="w-8 h-8" />,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                <div className="p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300">
                  <div className="text-6xl font-bold text-white/10 absolute top-4 right-6">
                    {item.step}
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-white/50">{item.description}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="w-8 h-8 text-white/20" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-[40px] blur-xl" />
          <div className="relative p-12 md:p-20 rounded-[40px] border border-white/20 bg-black/50 backdrop-blur-xl text-center space-y-8">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 mx-auto rounded-full border border-white/20 flex items-center justify-center"
            >
              <Sparkles className="w-10 h-10" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Start Designing?
            </h2>
            <p className="text-xl text-white/50 max-w-lg mx-auto">
              Start free today and transform your spaces with AI power
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/create"
                className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-semibold text-lg rounded-full hover:shadow-2xl hover:shadow-white/30 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5" />
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Dargah Vision</h3>
              <p className="text-white/50 text-sm">
                AI-powered interior and architectural design platform
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold uppercase tracking-wider text-sm text-white/60">Product</h4>
              <div className="space-y-2">
                <Link href="/create" className="block text-white/50 hover:text-white transition-colors">Create Design</Link>
                <Link href="/apps/interior-design" className="block text-white/50 hover:text-white transition-colors">Interior Design</Link>
                <Link href="/apps/2d-to-3d" className="block text-white/50 hover:text-white transition-colors">3D Conversion</Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold uppercase tracking-wider text-sm text-white/60">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-white/50 hover:text-white transition-colors">About</a>
                <a href="#" className="block text-white/50 hover:text-white transition-colors">Careers</a>
                <a href="#" className="block text-white/50 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold uppercase tracking-wider text-sm text-white/60">Legal</h4>
              <div className="space-y-2">
                <a href="#" className="block text-white/50 hover:text-white transition-colors">Privacy</a>
                <a href="#" className="block text-white/50 hover:text-white transition-colors">Terms</a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/40 text-sm">
            <p>© 2024 Dargah Vision. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Custom Styles for 3D Transform */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </main>
  )
}
