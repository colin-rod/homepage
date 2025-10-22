/**
 * Mock data factories for testing
 * These will be expanded as we define our data models in CRO-634
 */

/**
 * Creates a mock project object
 * TODO: Update with actual Project type from lib/types.ts after CRO-634
 */
export function createMockProject(overrides = {}) {
  return {
    id: 'test-project-1',
    title: 'Test Project',
    slug: 'test-project',
    description: 'A test project description',
    detailedDescription: 'Test project summary',
    type: 'project' as const,
    status: 'live' as const,
    techStack: ['Next.js', 'TypeScript', 'Tailwind'],
    tags: ['web', 'product'],
    featured: false,
    year: 2024,
    ...overrides,
  }
}

/**
 * Creates a mock timeline event
 * TODO: Update with actual TimelineEvent type from lib/types.ts after CRO-634
 */
export function createMockTimelineEvent(overrides = {}) {
  return {
    id: 'test-event-1',
    title: 'Test Event',
    organization: 'Test Org',
    type: 'job' as const,
    startDate: '2024-01-01',
    endDate: null,
    summary: 'Test event summary',
    tags: ['product', 'strategy'],
    ...overrides,
  }
}

/**
 * Creates mock CV data
 * TODO: Update with actual CVData type from lib/types.ts after CRO-634
 */
export function createMockCVData(overrides = {}) {
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
 * TODO: Update with actual BlogPost type from lib/types.ts after CRO-634
 */
export function createMockBlogPost(overrides = {}) {
  return {
    slug: 'test-post',
    title: 'Test Blog Post',
    date: '2024-01-01',
    summary: 'Test post summary',
    tags: ['product', 'tech'],
    ...overrides,
  }
}
