/**
 * Chart Utilities
 *
 * Helper functions for transforming and styling contribution charts
 */

import type { GitHubContribution } from './github'

/**
 * Color scheme for contribution levels using terracotta gradient
 */
export const CONTRIBUTION_COLORS = {
  0: '#FAF8F5', // Background (0 contributions)
  1: '#F5C9BC', // Light terracotta (1-2 contributions)
  2: '#E89B7E', // Medium terracotta (3-5 contributions)
  3: '#D3643E', // Brand terracotta (6-10 contributions)
  4: '#B54C2A', // Dark terracotta (11+ contributions)
} as const

/**
 * Get color for a contribution level
 */
export function getContributionColor(level: 0 | 1 | 2 | 3 | 4): string {
  return CONTRIBUTION_COLORS[level]
}

/**
 * Transform GitHub contributions to react-activity-calendar format
 */
export interface ActivityCalendarData {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export function transformToActivityCalendar(
  contributions: GitHubContribution[]
): ActivityCalendarData[] {
  return contributions.map((contribution) => ({
    date: contribution.date,
    count: contribution.count,
    level: contribution.level,
  }))
}

/**
 * Generate theme configuration for react-activity-calendar
 */
export function getActivityCalendarTheme() {
  return {
    light: [
      CONTRIBUTION_COLORS[0],
      CONTRIBUTION_COLORS[1],
      CONTRIBUTION_COLORS[2],
      CONTRIBUTION_COLORS[3],
      CONTRIBUTION_COLORS[4],
    ],
    dark: [
      CONTRIBUTION_COLORS[0],
      CONTRIBUTION_COLORS[1],
      CONTRIBUTION_COLORS[2],
      CONTRIBUTION_COLORS[3],
      CONTRIBUTION_COLORS[4],
    ],
  }
}
