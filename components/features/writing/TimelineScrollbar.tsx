'use client'

import { useMemo } from 'react'

interface TimelineScrollbarProps {
  posts: Array<{ date: string; slug: string; title: string }>
}

/**
 * Timeline Scrollbar Component
 *
 * Vertical timeline showing months and years of blog posts
 * Displays alongside the content for easy temporal navigation
 */
export default function TimelineScrollbar({ posts }: TimelineScrollbarProps) {
  // Extract unique months/years from posts
  const timeline = useMemo(() => {
    if (posts.length === 0) return []

    // Get all dates and sort chronologically (newest to oldest for display)
    const dates = posts.map((post) => new Date(post.date)).sort((a, b) => b.getTime() - a.getTime())

    const newestDate = dates[0]
    const oldestDate = dates[dates.length - 1]

    // Generate month labels from newest to oldest (top to bottom)
    const labels: Array<{ label: string; year: number; month: number }> = []
    const current = new Date(newestDate)

    while (current >= oldestDate) {
      labels.push({
        label: current.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
        year: current.getFullYear(),
        month: current.getMonth(),
      })

      // Move to previous month
      current.setMonth(current.getMonth() - 1)
    }

    return labels
  }, [posts])

  if (timeline.length === 0) return null

  return (
    <div className="sticky top-24 h-fit">
      <div className="relative py-4">
        {/* Vertical Timeline bar */}
        <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-accent-warm via-divider to-accent-warm" />

        {/* Month/Year labels */}
        <div className="space-y-4 relative">
          {timeline.map((item, index) => {
            const isFirst = index === 0
            const isLast = index === timeline.length - 1
            const isYearStart = item.month === 0

            return (
              <div key={`${item.year}-${item.month}`} className="flex items-center gap-3 relative">
                {/* Marker dot */}
                <div
                  className={`w-3 h-3 rounded-full relative z-10 flex-shrink-0 ${
                    isFirst || isLast || isYearStart
                      ? 'bg-accent-warm ring-2 ring-accent-warm/20'
                      : 'bg-divider'
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
