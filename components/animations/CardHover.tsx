'use client'

/**
 * CardHover Component
 *
 * Wraps cards to add subtle hover animation (scale + shadow).
 * Respects user's motion preferences.
 */

import { motion, useReducedMotion } from 'framer-motion'
import { cardHoverVariants } from './variants'

interface CardHoverProps {
  children: React.ReactNode
  className?: string
}

export default function CardHover({ children, className = '' }: CardHoverProps) {
  const shouldReduceMotion = useReducedMotion()

  // Disable animations if user prefers reduced motion
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      variants={cardHoverVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}
