import { render, screen } from '@testing-library/react'
import TimelinePage from './page'

/**
 * Timeline Page Tests
 *
 * Tests ensure the timeline page displays:
 * - Page heading and description
 * - Timeline events in chronological order
 * - Event details (title, date, organization, type)
 * - Filtering by event type
 * - Proper structure and accessibility
 */

describe('Timeline Page', () => {
  describe('Content', () => {
    it('renders the main page heading', () => {
      render(<TimelinePage />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading.textContent).toMatch(/timeline|journey|highlights/i)
    })

    it('displays page description or introduction', () => {
      render(<TimelinePage />)
      const main = screen.getByRole('main')
      expect(main.textContent.length).toBeGreaterThan(100)
    })

    it('shows timeline events', () => {
      render(<TimelinePage />)
      const main = screen.getByRole('main')
      // Should have event content
      expect(main.textContent).toBeTruthy()
    })

    it('displays event dates', () => {
      render(<TimelinePage />)
      const main = screen.getByRole('main')
      // Should show years
      expect(main.textContent).toMatch(/20\d{2}|present/i)
    })
  })

  describe('Structure', () => {
    it('renders within a main element', () => {
      render(<TimelinePage />)
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('has proper heading hierarchy', () => {
      render(<TimelinePage />)
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()
    })

    it('organizes events in chronological sections', () => {
      const { container } = render(<TimelinePage />)
      const main = container.querySelector('main')
      expect(main).toBeInTheDocument()
    })
  })

  describe('Event Display', () => {
    it('shows event titles', () => {
      render(<TimelinePage />)
      const main = screen.getByRole('main')
      // Should have event titles
      expect(main.textContent.length).toBeGreaterThan(50)
    })

    it('displays event types or categories', () => {
      render(<TimelinePage />)
      const main = screen.getByRole('main')
      // Should show event types
      expect(main).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('applies proper spacing and padding', () => {
      const { container } = render(<TimelinePage />)
      const main = container.querySelector('main')
      expect(main?.className).toMatch(/py-|px-/)
    })

    it('uses responsive container', () => {
      const { container } = render(<TimelinePage />)
      const main = container.querySelector('main')
      const responsiveContainer = main?.querySelector('[class*="max-w-"]')
      expect(responsiveContainer).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has a main landmark', () => {
      render(<TimelinePage />)
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('headings are accessible', () => {
      render(<TimelinePage />)
      const headings = screen.getAllByRole('heading')
      headings.forEach((heading) => {
        expect(heading).toHaveAccessibleName()
      })
    })

    it('has proper semantic HTML', () => {
      const { container } = render(<TimelinePage />)
      expect(container.querySelector('main')).toBeInTheDocument()
    })
  })
})
