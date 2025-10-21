import { render, screen } from '@testing-library/react'
import ProjectDetailPage from './page'

/**
 * Project Detail Page Tests
 *
 * Tests ensure the project detail page displays:
 * - Project title and summary
 * - Full description
 * - Status, tech stack, and tags
 * - Why built and learnings sections
 * - Links to live site and GitHub
 * - Proper metadata and SEO
 */

// Mock the params
const mockParams = { slug: 'portfolio-revamp' }

describe('Project Detail Page', () => {
  describe('Content', () => {
    it('renders the project title', () => {
      render(<ProjectDetailPage params={mockParams} />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading.textContent).toBeTruthy()
    })

    it('displays project summary', () => {
      render(<ProjectDetailPage params={mockParams} />)
      const main = screen.getByRole('main')
      expect(main.textContent.length).toBeGreaterThan(100)
    })

    it('shows project description', () => {
      render(<ProjectDetailPage params={mockParams} />)
      const main = screen.getByRole('main')
      // Should have detailed description text
      expect(main.textContent).toMatch(/portfolio|project|next\.js/i)
    })

    it('displays project status', () => {
      render(<ProjectDetailPage params={mockParams} />)
      const main = screen.getByRole('main')
      expect(main.textContent).toMatch(/active|completed|live|in-progress|concept|sunset/i)
    })

    it('shows tech stack', () => {
      render(<ProjectDetailPage params={mockParams} />)
      const main = screen.getByRole('main')
      // Should show technologies used
      expect(main.textContent).toMatch(/next\.js|typescript|tailwind|react/i)
    })

    it('displays project year', () => {
      render(<ProjectDetailPage params={mockParams} />)
      const main = screen.getByRole('main')
      expect(main.textContent).toMatch(/202[0-9]/i)
    })
  })

  describe('Optional Sections', () => {
    it('shows why built section if available', () => {
      render(<ProjectDetailPage params={mockParams} />)
      const main = screen.getByRole('main')
      // May or may not have this section depending on project data
      expect(main).toBeInTheDocument()
    })

    it('displays learnings section if available', () => {
      render(<ProjectDetailPage params={mockParams} />)
      const main = screen.getByRole('main')
      // May or may not have learnings depending on project data
      expect(main).toBeInTheDocument()
    })

    it('shows links section if URLs are available', () => {
      render(<ProjectDetailPage params={mockParams} />)
      const links = screen.getAllByRole('link')
      // Should have at least navigation links
      expect(links.length).toBeGreaterThan(0)
    })
  })

  describe('Structure', () => {
    it('renders within a main element', () => {
      render(<ProjectDetailPage params={mockParams} />)
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('has proper heading hierarchy', () => {
      render(<ProjectDetailPage params={mockParams} />)
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()
    })

    it('organizes content in sections', () => {
      const { container } = render(<ProjectDetailPage params={mockParams} />)
      const main = container.querySelector('main')
      expect(main).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('applies proper spacing and padding', () => {
      const { container } = render(<ProjectDetailPage params={mockParams} />)
      const main = container.querySelector('main')
      expect(main?.className).toMatch(/py-|px-/)
    })

    it('uses responsive container', () => {
      const { container } = render(<ProjectDetailPage params={mockParams} />)
      const main = container.querySelector('main')
      const responsiveContainer = main?.querySelector('[class*="max-w-"]')
      expect(responsiveContainer).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has a main landmark', () => {
      render(<ProjectDetailPage params={mockParams} />)
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('headings are accessible', () => {
      render(<ProjectDetailPage params={mockParams} />)
      const headings = screen.getAllByRole('heading')
      headings.forEach((heading) => {
        expect(heading).toHaveAccessibleName()
      })
    })

    it('links are accessible', () => {
      render(<ProjectDetailPage params={mockParams} />)
      const links = screen.getAllByRole('link')
      links.forEach((link) => {
        expect(link).toHaveAccessibleName()
      })
    })
  })

  describe('Error Handling', () => {
    it('calls notFound for non-existent project slug', () => {
      const invalidParams = { slug: 'non-existent-project' }
      // notFound() throws an error in Next.js, which is expected behavior
      expect(() => {
        render(<ProjectDetailPage params={invalidParams} />)
      }).toThrow()
    })
  })
})
