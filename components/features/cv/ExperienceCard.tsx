'use client'

/**
 * ExperienceCard Component
 *
 * Displays a professional experience entry with expandable highlights.
 * Features:
 * - Condensed view (first 3 highlights) by default
 * - Click anywhere to expand/collapse
 * - Smooth animations with Framer Motion
 * - Keyboard accessible (Enter/Space)
 * - Respects prefers-reduced-motion
 */

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { expandableCardVariants } from '@/components/animations/variants'

export interface ExperienceCardProps {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate?: string | null
  description: string
  highlights: string[]
  tags: string[]
  isExpanded: boolean
  onToggle: () => void
  formatDate: (date: string | null | undefined) => string
}

export default function ExperienceCard({
  id,
  title,
  company,
  location,
  startDate,
  endDate,
  description,
  highlights,
  tags,
  isExpanded,
  onToggle,
  formatDate,
}: ExperienceCardProps) {
  const shouldReduceMotion = useReducedMotion()

  const highlightCount = highlights.length
  const condensedCount = 3
  const hasMoreHighlights = highlightCount > condensedCount
  const visibleHighlights = isExpanded ? highlights : highlights.slice(0, condensedCount)
  const hiddenHighlights = highlights.slice(condensedCount)
  const remainingCount = highlightCount - condensedCount

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle()
    }
  }

  return (
    <div
      role="button"
      tabIndex={hasMoreHighlights ? 0 : undefined}
      aria-expanded={hasMoreHighlights ? isExpanded : undefined}
      aria-label={
        hasMoreHighlights
          ? isExpanded
            ? `Collapse ${title} at ${company}`
            : `Expand to show all ${highlightCount} achievements for ${title} at ${company}`
          : undefined
      }
      onClick={hasMoreHighlights ? onToggle : undefined}
      onKeyDown={hasMoreHighlights ? handleKeyDown : undefined}
      className={`card transition-all duration-200 ${
        hasMoreHighlights
          ? 'cursor-pointer hover:border-accent-warm focus:outline-none focus:ring-2 focus:ring-accent-warm focus:ring-offset-2'
          : ''
      }`}
    >
      {/* Position Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-primary mb-1">{title}</h3>
            <p className="text-lg text-text-secondary">
              {company} • {location}
            </p>
            <p className="text-sm text-text-secondary mt-1">
              {formatDate(startDate)} – {formatDate(endDate)}
            </p>
          </div>
          {hasMoreHighlights && (
            <div className="flex-shrink-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-warm/10 text-accent-warm">
                {isExpanded ? 'Click to collapse' : `+${remainingCount} more`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-text-secondary mb-4">{description}</p>

      {/* Highlights */}
      {highlights.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-text uppercase mb-3">Key Achievements</h4>
          <ul className="space-y-2">
            {/* Always visible highlights (first 3) */}
            {visibleHighlights.map((highlight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-accent-warm mr-2">•</span>
                <span className="text-text-secondary">{highlight}</span>
              </li>
            ))}

            {/* Expandable highlights (remaining) */}
            {hasMoreHighlights && !shouldReduceMotion && (
              <AnimatePresence initial={false}>
                {isExpanded && hiddenHighlights && (
                  <motion.div
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    variants={expandableCardVariants}
                  >
                    {hiddenHighlights.map((highlight, index) => (
                      <li key={condensedCount + index} className="flex items-start mt-2">
                        <span className="text-accent-warm mr-2">•</span>
                        <span className="text-text-secondary">{highlight}</span>
                      </li>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Fallback for reduced motion - no animation */}
            {hasMoreHighlights && shouldReduceMotion && isExpanded && hiddenHighlights && (
              <>
                {hiddenHighlights.map((highlight, index) => (
                  <li key={condensedCount + index} className="flex items-start">
                    <span className="text-accent-warm mr-2">•</span>
                    <span className="text-text-secondary">{highlight}</span>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-divider">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded bg-accent-warm/10 text-accent-warm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
