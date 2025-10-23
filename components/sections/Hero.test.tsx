import { render, screen } from '@testing-library/react'
import Hero from './Hero'

/**
 * Hero Section Tests
 *
 * Tests ensure the hero section displays:
 * - Main heading with name
 * - Tagline/subtitle
 * - Brief introduction
 * - Call-to-action buttons
 * - Proper styling with design system colors
 */

describe('Hero', () => {
  describe('Content', () => {
    it('renders the main heading with name', () => {
      render(<Hero />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading.textContent).toContain('Colin Rodrigues')
    })

    it('renders a tagline or subtitle', () => {
      render(<Hero />)
      // Should have a subtitle/tagline
      const subtitle = screen.getByText(/Building, Reflecting & Sharing/i)
      expect(subtitle).toBeInTheDocument()
    })

    it('renders an introduction paragraph', () => {
      render(<Hero />)
      // Should have some introductory text
      const intro = screen.getByText(/part portfolio, part journal/i)
      expect(intro).toBeInTheDocument()
    })

    it('renders primary CTA button', () => {
      render(<Hero />)
      const ctaButton = screen.getByRole('link', { name: /explore my work/i })
      expect(ctaButton).toBeInTheDocument()
      expect(ctaButton).toHaveAttribute('href', '/projects')
    })

    it('renders secondary CTA button', () => {
      render(<Hero />)
      const secondaryCta = screen.getByRole('link', { name: /connect/i })
      expect(secondaryCta).toBeInTheDocument()
      expect(secondaryCta).toHaveAttribute('href', '/contact')
    })
  })

  describe('Structure', () => {
    it('renders within a section element', () => {
      const { container } = render(<Hero />)
      const section = container.querySelector('section')
      expect(section).toBeInTheDocument()
    })

    it('has proper heading hierarchy', () => {
      render(<Hero />)
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()
    })

    it('renders CTA buttons in a container', () => {
      render(<Hero />)
      const ctaButtons = screen.getAllByRole('link')
      expect(ctaButtons.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Styling', () => {
    it('applies gradient background', () => {
      const { container } = render(<Hero />)
      const section = container.querySelector('section')
      expect(section?.className).toMatch(/gradient-hero|bg-gradient/)
    })

    it('primary CTA has accent color styling', () => {
      render(<Hero />)
      const primaryCta = screen.getByRole('link', { name: /explore my work/i })
      expect(primaryCta.className).toMatch(/btn-primary|bg-accent/)
    })

    it('secondary CTA has outline styling', () => {
      render(<Hero />)
      const secondaryCta = screen.getByRole('link', { name: /connect/i })
      expect(secondaryCta.className).toMatch(/btn-outline|border/)
    })
  })

  describe('Accessibility', () => {
    it('has a proper heading for screen readers', () => {
      render(<Hero />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveAccessibleName()
    })

    it('CTA buttons have accessible names', () => {
      render(<Hero />)
      const ctaButtons = screen.getAllByRole('link')
      ctaButtons.forEach((button) => {
        expect(button).toHaveAccessibleName()
      })
    })
  })
})
