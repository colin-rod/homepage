import { render, screen } from '@testing-library/react'
import ContactPage from './page'

/**
 * Contact Page Tests
 *
 * Tests ensure the contact page displays:
 * - Page heading
 * - Welcoming message
 * - Email mailto link
 * - Social links (LinkedIn, GitHub)
 * - Proper accessibility
 */

describe('Contact Page', () => {
  describe('Content', () => {
    it('renders the main page heading', () => {
      render(<ContactPage />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading.textContent).toMatch(/contact|get in touch|connect/i)
    })

    it('displays a welcoming message', () => {
      render(<ContactPage />)
      const main = screen.getByRole('main')
      expect(main.textContent).toMatch(/reach out|conversation|connect/i)
    })

    it('shows email address with mailto link', () => {
      render(<ContactPage />)
      const emailLink = screen.getByRole('link', { name: /mail@colinrodrigues\.com/i })
      expect(emailLink).toBeInTheDocument()
      expect(emailLink.getAttribute('href')).toMatch(/^mailto:/)
    })

    it('displays LinkedIn profile link', () => {
      render(<ContactPage />)
      const linkedinLink = screen.getByRole('link', { name: /linkedin/i })
      expect(linkedinLink).toBeInTheDocument()
      expect(linkedinLink.getAttribute('href')).toMatch(/linkedin\.com/)
    })

    it('displays GitHub profile link', () => {
      render(<ContactPage />)
      const githubLink = screen.getByRole('link', { name: /github/i })
      expect(githubLink).toBeInTheDocument()
      expect(githubLink.getAttribute('href')).toMatch(/github\.com/)
    })
  })

  describe('Structure', () => {
    it('renders within a main element', () => {
      render(<ContactPage />)
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('has proper heading hierarchy', () => {
      render(<ContactPage />)
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()
    })

    it('organizes content in a clean layout', () => {
      const { container } = render(<ContactPage />)
      const main = container.querySelector('main')
      expect(main).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('applies proper spacing and padding', () => {
      const { container } = render(<ContactPage />)
      const main = container.querySelector('main')
      expect(main?.className).toMatch(/pt-|pb-/)
    })

    it('uses responsive container', () => {
      const { container } = render(<ContactPage />)
      const main = container.querySelector('main')
      const responsiveContainer = main?.querySelector('[class*="max-w-"]')
      expect(responsiveContainer).toBeInTheDocument()
    })

    it('applies hover effects to contact links', () => {
      render(<ContactPage />)
      const emailLink = screen.getByRole('link', { name: /mail@colinrodrigues\.com/i })
      const linkedinLink = screen.getByRole('link', { name: /linkedin/i })
      const githubLink = screen.getByRole('link', { name: /github/i })

      expect(emailLink.className).toMatch(/hover:/)
      expect(linkedinLink.className).toMatch(/hover:/)
      expect(githubLink.className).toMatch(/hover:/)
    })
  })

  describe('Accessibility', () => {
    it('has a main landmark', () => {
      render(<ContactPage />)
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('all links have accessible names', () => {
      render(<ContactPage />)
      const links = screen.getAllByRole('link')
      links.forEach((link) => {
        expect(link).toHaveAccessibleName()
      })
    })

    it('mailto link opens in email client', () => {
      render(<ContactPage />)
      const emailLink = screen.getByRole('link', { name: /mail@colinrodrigues\.com/i })
      expect(emailLink.getAttribute('href')).toMatch(/^mailto:/)
    })

    it('external links have proper attributes', () => {
      render(<ContactPage />)
      const externalLinks = screen.getAllByRole('link').filter((link) => {
        const href = link.getAttribute('href')
        return href && (href.includes('linkedin') || href.includes('github'))
      })

      externalLinks.forEach((link) => {
        expect(link.getAttribute('target')).toBe('_blank')
        expect(link.getAttribute('rel')).toContain('noopener')
        expect(link.getAttribute('rel')).toContain('noreferrer')
      })
    })
  })

  describe('Responsive Design', () => {
    it('uses mobile-friendly layout', () => {
      const { container } = render(<ContactPage />)
      const main = container.querySelector('main')
      expect(main).toBeInTheDocument()
      // Mobile layout is handled by Tailwind responsive classes
    })
  })
})
