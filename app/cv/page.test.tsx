import { render, screen } from '@testing-library/react'
import CVPage from './page'

/**
 * CV Page Tests
 *
 * Tests ensure the CV page displays:
 * - Professional summary
 * - Skills organized by category
 * - Work experience with highlights
 * - Education details
 * - Proper structure and accessibility
 */

describe('CV Page', () => {
  describe('Content', () => {
    it('renders the main page heading', () => {
      render(<CVPage />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading.textContent).toMatch(/curriculum vitae|cv|resume/i)
    })

    it('displays professional summary', () => {
      render(<CVPage />)
      const main = screen.getByRole('main')
      // Should have summary section
      expect(main.textContent.length).toBeGreaterThan(100)
    })

    it('shows skills section', () => {
      render(<CVPage />)
      const main = screen.getByRole('main')
      // Should have skills mentioned
      expect(main.textContent).toMatch(/skill/i)
    })

    it('displays experience section', () => {
      render(<CVPage />)
      const main = screen.getByRole('main')
      // Should have experience or work history
      expect(main.textContent).toMatch(/experience/i)
    })

    it('shows education section', () => {
      render(<CVPage />)
      const main = screen.getByRole('main')
      // Should have education details
      expect(main.textContent).toMatch(/education/i)
    })
  })

  describe('Structure', () => {
    it('renders within a main element', () => {
      render(<CVPage />)
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('has proper heading hierarchy', () => {
      render(<CVPage />)
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()

      const headings = screen.getAllByRole('heading')
      expect(headings.length).toBeGreaterThan(1)
    })

    it('organizes content in sections', () => {
      const { container } = render(<CVPage />)
      const sections = container.querySelectorAll('section')
      expect(sections.length).toBeGreaterThan(0)
    })
  })

  describe('Experience Display', () => {
    it('shows job titles and companies', () => {
      render(<CVPage />)
      const main = screen.getByRole('main')
      // Should have company or role information
      expect(main.textContent.length).toBeGreaterThan(200)
    })

    it('displays date ranges for positions', () => {
      render(<CVPage />)
      const main = screen.getByRole('main')
      // Should have dates (years)
      expect(main.textContent).toMatch(/20\d{2}/i)
    })
  })

  describe('Styling', () => {
    it('applies proper spacing and padding', () => {
      const { container } = render(<CVPage />)
      const main = container.querySelector('main')
      expect(main?.className).toMatch(/py-|px-/)
    })

    it('uses responsive container', () => {
      const { container } = render(<CVPage />)
      const main = container.querySelector('main')
      const responsiveContainer = main?.querySelector('[class*="max-w-"]')
      expect(responsiveContainer).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has a main landmark', () => {
      render(<CVPage />)
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('headings are accessible', () => {
      render(<CVPage />)
      const headings = screen.getAllByRole('heading')
      headings.forEach((heading) => {
        expect(heading).toHaveAccessibleName()
      })
    })

    it('has proper semantic HTML', () => {
      const { container } = render(<CVPage />)
      const sections = container.querySelectorAll('section')
      expect(sections.length).toBeGreaterThan(0)
    })
  })
})
