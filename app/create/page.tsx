'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Wand2, Clock, ArrowRight, LayoutTemplate, Palette, Lightbulb, Sofa, Layers, CheckCircle, Copy, X } from 'lucide-react'
import Header from '@/components/Header'

interface DesignConcept {
  title: string
  subtitle: string
  description: string
  style: string
  colorPalette: {
    primary: string
    secondary: string
    accent: string
    neutral: string
  }
  materials: string[]
  furniture: string[]
  lighting: {
    natural: string
    artificial: string
    ambient: string
  }
  zones: string[]
  focalPoints: string[]
  mood: string
  tags: string[]
  tips: string[]
}

export default function CreatePage() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [concept, setConcept] = useState<DesignConcept | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showFullConcept, setShowFullConcept] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/create-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      if (!response.ok) {
        throw new Error('API xətası')
      }

      const data = await response.json()

      if (data.success && data.concept) {
        setConcept(data.concept)
      } else {
        setError(data.error || 'Gözlənilməz xəta baş verdi')
      }
    } catch (err) {
      console.error(err)
      setError('Dizayn yaradılarkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    if (!concept) return
    const text = JSON.stringify(concept, null, 2)
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const presets = [
    'İsti palıd döşəmə ilə İskandinav 2 otaqlı mənzil',
    'Tavandan döşəməyə pəncərələri olan minimal beton loft',
    'Dolayı işıqlandırmalı neytral tonlarda lüks otel süiti',
    'Ada və yemək guşəsi olan açıq planlı mətbəx + qonaq otağı',
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <section className="mb-12 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 text-xs text-white/60"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI düzüm və interyer yaratma</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight max-w-2xl"
          >
            Xəyal etdiyiniz məkanı təsvir edin.{' '}
            <span className="text-white/50">Biz sizin üçün dizayn edirik.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-sm sm:text-base text-white/60 max-w-2xl"
          >
            İdeal interyeriniz və ya düzümünüz haqqında qısa bir prompt yazın. AI peşəkar dizayn konsepti yaradacaq.
          </motion.p>
        </section>

        {/* Main grid */}
        <section className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-8">
          {/* Left: Prompt */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="rounded-3xl border border-white/15 bg-white/5 p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-white/70" />
                  <span className="text-xs sm:text-sm font-medium uppercase tracking-[0.22em] text-white/60">
                    Prompt
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] sm:text-xs text-white/40">
                  <Clock className="w-3.5 h-3.5" />
                  <span>~10-15 san</span>
                </div>
              </div>

              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Məs: Palıd döşəmə, L formalı divan və tavanın ətrafında gizli LED işıqlandırma ilə parlaq İskandinav qonaq otağı."
                  className="w-full min-h-[140px] max-h-[260px] bg-black/40 border border-white/15 focus:border-white/40 transition-colors rounded-2xl px-4 py-3 text-sm sm:text-base resize-vertical outline-none"
                />
                <div className="absolute bottom-3 right-4 text-[10px] sm:text-xs text-white/40">
                  {prompt.length}/500
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPrompt(p)}
                    className="px-3 py-1.5 rounded-full border border-white/15 text-[11px] sm:text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between gap-4 pt-1">
                <div className="hidden sm:flex flex-col text-[10px] text-white/40">
                  <span>İpucu: Əhval-ruhiyyə, materiallar, işıqlandırma və əsas mebel parçalarını qeyd edin.</span>
                </div>
                <motion.button
                  whileHover={!isGenerating ? { scale: 1.02 } : undefined}
                  whileTap={!isGenerating ? { scale: 0.97 } : undefined}
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full bg-white text-black text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/90 transition-all duration-300"
                >
                  {isGenerating ? (
                    <>
                      <motion.span
                        className="inline-block w-4 h-4 rounded-full border-2 border-black border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                      />
                      Yaradılır…
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Dizayn yarat
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                >
                  <p className="text-sm text-red-400 text-center">{error}</p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right: Result */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="rounded-3xl border border-white/15 bg-white/5 p-4 sm:p-6 min-h-[500px]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4 text-white/70" />
                  <span className="text-xs sm:text-sm font-medium uppercase tracking-[0.22em] text-white/60">
                    Dizayn Konsepti
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {concept && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 text-[10px] sm:text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Kopyalandı!' : 'Kopyala'}
                    </motion.button>
                  )}
                  <span className="text-[10px] sm:text-xs text-white/40">
                    {concept ? 'AI Konsept v1.0' : 'Prompt gözlənilir'}
                  </span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-20 gap-6"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="w-20 h-20 border-2 border-white/10 rounded-full"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-2 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white/60" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-white/80 font-medium">Dizayn konseptiniz yaradılır</p>
                      <p className="text-white/40 text-sm mt-1">AI peşəkar təkliflər hazırlayır...</p>
                    </div>
                  </motion.div>
                ) : concept ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Title & Style */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-white/10 text-[10px] uppercase tracking-wider text-white/60">
                          {concept.style}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-white/10 text-[10px] uppercase tracking-wider text-white/60">
                          {concept.mood}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-semibold">{concept.title}</h2>
                      <p className="text-sm text-white/60">{concept.subtitle}</p>
                    </div>

                    {/* Description */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-sm text-white/70 leading-relaxed">{concept.description}</p>
                    </div>

                    {/* Color Palette */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-white/60" />
                        <span className="text-xs font-medium uppercase tracking-wider text-white/60">Rəng Palitrası</span>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        {Object.entries(concept.colorPalette).map(([name, color]) => (
                          <div key={name} className="space-y-1.5">
                            <div
                              className="h-12 rounded-xl border border-white/10"
                              style={{ backgroundColor: color.includes('#') ? color.split(' ').pop() : '#666' }}
                            />
                            <p className="text-[10px] text-white/50 text-center capitalize">{name === 'primary' ? 'Əsas' : name === 'secondary' ? 'İkinci' : name === 'accent' ? 'Vurğu' : 'Neytral'}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Materials & Furniture Grid */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Materials */}
                      <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-white/60" />
                          <span className="text-xs font-medium uppercase tracking-wider text-white/60">Materiallar</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {concept.materials.map((material, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-full bg-white/10 text-xs text-white/70">
                              {material}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Zones */}
                      <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2">
                          <LayoutTemplate className="w-4 h-4 text-white/60" />
                          <span className="text-xs font-medium uppercase tracking-wider text-white/60">Zonalar</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {concept.zones.map((zone, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-full bg-white/10 text-xs text-white/70">
                              {zone}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Furniture */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Sofa className="w-4 h-4 text-white/60" />
                        <span className="text-xs font-medium uppercase tracking-wider text-white/60">Mebel</span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {concept.furniture.map((item, i) => (
                          <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                            <CheckCircle className="w-4 h-4 text-green-400/60 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-white/70">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Lighting */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-white/60" />
                        <span className="text-xs font-medium uppercase tracking-wider text-white/60">İşıqlandırma</span>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-[10px] text-white/40 mb-1">Təbii</p>
                          <p className="text-xs text-white/70">{concept.lighting.natural}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-[10px] text-white/40 mb-1">Süni</p>
                          <p className="text-xs text-white/70">{concept.lighting.artificial}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-[10px] text-white/40 mb-1">Ambient</p>
                          <p className="text-xs text-white/70">{concept.lighting.ambient}</p>
                        </div>
                      </div>
                    </div>

                    {/* Tips */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Wand2 className="w-4 h-4 text-white/60" />
                        <span className="text-xs font-medium uppercase tracking-wider text-white/60">Peşəkar Məsləhətlər</span>
                      </div>
                      <div className="space-y-2">
                        {concept.tips.map((tip, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-white/5 to-transparent border border-white/10">
                            <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-medium flex-shrink-0">
                              {i + 1}
                            </span>
                            <span className="text-xs text-white/70">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                      {concept.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 rounded-full border border-white/15 text-[10px] text-white/50">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-white/40 pt-2">
                      <span>AI tərəfindən yaradılmış peşəkar dizayn konsepti</span>
                      <span>Dargah Vision</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative flex-1 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-white/10 overflow-hidden min-h-[400px]"
                  >
                    {/* Animated background grid */}
                    <motion.div
                      className="absolute inset-0 opacity-10"
                      animate={{ x: ['0%', '10%', '0%'] }}
                      transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <svg width="100%" height="100%">
                        <defs>
                          <pattern id="preview-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path
                              d="M 40 0 L 0 0 0 40"
                              fill="none"
                              stroke="white"
                              strokeWidth="0.5"
                              strokeOpacity="0.5"
                            />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#preview-grid)" />
                      </svg>
                    </motion.div>

                    <div className="relative h-full flex flex-col justify-center items-center p-8 gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-white/20" />
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-lg font-medium text-white/60">Konseptiniz burada görünəcək</h3>
                        <p className="text-sm text-white/40 max-w-sm">
                          Solda xəyal etdiyiniz məkanı təsvir edin və AI sizin üçün peşəkar dizayn konsepti yaradacaq.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  )
}
