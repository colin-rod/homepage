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

export type LearningSentiment = 'positive' | 'negative' | 'neutral'

export type ProjectQuarter = 'Q1' | 'Q2' | 'Q3' | 'Q4'

export interface ProjectLearning {
  content: string
  sentiment: LearningSentiment
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string // Short description for cards
  detailedDescription: string | string[] // Previously "summary" - detailed explanation (formerly shown in cards, now for detail pages)
  type: ProjectType // Distinguishes between larger projects and smaller tools
  scope?: string
  prd?: string // Product Requirements Document
  businessModel?: string
  status: ProjectStatus
  techStack: string[]
  tags: string[] // e.g., ['web', 'api', 'automation', 'product']
  whyBuilt?: string | string[]
  learnings?: ProjectLearning[] // Array of learning objects with content and sentiment
  favicon?: string // Path to project favicon/logo (e.g., "/images/projects/babypool-favicon.png")
  links?: {
    live?: string
    github?: string
    blog?: string
    prd?: string // Link to Product Requirements Document
  }
  images?: string[] // Consolidated field for all project images/screenshots
  featured: boolean
  year: number
  quarter?: ProjectQuarter
}

// ============================================================================
// CV/Resume Types
// ============================================================================

export type CVFilterType = 'all' | 'product' | 'strategy' | 'tech'

export interface CVSkillCategory {
  category: string
  items: string[]
}

export interface KPI {
  label: string // "ARR", "Team Size", "Cost Savings", etc.
  value: string // "$1M+", "50 people", "20% reduction", etc.
  category: 'revenue' | 'team' | 'efficiency' | 'growth' | 'cost'
}

// Highlight entry that can be tagged with skills for granular filtering
export interface HighlightEntry {
  text: string // The highlight text (supports markdown)
  skills?: string[] // Skills demonstrated in this specific highlight
}

export interface CVExperience {
  id: string
  title: string
  company: string
  icon?: string
  location: string
  startDate: string // ISO 8601
  endDate?: string | null
  description: string
  highlights: (string | HighlightEntry)[] // Support both string and object formats
  tags: string[] // For filtering (e.g., ['product', 'strategy'])
  skills?: string[] // Skills used in this role (for skill-based filtering)
  kpis?: KPI[] // Key performance indicators for the role
}

export interface CVEducation {
  degree: string
  institution: string
  year: number
  location?: string
  description?: string
}

export interface CVFocusMetrics {
  achievements: string[] // Rotating ticker items with emojis
}

export interface CV {
  summary: string
  focusSummaries?: {
    all: string
    product: string
    strategy: string
    tech: string
  }
  focusMetrics?: {
    all: CVFocusMetrics
    product: CVFocusMetrics
    strategy: CVFocusMetrics
    tech: CVFocusMetrics
  }
  lastUpdated?: string // ISO 8601 date (YYYY-MM-DD) - manually edited to track when CV was last updated
  skills: CVSkillCategory[]
  experience: CVExperience[]
  education: CVEducation[]
  projects: string[] // References to project IDs
}

// ============================================================================
// Blog/Writing Types
// ============================================================================

export interface BlogPost {
  id?: string
  title: string
  slug: string
  date: string // ISO 8601 - Publication date
  summary: string // Short description/excerpt
  excerpt?: string // Alias for summary (for compatibility)
  content?: string // Full MDX content (optional, not included in list views)
  readingTime?: number // Estimated reading time in minutes
  publishedAt?: string // ISO 8601 (alias for date)
  updatedAt?: string
  tags: string[]
  featured?: boolean
  draft?: boolean // If true, post is hidden in production
  publish?: boolean // If false, post is hidden in all environments (dev and production)
}

// ============================================================================
// Uses Page Types
// ============================================================================

export interface UsesItem {
  name: string
  details?: string
  link?: string
  context: string
  tags?: string[]
  favicon?: string
}

export interface UsesCategory {
  id: string
  title: string
  description?: string
  items: UsesItem[]
}
