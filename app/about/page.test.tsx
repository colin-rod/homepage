import { render, screen } from '@testing-library/react'
import AboutPage from './page'

/**
 * About Page Tests
 *
 * Tests ensure the about page displays:
 * - Page heading
 * - Professional background section
 * - Skills/expertise section
 * - Personal interests (optional)
 * - Proper page structure and SEO
 */

describe('About Page', () => {
  describe('Content', () => {
    it('renders the main page heading', () => {
      render(<AboutPage />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading.textContent).toMatch(/about/i)
    })

    it('displays professional background section', () => {
      render(<AboutPage />)
      // Should have content about professional journey
      expect(screen.getByText(/fatherhood/i)).toBeInTheDocument()
    })

    it('displays skills or expertise section', () => {
      render(<AboutPage />)
      // Should mention building, creating, or professional background
      const page = screen.getByRole('main')
      expect(page.textContent).toMatch(/building|curiosity|builder/i)
    })

    it('includes introductory text', () => {
      render(<AboutPage />)
      // Should have substantial introductory content
      const main = screen.getByRole('main')
      expect(main.textContent?.length).toBeGreaterThan(100)
    })
  })

  describe('Structure', () => {
    it('renders within a main element', () => {
      render(<AboutPage />)
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('has proper heading hierarchy', () => {
      render(<AboutPage />)
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()

      const headings = screen.getAllByRole('heading')
      expect(headings.length).toBeGreaterThan(1)
    })

    it('organizes content in sections', () => {
      const { container } = render(<AboutPage />)
      const sections = container.querySelectorAll('section')
      expect(sections.length).toBeGreaterThan(0)
    })
  })

  describe('Styling', () => {
    it('applies proper styling to main content', () => {
      const { container } = render(<AboutPage />)
      const main = container.querySelector('main')
      expect(main?.className).toMatch(/pt-|pb-/)
    })

    it('uses responsive container', () => {
      const { container } = render(<AboutPage />)
      const main = container.querySelector('main')
      const responsiveContainer = main?.querySelector('[class*="max-w-"]')
      expect(responsiveContainer).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has a main landmark', () => {
      render(<AboutPage />)
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('headings are accessible', () => {
      render(<AboutPage />)
      const headings = screen.getAllByRole('heading')
      headings.forEach((heading) => {
        expect(heading).toHaveAccessibleName()
      })
    })
  })
})
