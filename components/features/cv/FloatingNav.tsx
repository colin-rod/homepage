'use client'

/**
 * FloatingNav Component
 *
 * A sticky right-side navigation for the CV page that:
 * - Shows progress through the page with a vertical progress bar
 * - Highlights the currently active section (centered in viewport)
 * - Enables smooth scroll navigation to each section
 * - Updates URL hash when navigating
 * - Fades in/out based on scroll position
 * - Hidden on mobile devices
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { usePostHog } from 'posthog-js/react'

interface NavSection {
  id: string
  label: string
}

const sections: NavSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
]

export default function FloatingNav() {
  const [activeSection, setActiveSection] = useState<string>('overview')
  const posthog = usePostHog()

  // Detect active section based on scroll position (section centered in viewport)
  useEffect(() => {
    const handleScroll = () => {
      const viewportCenter = window.innerHeight / 2

      // Find which section is closest to the center of the viewport
      let closestSection = sections[0].id
      let closestDistance = Infinity

      sections.forEach(({ id }) => {
        const element = document.getElementById(id)
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementCenter = rect.top + rect.height / 2
          const distance = Math.abs(elementCenter - viewportCenter)

          if (distance < closestDistance) {
            closestDistance = distance
            closestSection = id
          }
        }
      })

      if (closestSection !== activeSection) {
        setActiveSection(closestSection)
      }
    }

    handleScroll() // Initial check
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [activeSection])

  // Handle click to scroll to section
  const handleNavClick = (id: string, label: string) => {
    const element = document.getElementById(id)
    if (element) {
      // Smooth scroll to the top of the section with a small offset
      const elementRect = element.getBoundingClientRect()
      const absoluteElementTop = elementRect.top + window.scrollY
      const offset = 80 // Small offset to account for any spacing/padding

      window.scrollTo({
        top: absoluteElementTop - offset,
        behavior: 'smooth',
      })

      // Update URL hash
      window.history.pushState(null, '', `#${id}`)

      // Track navigation event
      posthog?.capture('cv_floating_nav_clicked', {
        section: id,
        label: label,
      })
    }
  }

  // Calculate progress based on active section index
  const activeIndex = sections.findIndex((s) => s.id === activeSection)
  const progress = ((activeIndex + 1) / sections.length) * 100

  return (
    <motion.nav
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed right-8 top-24 z-50 hidden lg:block"
      aria-label="Page navigation"
    >
      <div className="relative">
        {/* Progress bar background */}
        <div className="absolute left-0 top-0 w-0.5 h-full bg-divider rounded-full" />

        {/* Animated progress indicator */}
        <motion.div
          className="absolute left-0 top-0 w-0.5 bg-accent-warm rounded-full"
          initial={{ height: '0%' }}
          animate={{ height: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />

        {/* Navigation items */}
        <ul className="relative space-y-6 pl-6">
          {sections.map(({ id, label }) => {
            const isActive = activeSection === id

            return (
              <li key={id}>
                <button
                  onClick={() => handleNavClick(id, label)}
                  className={`text-sm transition-all duration-300 hover:text-accent-warm ${
                    isActive ? 'font-bold text-accent-warm' : 'text-text-secondary'
                  }`}
                  aria-current={isActive ? 'true' : 'false'}
                >
                  {label}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </motion.nav>
  )
}
