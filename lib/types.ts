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
  description: string // Short description for cards
  detailedDescription: string // Previously "summary" - detailed explanation (formerly shown in cards, now for detail pages)
  type: ProjectType // Distinguishes between larger projects and smaller tools
  scope?: string
  prd?: string // Product Requirements Document
  businessModel?: string
  status: ProjectStatus
  techStack: string[]
  tags: string[] // e.g., ['web', 'api', 'automation', 'product']
  whyBuilt?: string
  learnings?: string[]
  insight?: string // Brief insight or reflection about the project (kept in data model but not shown in cards)
  favicon?: string // Path to project favicon/logo (e.g., "/images/projects/babypool-favicon.png")
  links?: {
    live?: string
    github?: string
    blog?: string
    prd?: string // Link to Product Requirements Document
    screenshots?: string[] // Array of screenshot URLs
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
  startDate: string // ISO 8601
  endDate?: string | null
  description: string
  highlights: string[]
  tags: string[] // For filtering (e.g., ['product', 'strategy'])
}

export interface CVEducation {
  degree: string
  institution: string
  year: number
  description?: string
}

export interface CV {
  summary: string
  skills: CVSkillCategory[]
  experience: CVExperience[]
  education: CVEducation[]
  projects: string[] // References to project IDs
}

// ============================================================================
// Blog/Writing Types
// ============================================================================

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  publishedAt: string // ISO 8601
  updatedAt?: string
  tags: string[]
  featured: boolean
}
