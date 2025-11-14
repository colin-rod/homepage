/**
 * Zod Schemas for Runtime Data Validation
 *
 * These schemas validate data loaded from JSON files to catch errors early
 * and ensure type safety at runtime, not just compile time.
 */

import { z } from 'zod'

// ============================================================================
// Timeline Schemas
// ============================================================================

export const TimelineEventTypeSchema = z.enum([
  'job',
  'project',
  'education',
  'milestone',
  'learning',
])

export const TimelineEventSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  organization: z.string().min(1),
  type: TimelineEventTypeSchema,
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .nullable()
    .optional(),
  summary: z.string().min(1),
  description: z.string().optional(),
  tags: z.array(z.string()),
  link: z.string().url().optional(),
  location: z.string().optional(),
})

export const TimelineEventsArraySchema = z.array(TimelineEventSchema)

// ============================================================================
// Project Schemas
// ============================================================================

export const ProjectStatusSchema = z.enum([
  'concept',
  'in-progress',
  'active',
  'completed',
  'live',
  'sunset',
  'planned',
  'retired',
])

export const ProjectTypeSchema = z.enum(['project', 'tool'])

export const LearningSentimentSchema = z.enum(['positive', 'negative', 'neutral'])

export const ProjectQuarterSchema = z.enum(['Q1', 'Q2', 'Q3', 'Q4'])

export const ProjectLearningSchema = z.object({
  content: z.string().min(1),
  sentiment: LearningSentimentSchema,
})

export const ProjectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  detailedDescription: z.union([z.string().min(1), z.array(z.string().min(1))]),
  type: ProjectTypeSchema,
  scope: z.string().optional(),
  prd: z.string().optional(),
  businessModel: z.string().optional(),
  status: ProjectStatusSchema,
  techStack: z.array(z.string()),
  tags: z.array(z.string()),
  whyBuilt: z.union([z.string(), z.array(z.string())]).optional(),
  learnings: z.array(ProjectLearningSchema).optional(),
  favicon: z.string().optional(),
  links: z
    .object({
      live: z.string().url().optional(),
      github: z.string().url().optional(),
      blog: z.string().optional(),
      prd: z.string().url().optional(),
    })
    .optional(),
  images: z.array(z.string()).optional(),
  featured: z.boolean(),
  year: z.number().int().min(2000).max(2100),
  quarter: ProjectQuarterSchema.optional(),
  lastUpdated: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
})

export const ProjectsArraySchema = z.array(ProjectSchema)

// ============================================================================
// CV/Resume Schemas
// ============================================================================

export const CVFilterTypeSchema = z.enum(['all', 'product', 'strategy', 'tech'])

export const CVSkillCategorySchema = z.object({
  category: z.string().min(1),
  items: z.array(z.string().min(1)),
})

export const KPISchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  category: z.enum(['revenue', 'team', 'efficiency', 'growth', 'cost']),
})

export const HighlightEntrySchema = z.object({
  text: z.string().min(1),
  skills: z.array(z.string()).optional(),
})

export const CVExperienceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  company: z.string().min(1),
  icon: z.string().optional(),
  location: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .nullable()
    .optional(),
  description: z.string().min(1),
  highlights: z.array(z.union([z.string(), HighlightEntrySchema])),
  tags: z.array(z.string()),
  skills: z.array(z.string()).optional(),
  kpis: z.array(KPISchema).optional(),
})

export const CVEducationSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  location: z.string().optional(),
  description: z.string().optional(),
})

export const CVFocusMetricsSchema = z.object({
  achievements: z.array(z.string().min(1)),
})

export const CVSchema = z.object({
  summary: z.string().min(1),
  focusSummaries: z
    .object({
      all: z.string().min(1),
      product: z.string().min(1),
      strategy: z.string().min(1),
      tech: z.string().min(1),
    })
    .optional(),
  focusMetrics: z
    .object({
      all: CVFocusMetricsSchema,
      product: CVFocusMetricsSchema,
      strategy: CVFocusMetricsSchema,
      tech: CVFocusMetricsSchema,
    })
    .optional(),
  lastUpdated: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  skills: z.array(CVSkillCategorySchema),
  experience: z.array(CVExperienceSchema),
  education: z.array(CVEducationSchema),
  projects: z.array(z.string()),
})

// ============================================================================
// Uses Page Schemas
// ============================================================================

export const UsesItemSchema = z.object({
  name: z.string().min(1),
  details: z.string().optional(),
  link: z.string().url().optional(),
  context: z.string().min(1),
  tags: z.array(z.string()).optional(),
  favicon: z.string().optional(),
})

export const UsesCategorySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  items: z.array(UsesItemSchema),
})

export const UsesCategoriesArraySchema = z.array(UsesCategorySchema)
