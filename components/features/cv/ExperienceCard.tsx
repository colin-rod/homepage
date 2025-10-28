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
 * - Supports scroll-to navigation with pulse highlight
 */

import Image from 'next/image'
import { forwardRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { expandableCardVariants } from '@/components/animations/variants'
import HighlightText from './HighlightText'
import MarkdownText from './MarkdownText'
import KPIBadgeRow from './KPIBadgeRow'
import { KPI, HighlightEntry } from '@/lib/types'

export interface ExperienceCardProps {
  id: string
  title: string
  company: string
  icon?: string
  location: string
  startDate: string
  endDate?: string | null
  description: string
  highlights: (string | HighlightEntry)[]
  totalHighlights?: number // Total before filtering
  tags: string[]
  isExpanded: boolean
  onToggle: () => void
  formatDate: (date: string | null | undefined) => string
  searchQuery?: string
  isHighlighted?: boolean
  kpis?: KPI[]
}

const ExperienceCard = forwardRef<HTMLDivElement, ExperienceCardProps>(
  (
    {
      id,
      title,
      company,
      icon,
      location,
      startDate,
      endDate,
      description,
      highlights,
      totalHighlights,
      tags,
      isExpanded,
      onToggle,
      formatDate,
      searchQuery = '',
      isHighlighted = false,
      kpis,
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion()

    // Helper to get text from highlight (handles both string and HighlightEntry)
    const getHighlightText = (highlight: string | HighlightEntry): string => {
      return typeof highlight === 'string' ? highlight : highlight.text
    }

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
        ref={ref}
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
        } ${isHighlighted ? 'animate-pulse-highlight bg-amber-100 border-accent-warm' : ''}`}
        style={
          isHighlighted
            ? {
                animation: 'pulse-highlight 2s ease-out forwards',
              }
            : undefined
        }
      >
        {/* Position Header */}
        <div className="mb-4">
          <div className="flex items-start gap-4">
            {icon && (
              <div className="flex-shrink-0 w-12 h-12 rounded-lg border border-divider bg-neutral-surface flex items-center justify-center overflow-hidden">
                <Image
                  src={icon}
                  alt={`${company} logo`}
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-primary mb-1">
                    <HighlightText text={title} searchQuery={searchQuery} />
                  </h3>
                  <p className="text-lg text-text-secondary">
                    <HighlightText text={company} searchQuery={searchQuery} /> • {location}
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
          </div>
        </div>

        {/* KPI Badges */}
        {kpis && kpis.length > 0 && <KPIBadgeRow kpis={kpis} />}

        {/* Description */}
        <p className="text-text-secondary mb-4">
          <HighlightText text={description} searchQuery={searchQuery} />
        </p>

        {/* Highlights */}
        {highlights.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-text uppercase">Key Achievements</h4>
              {totalHighlights && totalHighlights > highlights.length && (
                <span className="text-xs text-text-secondary">
                  Showing {highlights.length} of {totalHighlights} highlights
                </span>
              )}
            </div>
            <ul className="space-y-2">
              {/* Always visible highlights (first 3) */}
              {visibleHighlights.map((highlight, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-accent-warm mr-2">•</span>
                  <span className="text-text-secondary">
                    <MarkdownText
                      text={getHighlightText(highlight)}
                      searchQuery={searchQuery}
                      trackingContext={{ roleId: id, company }}
                    />
                  </span>
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
                          <span className="text-text-secondary">
                            <MarkdownText
                              text={getHighlightText(highlight)}
                              searchQuery={searchQuery}
                              trackingContext={{ roleId: id, company }}
                            />
                          </span>
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
                      <span className="text-text-secondary">
                        <MarkdownText
                          text={getHighlightText(highlight)}
                          searchQuery={searchQuery}
                          trackingContext={{ roleId: id, company }}
                        />
                      </span>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>
        ) : totalHighlights && totalHighlights > 0 ? (
          <div className="rounded-lg bg-neutral-surface border border-divider p-4">
            <p className="text-sm text-text-secondary text-center">
              No highlights match the selected skills. This role has {totalHighlights} total{' '}
              {totalHighlights === 1 ? 'highlight' : 'highlights'} that may use other skills.
            </p>
          </div>
        ) : null}

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
)

ExperienceCard.displayName = 'ExperienceCard'

export default ExperienceCard
