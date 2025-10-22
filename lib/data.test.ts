/**
 * Tests for data loading utilities
 */

import {
  getProjects,
  getProjectBySlug,
  getFeaturedProjects,
  getProjectsByTag,
  getProjectsByType,
  getProjectsOnly,
  getTools,
  getTimelineEvents,
  getTimelineEventsByType,
  getTimelineEventsByTag,
  getCVData,
  getFilteredCVData,
  getAllProjectTags,
  getAllTimelineTags,
} from './data'

describe('Project Data Utilities', () => {
  describe('getProjects', () => {
    it('returns an array of projects', () => {
      const projects = getProjects()
      expect(Array.isArray(projects)).toBe(true)
      expect(projects.length).toBeGreaterThan(0)
    })

    it('returns projects with required fields', () => {
      const projects = getProjects()
      const project = projects[0]

      expect(project).toHaveProperty('id')
      expect(project).toHaveProperty('title')
      expect(project).toHaveProperty('slug')
      expect(project).toHaveProperty('description')
      expect(project).toHaveProperty('summary')
      expect(project).toHaveProperty('type')
      expect(project).toHaveProperty('status')
      expect(project).toHaveProperty('techStack')
      expect(project).toHaveProperty('tags')
      expect(project).toHaveProperty('featured')
      expect(project).toHaveProperty('year')
    })

    it('returns projects with valid type values', () => {
      const projects = getProjects()
      const validTypes = ['project', 'tool']

      projects.forEach((project) => {
        expect(validTypes).toContain(project.type)
      })
    })

    it('returns projects with valid status values', () => {
      const projects = getProjects()
      const validStatuses = ['concept', 'in-progress', 'active', 'completed', 'live', 'sunset']

      projects.forEach((project) => {
        expect(validStatuses).toContain(project.status)
      })
    })
  })

  describe('getProjectBySlug', () => {
    it('returns a project when slug exists', () => {
      const projects = getProjects()
      const firstProject = projects[0]
      const found = getProjectBySlug(firstProject.slug)

      expect(found).toBeDefined()
      expect(found?.slug).toBe(firstProject.slug)
    })

    it('returns undefined when slug does not exist', () => {
      const found = getProjectBySlug('non-existent-slug')
      expect(found).toBeUndefined()
    })
  })

  describe('getFeaturedProjects', () => {
    it('returns only featured projects', () => {
      const featured = getFeaturedProjects()
      expect(Array.isArray(featured)).toBe(true)

      featured.forEach((project) => {
        expect(project.featured).toBe(true)
      })
    })

    it('returns fewer or equal projects than total', () => {
      const all = getProjects()
      const featured = getFeaturedProjects()

      expect(featured.length).toBeLessThanOrEqual(all.length)
    })
  })

  describe('getProjectsByTag', () => {
    it('returns projects matching the specified tag', () => {
      const projects = getProjects()

      // Find a tag that exists in the data
      const firstProjectTag = projects[0].tags[0]
      const filtered = getProjectsByTag(firstProjectTag)

      expect(Array.isArray(filtered)).toBe(true)
      filtered.forEach((project) => {
        expect(project.tags).toContain(firstProjectTag)
      })
    })

    it('returns empty array when tag does not exist', () => {
      const filtered = getProjectsByTag('non-existent-tag')
      expect(filtered).toEqual([])
    })
  })

  describe('getAllProjectTags', () => {
    it('returns an array of unique tags', () => {
      const tags = getAllProjectTags()
      expect(Array.isArray(tags)).toBe(true)

      // Check uniqueness
      const uniqueTags = new Set(tags)
      expect(uniqueTags.size).toBe(tags.length)
    })

    it('returns sorted tags', () => {
      const tags = getAllProjectTags()
      const sorted = [...tags].sort()
      expect(tags).toEqual(sorted)
    })
  })

  describe('getProjectsByType', () => {
    it('returns only projects when type is "project"', () => {
      const projects = getProjectsByType('project')
      expect(Array.isArray(projects)).toBe(true)

      projects.forEach((project) => {
        expect(project.type).toBe('project')
      })
    })

    it('returns only tools when type is "tool"', () => {
      const tools = getProjectsByType('tool')
      expect(Array.isArray(tools)).toBe(true)

      tools.forEach((tool) => {
        expect(tool.type).toBe('tool')
      })
    })

    it('combines to equal total projects', () => {
      const all = getProjects()
      const projects = getProjectsByType('project')
      const tools = getProjectsByType('tool')

      expect(projects.length + tools.length).toBe(all.length)
    })
  })

  describe('getProjectsOnly', () => {
    it('returns only items with type "project"', () => {
      const projects = getProjectsOnly()
      expect(Array.isArray(projects)).toBe(true)

      projects.forEach((project) => {
        expect(project.type).toBe('project')
      })
    })

    it('returns same result as getProjectsByType("project")', () => {
      const fromHelper = getProjectsOnly()
      const fromType = getProjectsByType('project')

      expect(fromHelper).toEqual(fromType)
    })
  })

  describe('getTools', () => {
    it('returns only items with type "tool"', () => {
      const tools = getTools()
      expect(Array.isArray(tools)).toBe(true)

      tools.forEach((tool) => {
        expect(tool.type).toBe('tool')
      })
    })

    it('returns same result as getProjectsByType("tool")', () => {
      const fromHelper = getTools()
      const fromType = getProjectsByType('tool')

      expect(fromHelper).toEqual(fromType)
    })
  })
})

