'use client'

/**
 * FadeIn Component
 *
 * Animates elements as they scroll into view with fade + slide up.
 * Uses Intersection Observer via Framer Motion's useInView hook.
 * Respects user's motion preferences.
 */

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { fadeInVariants } from './variants'

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  threshold?: number
}

export default function FadeIn({
  children,
  className = '',
  delay = 0,
  threshold = 0.2,
}: FadeInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: threshold })
  const shouldReduceMotion = useReducedMotion()

  // Disable animations if user prefers reduced motion
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeInVariants}
      transition={{
        duration: 0.5,
        ease: 'easeOut',
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
