/**
 * Shared TypeScript types for the Personal Homepage project
 * These types are used across timeline, projects, CV, and blog features
 */

// ============================================================================
// Timeline Types
// ============================================================================

export type TimelineEventType = 'job' | 'project' | 'education' | 'milestone' | 'learning'

export interface TimelineEvent {
  id: string
  title: string
  organization: string
  type: TimelineEventType
  startDate: string // ISO 8601 format (YYYY-MM-DD)
  endDate?: string | null // null for current/ongoing
  summary: string
  description?: string
  tags: string[] // e.g., ['product', 'strategy', 'tech']
  link?: string // URL to project page, company, etc.
  location?: string
}

// ============================================================================
// Project Types
// ============================================================================

export type ProjectStatus =
  | 'concept'
  | 'in-progress'
  | 'active'
  | 'completed'
  | 'live'
  | 'sunset'
  | 'planned'
  | 'retired'
export type ProjectType = 'project' | 'tool'

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  summary: string
  type: ProjectType // Distinguishes between larger projects and smaller tools
  scope?: string
  prd?: string // Product Requirements Document
  businessModel?: string
  status: ProjectStatus
  techStack: string[]
  tags: string[] // e.g., ['web', 'api', 'automation', 'product']
  whyBuilt?: string
  learnings?: string[]
  insight?: string // Brief insight or reflection about the project (e.g., "Built to learn Supabase")
  links?: {
    live?: string
    github?: string
    blog?: string
  }
  images?: string[]
  featured: boolean
  year: number
}

// ============================================================================
// CV/Resume Types
// ============================================================================

export interface CVSkillCategory {
  category: string
  items: string[]
}

export interface CVExperience {
  id: string
  title: string
  company: string
  location: string
  startDate: string // ISO 8601 format
  endDate?: string | null // null for current
  description: string
  highlights: string[]
  tags: string[] // For filtering by role type (product, strategy, tech)
}

export interface CVEducation {
  degree: string
  institution: string
  year: number
  description?: string
}

export interface CVData {
  summary: string
  skills: CVSkillCategory[]
  experience: CVExperience[]
  education: CVEducation[]
  projects: string[] // Array of project IDs
}

// ============================================================================
// Blog/Writing Types
// ============================================================================

export interface BlogPost {
  slug: string
  title: string
  date: string // ISO 8601 format
  summary: string
  tags: string[]
  content?: string // MDX content (loaded separately)
  readingTime?: number // in minutes
}

// ============================================================================
// Shared/Utility Types
// ============================================================================

/**
 * Common tag categories used across the application
 */
export type TagCategory = 'product' | 'strategy' | 'tech' | 'design' | 'business' | 'learning'

/**
 * Filter options for CV display
 */
export type CVFilterType = 'all' | 'product' | 'strategy' | 'tech'

/**
 * Common metadata for pages
 */
export interface PageMetadata {
  title: string
  description: string
  image?: string
  url?: string
}
