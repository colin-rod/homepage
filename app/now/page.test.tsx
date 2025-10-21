import { render, screen } from '@testing-library/react'
import NowPage from './page'

/**
 * Now Page Tests
 *
 * Tests ensure the now page displays:
 * - Page heading
 * - Current projects/work
 * - Learning/interests
 * - Last updated date
 * - Proper page structure
 */

describe('Now Page', () => {
  describe('Content', () => {
    it('renders the main page heading', () => {
      render(<NowPage />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading.textContent).toMatch(/what.*doing|now/i)
    })

    it('displays current focus or projects', () => {
      render(<NowPage />)
      // Should mention current work or focus areas
      const main = screen.getByRole('main')
      expect(main.textContent).toMatch(/working|focus|building|project/i)
    })

    it('includes learning or interests section', () => {
      render(<NowPage />)
      // Should have content about learning or interests
      const main = screen.getByRole('main')
      expect(main.textContent).toMatch(/learning|exploring|reading|interest/i)
    })

    it('displays last updated information', () => {
      render(<NowPage />)
      // Should show when the page was last updated
      expect(screen.getByText(/last updated:/i)).toBeInTheDocument()
    })
  })

  describe('Structure', () => {
    it('renders within a main element', () => {
      render(<NowPage />)
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('has proper heading hierarchy', () => {
      render(<NowPage />)
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()

      const headings = screen.getAllByRole('heading')
      expect(headings.length).toBeGreaterThan(1)
    })

    it('organizes content in sections', () => {
      const { container } = render(<NowPage />)
      const sections = container.querySelectorAll('section')
      expect(sections.length).toBeGreaterThan(0)
    })
  })

  describe('Styling', () => {
    it('applies proper styling to main content', () => {
      const { container } = render(<NowPage />)
      const main = container.querySelector('main')
      expect(main?.className).toMatch(/py-|px-/)
    })

    it('uses responsive container', () => {
      const { container } = render(<NowPage />)
      const main = container.querySelector('main')
      const responsiveContainer = main?.querySelector('[class*="max-w-"]')
      expect(responsiveContainer).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has a main landmark', () => {
      render(<NowPage />)
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('headings are accessible', () => {
      render(<NowPage />)
      const headings = screen.getAllByRole('heading')
      headings.forEach((heading) => {
        expect(heading).toHaveAccessibleName()
      })
    })
  })
})
