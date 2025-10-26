'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CV, CVFilterType } from '@/lib/types'
import { staggerContainerVariants, staggerItemVariants } from '@/components/animations/variants'
import { usePostHog } from 'posthog-js/react'
import Fuse from 'fuse.js'
import FadeIn from '@/components/animations/FadeIn'
import SkillCategoryCard from '@/components/features/cv/SkillCategoryCard'
import ExperienceCard from '@/components/features/cv/ExperienceCard'
import EducationCard from '@/components/features/cv/EducationCard'
import SearchBar from '@/components/features/cv/SearchBar'
import SearchResultsPanel, {
  type SearchResultItem,
} from '@/components/features/cv/SearchResultsPanel'
import FloatingNav from '@/components/features/cv/FloatingNav'

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
  const [activeSkills, setActiveSkills] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [highlightedCardId, setHighlightedCardId] = useState<string | null>(null)
  const posthog = usePostHog()

  // Create refs for all experience cards for scroll-to navigation
  const cardRefs = useRef<Map<string, React.MutableRefObject<HTMLDivElement | null>>>(new Map())

  // Initialize refs for all experience entries
  useEffect(() => {
    cvData.experience.forEach((exp) => {
      if (!cardRefs.current.has(exp.id)) {
        cardRefs.current.set(exp.id, { current: null })
      }
    })
  }, [cvData.experience])

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

  // Filter experience based on active filter AND active skills (combined filtering)
  const filteredExperience = useMemo(() => {
    return cvData.experience.filter((exp) => {
      // First, filter by role type tags (Product/Strategy/Tech)
      const matchesRoleFilter = activeFilter === 'all' || exp.tags.includes(activeFilter)

      // Then, filter by skills (OR logic: match ANY selected skill)
      const matchesSkillFilter =
        activeSkills.size === 0 ||
        (exp.skills && exp.skills.some((skill) => activeSkills.has(skill)))

      // Both filters must match (AND logic)
      return matchesRoleFilter && matchesSkillFilter
    })
  }, [cvData.experience, activeFilter, activeSkills])

  // Search WITHIN filtered results and extract match metadata
  const searchResults = useMemo((): SearchResultItem[] => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      return []
    }

    // Create a temporary Fuse instance for the filtered results
    const filteredFuse = new Fuse(filteredExperience, {
      keys: [
        { name: 'title', weight: 0.3 },
        { name: 'company', weight: 0.3 },
        { name: 'skills', weight: 0.2 },
        { name: 'description', weight: 0.1 },
        { name: 'highlights', weight: 0.1 },
      ],
      threshold: 0.4,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
    })

    const results = filteredFuse.search(searchQuery)

    // Track search events
    if (results.length === 0) {
      posthog?.capture('cv_search_no_results', {
        query: searchQuery,
        filtered_results_count: filteredExperience.length,
      })
    } else {
      posthog?.capture('cv_search_submitted', {
        query: searchQuery,
        results_count: results.length,
        filtered_results_count: filteredExperience.length,
      })
    }

    // Transform Fuse results into SearchResultItem format
    return results.map((result) => {
      const firstMatch = result.matches?.[0]
      let previewText = ''

      if (firstMatch?.value) {
        // Extract preview text from first match (truncate to 80 chars)
        const value = Array.isArray(firstMatch.value) ? firstMatch.value[0] : firstMatch.value
        previewText = typeof value === 'string' ? value.substring(0, 80) + '...' : ''
      }

      return {
        id: result.item.id,
        title: result.item.title,
        company: result.item.company,
        matchCount: result.matches?.length || 0,
        previewText,
      }
    })
  }, [searchQuery, filteredExperience, posthog])

  // Always display filtered experience (never hide cards based on search)
  const displayedExperience = filteredExperience

  // Toggle skill filter with PostHog tracking
  const handleSkillClick = (skill: string) => {
    const newActiveSkills = new Set(activeSkills)

    if (newActiveSkills.has(skill)) {
      newActiveSkills.delete(skill)
      posthog?.capture('cv_skill_deselected', {
        skill,
        active_filter: activeFilter,
        remaining_skills: Array.from(newActiveSkills),
      })
    } else {
      newActiveSkills.add(skill)
      posthog?.capture('cv_skill_selected', {
        skill,
        active_filter: activeFilter,
        active_skills: Array.from(newActiveSkills),
      })
    }

    setActiveSkills(newActiveSkills)
  }

  // Clear all skill filters
  const handleClearSkills = () => {
    posthog?.capture('cv_skills_cleared', {
      cleared_skills: Array.from(activeSkills),
      active_filter: activeFilter,
    })
    setActiveSkills(new Set())
  }

  // Handle search query change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  // Handle search clear
  const handleSearchClear = () => {
    setSearchQuery('')
    setActiveFilter('all') // Reset to all experience
    posthog?.capture('cv_search_cleared', {
      previous_query: searchQuery,
    })
    posthog?.capture('cv_search_panel_closed', {
      method: 'clear_button',
    })
  }

  // Handle search result click (scroll to card + highlight)
  const handleResultClick = (id: string) => {
    const cardRef = cardRefs.current.get(id)
    if (cardRef?.current) {
      // Smooth scroll to card
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })

      // Highlight the card
      setHighlightedCardId(id)

      // Clear highlight after 2 seconds
      setTimeout(() => {
        setHighlightedCardId(null)
      }, 2000)

      // Track result click
      const result = searchResults.find((r) => r.id === id)
      posthog?.capture('cv_search_result_clicked', {
        result_id: id,
        result_title: result?.title,
        result_company: result?.company,
        match_count: result?.matchCount,
        query: searchQuery,
      })
    }

    // On mobile, close the search results panel
    if (window.innerWidth < 768) {
      // md breakpoint
      setSearchQuery('')
      posthog?.capture('cv_search_panel_closed', {
        method: 'result_click_mobile',
      })
    }
  }

  // Handle search panel close
  const handlePanelClose = () => {
    setSearchQuery('')
    posthog?.capture('cv_search_panel_closed', {
      method: 'close_button',
    })
  }

  // Track when search panel opens
  useEffect(() => {
    if (searchResults.length > 0) {
      posthog?.capture('cv_search_panel_opened', {
        query: searchQuery,
        results_count: searchResults.length,
      })
    }
  }, [searchResults.length, searchQuery, posthog])

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

  const filters: { label: string; value: CVFilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Product', value: 'product' },
    { label: 'Strategy', value: 'strategy' },
    { label: 'Technical', value: 'tech' },
  ]

  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-8">
      {/* Floating Navigation */}
      <FloatingNav />

      {/* Page Header / Overview Section */}
      <FadeIn threshold={0.05}>
        <div id="overview" className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-6">
            Curriculum Vitae
          </h1>
          <AnimatePresence mode="wait">
            <motion.p
              key={activeFilter}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="text-xl text-text-secondary leading-relaxed"
            >
              {cvData.focusSummaries?.[activeFilter] || cvData.summary}
            </motion.p>
          </AnimatePresence>
        </div>
      </FadeIn>

      {/* Filter Buttons */}
      <FadeIn delay={0.1} threshold={0.05}>
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
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <p className="text-sm text-text-secondary" aria-live="polite" aria-atomic="true">
              {activeSkills.size === 0
                ? activeFilter === 'all'
                  ? 'Showing all experience'
                  : `Showing ${activeFilter} experience (${filteredExperience.length} ${
                      filteredExperience.length === 1 ? 'position' : 'positions'
                    })`
                : activeFilter === 'all'
                  ? `Showing roles with: ${Array.from(activeSkills).join(', ')} (${filteredExperience.length} ${
                      filteredExperience.length === 1 ? 'position' : 'positions'
                    })`
                  : `Showing ${activeFilter} roles with: ${Array.from(activeSkills).join(', ')} (${filteredExperience.length} ${
                      filteredExperience.length === 1 ? 'position' : 'positions'
                    })`}
            </p>
            {activeSkills.size > 0 && (
              <button
                onClick={handleClearSkills}
                className="text-xs px-3 py-1 rounded-full bg-neutral-surface border border-divider text-text hover:border-accent-warm hover:bg-accent-warm/5 transition-colors"
              >
                Clear skills
              </button>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Search Bar */}
      <FadeIn delay={0.15} threshold={0.05}>
        <div className="mb-8">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
            resultsCount={displayedExperience.length}
            totalCount={cvData.experience.length}
          />
        </div>
      </FadeIn>

      {/* Search Results Panel */}
      {searchResults.length > 0 && searchQuery.length >= 2 && (
        <SearchResultsPanel
          results={searchResults}
          query={searchQuery}
          onResultClick={handleResultClick}
          onClose={handlePanelClose}
        />
      )}

      {/* Download CV Buttons */}
      <FadeIn delay={0.2} threshold={0.05}>
        <div id="download" className="mb-12 card bg-accent-warm/5 border-accent-warm/20">
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
      </FadeIn>

      {/* Skills Section */}
      <FadeIn delay={0.3} threshold={0.05}>
        <section id="skills" className="mb-16">
          <h2 className="text-2xl font-bold text-text mb-8">Skills & Expertise</h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
          >
            {cvData.skills.map((skillCategory) => (
              <motion.div key={skillCategory.category} variants={staggerItemVariants}>
                <SkillCategoryCard
                  category={skillCategory.category}
                  skills={skillCategory.items}
                  activeSkills={activeSkills}
                  onSkillClick={handleSkillClick}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </FadeIn>

      {/* Experience Section */}
      <FadeIn delay={0.04} threshold={0.05}>
        <section id="experience" className="mb-16">
          <h2 className="text-2xl font-bold text-text mb-8">Professional Experience</h2>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeFilter}-${searchQuery}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <>
                {displayedExperience.length === 0 && (
                  <div className="card text-center py-8 mb-8 bg-accent-warm/5 border-accent-warm/20">
                    <p className="text-text-secondary mb-2">
                      <strong>No roles found</strong>{' '}
                      {searchQuery
                        ? `matching "${searchQuery}"`
                        : `matching the selected ${activeSkills.size > 0 ? 'skills' : 'filters'}`}
                      .
                    </p>
                    <p className="text-sm text-text-secondary">
                      {searchQuery
                        ? 'Try a different search term.'
                        : 'Showing all experience below. Try different filters or clear skill selections.'}
                    </p>
                  </div>
                )}
                <div className="space-y-8">
                  {(displayedExperience.length > 0 ? displayedExperience : cvData.experience).map(
                    (exp) => (
                      <ExperienceCard
                        key={exp.id}
                        ref={cardRefs.current.get(exp.id)}
                        id={exp.id}
                        title={exp.title}
                        company={exp.company}
                        location={exp.location}
                        startDate={exp.startDate}
                        endDate={exp.endDate}
                        description={exp.description}
                        highlights={exp.highlights || []}
                        tags={exp.tags || []}
                        isExpanded={expandedRoles.has(exp.id)}
                        onToggle={() => handleToggleRole(exp.id, `${exp.title} at ${exp.company}`)}
                        formatDate={formatDate}
                        searchQuery={searchQuery}
                        isHighlighted={highlightedCardId === exp.id}
                        kpis={exp.kpis}
                      />
                    )
                  )}
                </div>
              </>
            </motion.div>
          </AnimatePresence>
        </section>
      </FadeIn>

      {/* Education Section */}
      <FadeIn delay={0.05} threshold={0.05}>
        <section id="education" className="mb-16">
          <h2 className="text-2xl font-bold text-text mb-8">Education</h2>
          <motion.div
            className="space-y-6"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
          >
            {cvData.education.map((edu, index) => (
              <motion.div key={index} variants={staggerItemVariants}>
                <EducationCard
                  degree={edu.degree}
                  institution={edu.institution}
                  year={edu.year}
                  location={edu.location}
                  description={edu.description}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </FadeIn>

      {/* CTA Section */}
      <FadeIn delay={0.06} threshold={0.05}>
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
      </FadeIn>
    </div>
  )
}
