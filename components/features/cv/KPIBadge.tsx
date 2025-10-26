'use client'

/**
 * KPIBadge Component
 *
 * Displays a key performance indicator badge with:
 * - Category-specific icon (auto-mapped from Lucide)
 * - Count-up animation for numeric values
 * - Category-based color coding
 * - Pulse/glow effect on scroll into view
 */

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { DollarSign, Users, TrendingUp, BarChart3, PiggyBank, LucideIcon } from 'lucide-react'

export interface KPIBadgeProps {
  label: string
  value: string
  category: 'revenue' | 'team' | 'efficiency' | 'growth' | 'cost'
}

// Map categories to Lucide icons
const categoryIcons: Record<string, LucideIcon> = {
  revenue: DollarSign,
  team: Users,
  efficiency: TrendingUp,
  growth: BarChart3,
  cost: PiggyBank,
}

// Category-specific colors with glow variants
const categoryStyles = {
  revenue: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: 'text-emerald-600',
    glow: 'shadow-emerald-200',
  },
  team: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: 'text-blue-600',
    glow: 'shadow-blue-200',
  },
  efficiency: {
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: 'text-purple-600',
    glow: 'shadow-purple-200',
  },
  growth: {
    badge: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: 'text-orange-600',
    glow: 'shadow-orange-200',
  },
  cost: {
    badge: 'bg-red-50 text-red-700 border-red-200',
    icon: 'text-red-600',
    glow: 'shadow-red-200',
  },
}

// Extract number from value string for count-up animation
function extractNumber(value: string): number | null {
  // Remove common prefixes/suffixes and extract number
  const cleaned = value.replace(/[$,\s]/g, '')

  // Handle formats like "1M+", "50", "20%"
  if (cleaned.includes('M')) {
    const num = parseFloat(cleaned.replace(/[^\d.]/g, ''))
    return num * 1000000
  }
  if (cleaned.includes('K')) {
    const num = parseFloat(cleaned.replace(/[^\d.]/g, ''))
    return num * 1000
  }

  const num = parseFloat(cleaned.replace(/[^\d.]/g, ''))
  return isNaN(num) ? null : num
}

// Format number back to display format
function formatNumber(num: number, original: string): string {
  if (original.includes('M')) {
    return (num / 1000000).toFixed(1).replace('.0', '')
  }
  if (original.includes('K')) {
    return (num / 1000).toFixed(1).replace('.0', '')
  }
  if (original.includes('%')) {
    return Math.round(num).toString()
  }
  return Math.round(num).toLocaleString()
}

export default function KPIBadge({ label, value, category }: KPIBadgeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const [hasAnimated, setHasAnimated] = useState(false)
  const [displayValue, setDisplayValue] = useState(value)

  const Icon = categoryIcons[category]
  const styles = categoryStyles[category]

  // Extract numeric value and metadata
  const numericValue = extractNumber(value)
  const prefix = value.match(/^[$€£¥]/)?.[0] || ''
  const suffix = value.match(/[+%KM]$/)?.[0] || value.split(' ').slice(1).join(' ')
  const hasNumber = numericValue !== null

  // Count-up animation effect
  useEffect(() => {
    if (!isInView || !hasNumber || hasAnimated) return

    const duration = 1500 // 1.5 seconds
    const steps = 60
    const increment = numericValue! / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current += increment

      if (step >= steps) {
        current = numericValue!
        clearInterval(timer)
        setHasAnimated(true)
      }

      const formattedNum = formatNumber(current, value)

      // Reconstruct value with animated number
      let newValue = prefix + formattedNum
      if (suffix && !suffix.match(/^\s/)) {
        newValue += suffix
      } else if (suffix) {
        newValue += ' ' + suffix.trim()
      }

      setDisplayValue(newValue)
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isInView, hasNumber, numericValue, value, prefix, suffix, hasAnimated])

  return (
    <div
      ref={ref}
      className={`
        inline-flex items-center gap-2 px-3 py-2 rounded-lg border
        ${styles.badge}
        ${isInView && !hasAnimated ? 'animate-kpi-pulse' : ''}
        transition-all duration-300
      `}
    >
      <Icon className={`w-4 h-4 ${styles.icon} flex-shrink-0`} />
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-medium opacity-75 whitespace-nowrap">{label}</span>
        <span className="text-sm font-bold whitespace-nowrap">{displayValue}</span>
      </div>
    </div>
  )
}
