'use client'

import Header from '@/components/Header'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  ArrowRight,
  Download,
  ZoomIn,
  X,
  Ruler,
  Home,
  DoorOpen,
  Square,
  Bed,
  Sofa,
  UtensilsCrossed,
  Bath,
  Briefcase,
  Baby,
  Dumbbell,
  Car,
  TreePine,
  CheckCircle,
  Plus,
  Minus
} from 'lucide-react'

const API_URL = '/api/create-2d-plan'

type RoomType = {
  id: string
  name: string
  nameAz: string
  icon: React.ReactNode
  defaultWidth: number
  defaultHeight: number
}

const roomTypes: RoomType[] = [
  { id: 'bedroom', name: 'Bedroom', nameAz: 'Yataq Otağı', icon: <Bed className="w-5 h-5" />, defaultWidth: 4, defaultHeight: 4 },
  { id: 'living', name: 'Living Room', nameAz: 'Qonaq Otağı', icon: <Sofa className="w-5 h-5" />, defaultWidth: 5, defaultHeight: 6 },
  { id: 'kitchen', name: 'Kitchen', nameAz: 'Mətbəx', icon: <UtensilsCrossed className="w-5 h-5" />, defaultWidth: 3.5, defaultHeight: 4 },
  { id: 'bathroom', name: 'Bathroom', nameAz: 'Hamam', icon: <Bath className="w-5 h-5" />, defaultWidth: 2.5, defaultHeight: 3 },
  { id: 'office', name: 'Home Office', nameAz: 'Ev Ofisi', icon: <Briefcase className="w-5 h-5" />, defaultWidth: 3, defaultHeight: 3.5 },
  { id: 'kids', name: 'Kids Room', nameAz: 'Uşaq Otağı', icon: <Baby className="w-5 h-5" />, defaultWidth: 3.5, defaultHeight: 4 },
  { id: 'gym', name: 'Home Gym', nameAz: 'İdman Otağı', icon: <Dumbbell className="w-5 h-5" />, defaultWidth: 4, defaultHeight: 5 },
  { id: 'garage', name: 'Garage', nameAz: 'Qaraj', icon: <Car className="w-5 h-5" />, defaultWidth: 6, defaultHeight: 6 },
  { id: 'garden', name: 'Garden/Terrace', nameAz: 'Bağ/Terras', icon: <TreePine className="w-5 h-5" />, defaultWidth: 5, defaultHeight: 8 },
  { id: 'custom', name: 'Custom Room', nameAz: 'Xüsusi Otaq', icon: <Square className="w-5 h-5" />, defaultWidth: 4, defaultHeight: 4 },
]

const styleOptions = [
  { id: 'modern', name: 'Modern', nameAz: 'Müasir' },
  { id: 'minimalist', name: 'Minimalist', nameAz: 'Minimalist' },
  { id: 'classic', name: 'Classic', nameAz: 'Klassik' },
  { id: 'scandinavian', name: 'Scandinavian', nameAz: 'Skandinav' },
  { id: 'industrial', name: 'Industrial', nameAz: 'Sənaye' },
  { id: 'luxury', name: 'Luxury', nameAz: 'Lüks' },
]

