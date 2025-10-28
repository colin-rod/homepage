'use client'

/**
 * KPIBadgeRow Component
 *
 * Displays a row of KPI badges with:
 * - Horizontal scroll on mobile with fade gradients
 * - Arrow buttons for navigation
 * - Free-form scrolling
 */

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import KPIBadge from './KPIBadge'
import { KPI } from '@/lib/types'

export interface KPIBadgeRowProps {
  kpis: KPI[]
}

export default function KPIBadgeRow({ kpis }: KPIBadgeRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  // Check if scrolling is needed and update arrow visibility
  const updateArrowVisibility = () => {
    const container = scrollRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    setShowLeftArrow(scrollLeft > 10)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    updateArrowVisibility()
    window.addEventListener('resize', updateArrowVisibility)
    return () => window.removeEventListener('resize', updateArrowVisibility)
  }, [kpis])

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current
    if (!container) return

    const scrollAmount = 200
    const newScrollLeft =
      container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    })
  }

  if (!kpis || kpis.length === 0) return null

  return (
    <div className="relative border-t border-divider pt-4 mt-4">
      {/* Left fade gradient */}
      {showLeftArrow && (
        <div className="absolute left-0 top-4 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none md:hidden" />
      )}

      {/* Right fade gradient */}
      {showRightArrow && (
        <div className="absolute right-0 top-4 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none md:hidden" />
      )}

      {/* Left arrow button (mobile only) */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white border border-divider rounded-full p-1 shadow-md hover:bg-neutral-surface transition-colors md:hidden"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4 text-text" />
        </button>
      )}

      {/* Right arrow button (mobile only) */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white border border-divider rounded-full p-1 shadow-md hover:bg-neutral-surface transition-colors md:hidden"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4 text-text" />
        </button>
      )}

      {/* Scrollable KPI badges */}
      <div
        ref={scrollRef}
        onScroll={updateArrowVisibility}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap md:overflow-visible"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {kpis.map((kpi, index) => (
          <div key={index} className="flex-shrink-0">
            <KPIBadge label={kpi.label} value={kpi.value} category={kpi.category} />
          </div>
        ))}
      </div>
    </div>
  )
}
