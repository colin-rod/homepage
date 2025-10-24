'use client'

/**
 * SearchBar Component
 *
 * Search input for filtering CV experience by role titles, companies, skills, and descriptions.
 * Features:
 * - Fuzzy search with text highlighting
 * - Mobile: Collapsible with icon button
 * - Desktop: Always visible full-width input
 * - Clear button when text is present
 * - ARIA live region for accessibility
 */

import { useState } from 'react'
import { Search, X } from 'lucide-react'

export interface SearchBarProps {
  value: string
  onChange: (query: string) => void
  onClear: () => void
  resultsCount: number
  totalCount: number
}

export default function SearchBar({
  value,
  onChange,
  onClear,
  resultsCount,
  totalCount,
}: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleClear = () => {
    onClear()
    setIsExpanded(false)
  }

  return (
    <div className="relative">
      {/* Mobile: Search icon button that expands */}
      <div className="md:hidden">
        {!isExpanded ? (
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-divider text-text hover:border-accent-warm transition-colors"
            aria-label="Open search"
          >
            <Search className="w-4 h-4" />
            <span className="text-sm font-medium">Search CV</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search roles, companies, skills..."
                className="w-full pl-10 pr-10 py-2 rounded-lg border border-divider bg-neutral-surface text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-warm focus:border-transparent"
                aria-label="Search CV content"
                autoFocus
              />
              {value && (
                <button
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop: Always visible search bar */}
      <div className="hidden md:block relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search roles, companies, skills, or descriptions..."
          className="w-full pl-11 pr-11 py-3 rounded-lg border border-divider bg-neutral-surface text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-warm focus:border-transparent transition-all"
          aria-label="Search CV content"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text transition-colors"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ARIA live region for search results */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {value
          ? resultsCount === 0
            ? 'No results found'
            : `${resultsCount} ${resultsCount === 1 ? 'result' : 'results'} found`
          : `Showing all ${totalCount} ${totalCount === 1 ? 'position' : 'positions'}`}
      </div>
    </div>
  )
}
