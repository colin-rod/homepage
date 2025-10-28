import { render, screen } from '@testing-library/react'
import Footer from './Footer'

/**
 * Footer Component Tests
 *
 * Tests ensure the footer displays:
 * - Copyright notice
 * - Quick navigation links
 * - Social media links
 * - Built with attribution
 * - Proper styling and layout
 */

describe('Footer', () => {
  describe('Content', () => {
    it('renders copyright notice', () => {
      render(<Footer />)
      const currentYear = new Date().getFullYear()
      expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument()
      expect(screen.getByText(/all thoughts and projects are my own/i)).toBeInTheDocument()
    })

    it('renders quick navigation links', () => {
      render(<Footer />)

      expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
    })

    it('quick links have correct href attributes', () => {
      render(<Footer />)

      expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '/about')
      expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute('href', '/projects')
      expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '/contact')
    })

    it('renders built with attribution', () => {
      render(<Footer />)
      expect(screen.getByText(/built with/i)).toBeInTheDocument()
      expect(screen.getByText(/Next.js/i)).toBeInTheDocument()
    })
  })

  describe('Structure', () => {
    it('renders within a footer element', () => {
      const { container } = render(<Footer />)
      const footer = container.querySelector('footer')
      expect(footer).toBeInTheDocument()
    })

    it('has a navigation section for quick links', () => {
      render(<Footer />)
      const nav = screen.getByRole('navigation', { name: /footer/i })
      expect(nav).toBeInTheDocument()
    })

    it('organizes content in sections', () => {
      const { container } = render(<Footer />)
      const footer = container.querySelector('footer')
      expect(footer?.children.length).toBeGreaterThan(0)
    })
  })

  describe('Styling', () => {
    it('applies proper background color', () => {
      const { container } = render(<Footer />)
      const footer = container.querySelector('footer')
      expect(footer?.className).toMatch(/bg-/)
    })

    it('has border separator', () => {
      const { container } = render(<Footer />)
      const footer = container.querySelector('footer')
      expect(footer?.className).toMatch(/border/)
    })

    it('link styles have hover effects', () => {
      render(<Footer />)
      const links = screen.getAllByRole('link')
      links.forEach((link) => {
        expect(link.className).toMatch(/hover:/)
      })
    })
  })

  describe('Accessibility', () => {
    it('footer has proper landmark role', () => {
      const { container } = render(<Footer />)
      const footer = container.querySelector('footer')
      expect(footer).toBeInTheDocument()
    })

    it('all links have accessible names', () => {
      render(<Footer />)
      const links = screen.getAllByRole('link')
      links.forEach((link) => {
        expect(link).toHaveAccessibleName()
      })
    })

    it('navigation has accessible label', () => {
      render(<Footer />)
      const nav = screen.getByRole('navigation', { name: /footer/i })
      expect(nav).toHaveAttribute('aria-label')
    })
  })

  describe('Responsive Design', () => {
    it('renders in a responsive container', () => {
      const { container } = render(<Footer />)
      const footer = container.querySelector('footer')
      expect(footer?.querySelector('.max-w-7xl')).toBeInTheDocument()
    })
  })
})
