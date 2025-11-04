/**
 * Tests for useCVFilters custom hook
 */

import { renderHook, act } from '@testing-library/react'
import { useCVFilters } from './useCVFilters'
import { CV, CVExperience } from '@/lib/types'

describe('useCVFilters', () => {
  const mockCVData: CV = {
    summary: 'Test summary',
    skills: [],
    experience: [
      {
        id: '1',
        title: 'Product Manager',
        company: 'Company A',
        location: 'Remote',
        startDate: '2020-01-01',
        endDate: '2021-01-01',
        description: 'Product role',
        highlights: ['Launched product'],
        tags: ['product'],
        skills: ['Product Management', 'Strategy'],
      },
      {
        id: '2',
        title: 'Strategy Lead',
        company: 'Company B',
        location: 'SF',
        startDate: '2021-01-01',
        endDate: null,
        description: 'Strategy role',
        highlights: ['Drove strategy'],
        tags: ['strategy'],
        skills: ['Strategy', 'Analytics'],
      },
      {
        id: '3',
        title: 'Software Engineer',
        company: 'Company C',
        location: 'NY',
        startDate: '2019-01-01',
        endDate: '2020-01-01',
        description: 'Tech role',
        highlights: ['Built features'],
        tags: ['tech'],
        skills: ['React', 'TypeScript'],
      },
      {
        id: '4',
        title: 'Full Stack PM',
        company: 'Company D',
        location: 'LA',
        startDate: '2018-01-01',
        endDate: '2019-01-01',
        description: 'Hybrid role',
        highlights: ['Did everything'],
        tags: ['product', 'tech'],
        skills: ['Product Management', 'React'],
      },
    ] as CVExperience[],
    education: [],
    projects: [],
  }

  it('should initialize with default filter state', () => {
    const { result } = renderHook(() => useCVFilters(mockCVData))

    expect(result.current.activeFilter).toBe('all')
    expect(result.current.activeSkills.size).toBe(0)
    expect(result.current.expandedRoles.size).toBe(0)
    expect(result.current.filteredExperience).toEqual(mockCVData.experience)
  })

  it('should filter experience by role type', () => {
    const { result } = renderHook(() => useCVFilters(mockCVData))

    act(() => {
      result.current.setActiveFilter('product')
    })

    expect(result.current.activeFilter).toBe('product')
    expect(result.current.filteredExperience).toHaveLength(2)
    expect(result.current.filteredExperience.map((e) => e.id)).toEqual(['1', '4'])
  })

  it('should filter experience by strategy tag', () => {
    const { result } = renderHook(() => useCVFilters(mockCVData))

    act(() => {
      result.current.setActiveFilter('strategy')
    })

    expect(result.current.filteredExperience).toHaveLength(1)
    expect(result.current.filteredExperience[0].id).toBe('2')
  })

  it('should filter experience by tech tag', () => {
    const { result } = renderHook(() => useCVFilters(mockCVData))

    act(() => {
      result.current.setActiveFilter('tech')
    })

    expect(result.current.filteredExperience).toHaveLength(2)
    expect(result.current.filteredExperience.map((e) => e.id)).toEqual(['3', '4'])
  })

  it('should filter experience by single skill', () => {
    const { result } = renderHook(() => useCVFilters(mockCVData))

    act(() => {
      result.current.setActiveSkills(new Set(['React']))
    })

    expect(result.current.filteredExperience).toHaveLength(2)
    expect(result.current.filteredExperience.map((e) => e.id)).toEqual(['3', '4'])
  })

  it('should filter experience by multiple skills (OR logic)', () => {
    const { result } = renderHook(() => useCVFilters(mockCVData))

    act(() => {
      result.current.setActiveSkills(new Set(['React', 'Strategy']))
    })

    // Should match: 1 (Strategy), 2 (Strategy), 3 (React), 4 (React)
    expect(result.current.filteredExperience).toHaveLength(4)
    expect(result.current.filteredExperience.map((e) => e.id)).toEqual(['1', '2', '3', '4'])
  })

  it('should combine role filter AND skill filter', () => {
    const { result } = renderHook(() => useCVFilters(mockCVData))

    act(() => {
      result.current.setActiveFilter('product')
      result.current.setActiveSkills(new Set(['React']))
    })

    // Should only show product roles with React skill
    expect(result.current.filteredExperience).toHaveLength(1)
    expect(result.current.filteredExperience[0].id).toBe('4')
  })

  it('should track expanded roles', () => {
    const { result } = renderHook(() => useCVFilters(mockCVData))

    act(() => {
      result.current.setExpandedRoles(new Set(['1', '2']))
    })

    expect(result.current.expandedRoles.size).toBe(2)
    expect(result.current.expandedRoles.has('1')).toBe(true)
    expect(result.current.expandedRoles.has('2')).toBe(true)
  })

  it('should clear expanded roles when filter changes', () => {
    const { result } = renderHook(() => useCVFilters(mockCVData))

    // First expand some roles
    act(() => {
      result.current.setExpandedRoles(new Set(['1', '2']))
    })

    expect(result.current.expandedRoles.size).toBe(2)

    // Change filter - should clear expanded roles
    act(() => {
      result.current.setActiveFilter('product')
    })

    expect(result.current.expandedRoles.size).toBe(0)
  })

  describe('getFilteredHighlights', () => {
    it('should return all highlights when no skills selected', () => {
      const { result } = renderHook(() => useCVFilters(mockCVData))

      const highlights = [
        { text: 'Highlight 1', skills: ['React'] },
        { text: 'Highlight 2', skills: ['TypeScript'] },
        'String highlight',
      ]

      const filtered = result.current.getFilteredHighlights(highlights, new Set())

      expect(filtered).toHaveLength(3)
      expect(filtered).toEqual(highlights)
    })

    it('should filter highlights by active skills', () => {
      const { result } = renderHook(() => useCVFilters(mockCVData))

      const highlights = [
        { text: 'Highlight 1', skills: ['React'] },
        { text: 'Highlight 2', skills: ['TypeScript'] },
        { text: 'Highlight 3', skills: ['Product Management'] },
      ]

      const filtered = result.current.getFilteredHighlights(highlights, new Set(['React']))

      expect(filtered).toHaveLength(1)
      expect(filtered).toEqual([{ text: 'Highlight 1', skills: ['React'] }])
    })

    it('should always show highlights with no skills tagged', () => {
      const { result } = renderHook(() => useCVFilters(mockCVData))

      const highlights = [
        { text: 'Highlight 1', skills: ['React'] },
        { text: 'Neutral highlight' }, // No skills
        { text: 'Highlight 2', skills: ['TypeScript'] },
      ]

      const filtered = result.current.getFilteredHighlights(
        highlights,
        new Set(['Product Management'])
      )

      // Should only show neutral highlight (no matching skills)
      expect(filtered).toHaveLength(1)
      expect(filtered).toEqual([{ text: 'Neutral highlight' }])
    })

    it('should always show string highlights (backward compatibility)', () => {
      const { result } = renderHook(() => useCVFilters(mockCVData))

      const highlights = [
        { text: 'Highlight 1', skills: ['React'] },
        'String highlight 1',
        'String highlight 2',
      ]

      const filtered = result.current.getFilteredHighlights(
        highlights,
        new Set(['Product Management'])
      )

      // Should show both string highlights (backward compatibility)
      expect(filtered).toHaveLength(2)
      expect(filtered).toEqual(['String highlight 1', 'String highlight 2'])
    })

    it('should handle mixed highlight formats', () => {
      const { result } = renderHook(() => useCVFilters(mockCVData))

      const highlights = [
        { text: 'Has React', skills: ['React'] },
        'String highlight',
        { text: 'Neutral' }, // No skills
        { text: 'Has TS', skills: ['TypeScript'] },
      ]

      const filtered = result.current.getFilteredHighlights(highlights, new Set(['React']))

      expect(filtered).toHaveLength(3)
      expect(filtered).toEqual([
        { text: 'Has React', skills: ['React'] },
        'String highlight',
        { text: 'Neutral' },
      ])
    })
  })
})
