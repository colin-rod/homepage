/**
 * Utility functions
 * Common helper functions used throughout the application
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines class names with tailwind-merge for conflict resolution
 * Useful for component className props
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format a date range (start - end)
 */
export function formatDateRange(
  startDate: string,
  endDate?: string | null
): string {
  const start = new Date(startDate)
  const startFormatted = start.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })

  if (!endDate) {
    return `${startFormatted} - Present`
  }

  const end = new Date(endDate)
  const endFormatted = end.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })

  return `${startFormatted} - ${endFormatted}`
}

/**
 * Calculate duration between two dates in months
 */
export function calculateDuration(
  startDate: string,
  endDate?: string | null
): number {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date()

  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth())

  return months
}

/**
 * Format duration in months to human-readable string
 */
export function formatDuration(months: number): string {
  if (months < 12) {
    return `${months} ${months === 1 ? 'month' : 'months'}`
  }

  const years = Math.floor(months / 12)
  const remainingMonths = months % 12

  if (remainingMonths === 0) {
    return `${years} ${years === 1 ? 'year' : 'years'}`
  }

  return `${years} ${years === 1 ? 'year' : 'years'}, ${remainingMonths} ${
    remainingMonths === 1 ? 'month' : 'months'
  }`
}

/**
 * Slugify a string (convert to URL-friendly format)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Truncate text to a specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) {
    return text
  }
  return text.slice(0, length).trim() + '...'
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
