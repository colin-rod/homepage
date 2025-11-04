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
 * @param dateString - The date string to format (ISO 8601 format)
 * @param includeDay - Whether to include the day in the output (default: true)
 * @returns Formatted date string (e.g., "Jan 15, 2024" or "Jan 2024")
 */
export function formatDate(dateString: string, includeDay: boolean = true): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    ...(includeDay && { day: 'numeric' }),
  })
}

/**
 * Format a date with optional null handling
 * @param dateString - The date string to format (ISO 8601 format) or null/undefined
 * @param presentLabel - The label to use for null/undefined dates (default: 'Present')
 * @param includeDay - Whether to include the day in the output (default: false for date ranges)
 * @returns Formatted date string or present label
 */
export function formatDateOrPresent(
  dateString: string | null | undefined,
  presentLabel: string = 'Present',
  includeDay: boolean = false
): string {
  if (!dateString) return presentLabel
  return formatDate(dateString, includeDay)
}

/**
 * Format a date range (start - end)
 */
export function formatDateRange(startDate: string, endDate?: string | null): string {
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
export function calculateDuration(startDate: string, endDate?: string | null): number {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date()

  const months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())

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
