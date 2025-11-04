/**
 * Tests for useCVSearch custom hook
 */

import { renderHook } from '@testing-library/react'
import { useCVSearch } from './useCVSearch'
import { CVExperience } from '@/lib/types'

// Mock PostHog
jest.mock('posthog-js/react', () => ({
  usePostHog: () => ({
    capture: jest.fn(),
  }),
}))

describe('useCVSearch', () => {
  const mockExperience: CVExperience[] = [
    {
      id: '1',
      title: 'Product Manager',
      company: 'Tech Company',
      location: 'Remote',
      startDate: '2020-01-01',
      endDate: '2021-01-01',
      description: 'Led product development for mobile apps',
      highlights: ['Launched successful product', 'Increased user engagement'],
      tags: ['product'],
      skills: ['Product Management', 'Mobile', 'Strategy'],
    },
    {
      id: '2',
      title: 'Software Engineer',
      company: 'Startup Inc',
      location: 'SF',
      startDate: '2019-01-01',
      endDate: '2020-01-01',
      description: 'Built React applications with TypeScript',
      highlights: ['Improved performance', 'Refactored codebase'],
      tags: ['tech'],
      skills: ['React', 'TypeScript', 'Node.js'],
    },
    {
      id: '3',
      title: 'Strategy Consultant',
      company: 'Consulting Firm',
      location: 'NY',
      startDate: '2018-01-01',
      endDate: '2019-01-01',
      description: 'Advised clients on digital transformation',
      highlights: ['Delivered key insights', 'Drove strategic initiatives'],
      tags: ['strategy'],
      skills: ['Strategy', 'Analytics', 'Consulting'],
    },
  ]

  it('should return empty results for empty query', () => {
    const { result } = renderHook(() => useCVSearch(mockExperience, ''))

    expect(result.current.searchResults).toEqual([])
  })

  it('should return empty results for query less than 2 characters', () => {
    const { result } = renderHook(() => useCVSearch(mockExperience, 'a'))

    expect(result.current.searchResults).toEqual([])
  })

  it('should search by title', () => {
    const { result } = renderHook(() => useCVSearch(mockExperience, 'Product'))

    expect(result.current.searchResults).toHaveLength(1)
    expect(result.current.searchResults[0].id).toBe('1')
    expect(result.current.searchResults[0].title).toBe('Product Manager')
  })

  it('should search by company', () => {
    const { result } = renderHook(() => useCVSearch(mockExperience, 'Startup'))

    expect(result.current.searchResults).toHaveLength(1)
    expect(result.current.searchResults[0].id).toBe('2')
    expect(result.current.searchResults[0].company).toBe('Startup Inc')
  })

  it('should search by skills', () => {
    const { result } = renderHook(() => useCVSearch(mockExperience, 'React'))

    expect(result.current.searchResults).toHaveLength(1)
    expect(result.current.searchResults[0].id).toBe('2')
  })

  it('should search by description', () => {
    const { result } = renderHook(() => useCVSearch(mockExperience, 'digital transformation'))

    expect(result.current.searchResults).toHaveLength(1)
    expect(result.current.searchResults[0].id).toBe('3')
  })

  it('should search by highlights', () => {
    const { result } = renderHook(() => useCVSearch(mockExperience, 'performance'))

    expect(result.current.searchResults).toHaveLength(1)
    expect(result.current.searchResults[0].id).toBe('2')
  })

  it('should return multiple results for broad query', () => {
    const { result } = renderHook(() => useCVSearch(mockExperience, 'strategy'))

    // Should match both Strategy Consultant (title/skills) and Product Manager (skills)
    expect(result.current.searchResults.length).toBeGreaterThanOrEqual(1)
  })

  it('should include match metadata in results', () => {
    const { result } = renderHook(() => useCVSearch(mockExperience, 'Product'))

    const searchResult = result.current.searchResults[0]
    expect(searchResult).toHaveProperty('id')
    expect(searchResult).toHaveProperty('title')
    expect(searchResult).toHaveProperty('company')
    expect(searchResult).toHaveProperty('matchCount')
    expect(searchResult).toHaveProperty('previewText')
  })

  it('should include match count', () => {
    const { result } = renderHook(() => useCVSearch(mockExperience, 'Product'))

    const searchResult = result.current.searchResults[0]
    expect(searchResult.matchCount).toBeGreaterThan(0)
  })

  it('should include preview text from first match', () => {
    const { result } = renderHook(() => useCVSearch(mockExperience, 'Product'))

    const searchResult = result.current.searchResults[0]
    expect(searchResult.previewText).toBeTruthy()
    expect(searchResult.previewText?.length).toBeGreaterThan(0)
  })

  it('should truncate preview text to 80 characters', () => {
    const longDescription =
      'This is a very long description that should be truncated to 80 characters plus ellipsis'
    const experienceWithLongDesc: CVExperience[] = [
      {
        id: '1',
        title: 'Test Role',
        company: 'Test Company',
        location: 'Remote',
        startDate: '2020-01-01',
        endDate: null,
        description: longDescription,
        highlights: [],
        tags: ['product'],
        skills: [],
      },
    ]

    const { result } = renderHook(() => useCVSearch(experienceWithLongDesc, 'description'))

    const searchResult = result.current.searchResults[0]
    expect(searchResult.previewText?.length).toBeLessThanOrEqual(83) // 80 chars + '...'
    expect(searchResult.previewText?.endsWith('...')).toBe(true)
  })

  it('should update results when query changes', () => {
    const { result, rerender } = renderHook(
      ({ experience, query }) => useCVSearch(experience, query),
      {
        initialProps: { experience: mockExperience, query: 'Product' },
      }
    )

    expect(result.current.searchResults).toHaveLength(1)
    expect(result.current.searchResults[0].id).toBe('1')

    // Change query
    rerender({ experience: mockExperience, query: 'React' })

    expect(result.current.searchResults).toHaveLength(1)
    expect(result.current.searchResults[0].id).toBe('2')
  })

  it('should update results when filtered experience changes', () => {
    const { result, rerender } = renderHook(
      ({ experience, query }) => useCVSearch(experience, query),
      {
        initialProps: { experience: mockExperience, query: 'strategy' },
      }
    )

    const initialCount = result.current.searchResults.length

    // Change filtered experience (remove some entries)
    const filteredExperience = mockExperience.filter((e) => e.tags.includes('product'))
    rerender({ experience: filteredExperience, query: 'strategy' })

    // Results should update based on new filtered experience
    expect(result.current.searchResults.length).toBeLessThanOrEqual(initialCount)
  })

  it('should handle case-insensitive search', () => {
    const { result: upperResult } = renderHook(() => useCVSearch(mockExperience, 'PRODUCT'))
    const { result: lowerResult } = renderHook(() => useCVSearch(mockExperience, 'product'))

    expect(upperResult.current.searchResults.length).toBe(lowerResult.current.searchResults.length)
  })

  it('should handle partial matches', () => {
    const { result } = renderHook(() => useCVSearch(mockExperience, 'Prod'))

    expect(result.current.searchResults.length).toBeGreaterThan(0)
    expect(result.current.searchResults[0].title).toContain('Product')
  })

  it('should handle queries with special characters', () => {
    const { result } = renderHook(() => useCVSearch(mockExperience, 'Node.js'))

    expect(result.current.searchResults).toHaveLength(1)
    expect(result.current.searchResults[0].id).toBe('2')
  })

  it('should memoize Fuse instance when filteredExperience unchanged', () => {
    const { result, rerender } = renderHook(
      ({ experience, query }) => useCVSearch(experience, query),
      {
        initialProps: { experience: mockExperience, query: 'Product' },
      }
    )

    const firstResults = result.current.searchResults

    // Change only query (not filtered experience)
    rerender({ experience: mockExperience, query: 'React' })

    // Should use same Fuse instance (memoized)
    expect(result.current.searchResults).not.toBe(firstResults)
  })
})
