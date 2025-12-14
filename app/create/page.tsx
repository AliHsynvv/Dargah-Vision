'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Wand2, Clock, ArrowRight, Image as ImageIcon, Upload, X, Download, RefreshCw, CheckCircle, Home, Building2, ZoomIn } from 'lucide-react'
import Header from '@/components/Header'

type DesignType = 'interior' | 'exterior'

export default function CreatePage() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [designType, setDesignType] = useState<DesignType>('interior')
  const [error, setError] = useState<string | null>(null)
  const [showZoomModal, setShowZoomModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setError(null)
    setGeneratedImage(null)

    try {
      const response = await fetch('/api/create-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          referenceImage: referenceImage,
          designType: designType
        }),
      })

      if (!response.ok) {
        throw new Error('API error')
      }

      const data = await response.json()

      if (data.success && data.imageUrl) {
        setGeneratedImage(data.imageUrl)
      } else {
        setError(data.error || 'Failed to generate image')
      }
    } catch (err) {
      console.error(err)
      setError('An error occurred while generating the image. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setReferenceImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveReference = () => {
    setReferenceImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDownload = () => {
    if (!generatedImage) return
    const link = document.createElement('a')
    link.href = generatedImage
    link.download = `dargah-${designType}-design-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleNewDesign = () => {
    setGeneratedImage(null)
    setReferenceImage(null)
    setPrompt('')
    setError(null)
  }

  const interiorPresets = [
    'Scandinavian living room with warm oak flooring',
    'Minimal loft with concrete walls',
    'Luxury hotel suite in neutral tones',
    'Open plan modern kitchen',
  ]

  const exteriorPresets = [
    'Modern villa with large glass windows',
    'Minimal garden house with wood facade',
    'Luxury home with pool, night view',
    'Scandinavian style cottage, winter scene',
  ]

  const presets = designType === 'interior' ? interiorPresets : exteriorPresets

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
            <span>AI {designType === 'interior' ? 'Interior' : 'Exterior'} Image Generation</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight max-w-2xl"
          >
            Describe your dream space.{' '}
            <span className="text-white/50">AI will create it.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-sm sm:text-base text-white/60 max-w-2xl"
          >
            Write a short prompt about your ideal {designType === 'interior' ? 'interior' : 'exterior'}. You can also add a reference image.
          </motion.p>
        </section>

        {/* Main grid */}
        <section className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-8">
          {/* Left: Prompt & Reference Image */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Design Type Toggle */}
            <div className="rounded-3xl border border-white/15 bg-white/5 p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-4 h-4 text-white/70" />
                <span className="text-xs sm:text-sm font-medium uppercase tracking-[0.22em] text-white/60">
                  Design Type
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDesignType('interior')}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${designType === 'interior'
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 text-white/70 border-white/15 hover:border-white/30'
                    }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Interior</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDesignType('exterior')}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${designType === 'exterior'
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 text-white/70 border-white/15 hover:border-white/30'
                    }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span className="font-medium">Exterior</span>
                </motion.button>
              </div>
            </div>

            {/* Prompt Section */}
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
                  <span>~15-30 sec</span>
                </div>
              </div>

              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={designType === 'interior'
                    ? "E.g., Bright Scandinavian living room with oak flooring, L-shaped sofa, and hidden LED lighting around the ceiling."
                    : "E.g., Modern villa with large glass windows, white facade, and green garden."
                  }
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
            </div>

            {/* Reference Image Section */}
            <div className="rounded-3xl border border-white/15 bg-white/5 p-4 sm:p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-white/70" />
                <span className="text-xs sm:text-sm font-medium uppercase tracking-[0.22em] text-white/60">
                  Reference Image (Optional)
                </span>
              </div>

              <AnimatePresence mode="wait">
                {!referenceImage ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/20 hover:border-white/40 transition-all duration-300 p-8 text-center cursor-pointer rounded-2xl group"
                  >
                    <Upload className="w-10 h-10 mx-auto mb-3 text-white/40 group-hover:text-white/60 transition-colors" />
                    <p className="text-sm text-white/60 mb-1">Upload an image</p>
                    <p className="text-xs text-white/40">PNG, JPG, WEBP (up to 10MB)</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative rounded-2xl overflow-hidden"
                  >
                    <img
                      src={referenceImage}
                      alt="Reference"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={handleRemoveReference}
                      className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/80 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-xs text-white/80">
                      Reference image
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.webp"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Generate Button */}
            <motion.button
              whileHover={!isGenerating ? { scale: 1.02 } : undefined}
              whileTap={!isGenerating ? { scale: 0.97 } : undefined}
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white text-black text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/90 transition-all duration-300"
            >
              {isGenerating ? (
                <>
                  <motion.span
                    className="inline-block w-5 h-5 rounded-full border-2 border-black border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                  />
                  Generating image…
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate {designType === 'interior' ? 'Interior' : 'Exterior'} Image
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
              >
                <p className="text-sm text-red-400 text-center">{error}</p>
              </motion.div>
            )}
          </motion.div>

          {/* Right: Result */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="rounded-3xl border border-white/15 bg-white/5 p-4 sm:p-6 min-h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-white/70" />
                  <span className="text-xs sm:text-sm font-medium uppercase tracking-[0.22em] text-white/60">
                    Generated Image
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {generatedImage && (
                    <>
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => setShowZoomModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 text-[10px] sm:text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                        Zoom
                      </motion.button>
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={handleDownload}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 text-[10px] sm:text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </motion.button>
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={handleNewDesign}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 text-[10px] sm:text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        New
                      </motion.button>
                    </>
                  )}
                  <span className="text-[10px] sm:text-xs text-white/40">
                    {generatedImage ? 'AI Image v1.0' : 'Waiting for prompt'}
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
                    className="flex flex-col items-center justify-center py-32 gap-6"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="w-24 h-24 border-2 border-white/10 rounded-full"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-2 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        {designType === 'interior' ? (
                          <Home className="w-8 h-8 text-white/60" />
                        ) : (
                          <Building2 className="w-8 h-8 text-white/60" />
                        )}
                      </motion.div>
                    </div>
                    <div className="text-center">
                      <p className="text-white/80 font-medium text-lg">
                        Creating your {designType === 'interior' ? 'interior' : 'exterior'} image
                      </p>
                      <p className="text-white/40 text-sm mt-2">AI is generating a professional {designType === 'interior' ? 'interior' : 'exterior'} design...</p>
                      <p className="text-white/30 text-xs mt-4">This process may take 15-30 seconds</p>
                    </div>
                  </motion.div>
                ) : generatedImage ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div
                      className="relative rounded-2xl overflow-hidden bg-black/20 cursor-zoom-in group"
                      onClick={() => setShowZoomModal(true)}
                    >
                      <img
                        src={generatedImage}
                        alt="Generated design"
                        className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ opacity: 1, scale: 1 }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ZoomIn className="w-12 h-12 text-white/80" />
                        </motion.div>
                      </div>
                      <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-white/80">
                          Generated by AI ({designType === 'interior' ? 'Interior' : 'Exterior'})
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-xs text-white/50 mb-1">Prompt:</p>
                      <p className="text-sm text-white/80">{prompt}</p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-white/40 pt-2">
                      <span>Professional {designType === 'interior' ? 'interior' : 'exterior'} image generated by AI</span>
                      <span>Dargah Vision</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative flex-1 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-white/10 overflow-hidden min-h-[500px]"
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
                      <div className="w-24 h-24 rounded-2xl bg-white/5 flex items-center justify-center">
                        {designType === 'interior' ? (
                          <Home className="w-12 h-12 text-white/20" />
                        ) : (
                          <Building2 className="w-12 h-12 text-white/20" />
                        )}
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-medium text-white/60">Your image will appear here</h3>
                        <p className="text-sm text-white/40 max-w-sm">
                          Describe your dream {designType === 'interior' ? 'interior' : 'exterior'} on the left and AI will create a professional image for you.
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

      {/* Zoom Modal */}
      <AnimatePresence>
        {showZoomModal && generatedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowZoomModal(false)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-[95vw] max-h-[95vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={generatedImage}
                alt="Zoomed design"
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
              <button
                onClick={() => setShowZoomModal(false)}
                className="absolute top-4 right-4 p-3 bg-black/60 hover:bg-black/80 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-sm rounded-full">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white/80">
                    {designType === 'interior' ? 'Interior' : 'Exterior'} Design
                  </span>
                </div>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full font-medium text-sm hover:bg-white/90 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
