'use client'

import { motion } from 'framer-motion'

interface ToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label?: string
  disabled?: boolean
}

export default function Toggle({
  enabled,
  onChange,
  label,
  disabled = false
}: ToggleProps) {
  return (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div
        className={`relative w-12 h-6 border transition-colors duration-300 ${
          enabled
            ? 'bg-white border-white'
            : 'bg-black border-white/20'
        }`}
      >
        <motion.div
          animate={{ x: enabled ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`absolute top-0.5 left-0.5 w-5 h-5 ${
            enabled ? 'bg-black' : 'bg-white'
          }`}
        />
      </div>
      {label && (
        <span className="text-sm font-medium">{label}</span>
      )}
    </button>
  )
}

