'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Upload, Grid3x3, Layers, Sparkles, X } from 'lucide-react'
import Header from '@/components/Header'

export default function FloorplanToFurnished() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      setUploadedFile(file)
    }
  }, [])

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      // Show result
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="pt-28 min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 p-4 sm:p-6 lg:p-12 max-w-[1600px] mx-auto">
        {/* Left Side - Upload Area */}
        <div className="flex flex-col justify-center space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-white/60">
            <Link href="/dashboard" className="hover:text-white transition-colors">Apps</Link>
            <span>/</span>
            <span className="text-white truncate">Empty Floorplan to Furnished</span>
          </div>

          {/* Title */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight uppercase tracking-tight">
              Empty Floorplan to{' '}
              <span className="text-white/50">Furnished</span>
            </h1>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              Transform empty floor plans into fully furnished layouts with CAD furniture blocks
            </p>
          </div>

          {/* Upload Zone */}
          {!uploadedFile ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-white/20 hover:border-white/40 transition-colors duration-300 p-12 text-center group rounded-2xl bg-white/5"
            >
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white/60 group-hover:text-white transition-colors" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">UPLOAD IMAGE OR DRAG & DROP</h3>
              <p className="text-sm text-white/50 mb-6">
                PNG, JPG, JPEG & WEBP (Up To 5MB)
              </p>
              <label className="inline-block px-6 py-2.5 bg-white/10 border border-white/20 text-sm font-medium cursor-pointer hover:bg-white/20 transition-all duration-300 rounded-full">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                Browse Files
              </label>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="border border-white/20 p-6 rounded-2xl bg-white/5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Grid3x3 className="w-5 h-5" />
                      <h3 className="text-base font-semibold truncate">{uploadedFile.name}</h3>
                    </div>
                    <div className="text-sm text-white/60">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="p-2 hover:bg-white/10 transition-colors rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="aspect-video bg-white/5 flex items-center justify-center rounded-lg border border-white/10">
                  <div className="text-white/40 text-sm">Floor Plan Preview</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!uploadedFile || isGenerating}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-white/10 border border-white/20 text-white font-medium text-base hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Image
              </>
            )}
          </button>

          <p className="text-center text-sm text-white/40">
            Your request will cost 4 credits
          </p>
        </div>

        {/* Right Side - Preview/Example */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-lg">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              <div className="aspect-square bg-gradient-to-br from-white/10 to-white/5 rounded-2xl mb-6 flex items-center justify-center overflow-hidden">
                {/* Before/After Preview */}
                <div className="grid grid-cols-2 gap-4 p-6 w-full">
                  <div className="aspect-square bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                    <Grid3x3 className="w-12 h-12 text-white/20" />
                  </div>
                  <div className="aspect-square bg-white/10 rounded-xl flex items-center justify-center border border-white/10 relative">
                    <Layers className="w-12 h-12 text-white/30" />
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <h3 className="text-xl font-bold">Ready to furnish your floor plan</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Upload an empty floor plan to add furniture and show room functions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

