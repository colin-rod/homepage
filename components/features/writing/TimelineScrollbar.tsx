'use client'

import { useMemo } from 'react'

interface TimelineScrollbarProps {
  posts: Array<{ date: string; slug: string; title: string }>
}

/**
 * Timeline Scrollbar Component
 *
 * Visual timeline showing months and years of blog posts
 * Similar to CV page scrollbar but for chronological post navigation
 */
export default function TimelineScrollbar({ posts }: TimelineScrollbarProps) {
  // Extract unique months/years from posts
  const timeline = useMemo(() => {
    if (posts.length === 0) return []

    // Get all dates and sort chronologically (oldest to newest for timeline)
    const dates = posts.map((post) => new Date(post.date)).sort((a, b) => a.getTime() - b.getTime())

    const oldestDate = dates[0]
    const newestDate = dates[dates.length - 1]

    // Generate month labels from oldest to newest
    const labels: Array<{ label: string; year: number; month: number }> = []
    const current = new Date(oldestDate)

    while (current <= newestDate) {
      labels.push({
        label: current.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
        year: current.getFullYear(),
        month: current.getMonth(),
      })

      // Move to next month
      current.setMonth(current.getMonth() + 1)
    }

    return labels
  }, [posts])

  if (timeline.length === 0) return null

  return (
    <div className="mb-8 overflow-hidden">
      <div className="relative">
        {/* Timeline bar */}
        <div className="h-px bg-gradient-to-r from-transparent via-divider to-transparent mb-2" />

        {/* Month/Year labels */}
        <div className="flex items-center justify-between overflow-x-auto scrollbar-hide">
          {timeline.map((item, index) => {
            const isFirst = index === 0
            const isLast = index === timeline.length - 1
            const isYearStart = item.month === 0

            return (
              <div
                key={`${item.year}-${item.month}`}
                className="flex flex-col items-center min-w-fit px-2"
              >
                {/* Marker dot */}
                <div
                  className={`w-2 h-2 rounded-full mb-1 ${
                    isFirst || isLast || isYearStart ? 'bg-accent-warm' : 'bg-divider'
                  }`}
                />

                {/* Label */}
                <span
                  className={`text-xs whitespace-nowrap ${
                    isFirst || isLast || isYearStart
                      ? 'text-text font-semibold'
                      : 'text-text-secondary'
                  }`}
                >
                  {isYearStart || isFirst || isLast ? item.label : item.label.split(' ')[0]}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
