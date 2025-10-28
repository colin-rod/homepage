import React from 'react'

interface GitHubChartProps {
  /**
   * GitHub username
   */
  username: string

  /**
   * Hex color code for contribution squares (without #)
   * @default "006400" (dark green)
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

/**
 * GitHubChart Component
 *
 * Displays a GitHub contribution chart using ghchart.rshah.org embed service.
 * The chart shows the last year of contributions and is cached daily.
 *
 * Features:
 * - Lightweight (no JavaScript dependencies)
 * - Updates daily (cached by service)
 * - Customizable color scheme
 * - Responsive design
 *
 * @example
 * ```tsx
 * <GitHubChart username="colin-rod" color="D3643E" title="Recent Activity" />
 * ```
 */
export default function GitHubChart({
  username,
  color = '006400',
  title,
  className = '',
}: GitHubChartProps) {
  const chartUrl = `https://ghchart.rshah.org/${color}/${username}`

  return (
    <div className={className}>
      {title && <h3 className="text-xl font-semibold text-text mb-4">{title}</h3>}
      <div className="w-full overflow-x-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={chartUrl}
          alt={`${username}'s GitHub contribution chart`}
          className="w-full h-auto"
          loading="lazy"
        />
      </div>
    </div>
  )
}
