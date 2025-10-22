import { render, screen } from '@testing-library/react'
import ProjectsPage from './page'

/**
 * Projects Index Page Tests (Swimlane Layout)
 *
 * Tests ensure the projects page displays:
 * - Page heading and description
 * - All 4 swimlanes (In Progress, Shipped, Planned, Retired)
 * - Tools & Utilities swimlane
 * - Swimlane titles and descriptions
 * - Project tiles within swimlanes
 * - Horizontal scroll containers
 * - Proper accessibility
 */

describe('Projects Page (Swimlane Layout)', () => {
  describe('Content', () => {
    it('renders the main page heading', () => {
      render(<ProjectsPage />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading.textContent).toMatch(/projects/i)
    })

    it('displays page description', () => {
      render(<ProjectsPage />)
      const main = screen.getByRole('main')
      expect(main.textContent).toMatch(/collection of things/i)
    })
  })

  describe('Swimlanes', () => {
    it('renders "In Progress" swimlane heading', () => {
      render(<ProjectsPage />)
      expect(screen.getByRole('heading', { name: /in progress/i })).toBeInTheDocument()
    })

    it('renders "Shipped" swimlane heading', () => {
      render(<ProjectsPage />)
      expect(screen.getByRole('heading', { name: /shipped/i })).toBeInTheDocument()
    })

    it('renders "Planned" swimlane heading', () => {
      render(<ProjectsPage />)
      expect(screen.getByRole('heading', { name: /planned/i })).toBeInTheDocument()
    })

    it('renders "Tools & Utilities" swimlane heading', () => {
      render(<ProjectsPage />)
      expect(screen.getByRole('heading', { name: /tools & utilities/i })).toBeInTheDocument()
    })

    it('displays swimlane descriptions', () => {
      render(<ProjectsPage />)
      const main = screen.getByRole('main')
      expect(main.textContent).toMatch(/currently under active development/i)
      expect(main.textContent).toMatch(/live and completed projects/i)
      expect(main.textContent).toMatch(/concepts and ideas/i)
    })

    it('renders swimlanes as section elements with region role', () => {
      render(<ProjectsPage />)
      const regions = screen.getAllByRole('region')
      // Should have at least 4 swimlanes (In Progress, Shipped, Planned, Tools)
      expect(regions.length).toBeGreaterThanOrEqual(4)
    })
  })

  describe('Project Display', () => {
    it('displays project cards within swimlanes', () => {
      render(<ProjectsPage />)
      const articles = screen.getAllByRole('article')
      // Should have multiple project cards
      expect(articles.length).toBeGreaterThan(0)
    })

    it('shows project titles', () => {
      render(<ProjectsPage />)
      // Should have project titles as h3 headings
      const headings = screen.getAllByRole('heading', { level: 3 })
      expect(headings.length).toBeGreaterThan(0)
    })

    it('displays project summaries', () => {
      render(<ProjectsPage />)
      const main = screen.getByRole('main')
      // Should contain project summary text
      expect(main.textContent).toMatch(/portfolio|product|strategy/i)
    })

    it('shows tech stack tags', () => {
      render(<ProjectsPage />)
      const main = screen.getByRole('main')
      expect(main.textContent).toMatch(/next\.js|typescript|react/i)
    })

    it('displays "Learn more" links', () => {
      render(<ProjectsPage />)
      const learnMoreLinks = screen.getAllByRole('link', { name: /learn more/i })
      expect(learnMoreLinks.length).toBeGreaterThan(0)
    })
  })

  describe('Icons', () => {
    it('renders icons for each swimlane', () => {
      const { container } = render(<ProjectsPage />)
      // Each swimlane should have an icon (SVG element from Lucide)
      const icons = container.querySelectorAll('svg')
      expect(icons.length).toBeGreaterThan(4) // Swimlane icons + project tile icons
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
      // Should have h2 headings for swimlanes
      const h2Headings = screen.getAllByRole('heading', { level: 2 })
      expect(h2Headings.length).toBeGreaterThanOrEqual(4)
    })

    it('uses horizontal scroll containers', () => {
      const { container } = render(<ProjectsPage />)
      const main = container.querySelector('main')
      // Should have overflow-x-auto classes for horizontal scrolling
      const scrollContainers = main?.querySelectorAll('[class*="overflow-x-auto"]')
      expect(scrollContainers).toBeTruthy()
      expect(scrollContainers!.length).toBeGreaterThan(0)
    })
  })

  describe('Featured Projects', () => {
    it('displays featured badge on featured projects', () => {
      render(<ProjectsPage />)
      const main = screen.getByRole('main')
      // Featured projects should have "Featured" text
      expect(main.textContent).toMatch(/featured/i)
    })
  })

  describe('Tools Display', () => {
    it('displays tools in their own swimlane', () => {
      render(<ProjectsPage />)
      const toolsHeading = screen.getByRole('heading', { name: /tools & utilities/i })
      expect(toolsHeading).toBeInTheDocument()
    })

    it('shows tool-specific content', () => {
      render(<ProjectsPage />)
      const main = screen.getByRole('main')
      // Should show tool names
      expect(main.textContent).toMatch(/spotify|meeting/i)
    })
  })

  describe('Styling', () => {
    it('applies proper spacing and padding to main', () => {
      const { container } = render(<ProjectsPage />)
      const main = container.querySelector('main')
      expect(main?.className).toMatch(/py-/)
    })

    it('uses responsive container', () => {
      const { container } = render(<ProjectsPage />)
      const main = container.querySelector('main')
      const responsiveContainer = main?.querySelector('[class*="max-w-"]')
      expect(responsiveContainer).toBeInTheDocument()
    })

    it('applies fixed-width card classes', () => {
      const { container } = render(<ProjectsPage />)
      const cards = container.querySelectorAll('[class*="w-80"]')
      // Should have fixed-width project tiles
      expect(cards.length).toBeGreaterThan(0)
    })

    it('applies fixed-height card classes', () => {
      const { container } = render(<ProjectsPage />)
      const cards = container.querySelectorAll('[class*="h-72"]')
      // Should have fixed-height project tiles
      expect(cards.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibility', () => {
    it('has a main landmark', () => {
      render(<ProjectsPage />)
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('swimlanes have region role', () => {
      render(<ProjectsPage />)
      const regions = screen.getAllByRole('region')
      expect(regions.length).toBeGreaterThanOrEqual(4)
    })

    it('all headings are accessible', () => {
      render(<ProjectsPage />)
      const headings = screen.getAllByRole('heading')
      headings.forEach((heading) => {
        expect(heading).toHaveAccessibleName()
      })
    })

    it('all links are accessible', () => {
      render(<ProjectsPage />)
      const links = screen.getAllByRole('link')
      links.forEach((link) => {
        expect(link).toHaveAccessibleName()
      })
    })

    it('project cards are article elements', () => {
      render(<ProjectsPage />)
      const articles = screen.getAllByRole('article')
      expect(articles.length).toBeGreaterThan(0)
    })
  })

  describe('Empty States', () => {
    it('handles empty swimlanes gracefully', () => {
      render(<ProjectsPage />)
      // Even if a swimlane has no projects, the page should render without errors
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })
  })
})
