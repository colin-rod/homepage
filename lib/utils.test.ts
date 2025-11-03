import {
  cn,
  formatDate,
  formatDateRange,
  calculateDuration,
  formatDuration,
  slugify,
  truncate,
  getInitials,
} from './utils'

describe('Utility Functions', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      const result = cn('text-red-500', 'bg-blue-500')
      expect(result).toBe('text-red-500 bg-blue-500')
    })

    it('handles Tailwind conflicts with merge', () => {
      const result = cn('px-4', 'px-6')
      expect(result).toBe('px-6')
    })

    it('handles conditional classes', () => {
      const isActive = true
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toBe('base-class active-class')
    })

    it('filters out falsy values', () => {
      const result = cn('class1', false, 'class2', null, undefined)
      expect(result).toBe('class1 class2')
    })
  })

  describe('formatDate', () => {
    it('formats date string correctly', () => {
      const result = formatDate('2024-01-15')
      expect(result).toBe('Jan 15, 2024')
    })

    it('handles different date formats', () => {
      const result = formatDate('2023-12-31')
      expect(result).toBe('Dec 31, 2023')
    })
  })

  describe('formatDateRange', () => {
    it('formats date range with both start and end dates', () => {
      const result = formatDateRange('2023-01-01', '2024-12-31')
      expect(result).toBe('Jan 2023 - Dec 2024')
    })

    it('formats date range with only start date (Present)', () => {
      const result = formatDateRange('2023-06-15')
      expect(result).toBe('Jun 2023 - Present')
    })

    it('handles null end date as Present', () => {
      const result = formatDateRange('2024-03-01', null)
      expect(result).toBe('Mar 2024 - Present')
    })

    it('handles undefined end date as Present', () => {
      const result = formatDateRange('2024-03-01', undefined)
      expect(result).toBe('Mar 2024 - Present')
    })

    it('formats same year correctly', () => {
      const result = formatDateRange('2024-01-01', '2024-06-30')
      expect(result).toBe('Jan 2024 - Jun 2024')
    })
  })

  describe('calculateDuration', () => {
    it('calculates duration between two dates in months', () => {
      const result = calculateDuration('2023-01-01', '2024-01-01')
      expect(result).toBe(12)
    })

    it('calculates duration with no end date (to present)', () => {
      const result = calculateDuration('2024-01-01')
      const now = new Date()
      const start = new Date('2024-01-01')
      const expectedMonths =
        (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
      expect(result).toBe(expectedMonths)
    })

    it('calculates partial year correctly', () => {
      const result = calculateDuration('2023-03-15', '2024-07-15')
      expect(result).toBe(16) // 16 months
    })

    it('handles same month and year', () => {
      const result = calculateDuration('2024-05-01', '2024-05-31')
      expect(result).toBe(0)
    })

    it('handles null end date', () => {
      const result = calculateDuration('2024-01-01', null)
      const now = new Date()
      const start = new Date('2024-01-01')
      const expectedMonths =
        (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
      expect(result).toBe(expectedMonths)
    })
  })

  describe('formatDuration', () => {
    it('formats duration less than 12 months', () => {
      expect(formatDuration(1)).toBe('1 month')
      expect(formatDuration(6)).toBe('6 months')
      expect(formatDuration(11)).toBe('11 months')
    })

    it('formats duration of exactly 1 year', () => {
      expect(formatDuration(12)).toBe('1 year')
    })

    it('formats duration of multiple years', () => {
      expect(formatDuration(24)).toBe('2 years')
      expect(formatDuration(36)).toBe('3 years')
    })

    it('formats duration with years and months', () => {
      expect(formatDuration(13)).toBe('1 year, 1 month')
      expect(formatDuration(14)).toBe('1 year, 2 months')
      expect(formatDuration(25)).toBe('2 years, 1 month')
      expect(formatDuration(30)).toBe('2 years, 6 months')
    })

    it('formats zero months', () => {
      expect(formatDuration(0)).toBe('0 months')
    })
  })

  describe('slugify', () => {
    it('converts text to lowercase', () => {
      expect(slugify('Hello World')).toBe('hello-world')
    })

    it('replaces spaces with hyphens', () => {
      expect(slugify('Product Strategy Role')).toBe('product-strategy-role')
    })

    it('removes special characters', () => {
      expect(slugify('Hello! World?')).toBe('hello-world')
      expect(slugify('Test@Email.com')).toBe('testemailcom')
    })

    it('handles multiple spaces', () => {
      expect(slugify('Hello    World')).toBe('hello-world')
    })

    it('removes leading/trailing spaces', () => {
      expect(slugify('  Hello World  ')).toBe('hello-world')
    })

    it('handles multiple consecutive hyphens', () => {
      expect(slugify('Hello---World')).toBe('hello-world')
    })

    it('preserves hyphens in text', () => {
      expect(slugify('next-js-project')).toBe('next-js-project')
    })

    it('handles empty string', () => {
      expect(slugify('')).toBe('')
    })

    it('handles already slugified text', () => {
      expect(slugify('already-slugified')).toBe('already-slugified')
    })
  })

  describe('truncate', () => {
    it('truncates text longer than specified length', () => {
      const text = 'This is a very long piece of text that needs truncation'
      const result = truncate(text, 20)
      expect(result).toBe('This is a very long...')
      expect(result.length).toBeLessThanOrEqual(23) // 20 + '...'
    })

    it('does not truncate text shorter than specified length', () => {
      const text = 'Short text'
      const result = truncate(text, 20)
      expect(result).toBe('Short text')
    })

    it('does not truncate text equal to specified length', () => {
      const text = 'Exactly twenty chars'
      const result = truncate(text, 20)
      expect(result).toBe('Exactly twenty chars')
    })

    it('handles empty string', () => {
      expect(truncate('', 10)).toBe('')
    })

    it('trims whitespace before adding ellipsis', () => {
      const text = 'Text with trailing spaces   '
      const result = truncate(text, 10)
      expect(result).toBe('Text with...')
    })

    it('handles very short length', () => {
      const result = truncate('Hello World', 5)
      expect(result).toBe('Hello...')
    })
  })

  describe('getInitials', () => {
    it('gets initials from full name', () => {
      expect(getInitials('John Doe')).toBe('JD')
    })

    it('gets initials from three-part name', () => {
      expect(getInitials('John Paul Smith')).toBe('JP')
    })

    it('gets initials from single name', () => {
      expect(getInitials('John')).toBe('J')
    })

    it('converts to uppercase', () => {
      expect(getInitials('john doe')).toBe('JD')
    })

    it('handles names with multiple spaces', () => {
      expect(getInitials('John   Doe')).toBe('JD')
    })

    it('limits to 2 characters', () => {
      expect(getInitials('John Paul George Ringo')).toBe('JP')
    })

    it('handles empty string', () => {
      expect(getInitials('')).toBe('')
    })

    it('handles hyphenated names', () => {
      expect(getInitials('Mary-Jane Watson')).toBe('MW')
    })
  })
})
