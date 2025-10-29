'use client'

/**
 * FocusTicker Component
 *
 * A continuously rotating ticker that displays achievements for the active focus area.
 * Features:
 * - Seamless infinite loop animation
 * - Respects prefers-reduced-motion
 * - Accessible with ARIA live regions
 * - Truncates long text on small screens
 * - Does not pause on hover
 */

import { useEffect, useState, useRef } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'

export interface FocusTickerProps {
  items: string[]
  rotationSpeed?: number // Milliseconds between rotations (default: 4000)
}

export function FocusTicker({ items, rotationSpeed = 4000 }: FocusTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const shouldReduceMotion = useReducedMotion()
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-rotate through items
  useEffect(() => {
    // Don't rotate if reduced motion is preferred or no items
    if (shouldReduceMotion || !items || items.length === 0) {
      return
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
    }, rotationSpeed)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [items, rotationSpeed, shouldReduceMotion])

  // Reset index when items change
  useEffect(() => {
    setCurrentIndex(0)
  }, [items])

  // Handle empty or invalid items
  if (!items || items.length === 0) {
    return (
      <div
        role="region"
        aria-label="Achievements ticker"
        aria-live="polite"
        aria-atomic="false"
        className="overflow-hidden"
      />
    )
  }

  const currentItem = items[currentIndex]

  return (
    <div
      role="region"
      aria-label="Achievements ticker"
      aria-live="polite"
      aria-atomic="false"
      className="overflow-hidden relative h-6 flex items-center"
      data-testid="ticker-container"
    >
      {shouldReduceMotion ? (
        // Static display for users who prefer reduced motion
        <div className="text-sm text-text-secondary truncate px-1" data-testid="ticker-content">
          {currentItem}
        </div>
      ) : (
        // Animated ticker
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="text-sm text-text-secondary truncate px-1 absolute inset-0 flex items-center"
            data-testid="ticker-content"
          >
            {currentItem}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Hidden duplicate items for screen readers (for seamless loop perception) */}
      <div className="sr-only">
        {items.map((item, index) => (
          <span key={index}>{item}</span>
        ))}
      </div>
    </div>
  )
}
