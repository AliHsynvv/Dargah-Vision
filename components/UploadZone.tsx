'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, File } from 'lucide-react'

interface UploadZoneProps {
  onFileSelect: (file: File) => void
  acceptedFormats?: string[]
  maxSize?: number // in MB
  className?: string
}

export default function UploadZone({
  onFileSelect,
  acceptedFormats = ['PNG', 'JPG', 'JPEG', 'WEBP'],
  maxSize = 5,
  className = ''
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }

    // Check file type
    const fileExtension = file.name.split('.').pop()?.toUpperCase()
    if (!fileExtension || !acceptedFormats.includes(fileExtension)) {
      return `Only ${acceptedFormats.join(', ')} files are accepted`
    }

    return null
  }

  const handleFile = (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      setTimeout(() => setError(null), 3000)
      return
    }

    setSelectedFile(file)
    onFileSelect(file)
    setError(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleRemove = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed transition-all duration-300 p-12 text-center cursor-pointer group ${
              isDragging
                ? 'border-white bg-white/5'
                : error
                ? 'border-red-500/50 bg-red-500/5'
                : 'border-white/20 hover:border-white/40'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="mb-6">
              <Upload className={`w-16 h-16 mx-auto transition-colors ${
                isDragging ? 'text-white' : 'text-white/40 group-hover:text-white/60'
              }`} />
            </div>

            <h3 className="text-xl font-semibold mb-2">
              {isDragging ? 'Drop your file here' : 'Upload Floor Plan'}
            </h3>

            <p className="text-white/60 mb-4">
              Drag and drop your floor plan or click to browse
            </p>

            <p className="text-sm text-white/40">
              {acceptedFormats.join(', ')} (Up to {maxSize}MB)
            </p>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-4"
              >
                {error}
              </motion.p>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedFormats.map(f => `.${f.toLowerCase()}`).join(',')}
              onChange={handleFileInput}
              className="hidden"
            />
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="border border-white/20 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/5 flex items-center justify-center">
                <File className="w-6 h-6 text-white/60" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold mb-1 truncate">{selectedFile.name}</h4>
                <p className="text-sm text-white/60">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <button
                onClick={handleRemove}
                className="flex-shrink-0 p-2 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview */}
            <div className="mt-4 aspect-video bg-white/5 flex items-center justify-center border border-white/10">
              <span className="text-white/40 text-sm">Preview</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

