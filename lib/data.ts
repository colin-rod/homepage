/**
 * Data loading utilities
 * Functions to load and process data from JSON files
 */

import { Project, TimelineEvent, CVData } from './types'
import projectsData from '@/data/projects.json'
import timelineData from '@/data/timeline.json'
import cvData from '@/data/cv.json'

/**
 * Get all projects
 */
export function getProjects(): Project[] {
  return projectsData as Project[]
}

/**
 * Get a single project by slug
 */
export function getProjectBySlug(slug: string): Project | undefined {
  const projects = getProjects()
  return projects.find((project) => project.slug === slug)
}

/**
 * Get featured projects
 */
export function getFeaturedProjects(): Project[] {
  return getProjects().filter((project) => project.featured)
}

/**
 * Get projects by tag
 */
export function getProjectsByTag(tag: string): Project[] {
  return getProjects().filter((project) => project.tags.includes(tag))
}

/**
 * Get projects by type (project or tool)
 */
export function getProjectsByType(type: 'project' | 'tool'): Project[] {
  return getProjects().filter((project) => project.type === type)
}

/**
 * Get all projects (type: 'project' only, excludes tools)
 */
export function getProjectsOnly(): Project[] {
  return getProjectsByType('project')
}

/**
 * Get all tools (type: 'tool' only, excludes projects)
 */
export function getTools(): Project[] {
  return getProjectsByType('tool')
}

/**
 * Get all timeline events
 */
export function getTimelineEvents(): TimelineEvent[] {
  return timelineData as TimelineEvent[]
}

/**
 * Get timeline events by type
 */
export function getTimelineEventsByType(type: string): TimelineEvent[] {
  return getTimelineEvents().filter((event) => event.type === type)
}

/**
 * Get timeline events by tag
 */
export function getTimelineEventsByTag(tag: string): TimelineEvent[] {
  return getTimelineEvents().filter((event) => event.tags.includes(tag))
}

/**
 * Get CV data
 */
export function getCVData(): CVData {
  return cvData as CVData
}

/**
 * Get filtered CV data by tag
 * This is used for generating role-specific CVs (product, strategy, tech)
 */
export function getFilteredCVData(filterTag?: string): CVData {
  const cv = getCVData()

  if (!filterTag || filterTag === 'all') {
    return cv
  }

  // Filter experience by tag
  const filteredExperience = cv.experience.filter((exp) =>
    exp.tags.includes(filterTag)
  )

  return {
    ...cv,
    experience: filteredExperience,
  }
}

/**
 * Get all unique tags from projects
 */
export function getAllProjectTags(): string[] {
  const projects = getProjects()
  const tags = new Set<string>()

  projects.forEach((project) => {
    project.tags.forEach((tag) => tags.add(tag))
  })

  return Array.from(tags).sort()
}

/**
 * Get all unique tags from timeline events
 */
export function getAllTimelineTags(): string[] {
  const events = getTimelineEvents()
  const tags = new Set<string>()

  events.forEach((event) => {
    event.tags.forEach((tag) => tags.add(tag))
  })

  return Array.from(tags).sort()
}
