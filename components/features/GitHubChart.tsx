/**
 * GitHubChart Component
 *
 * Displays a custom GitHub contribution chart showing the last 6 months.
 * Uses GitHub GraphQL API via server-side data fetching.
 *
 * Features:
 * - Shows last 6 months of contributions
 * - Custom terracotta color scheme
 * - Click-through to GitHub profile
 * - Graceful failure (hides if API unavailable)
 * - Server-side rendering with 24-hour cache
 *
 * @example
 * ```tsx
 * <GitHubChart username="colin-rod" color="D3643E" title="Recent Activity" />
 * ```
 */

'use client'

import React, { useEffect, useState } from 'react'
import ActivityCalendar from 'react-activity-calendar'
import { getActivityCalendarTheme } from '@/lib/chart-utils'
import type { GitHubContribution } from '@/lib/github'

interface GitHubChartProps {
  /**
   * GitHub username
   */
  username: string

  /**
   * Hex color code for contribution squares (without #)
   * @default "006400" (dark green)
   * @deprecated Color is now fixed to terracotta theme
   */
  color?: string

  /**
   * Optional title/heading above the chart
   */
  title?: string

  /**
   * Additional CSS classes for the container
   */
  className?: string
}

export default function GitHubChart({ username, title, className = '' }: GitHubChartProps) {
  const isTestEnv = process.env.NODE_ENV === 'test'
  const logError = (...args: Parameters<typeof console.error>) => {
    if (!isTestEnv) {
      console.error(...args)
    }
  }

  const [contributions, setContributions] = useState<GitHubContribution[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    async function fetchContributions() {
      try {
        const response = await fetch(`/api/github-contributions?username=${username}`)

        if (!response.ok) {
          logError('Failed to fetch contributions:', response.status)
          setHasError(true)
          setIsLoading(false)
          return
        }

        const data = await response.json()
        setContributions(data.contributions)
        setIsLoading(false)
      } catch (error) {
        logError('Error fetching contributions:', error)
        setHasError(true)
        setIsLoading(false)
      }
    }

    fetchContributions()
  }, [username])

  // Don't render anything if there's an error or no data
  if (hasError || (!isLoading && !contributions)) {
    return null
  }

  // Don't render while loading
  if (isLoading) {
    return null
  }

  const theme = getActivityCalendarTheme()

  return (
    <div className={className}>
      {title && <h3 className="text-xl font-semibold text-text mb-4">{title}</h3>}

      {/* GitHub Logo */}
      <div className="w-full flex justify-center mb-6">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${username}'s GitHub profile`}
          className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span className="text-sm font-medium">@{username}</span>
        </a>
      </div>

      {/* Chart */}
      <div className="w-full flex justify-center overflow-x-auto">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
          aria-label={`View ${username}'s GitHub contribution chart`}
        >
          <ActivityCalendar
            data={contributions || []}
            theme={theme}
            blockSize={12}
            blockMargin={4}
            fontSize={14}
            hideColorLegend
            hideTotalCount
            labels={{
              totalCount: '{{count}} contributions in the last 6 months',
            }}
          />
        </a>
      </div>
    </div>
  )
}
