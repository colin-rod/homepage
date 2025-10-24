'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { CV, CVFilterType } from '@/lib/types'
import { expandableCardVariants } from '@/components/animations/variants'
import { usePostHog } from 'posthog-js/react'

interface CVContentProps {
  cvData: CV
}

/**
 * CV Content Component (Client)
 *
 * Handles filtering and display of CV content with expandable role cards
 */
export default function CVContent({ cvData }: CVContentProps) {
  const [activeFilter, setActiveFilter] = useState<CVFilterType>('all')
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set())
  const shouldReduceMotion = useReducedMotion()
  const posthog = usePostHog()

  // Reset expanded roles when filter changes
  useEffect(() => {
    setExpandedRoles(new Set())
  }, [activeFilter])

  // Helper function to format dates
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Present'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  // Filter experience based on active filter
  const filteredExperience =
    activeFilter === 'all'
      ? cvData.experience
      : cvData.experience.filter((exp) => exp.tags.includes(activeFilter))

  // Toggle role expansion with PostHog tracking
  const handleToggleRole = (roleId: string, roleName: string) => {
    const newExpanded = new Set(expandedRoles)
    const isExpanding = !newExpanded.has(roleId)

    if (isExpanding) {
      newExpanded.add(roleId)
      posthog?.capture('cv_role_expanded', {
        role_id: roleId,
        role_name: roleName,
        filter: activeFilter,
      })
    } else {
      newExpanded.delete(roleId)
      posthog?.capture('cv_role_collapsed', {
        role_id: roleId,
        role_name: roleName,
        filter: activeFilter,
      })
    }

    setExpandedRoles(newExpanded)
  }

  // Keyboard handler for accessibility
  const handleKeyDown = (e: React.KeyboardEvent, roleId: string, roleName: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleToggleRole(roleId, roleName)
    }
  }

  const filters: { label: string; value: CVFilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Product', value: 'product' },
    { label: 'Strategy', value: 'strategy' },
    { label: 'Technical', value: 'tech' },
  ]

  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-6">
          Curriculum Vitae
        </h1>
        <p className="text-xl text-text-secondary leading-relaxed">{cvData.summary}</p>
      </div>

      {/* Filter Buttons */}
      <div className="mb-8" role="group" aria-label="Filter CV by focus area">
        <h3 className="text-sm font-semibold text-text mb-3">Filter by focus:</h3>
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              aria-pressed={activeFilter === filter.value}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeFilter === filter.value
                  ? 'bg-accent-warm text-white'
                  : 'bg-neutral-surface border border-divider text-text hover:border-accent-warm'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-text-secondary mt-3" aria-live="polite" aria-atomic="true">
          {activeFilter === 'all'
            ? 'Showing all experience'
            : `Showing ${activeFilter} experience (${filteredExperience.length} ${
                filteredExperience.length === 1 ? 'position' : 'positions'
              })`}
        </p>
      </div>

      {/* Download CV Buttons */}
      <div className="mb-12 card bg-accent-warm/5 border-accent-warm/20">
        <h3 className="text-sm font-semibold text-text mb-3">Download as PDF:</h3>
        <p className="text-sm text-text-secondary mb-4">
          Click below to open a print-optimized version. Use your browser&apos;s print function
          (Cmd/Ctrl+P) to save as PDF.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <a
            href="/cv/download?filter=all"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline text-center"
          >
            Download Full CV
          </a>
          <a
            href="/cv/download?filter=product"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline text-center"
          >
            Product Focus
          </a>
          <a
            href="/cv/download?filter=strategy"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline text-center"
          >
            Strategy Focus
          </a>
          <a
            href="/cv/download?filter=tech"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline text-center"
          >
            Technical Focus
          </a>
        </div>
      </div>

      {/* Skills Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-text mb-8">Skills & Expertise</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cvData.skills.map((skillCategory) => (
            <div key={skillCategory.category} className="card">
              <h3 className="text-lg font-semibold text-primary mb-4">{skillCategory.category}</h3>
              <div className="flex flex-wrap gap-2">
                {skillCategory.items.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm px-3 py-1 rounded-full bg-neutral-surface border border-divider text-text"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-text mb-8">Professional Experience</h2>
        {filteredExperience.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-text-secondary">
              No experience found for the selected filter. Try selecting a different filter.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredExperience.map((exp) => {
              const isExpanded = expandedRoles.has(exp.id)
              const highlightCount = exp.highlights?.length || 0
              const condensedCount = 3
              const hasMoreHighlights = highlightCount > condensedCount
              const visibleHighlights = isExpanded
                ? exp.highlights
                : exp.highlights?.slice(0, condensedCount)
              const hiddenHighlights = exp.highlights?.slice(condensedCount)
              const remainingCount = highlightCount - condensedCount

              return (
                <div
                  key={exp.id}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  aria-label={
                    isExpanded
                      ? `Collapse ${exp.title} at ${exp.company}`
                      : `Expand to show all ${highlightCount} achievements for ${exp.title} at ${exp.company}`
                  }
                  onClick={() => handleToggleRole(exp.id, `${exp.title} at ${exp.company}`)}
                  onKeyDown={(e) => handleKeyDown(e, exp.id, `${exp.title} at ${exp.company}`)}
                  className={`card transition-all duration-200 ${
                    hasMoreHighlights
                      ? 'cursor-pointer hover:border-accent-warm focus:outline-none focus:ring-2 focus:ring-accent-warm focus:ring-offset-2'
                      : ''
                  }`}
                >
                  {/* Position Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-primary mb-1">{exp.title}</h3>
                        <p className="text-lg text-text-secondary">
                          {exp.company} • {exp.location}
                        </p>
                        <p className="text-sm text-text-secondary mt-1">
                          {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                        </p>
                      </div>
                      {hasMoreHighlights && (
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-warm/10 text-accent-warm">
                            {isExpanded ? 'Click to collapse' : `+${remainingCount} more`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-text-secondary mb-4">{exp.description}</p>

                  {/* Highlights */}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-text uppercase mb-3">
                        Key Achievements
                      </h4>
                      <ul className="space-y-2">
                        {/* Always visible highlights (first 3) */}
                        {visibleHighlights?.map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-accent-warm mr-2">•</span>
                            <span className="text-text-secondary">{highlight}</span>
                          </li>
                        ))}

                        {/* Expandable highlights (remaining) */}
                        {hasMoreHighlights && !shouldReduceMotion && (
                          <AnimatePresence initial={false}>
                            {isExpanded && hiddenHighlights && (
                              <motion.div
                                initial="collapsed"
                                animate="expanded"
                                exit="collapsed"
                                variants={expandableCardVariants}
                              >
                                {hiddenHighlights.map((highlight, index) => (
                                  <li
                                    key={condensedCount + index}
                                    className="flex items-start mt-2"
                                  >
                                    <span className="text-accent-warm mr-2">•</span>
                                    <span className="text-text-secondary">{highlight}</span>
                                  </li>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}

                        {/* Fallback for reduced motion - no animation */}
                        {hasMoreHighlights &&
                          shouldReduceMotion &&
                          isExpanded &&
                          hiddenHighlights && (
                            <>
                              {hiddenHighlights.map((highlight, index) => (
                                <li key={condensedCount + index} className="flex items-start">
                                  <span className="text-accent-warm mr-2">•</span>
                                  <span className="text-text-secondary">{highlight}</span>
                                </li>
                              ))}
                            </>
                          )}
                      </ul>
                    </div>
                  )}

                  {/* Tags */}
                  {exp.tags && exp.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-divider">
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded bg-accent-warm/10 text-accent-warm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Education Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-text mb-8">Education</h2>
        <div className="space-y-6">
          {cvData.education.map((edu, index) => (
            <div key={index} className="card">
              <h3 className="text-xl font-bold text-primary mb-1">{edu.degree}</h3>
              <p className="text-lg text-text-secondary mb-2">{edu.institution}</p>
              <p className="text-sm text-text-secondary">{edu.year}</p>
              {edu.description && <p className="text-text-secondary mt-3">{edu.description}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-divider pt-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text mb-4">Download CV</h2>
          <p className="text-lg text-text-secondary mb-8">
            Get a customized version of my CV tailored to specific role types
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <a href="/cv/download?filter=product" className="btn btn-primary text-center">
              Download Product CV
            </a>
            <a href="/cv/download?filter=strategy" className="btn btn-primary text-center">
              Download Strategy CV
            </a>
            <a href="/cv/download?filter=tech" className="btn btn-primary text-center">
              Download Technical CV
            </a>
            <a href="/cv/download?filter=all" className="btn btn-secondary text-center">
              Download Full CV
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
