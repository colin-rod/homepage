import type { Project, TimelineEvent, CV, BlogPost } from '@/lib/types'

/**
 * Mock data factories for testing
 * Uses actual type definitions from lib/types.ts
 */

/**
 * Creates a mock project object
 */
export function createMockProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'test-project-1',
    title: 'Test Project',
    slug: 'test-project',
    description: 'A test project description',
    detailedDescription: 'Test project summary',
    type: 'project',
    status: 'live',
    techStack: ['Next.js', 'TypeScript', 'Tailwind'],
    tags: ['web', 'product'],
    featured: false,
    year: 2024,
    quarter: 'Q1',
    ...overrides,
  }
}

/**
 * Creates a mock timeline event
 */
export function createMockTimelineEvent(overrides: Partial<TimelineEvent> = {}): TimelineEvent {
  return {
    id: 'test-event-1',
    title: 'Test Event',
    organization: 'Test Org',
    type: 'job',
    startDate: '2024-01-01',
    endDate: null,
    summary: 'Test event summary',
    tags: ['product', 'strategy'],
    ...overrides,
  }
}

/**
 * Creates mock CV data
 */
export function createMockCVData(overrides: Partial<CV> = {}): CV {
  return {
    summary: 'Professional summary',
    skills: [
      {
        category: 'Product',
        items: ['Product Management', 'Strategy'],
      },
    ],
    experience: [
      {
        id: 'exp-1',
        title: 'Product Manager',
        company: 'Test Company',
        location: 'Remote',
        startDate: '2024-01-01',
        endDate: null,
        description: 'Test description',
        highlights: ['Achievement 1', 'Achievement 2'],
        tags: ['product'],
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science',
        institution: 'Test University',
        year: 2020,
      },
    ],
    projects: ['test-project-1'],
    ...overrides,
  }
}

/**
 * Creates mock blog post metadata
 */
export function createMockBlogPost(overrides: Partial<BlogPost> = {}): BlogPost {
  return {
    slug: 'test-post',
    title: 'Test Blog Post',
    date: '2024-01-01',
    summary: 'Test post summary',
    tags: ['product', 'tech'],
    ...overrides,
  }
}
