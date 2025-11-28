'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { LayoutDashboard, Grid3x3, PlusCircle, CreditCard } from 'lucide-react'

export default function Header() {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="pointer-events-auto max-w-4xl mx-auto px-3"
      >
        <div className="flex items-center justify-between gap-4 rounded-full border border-white/15 bg-black/70 backdrop-blur-xl px-4 sm:px-6 py-3 shadow-lg shadow-black/40">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center">
            <span className="text-sm sm:text-base md:text-lg font-semibold tracking-tight whitespace-nowrap hover:text-white/80 transition-colors">
              Dargah Vision
            </span>
          </Link>

          {/* Nav Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
            {/* Panel - temporarily hidden
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Panel</span>
            </Link>
            */}
            <Link
              href="/apps"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Grid3x3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Tətbiqlər</span>
            </Link>
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Qiymətlər</span>
            </Link>
            <Link
              href="/create"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-white text-black text-xs sm:text-sm font-medium hover:bg-white/90 transition-all duration-300 shadow-md shadow-white/20"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Yarat</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </nav>
  )
}


