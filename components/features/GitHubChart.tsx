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
  const [contributions, setContributions] = useState<GitHubContribution[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    async function fetchContributions() {
      try {
        const response = await fetch(`/api/github-contributions?username=${username}`)

        if (!response.ok) {
          console.error('Failed to fetch contributions:', response.status)
          setHasError(true)
          setIsLoading(false)
          return
        }

        const data = await response.json()
        setContributions(data.contributions)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching contributions:', error)
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
      <div className="w-full flex justify-center overflow-x-auto">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
          aria-label={`View ${username}'s GitHub profile`}
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