export default function TwoDPlanCreatorPage() {
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null)
  const [width, setWidth] = useState<number>(4)
  const [height, setHeight] = useState<number>(4)
  const [doors, setDoors] = useState<number>(1)
  const [windows, setWindows] = useState<number>(1)
  const [selectedStyle, setSelectedStyle] = useState<string>('modern')
  const [additionalNotes, setAdditionalNotes] = useState<string>('')

  const [isGenerating, setIsGenerating] = useState(false)
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleRoomSelect = (room: RoomType) => {
    setSelectedRoom(room)
    setWidth(room.defaultWidth)
    setHeight(room.defaultHeight)
    setResultImageUrl(null)
    setError(null)
  }

  const handleGenerate = async () => {
    if (!selectedRoom) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomType: selectedRoom.id,
          roomName: selectedRoom.name,
          width,
          height,
          doors,
          windows,
          style: selectedStyle,
          additionalNotes: additionalNotes.trim() || undefined,
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
    link.download = `2d-plan-${selectedRoom?.id}-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const canGenerate = selectedRoom && width > 0 && height > 0

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Header />

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/[0.03] rounded-full blur-3xl" />
      </div>

      <main className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6"
            >
              <Ruler className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400">AI Plan Generator</span>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
                2D Plan Yaradıcı
              </span>
            </h1>
            <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto">
              Ölçüləri daxil edin, otaq tipini seçin və AI sizin üçün professional 2D plan yaratsın
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Configuration */}
            <div className="space-y-6">
              {/* Room Type Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl lg:rounded-3xl p-5 sm:p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Home className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">Otaq Tipi</h2>
                    <p className="text-xs text-white/40">Plan yaradılacaq otağı seçin</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {roomTypes.map((room) => (
                    <motion.button
                      key={room.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRoomSelect(room)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${selectedRoom?.id === room.id
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20'
                        }`}
                    >
                      {room.icon}
                      <span className="text-[10px] font-medium text-center leading-tight">{room.nameAz}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Dimensions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl lg:rounded-3xl p-5 sm:p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                    <Ruler className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">Ölçülər</h2>
                    <p className="text-xs text-white/40">Otağın en və uzunluğu (metr)</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-2">En (m)</label>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setWidth(Math.max(1, width - 0.5))}
                        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </motion.button>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(Math.max(1, parseFloat(e.target.value) || 1))}
                        step="0.5"
                        min="1"
                        max="20"
                        className="flex-1 h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-center text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setWidth(Math.min(20, width + 0.5))}
                        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-white/50 mb-2">Uzunluq (m)</label>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setHeight(Math.max(1, height - 0.5))}
                        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </motion.button>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(Math.max(1, parseFloat(e.target.value) || 1))}
                        step="0.5"
                        min="1"
                        max="20"
                        className="flex-1 h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-center text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setHeight(Math.min(20, height + 0.5))}
                        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Area Display */}
                <div className="mt-4 p-3 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Ümumi Sahə:</span>
                    <span className="text-lg font-semibold text-cyan-400">{(width * height).toFixed(1)} m²</span>
                  </div>
                </div>
              </motion.div>

              {/* Doors & Windows */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl lg:rounded-3xl p-5 sm:p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                    <DoorOpen className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">Qapılar və Pəncərələr</h2>
                    <p className="text-xs text-white/40">Otaqdakı qapı və pəncərə sayı</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-2">Qapı sayı</label>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDoors(Math.max(0, doors - 1))}
                        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </motion.button>
                      <div className="flex-1 h-10 px-3 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white font-medium">
                        {doors}
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDoors(Math.min(5, doors + 1))}
                        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-white/50 mb-2">Pəncərə sayı</label>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setWindows(Math.max(0, windows - 1))}
                        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </motion.button>
                      <div className="flex-1 h-10 px-3 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white font-medium">
                        {windows}
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setWindows(Math.min(6, windows + 1))}
                        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Style Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl lg:rounded-3xl p-5 sm:p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">Dizayn Stili</h2>
                    <p className="text-xs text-white/40">Plan üçün ümumi stil</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {styleOptions.map((style) => (
                    <motion.button
                      key={style.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${selectedStyle === style.id
                          ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                        }`}
                    >
                      {style.nameAz}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Additional Notes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl lg:rounded-3xl p-5 sm:p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="font-semibold text-white text-sm">Əlavə Qeydlər</h2>
                  <span className="text-[10px] px-2 py-0.5 bg-white/10 text-white/40 rounded-full">Opsional</span>
                </div>
                <textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Xüsusi istəklərinizi yazın... (məsələn: 'Böyük dolap lazımdır', 'Pəncərə cənub tərəfdə olsun')"
                  className="w-full h-20 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </motion.div>
            </div>

            {/* Right Side - Preview & Result */}
            <div className="space-y-6">
              {/* Live Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl lg:rounded-3xl p-5 sm:p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Square className="w-5 h-5 text-white/70" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">Canlı Önizləmə</h2>
                    <p className="text-xs text-white/40">Seçdiyiniz parametrlər</p>
                  </div>
                </div>

                <div className="aspect-square bg-gradient-to-br from-white/[0.02] to-white/[0.05] rounded-xl border border-white/10 flex items-center justify-center p-6 relative overflow-hidden">
                  {/* Grid Background */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full" style={{
                      backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                      backgroundSize: '20px 20px'
                    }} />
                  </div>

                  {selectedRoom ? (
                    <div className="relative flex flex-col items-center gap-4">
                      {/* Room Shape Preview */}
                      <div
                        className="border-2 border-dashed border-emerald-500/50 bg-emerald-500/10 rounded-lg flex items-center justify-center transition-all duration-300"
                        style={{
                          width: `${Math.min(200, width * 30)}px`,
                          height: `${Math.min(200, height * 30)}px`,
                        }}
                      >
                        <div className="text-center">
                          <div className="text-emerald-400 mb-1">{selectedRoom.icon}</div>
                          <p className="text-xs text-white/60">{selectedRoom.nameAz}</p>
                        </div>
                      </div>

                      {/* Dimension Labels */}
                      <div className="flex items-center gap-4 text-xs text-white/50">
                        <span>{width}m × {height}m</span>
                        <span className="text-emerald-400">{(width * height).toFixed(1)} m²</span>
                      </div>

                      {/* Features */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 rounded text-amber-400 text-xs">
                          <DoorOpen className="w-3 h-3" />
                          <span>{doors} qapı</span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-cyan-500/20 rounded text-cyan-400 text-xs">
                          <Square className="w-3 h-3" />
                          <span>{windows} pəncərə</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Home className="w-12 h-12 text-white/20 mx-auto mb-3" />
                      <p className="text-white/40 text-sm">Otaq tipi seçin</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Result */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl lg:rounded-3xl p-5 sm:p-6 relative overflow-hidden"
              >
                {/* Success Glow */}
                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">Nəticə</h2>
                    <p className="text-xs text-white/40">AI tərəfindən yaradılmış 2D plan</p>
                  </div>
                </div>

                {/* Output Preview */}
                <div className="aspect-square bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-xl overflow-hidden border border-white/10 flex items-center justify-center mb-4 relative">
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
                            className="absolute inset-2 border-2 border-t-emerald-400 border-r-transparent border-b-transparent border-l-transparent rounded-full"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Ruler className="w-5 h-5 text-emerald-400" />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-white/80 text-sm font-medium">Plan yaradılır...</p>
                          <p className="text-white/40 text-xs mt-1">Bu bir neçə saniyə çəkə bilər</p>
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
                          alt="Generated 2D plan"
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
                          <Ruler className="w-7 h-7 text-white/20" />
                        </div>
                        <div className="text-center">
                          <p className="text-white/40 text-sm">Nəticə burada görünəcək</p>
                          <p className="text-white/30 text-xs mt-1">Select parameters and click &quot;Create&quot;</p>
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
                        className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-full"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs text-emerald-400 font-medium">Hazırdır!</span>
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
                      Yüklə
                    </button>
                    <button
                      onClick={() => setIsFullscreen(true)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 border border-white/20 font-medium text-sm rounded-xl hover:bg-white/20 transition-colors"
                    >
                      <ZoomIn className="w-4 h-4" />
                      Tam Ölçü
                    </button>
                  </motion.div>
                )}
              </motion.div>

              {/* Generate Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  onClick={handleGenerate}
                  disabled={!canGenerate || isGenerating}
                  whileHover={canGenerate && !isGenerating ? { scale: 1.02 } : undefined}
                  whileTap={canGenerate && !isGenerating ? { scale: 0.98 } : undefined}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-emerald-500/20"
                >
                  {isGenerating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                      <span>Plan Yaradılır...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>2D Plan Yarat</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

                <p className="text-center text-xs text-white/30 mt-3">
                  Təxmini vaxt: 20-40 saniyə • Xərc: 4 kredit
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
            </div>
          </div>
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
              alt="Generated 2D plan - Full size"
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
                Planı Yüklə
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

