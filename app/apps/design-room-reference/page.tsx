'use client'

import Header from '@/components/Header'
import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image as ImageIcon, Sparkles, ArrowRight, Upload, X, CheckCircle, Download, ZoomIn, Layers, MessageSquare, Wand2, ChevronDown } from 'lucide-react'
import { uploadToSupabase } from '@/lib/supabase'

const API_URL = '/api/design-from-reference'

type ImageState = {
  file: File | null
  localUrl: string | null
  uploadedUrl: string | null
  isUploading: boolean
}

const initialImageState: ImageState = {
  file: null,
  localUrl: null,
  uploadedUrl: null,
  isUploading: false,
}

export default function DesignRoomReferencePage() {
  const [room, setRoom] = useState<ImageState>(initialImageState)
  const [reference, setReference] = useState<ImageState>(initialImageState)
  const [isGenerating, setIsGenerating] = useState(false)
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [userPrompt, setUserPrompt] = useState('')
  const [promptExpanded, setPromptExpanded] = useState(false)

  const handleImageSelect = useCallback(async (
    file: File,
    setter: React.Dispatch<React.SetStateAction<ImageState>>
  ) => {
    // Create local preview
    const localUrl = URL.createObjectURL(file)
    setter({
      file,
      localUrl,
      uploadedUrl: null,
      isUploading: true,
    })

    // Upload to Supabase
    try {
      const uploadedUrl = await uploadToSupabase(file)
      setter(prev => ({
        ...prev,
        uploadedUrl,
        isUploading: false,
      }))
    } catch (err) {
      console.error('Upload error:', err)
      setter(prev => ({
        ...prev,
        isUploading: false,
      }))
      setError('Failed to upload image. Please try again.')
    }
  }, [])

  const handleRoomChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResultImageUrl(null)
      setError(null)
      handleImageSelect(file, setRoom)
    }
  }, [handleImageSelect])

  const handleReferenceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResultImageUrl(null)
      setError(null)
      handleImageSelect(file, setReference)
    }
  }, [handleImageSelect])

  const clearRoom = useCallback(() => {
    if (room.localUrl) URL.revokeObjectURL(room.localUrl)
    setRoom(initialImageState)
    setResultImageUrl(null)
  }, [room.localUrl])

  const clearReference = useCallback(() => {
    if (reference.localUrl) URL.revokeObjectURL(reference.localUrl)
    setReference(initialImageState)
    setResultImageUrl(null)
  }, [reference.localUrl])

  useEffect(() => {
    return () => {
      if (room.localUrl) URL.revokeObjectURL(room.localUrl)
      if (reference.localUrl) URL.revokeObjectURL(reference.localUrl)
    }
  }, [])

  const handleGenerate = async () => {
    if (!room.uploadedUrl || !reference.uploadedUrl) return
    
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomImageUrl: room.uploadedUrl,
          referenceImageUrl: reference.uploadedUrl,
          userPrompt: userPrompt.trim() || undefined,
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
    link.download = `design-reference-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const canGenerate = room.uploadedUrl && reference.uploadedUrl && !room.isUploading && !reference.isUploading

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Header />

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl" />
      </div>

      <main className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-white/60" />
              <span className="text-sm text-white/60">AI Style Transfer</span>
            </motion.div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
                Design From Reference
              </span>
            </h1>
            <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto">
              Transform your room to match the style of any reference image using AI
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Left - Room Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <UploadCard
                title="Your Room"
                subtitle="Upload the room you want to redesign"
                icon={<Layers className="w-5 h-5 text-white/70" />}
                imageState={room}
                onChange={handleRoomChange}
                onClear={clearRoom}
              />
            </motion.div>

            {/* Center - Reference Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <UploadCard
                title="Reference Style"
                subtitle="Upload an inspiration image"
                icon={<ImageIcon className="w-5 h-5 text-white/70" />}
                imageState={reference}
                onChange={handleReferenceChange}
                onClear={clearReference}
              />
            </motion.div>

            {/* Right - Output */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl lg:rounded-3xl p-5 sm:p-6 h-full relative overflow-hidden">
                {/* Success Glow */}
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

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white/70" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">Result</h2>
                    <p className="text-xs text-white/40">AI-generated design</p>
                  </div>
                </div>

                {/* Output Preview */}
                <div className="aspect-[4/3] bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-xl overflow-hidden border border-white/10 flex items-center justify-center mb-4 relative">
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
                            className="w-16 h-16 border-2 border-white/10 rounded-full"
                          />
                          <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-2 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white/60" />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-white/80 text-sm font-medium">Blending styles...</p>
                          <p className="text-white/40 text-xs mt-1">This may take a moment</p>
                        </div>
                      </motion.div>
                    ) : resultImageUrl ? (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full h-full relative group"
                      >
                        <img
                          src={resultImageUrl}
                          alt="Generated design"
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
                        className="flex flex-col items-center gap-3 p-6"
                      >
                        <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center">
                          <Sparkles className="w-7 h-7 text-white/20" />
                        </div>
                        <div className="text-center">
                          <p className="text-white/40 text-sm">Result will appear here</p>
                          <p className="text-white/30 text-xs mt-1">Upload both images to start</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Success Badge */}
                  <AnimatePresence>
                    {showSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                        className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-full"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-xs text-green-400 font-medium">Complete!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Action Buttons */}
                {resultImageUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    <button
                      onClick={handleDownload}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-black font-medium text-sm rounded-xl hover:bg-white/90 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => setIsFullscreen(true)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 border border-white/20 font-medium text-sm rounded-xl hover:bg-white/20 transition-colors"
                    >
                      <ZoomIn className="w-4 h-4" />
                      Full Size
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Prompt Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mt-8 max-w-4xl mx-auto"
          >
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl lg:rounded-3xl p-5 sm:p-6 relative overflow-hidden">
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white flex items-center gap-2">
                      Design Instructions
                      <span className="text-[10px] px-2 py-0.5 bg-violet-500/20 text-violet-400 rounded-full font-medium">
                        Optional
                      </span>
                    </h2>
                    <p className="text-xs text-white/40">Describe your specific design preferences</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPromptExpanded(!promptExpanded)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white/60 transition-colors"
                >
                  <motion.div
                    animate={{ rotate: promptExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </motion.div>
                  {promptExpanded ? 'Collapse' : 'Expand'}
                </motion.button>
              </div>

              <AnimatePresence>
                {promptExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="relative">
                      <textarea
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        placeholder="Describe how you want your room to look... (e.g., 'Add warm lighting, use oak wood furniture, keep the colors neutral with green plants as accent')"
                        className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                      />
                      <div className="absolute bottom-3 right-3 flex items-center gap-2">
                        <span className="text-[10px] text-white/30">{userPrompt.length}/500</span>
                      </div>
                    </div>

                    {/* Quick Prompts */}
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Wand2 className="w-3.5 h-3.5 text-white/40" />
                        <span className="text-xs text-white/40">Quick suggestions</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Modern & minimalist',
                          'Warm & cozy with wood',
                          'Scandinavian style',
                          'Industrial loft',
                          'Luxury & elegant',
                          'Natural & organic',
                          'Bold colors',
                          'Soft lighting',
                        ].map((suggestion) => (
                          <motion.button
                            key={suggestion}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setUserPrompt(prev => prev ? `${prev}, ${suggestion.toLowerCase()}` : suggestion)}
                            className="px-3 py-1.5 bg-white/5 hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/30 rounded-lg text-xs text-white/60 hover:text-violet-300 transition-all"
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Collapsed preview */}
              {!promptExpanded && userPrompt && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 px-3 py-2 bg-violet-500/10 border border-violet-500/20 rounded-lg"
                >
                  <p className="text-xs text-violet-300 line-clamp-1">
                    <span className="text-violet-400/60">Your prompt: </span>
                    {userPrompt}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Generate Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 max-w-md mx-auto"
          >
            <motion.button
              onClick={handleGenerate}
              disabled={!canGenerate || isGenerating}
              whileHover={canGenerate && !isGenerating ? { scale: 1.02 } : undefined}
              whileTap={canGenerate && !isGenerating ? { scale: 0.98 } : undefined}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-white to-white/90 text-black font-semibold rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-white/10"
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  <span>Generating Design...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Design</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>

            <p className="text-center text-xs text-white/30 mt-3">
              Estimated time: 30-60 seconds • Cost: 6 credits
            </p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
              >
                <p className="text-sm text-red-400 text-center">{error}</p>
              </motion.div>
            )}
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto"
          >
            {[
              { title: 'Good Lighting', desc: 'Use well-lit photos for best results' },
              { title: 'Clear Angles', desc: 'Front-facing shots work best' },
              { title: 'Similar Spaces', desc: 'Match room types for better blending' },
            ].map((tip, i) => (
              <div
                key={tip.title}
                className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl"
              >
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 text-white/40 text-sm font-medium">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-medium text-sm">{tip.title}</h3>
                  <p className="text-xs text-white/40">{tip.desc}</p>
                </div>
              </div>
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
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
            
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={resultImageUrl}
              alt="Generated design - Full size"
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2"
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

function UploadCard({
  title,
  subtitle,
  icon,
  imageState,
  onChange,
  onClear,
}: {
  title: string
  subtitle: string
  icon: React.ReactNode
  imageState: ImageState
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
}) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      const input = document.createElement('input')
      input.type = 'file'
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      input.files = dataTransfer.files
      onChange({ target: input } as React.ChangeEvent<HTMLInputElement>)
    }
  }

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl lg:rounded-3xl p-5 sm:p-6 h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h2 className="font-semibold text-white">{title}</h2>
          <p className="text-xs text-white/40">{subtitle}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!imageState.file ? (
          <motion.label
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            className={`block cursor-pointer aspect-[4/3] border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
              isDragging
                ? 'border-white/50 bg-white/10'
                : 'border-white/20 hover:border-white/30 bg-white/[0.02]'
            }`}
          >
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Upload className={`w-6 h-6 transition-colors ${isDragging ? 'text-white' : 'text-white/50'}`} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">{isDragging ? 'Drop here' : 'Drag & drop'}</p>
              <p className="text-xs text-white/40 mt-1">or click to browse</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={onChange}
              className="hidden"
            />
          </motion.label>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative group"
          >
            <div className="aspect-[4/3] bg-white/5 rounded-xl overflow-hidden border border-white/10">
              {imageState.localUrl && (
                <img
                  src={imageState.localUrl}
                  alt={title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Remove Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={onClear}
              className="absolute top-2 right-2 p-2 bg-black/60 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
            >
              <X className="w-4 h-4" />
            </motion.button>

            {/* Status Badge */}
            <div className="absolute bottom-2 left-2">
              {imageState.isUploading ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span className="text-xs text-white/70">Uploading...</span>
                </div>
              ) : imageState.uploadedUrl ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/20 backdrop-blur-sm rounded-full">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">Ready</span>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
