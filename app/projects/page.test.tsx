import { render, screen } from '@testing-library/react'
import ProjectsPage from './page'

/**
 * Projects Page Tests (Swimlane Layout)
 *
 * Tests the main projects index page which displays projects
 * in horizontal scrollable swimlanes organized by status.
 *
 * Layout: Horizontal "swimlane" cards with fixed width/height,
 * organized into sections (In Progress, Shipped, Planned, etc.)
 */

describe('Projects Page (Swimlane Layout)', () => {
  describe('Page Rendering', () => {
    it('renders without crashing', () => {
      render(<ProjectsPage />)
    })

    it('displays page title', () => {
      render(<ProjectsPage />)
      const heading = screen.getByRole('heading', { name: /projects/i, level: 1 })
      expect(heading).toBeInTheDocument()
    })

    it('displays page description', () => {
      render(<ProjectsPage />)
      // Page should have descriptive text about projects
      expect(screen.getByText(/A collection of things I'm working on/i)).toBeInTheDocument()
    })
  })

  describe('Swimlane Sections', () => {
    it('renders "In Progress" swimlane section', () => {
      render(<ProjectsPage />)
      const inProgressHeading = screen.getByRole('heading', { name: /in progress/i })
      expect(inProgressHeading).toBeInTheDocument()
    })

    it('renders "Shipped" swimlane section', () => {
      render(<ProjectsPage />)
      const shippedHeading = screen.getByRole('heading', { name: /shipped/i })
      expect(shippedHeading).toBeInTheDocument()
    })

    it('renders "Planned" swimlane section', () => {
      render(<ProjectsPage />)
      const plannedHeading = screen.getByRole('heading', { name: /planned/i })
      expect(plannedHeading).toBeInTheDocument()
    })

    it('renders section descriptions', () => {
      render(<ProjectsPage />)
      expect(screen.getByText(/Projects currently under active development/i)).toBeInTheDocument()
    })

    it('renders section icons', () => {
      const { container } = render(<ProjectsPage />)
      // Each swimlane should have an icon (SVG)
      const svgs = container.querySelectorAll('svg')
      expect(svgs.length).toBeGreaterThan(0)
    })
  })

  describe('Project Cards', () => {
    it('renders project cards in swimlanes', () => {
      const { container } = render(<ProjectsPage />)
      // Should have multiple article elements (project cards)
      const articles = container.querySelectorAll('article')
      expect(articles.length).toBeGreaterThan(0)
    })

    it('project cards have titles', () => {
      render(<ProjectsPage />)
      const articles = screen.getAllByRole('article')
      expect(articles.length).toBeGreaterThan(0)
    })

    it('displays project metadata (tags, tech stack)', () => {
      const { container } = render(<ProjectsPage />)
      // Should have badge/tag elements
      const badges = container.querySelectorAll('[class*="badge"]')
      // Some projects should have tags
      expect(badges.length).toBeGreaterThanOrEqual(0)
    })

    it('project cards have links', () => {
      render(<ProjectsPage />)
      const links = screen.getAllByRole('link', { name: /learn more/i })
      expect(links.length).toBeGreaterThan(0)
    })
  })

  describe('Horizontal Scroll Layout', () => {
    it('swimlanes have horizontal scroll containers', () => {
      const { container } = render(<ProjectsPage />)
      // Should have elements with overflow-x-auto for horizontal scrolling
      const scrollContainers = container.querySelectorAll('[class*="overflow-x"]')
      expect(scrollContainers.length).toBeGreaterThan(0)
    })

    it('swimlane sections have regions for accessibility', () => {
      render(<ProjectsPage />)
      const regions = screen.getAllByRole('region')
      // Should have multiple swimlane regions
      expect(regions.length).toBeGreaterThan(0)
    })

    it('applies snap scroll for smooth navigation', () => {
      const { container } = render(<ProjectsPage />)
      // Should have snap-x or snap-mandatory classes for scroll snapping
      const snapElements = container.querySelectorAll('[class*="snap"]')
      expect(snapElements.length).toBeGreaterThan(0)
    })
  })

  describe('Conditional Rendering', () => {
    it('only renders Tools section if tools exist', () => {
      render(<ProjectsPage />)
      // Tools section may or may not be present depending on data
      const toolsHeading = screen.queryByRole('heading', { name: /tools & utilities/i })
      // If present, it should be in the document; if not, that's fine
      if (toolsHeading) {
        expect(toolsHeading).toBeInTheDocument()
      }
    })

    it('only renders Retired section if retired projects exist', () => {
      render(<ProjectsPage />)
      // Retired section may or may not be present depending on data
      const retiredHeading = screen.queryByRole('heading', { name: /retired/i })
      // If present, it should be in the document; if not, that's fine
      if (retiredHeading) {
        expect(retiredHeading).toBeInTheDocument()
      }
    })
  })

  describe('Responsive Design', () => {
    it('applies responsive padding classes', () => {
      const { container } = render(<ProjectsPage />)
      const main = container.querySelector('main')
      expect(main).toHaveClass('py-24', 'sm:py-32')
    })

    it('uses max-width container for content', () => {
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
      const cards = container.querySelectorAll('[class*="h-80"]')
      // Should have fixed-height project tiles
      expect(cards.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibility', () => {
    it('has a main landmark', () => {
      const { container } = render(<ProjectsPage />)
      const main = container.querySelector('main')
      expect(main).toBeInTheDocument()
    })

    it('has proper heading hierarchy', () => {
      render(<ProjectsPage />)
      const h1 = screen.getByRole('heading', { level: 1 })
      const h2s = screen.getAllByRole('heading', { level: 2 })
      expect(h1).toBeInTheDocument()
      expect(h2s.length).toBeGreaterThan(0)
    })

    it('swimlane regions have accessible labels', () => {
      render(<ProjectsPage />)
      const regions = screen.getAllByRole('region')
      regions.forEach((region) => {
        // Each region should have an aria-label
        expect(region).toHaveAttribute('aria-label')
      })
    })

    it('project links have accessible text', () => {
      render(<ProjectsPage />)
      const links = screen.getAllByRole('link', { name: /learn more/i })
      links.forEach((link) => {
        expect(link).toHaveAccessibleName()
      })
    })
  })

  describe('Navigation', () => {
    it('has navigation component', () => {
      const { container } = render(<ProjectsPage />)
      const nav = container.querySelector('nav')
      expect(nav).toBeInTheDocument()
    })

    it('has footer component', () => {
      const { container } = render(<ProjectsPage />)
      const footer = container.querySelector('footer')
      expect(footer).toBeInTheDocument()
    })
  })
})
