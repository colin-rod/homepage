import { render, screen } from '@testing-library/react'
import FeaturedProjects from './FeaturedProjects'

/**
 * Featured Projects Section Tests
 *
 * Tests ensure the featured projects section displays:
 * - Section heading
 * - Featured project cards
 * - Project titles and descriptions
 * - Links to project details
 * - "View All Projects" CTA
 */

describe('FeaturedProjects', () => {
  describe('Content', () => {
    it('renders a section heading', () => {
      render(<FeaturedProjects />)
      const heading = screen.getByRole('heading', { name: /recent projects/i })
      expect(heading).toBeInTheDocument()
    })

    it('renders featured project cards', () => {
      render(<FeaturedProjects />)
      // Should render at least one project card
      const cards = screen.getAllByRole('article')
      expect(cards.length).toBeGreaterThan(0)
    })

    it('displays project titles', () => {
      render(<FeaturedProjects />)
      // Should have project titles as headings
      const headings = screen.getAllByRole('heading')
      const projectHeadings = headings.filter((h) => h.tagName === 'H3')
      expect(projectHeadings.length).toBeGreaterThan(0)
    })

    it('displays project descriptions', () => {
      render(<FeaturedProjects />)
      // Should have text content (descriptions)
      const articles = screen.getAllByRole('article')
      articles.forEach((article) => {
        expect(article.textContent).toBeTruthy()
      })
    })

    it('renders "View All Projects" CTA', () => {
      render(<FeaturedProjects />)
      const viewAllLink = screen.getByRole('link', { name: /view all projects/i })
      expect(viewAllLink).toBeInTheDocument()
      expect(viewAllLink).toHaveAttribute('href', '/projects')
    })
  })

  describe('Structure', () => {
    it('renders within a section element', () => {
      const { container } = render(<FeaturedProjects />)
      const section = container.querySelector('section')
      expect(section).toBeInTheDocument()
    })

    it('displays projects in a grid layout', () => {
      const { container } = render(<FeaturedProjects />)
      const grid = container.querySelector('.grid')
      expect(grid).toBeInTheDocument()
    })

    it('each project card has a link', () => {
      render(<FeaturedProjects />)
      const articles = screen.getAllByRole('article')
      articles.forEach((article) => {
        const link = article.querySelector('a')
        expect(link).toBeInTheDocument()
      })
    })
  })

  describe('Styling', () => {
    it('project cards have card styling', () => {
      const { container } = render(<FeaturedProjects />)
      const cards = container.querySelectorAll('.card')
      expect(cards.length).toBeGreaterThan(0)
    })

    it('section has proper background', () => {
      const { container } = render(<FeaturedProjects />)
      const section = container.querySelector('section')
      expect(section?.className).toMatch(/bg-/)
    })

    it('CTA button has accent color', () => {
      render(<FeaturedProjects />)
      const ctaLink = screen.getByRole('link', { name: /view all projects/i })
      expect(ctaLink.className).toMatch(/btn-primary|bg-accent/)
    })
  })

  describe('Data Integration', () => {
    it('displays featured projects', () => {
      render(<FeaturedProjects />)
      const articles = screen.getAllByRole('article')
      // Should show at least one featured project
      expect(articles.length).toBeGreaterThan(0)
      // Should show a reasonable number (not all projects)
      expect(articles.length).toBeLessThanOrEqual(10)
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<FeaturedProjects />)
      const h2 = screen.getByRole('heading', { level: 2 })
      expect(h2).toBeInTheDocument()
    })

    it('project links have accessible names', () => {
      render(<FeaturedProjects />)
      const articles = screen.getAllByRole('article')
      articles.forEach((article) => {
        const link = article.querySelector('a')
        if (link) {
          expect(link).toHaveAccessibleName()
        }
      })
    })
  })
})
