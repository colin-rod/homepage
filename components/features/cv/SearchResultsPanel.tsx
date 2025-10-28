'use client'

/**
 * SearchResultsPanel Component
 *
 * Displays a compact preview of search results above CV cards.
 * Shows matching roles with match counts and allows navigation via scroll.
 */

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'

export interface SearchResultItem {
  id: string
  title: string
  company: string
  matchCount: number
  previewText?: string
}

export interface SearchResultsPanelProps {
  results: SearchResultItem[]
  query: string
  onResultClick: (id: string) => void
  onClose: () => void
}

export default function SearchResultsPanel({
  results,
  query,
  onResultClick,
  onClose,
}: SearchResultsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Handle Esc key to close panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (results.length === 0) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={panelRef}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="mb-6 card bg-neutral-surface border-accent-warm/30"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-divider">
          <div className="flex items-center gap-2">
            <span className="text-accent-warm">🔍</span>
            <h3 className="text-sm font-semibold text-text">
              {results.length} {results.length === 1 ? 'match' : 'matches'} found for &ldquo;
              {query}&rdquo;
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text transition-colors"
            aria-label="Close search results"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="space-y-2" role="list">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => onResultClick(result.id)}
              className="w-full text-left p-3 rounded-lg bg-background hover:bg-accent-warm/5 border border-transparent hover:border-accent-warm/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-warm"
              role="listitem"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary">
                    {result.company} — {result.title}
                  </p>
                  {result.previewText && (
                    <p className="text-xs text-text-secondary mt-1 truncate">
                      {result.previewText}
                    </p>
                  )}
                </div>
                <span className="flex-shrink-0 text-xs px-2 py-1 rounded-full bg-accent-warm/10 text-accent-warm font-medium">
                  {result.matchCount} {result.matchCount === 1 ? 'match' : 'matches'}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* ARIA live region for screen readers */}
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {results.length} {results.length === 1 ? 'result' : 'results'} found. Press Escape to
          close.
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