describe('Timeline Data Utilities', () => {
  describe('getTimelineEvents', () => {
    it('returns an array of timeline events', () => {
      const events = getTimelineEvents()
      expect(Array.isArray(events)).toBe(true)
    })

    it('returns events with required fields', () => {
      const events = getTimelineEvents()

      if (events.length > 0) {
        const event = events[0]
        expect(event).toHaveProperty('id')
        expect(event).toHaveProperty('title')
        expect(event).toHaveProperty('organization')
        expect(event).toHaveProperty('type')
        expect(event).toHaveProperty('startDate')
        expect(event).toHaveProperty('summary')
        expect(event).toHaveProperty('tags')
      }
    })

    it('returns events with valid type values', () => {
      const events = getTimelineEvents()
      const validTypes = ['job', 'project', 'education', 'milestone', 'learning']

      events.forEach((event) => {
        expect(validTypes).toContain(event.type)
      })
    })
  })

  describe('getTimelineEventsByType', () => {
    it('returns events matching the specified type', () => {
      const events = getTimelineEvents()

      if (events.length > 0) {
        const firstEventType = events[0].type
        const filtered = getTimelineEventsByType(firstEventType)

        filtered.forEach((event) => {
          expect(event.type).toBe(firstEventType)
        })
      }
    })

    it('returns empty array when type does not exist', () => {
      const filtered = getTimelineEventsByType('non-existent-type')
      expect(filtered).toEqual([])
    })
  })

  describe('getTimelineEventsByTag', () => {
    it('returns events matching the specified tag', () => {
      const events = getTimelineEvents()

      if (events.length > 0 && events[0].tags.length > 0) {
        const firstEventTag = events[0].tags[0]
        const filtered = getTimelineEventsByTag(firstEventTag)

        filtered.forEach((event) => {
          expect(event.tags).toContain(firstEventTag)
        })
      }
    })

    it('returns empty array when tag does not exist', () => {
      const filtered = getTimelineEventsByTag('non-existent-tag')
      expect(filtered).toEqual([])
    })
  })

  describe('getAllTimelineTags', () => {
    it('returns an array of unique tags', () => {
      const tags = getAllTimelineTags()
      expect(Array.isArray(tags)).toBe(true)

      // Check uniqueness
      const uniqueTags = new Set(tags)
      expect(uniqueTags.size).toBe(tags.length)
    })

    it('returns sorted tags', () => {
      const tags = getAllTimelineTags()
      const sorted = [...tags].sort()
      expect(tags).toEqual(sorted)
    })
  })
})

describe('CV Data Utilities', () => {
  describe('getCVData', () => {
    it('returns CV data object', () => {
      const cv = getCVData()
      expect(cv).toBeDefined()
      expect(typeof cv).toBe('object')
    })

    it('returns CV with required fields', () => {
      const cv = getCVData()
      expect(cv).toHaveProperty('summary')
      expect(cv).toHaveProperty('skills')
      expect(cv).toHaveProperty('experience')
      expect(cv).toHaveProperty('education')
      expect(cv).toHaveProperty('projects')
    })

    it('returns CV with array fields', () => {
      const cv = getCVData()
      expect(Array.isArray(cv.skills)).toBe(true)
      expect(Array.isArray(cv.experience)).toBe(true)
      expect(Array.isArray(cv.education)).toBe(true)
      expect(Array.isArray(cv.projects)).toBe(true)
    })
  })

  describe('getFilteredCVData', () => {
    it('returns full CV when no filter is provided', () => {
      const full = getCVData()
      const filtered = getFilteredCVData()

      expect(filtered).toEqual(full)
    })

    it('returns full CV when filter is "all"', () => {
      const full = getCVData()
      const filtered = getFilteredCVData('all')

      expect(filtered).toEqual(full)
    })

    it('filters experience by tag', () => {
      const cv = getCVData()

      if (cv.experience.length > 0 && cv.experience[0].tags.length > 0) {
        const tag = cv.experience[0].tags[0]
        const filtered = getFilteredCVData(tag)

        expect(filtered).toHaveProperty('experience')
        filtered.experience.forEach((exp) => {
          expect(exp.tags).toContain(tag)
        })
      }
    })

    it('preserves other CV fields when filtering', () => {
      const cv = getCVData()
      const filtered = getFilteredCVData('product')

      expect(filtered.summary).toBe(cv.summary)
      expect(filtered.skills).toEqual(cv.skills)
      expect(filtered.education).toEqual(cv.education)
      expect(filtered.projects).toEqual(cv.projects)
    })

    it('returns empty experience array when no matches', () => {
      const filtered = getFilteredCVData('non-existent-tag')
      expect(filtered.experience).toEqual([])
    })
  })
})
