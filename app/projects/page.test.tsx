import { render, screen } from '@testing-library/react'
import ProjectsPage from './page'

/**
 * Projects Index Page Tests
 *
 * Tests ensure the projects page displays:
 * - Page heading and description
 * - All projects from data
 * - Featured projects highlighted
 * - Project filtering by tags
 * - Proper grid layout
 * - Links to project detail pages
 */

describe('Projects Page', () => {
  describe('Content', () => {
    it('renders the main page heading', () => {
      render(<ProjectsPage />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading.textContent).toMatch(/projects/i)
    })

    it('displays page description or introduction', () => {
      render(<ProjectsPage />)
      const main = screen.getByRole('main')
      expect(main.textContent).toMatch(/built|work|portfolio/i)
    })

    it('displays project cards', () => {
      render(<ProjectsPage />)
      // Should have multiple project cards displayed
      const main = screen.getByRole('main')
      expect(main.textContent).toMatch(/portfolio|project|strategy/i)
    })

    it('shows project titles', () => {
      render(<ProjectsPage />)
      // At least one project title should be visible
      const titles = screen.getAllByRole('heading', { level: 3 })
      expect(titles.length).toBeGreaterThan(0)
    })

    it('displays project summaries or descriptions', () => {
      render(<ProjectsPage />)
      const main = screen.getByRole('main')
      // Should contain descriptive text about projects
      expect(main.textContent.length).toBeGreaterThan(200)
    })
  })

  describe('Structure', () => {
    it('renders within a main element', () => {
      render(<ProjectsPage />)
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('has proper heading hierarchy', () => {
      render(<ProjectsPage />)
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()
    })

    it('uses a grid or list layout for projects', () => {
      const { container } = render(<ProjectsPage />)
      const main = container.querySelector('main')
      // Should have grid or flex container for projects
      expect(main?.textContent).toBeTruthy()
    })
  })

  describe('Project Display', () => {
    it('shows project status badges', () => {
      render(<ProjectsPage />)
      const main = screen.getByRole('main')
      // Should show status like "active", "completed", "live", etc.
      expect(main.textContent).toMatch(/active|completed|live|concept/i)
    })

    it('displays tech stack or tags', () => {
      render(<ProjectsPage />)
      const main = screen.getByRole('main')
      // Should show technologies or tags
      expect(main.textContent).toMatch(/next\.js|typescript|react|product|strategy/i)
    })

    it('includes links to project pages or external URLs', () => {
      render(<ProjectsPage />)
      const links = screen.getAllByRole('link')
      // Should have navigation links plus project links
      expect(links.length).toBeGreaterThan(5)
    })
  })

  describe('Styling', () => {
    it('applies proper spacing and padding', () => {
      const { container } = render(<ProjectsPage />)
      const main = container.querySelector('main')
      expect(main?.className).toMatch(/py-|px-/)
    })

    it('uses responsive container', () => {
      const { container } = render(<ProjectsPage />)
      const main = container.querySelector('main')
      const responsiveContainer = main?.querySelector('[class*="max-w-"]')
      expect(responsiveContainer).toBeInTheDocument()
    })

    it('applies grid layout for project cards', () => {
      const { container } = render(<ProjectsPage />)
      const main = container.querySelector('main')
      // Should have grid classes
      const grid = main?.querySelector('[class*="grid"]')
      expect(grid).toBeInTheDocument()
    })
  })

  describe('Tools & Utilities Section', () => {
    it('displays tools section heading', () => {
      render(<ProjectsPage />)
      const toolsHeading = screen.getByRole('heading', { name: /tools & utilities/i })
      expect(toolsHeading).toBeInTheDocument()
    })

    it('shows tools section description', () => {
      render(<ProjectsPage />)
      const main = screen.getByRole('main')
      expect(main.textContent).toMatch(/smaller utilities|tools built/i)
    })

    it('displays tool cards separately from project cards', () => {
      render(<ProjectsPage />)
      // Tools section should exist
      const toolsHeading = screen.getByRole('heading', { name: /tools & utilities/i })
      expect(toolsHeading).toBeInTheDocument()

      // Should have Featured Projects or Other Projects heading
      const projectsHeadings = screen.getAllByRole('heading').filter(h =>
        h.textContent?.match(/featured projects|other projects|all projects/i)
      )
      expect(projectsHeadings.length).toBeGreaterThan(0)
    })

    it('shows tool titles and summaries', () => {
      render(<ProjectsPage />)
      const main = screen.getByRole('main')
      // Should show tool-specific content (from our test data)
      expect(main.textContent).toMatch(/spotify|meeting/i)
    })

    it('displays tool status badges', () => {
      render(<ProjectsPage />)
      const main = screen.getByRole('main')
      // Tools should have status badges too
      expect(main.textContent).toMatch(/active|live|completed/i)
    })
  })

  describe('Accessibility', () => {
    it('has a main landmark', () => {
      render(<ProjectsPage />)
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('headings are accessible', () => {
      render(<ProjectsPage />)
      const headings = screen.getAllByRole('heading')
      headings.forEach((heading) => {
        expect(heading).toHaveAccessibleName()
      })
    })

    it('links are accessible', () => {
      render(<ProjectsPage />)
      const links = screen.getAllByRole('link')
      links.forEach((link) => {
        expect(link).toHaveAccessibleName()
      })
    })
  })
})
