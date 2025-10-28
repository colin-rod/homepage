'use client'

/**
 * PageTransition Component
 *
 * Wraps page content to animate entry with fade + slide up effect.
 * Respects user's motion preferences.
 */

import { motion, useReducedMotion } from 'framer-motion'
import { pageVariants } from './variants'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export default function PageTransition({ children, className = '' }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion()

  // Disable animations if user prefers reduced motion
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}
