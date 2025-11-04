/**
 * Custom hook for CV filtering logic
 * Handles role type and skill-based filtering
 */

import { useState, useEffect, useMemo } from 'react'
import { CV, CVFilterType, HighlightEntry } from '@/lib/types'

export function useCVFilters(cvData: CV) {
  const [activeFilter, setActiveFilter] = useState<CVFilterType>('all')
  const [activeSkills, setActiveSkills] = useState<Set<string>>(new Set())
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set())

  // Reset expanded roles when filter changes
  useEffect(() => {
    setExpandedRoles(new Set())
  }, [activeFilter])

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

  /**
   * Filter highlights based on active skills
   * Returns filtered highlights for a given experience entry
   * Supports both string and HighlightEntry formats for backward compatibility
   */
  const getFilteredHighlights = (
    highlights: (string | HighlightEntry)[],
    skillsFilter: Set<string>
  ): (string | HighlightEntry)[] => {
    // If no skills selected, show all highlights
    if (skillsFilter.size === 0) {
      return highlights
    }

    return highlights.filter((highlight) => {
      // Handle string format (backward compatibility - show all)
      if (typeof highlight === 'string') {
        return true
      }

      // Handle HighlightEntry format
      // Show highlight if:
      // 1. It has no skills tagged (neutral highlight)
      // 2. It has at least one skill that matches active skills
      if (!highlight.skills || highlight.skills.length === 0) {
        return true
      }

      return highlight.skills.some((skill) => skillsFilter.has(skill))
    })
  }

  return {
    activeFilter,
    setActiveFilter,
    activeSkills,
    setActiveSkills,
    expandedRoles,
    setExpandedRoles,
    filteredExperience,
    getFilteredHighlights,
  }
}
