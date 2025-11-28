'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Upload, Sofa, Layers, X, CheckCircle, Download, ZoomIn, Sparkles, ArrowRight, Image as ImageIcon } from 'lucide-react'
import Header from '@/components/Header'
import { uploadToSupabase } from '@/lib/supabase'

const API_URL = '/api/furniture-plan'

const FURNITURE_STYLES = [
  { id: 'modern', label: 'Modern', desc: 'Clean lines, minimal' },
  { id: 'scandinavian', label: 'Scandinavian', desc: 'Light, functional' },
  { id: 'traditional', label: 'Traditional', desc: 'Classic, elegant' },
  { id: 'minimalist', label: 'Minimalist', desc: 'Essential only' },
  { id: 'industrial', label: 'Industrial', desc: 'Raw, urban' },
]

export default function FurniturePlanPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState('modern')

  const handleFileSelect = useCallback(async (file: File) => {
    setUploadedFile(file)
    setResultImageUrl(null)
    setError(null)
    setUploadedUrl(null)

    setIsUploading(true)
    try {
      const url = await uploadToSupabase(file)
      setUploadedUrl(url)
    } catch (err) {
      console.error('Upload error:', err)
      setError('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }, [])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  useEffect(() => {
    if (!uploadedFile) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
      return
    }

    const url = URL.createObjectURL(uploadedFile)
    setPreviewUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [uploadedFile])

  const handleGenerate = async () => {
    if (!uploadedUrl) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          imageUrl: uploadedUrl,
          style: selectedStyle,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.imageUrl) {
        setResultImageUrl(data.imageUrl)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      } else if (data.error) {
        setError(`Error: ${data.error}`)
      } else {
        setError('Unexpected response. Please try again.')
      }
    } catch (err) {
      console.error(err)
      setError('Generation failed. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!resultImageUrl) return
    const link = document.createElement('a')
    link.href = resultImageUrl
    link.download = `furniture-plan-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Header />

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl" />
      </div>

      <main className="relative pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 lg:mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6"
            >
              <Sofa className="w-4 h-4 text-white/60" />
              <span className="text-sm text-white/60">AI Furniture Layout</span>
            </motion.div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
                Furniture Plan Generator
              </span>
            </h1>
            <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto">
              Upload an empty floor plan and let AI create the perfect furniture layout
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            {/* Left Panel - Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl lg:rounded-3xl p-5 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-white/70" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">Empty Floor Plan</h2>
                    <p className="text-xs text-white/40">Upload your 2D floor plan without furniture</p>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {!uploadedFile ? (
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onDrop={handleDrop}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                      onDragLeave={() => setIsDragging(false)}
                      className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all duration-300 ${
                        isDragging 
                          ? 'border-white/50 bg-white/10' 
                          : 'border-white/20 hover:border-white/30 bg-white/[0.02]'
                      }`}
                    >
                      <motion.div
                        animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                        className="mb-4"
                      >
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center mb-4">
                          <Upload className={`w-7 h-7 transition-colors ${isDragging ? 'text-white' : 'text-white/50'}`} />
                        </div>
                      </motion.div>
                      
                      <h3 className="text-lg font-medium mb-2">
                        {isDragging ? 'Drop your file here' : 'Drag & drop your floor plan'}
                      </h3>
                      <p className="text-sm text-white/40 mb-6">
                        or click to browse • PNG, JPG, WEBP up to 5MB
                      </p>
                      
                      <label className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium text-sm rounded-xl cursor-pointer hover:bg-white/90 transition-all duration-300 hover:scale-105 active:scale-95">
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Upload className="w-4 h-4" />
                        Choose File
                      </label>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="space-y-4"
                    >
                      {/* Preview Image */}
                      <div className="relative group">
                        <div className="aspect-[4/3] bg-white/5 rounded-xl overflow-hidden border border-white/10">
                          {previewUrl && (
                            <img
                              src={previewUrl}
                              alt="Floor plan preview"
                              className="w-full h-full object-contain"
                            />
                          )}
                        </div>
                        
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={() => {
                            setUploadedFile(null)
                            setUploadedUrl(null)
                            setResultImageUrl(null)
                          }}
                          className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>

                      {/* File Info */}
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                            <Layers className="w-5 h-5 text-white/60" />
                          </div>
                          <div>
                            <p className="text-sm font-medium truncate max-w-[180px]">{uploadedFile.name}</p>
                            <p className="text-xs text-white/40">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {isUploading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                            />
                          ) : uploadedUrl ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/20 rounded-full"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                              <span className="text-xs text-green-400 font-medium">Ready</span>
                            </motion.div>
                          ) : null}
                        </div>
                      </div>

                      {/* Style Selection */}
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-white/70">Furniture Style</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {FURNITURE_STYLES.map((style) => (
                            <motion.button
                              key={style.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedStyle(style.id)}
                              className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                                selectedStyle === style.id
                                  ? 'bg-white/10 border-white/30'
                                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                              }`}
                            >
                              <p className="text-sm font-medium">{style.label}</p>
                              <p className="text-xs text-white/40">{style.desc}</p>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Generate Button */}
                      <motion.button
                        onClick={handleGenerate}
                        disabled={!uploadedUrl || isGenerating || isUploading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-white to-white/90 text-black font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-white/10"
                      >
                        {isGenerating ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                              <Sparkles className="w-5 h-5" />
                            </motion.div>
                            <span>Generating Furniture Plan...</span>
                          </>
                        ) : (
                          <>
                            <Sofa className="w-5 h-5" />
                            <span>Generate Furniture Plan</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </motion.button>

                      <p className="text-center text-xs text-white/30">
                        Estimated time: 30-60 seconds • Cost: 4 credits
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                  >
                    <p className="text-sm text-red-400 text-center">{error}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Right Panel - Output */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl lg:rounded-3xl p-5 sm:p-6 lg:p-8 relative overflow-hidden">
                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Sofa className="w-5 h-5 text-white/70" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">Furnished Plan</h2>
                    <p className="text-xs text-white/40">AI-generated furniture layout</p>
                  </div>
                </div>

                {/* Output Preview */}
                <div className="relative">
                  <div 
                    className="aspect-[4/3] bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-xl overflow-hidden border border-white/10 flex items-center justify-center"
                  >
                    <AnimatePresence mode="wait">
                      {isGenerating ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center gap-4"
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
                              <Sofa className="w-6 h-6 text-white/60" />
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-white/80 font-medium">Placing furniture...</p>
                            <p className="text-white/40 text-sm mt-1">AI is designing your layout</p>
                          </div>
                        </motion.div>
                      ) : resultImageUrl ? (
                        <motion.div
                          key="result"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-full h-full relative group"
                        >
                          <img
                            src={resultImageUrl}
                            alt="Furnished floor plan"
                            className="w-full h-full object-contain"
                          />
                          
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setIsFullscreen(true)}
                              className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"
                            >
                              <ZoomIn className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={handleDownload}
                              className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"
                            >
                              <Download className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center gap-4 p-8"
                        >
                          <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center">
                            <Sofa className="w-10 h-10 text-white/20" />
                          </div>
                          <div className="text-center">
                            <p className="text-white/40 font-medium">No output yet</p>
                            <p className="text-white/30 text-sm mt-1">Upload a floor plan to start</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence>
                    {showSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                        className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-full"
                      >
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400 font-medium">Plan complete!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Action Buttons */}
                {resultImageUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-2 gap-3 mt-6"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDownload}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsFullscreen(true)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-white/20 font-medium rounded-xl hover:bg-white/20 transition-colors"
                    >
                      <ZoomIn className="w-4 h-4" />
                      <span>Full Size</span>
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[
              { icon: Sparkles, title: 'Smart Placement', desc: 'AI optimizes furniture positions' },
              { icon: Layers, title: 'Room Detection', desc: 'Identifies room types automatically' },
              { icon: Sofa, title: 'Style Options', desc: 'Multiple furniture styles available' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl"
              >
                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-white/50" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{feature.title}</h3>
                  <p className="text-xs text-white/40">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && resultImageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
            
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              src={resultImageUrl}
              alt="Furnished floor plan - Full size"
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDownload()
                }}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Image
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

