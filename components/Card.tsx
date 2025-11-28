'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
}

export default function Card({
  children,
  hover = true,
  padding = 'md',
  className = '',
  onClick
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const hoverStyles = hover
    ? 'hover:border-white/30 hover:shadow-xl hover:shadow-white/5 cursor-pointer'
    : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4 } : undefined}
      onClick={onClick}
      className={`border border-white/10 transition-all duration-500 ${paddingStyles[padding]} ${hoverStyles} ${className}`}
    >
      {children}
    </motion.div>
  )
}

