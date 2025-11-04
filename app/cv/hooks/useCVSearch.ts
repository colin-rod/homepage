/**
 * Custom hook for CV search functionality
 * Handles Fuse.js search with memoization and analytics
 */

import { useMemo } from 'react'
import { usePostHog } from 'posthog-js/react'
import Fuse from 'fuse.js'
import { CVExperience } from '@/lib/types'
import { type SearchResultItem } from '@/components/features/cv/SearchResultsPanel'

export function useCVSearch(filteredExperience: CVExperience[], searchQuery: string) {
  const posthog = usePostHog()

  // Memoize Fuse instance to avoid expensive re-initialization on every search
  const fuseInstance = useMemo(() => {
    return new Fuse(filteredExperience, {
      keys: [
        { name: 'title', weight: 0.3 },
        { name: 'company', weight: 0.3 },
        { name: 'skills', weight: 0.2 },
        { name: 'description', weight: 0.1 },
        { name: 'highlights', weight: 0.1 },
      ],
      threshold: 0.4,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
    })
  }, [filteredExperience])

  // Search WITHIN filtered results and extract match metadata
  const searchResults = useMemo((): SearchResultItem[] => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      return []
    }

    const results = fuseInstance.search(searchQuery)

    // Track search events
    if (results.length === 0) {
      posthog?.capture('cv_search_no_results', {
        query: searchQuery,
        filtered_results_count: filteredExperience.length,
      })
    } else {
      posthog?.capture('cv_search_submitted', {
        query: searchQuery,
        results_count: results.length,
        filtered_results_count: filteredExperience.length,
      })
    }

    // Transform Fuse results into SearchResultItem format
    return results.map((result) => {
      const firstMatch = result.matches?.[0]
      let previewText = ''

      if (firstMatch?.value) {
        // Extract preview text from first match (truncate to 80 chars)
        const value = Array.isArray(firstMatch.value) ? firstMatch.value[0] : firstMatch.value
        previewText = typeof value === 'string' ? value.substring(0, 80) + '...' : ''
      }

      return {
        id: result.item.id,
        title: result.item.title,
        company: result.item.company,
        matchCount: result.matches?.length || 0,
        previewText,
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // Note: filteredExperience.length is used only for analytics, not computation
  }, [searchQuery, fuseInstance, posthog])

  return {
    searchResults,
  }
}
