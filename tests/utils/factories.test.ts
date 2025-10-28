import {
  createMockProject,
  createMockTimelineEvent,
  createMockCVData,
  createMockBlogPost,
} from './factories'

describe('Test Factories', () => {
  describe('createMockProject', () => {
    it('creates a mock project with default values', () => {
      const project = createMockProject()

      expect(project).toHaveProperty('id')
      expect(project).toHaveProperty('title')
      expect(project).toHaveProperty('slug')
      expect(project.status).toBe('live')
    })

    it('allows overriding default values', () => {
      const project = createMockProject({
        title: 'Custom Title',
        status: 'concept',
      })

      expect(project.title).toBe('Custom Title')
      expect(project.status).toBe('concept')
    })
  })

  describe('createMockTimelineEvent', () => {
    it('creates a mock timeline event with default values', () => {
      const event = createMockTimelineEvent()

      expect(event).toHaveProperty('id')
      expect(event).toHaveProperty('title')
      expect(event.type).toBe('job')
    })

    it('allows overriding default values', () => {
      const event = createMockTimelineEvent({
        title: 'Custom Event',
        type: 'project',
      })

      expect(event.title).toBe('Custom Event')
      expect(event.type).toBe('project')
    })
  })

  describe('createMockCVData', () => {
    it('creates mock CV data with default values', () => {
      const cv = createMockCVData()

      expect(cv).toHaveProperty('summary')
      expect(cv).toHaveProperty('skills')
      expect(cv).toHaveProperty('experience')
      expect(cv).toHaveProperty('education')
      expect(Array.isArray(cv.skills)).toBe(true)
    })

    it('allows overriding default values', () => {
      const cv = createMockCVData({
        summary: 'Custom summary',
      })

      expect(cv.summary).toBe('Custom summary')
    })
  })

  describe('createMockBlogPost', () => {
    it('creates a mock blog post with default values', () => {
      const post = createMockBlogPost()

      expect(post).toHaveProperty('slug')
      expect(post).toHaveProperty('title')
      expect(post).toHaveProperty('date')
      expect(Array.isArray(post.tags)).toBe(true)
    })

    it('allows overriding default values', () => {
      const post = createMockBlogPost({
        title: 'Custom Post',
      })

      expect(post.title).toBe('Custom Post')
    })
  })
})
