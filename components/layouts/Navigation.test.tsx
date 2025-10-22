import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navigation from './Navigation'

describe('Navigation', () => {
  describe('Desktop Navigation', () => {
    it('renders the site logo/name', () => {
      render(<Navigation />)
      expect(screen.getByText('Colin Rodrigues')).toBeInTheDocument()
    })

    it('renders all navigation links', () => {
      render(<Navigation />)

      // Query within main navigation to avoid mobile nav duplicates
      const mainNav = screen.getByRole('navigation', { name: /main/i })
      const links = mainNav.querySelectorAll('a')
      const linkTexts = Array.from(links).map((link) => link.textContent)

      expect(linkTexts).toContain('About')
      expect(linkTexts).toContain('Projects')
      expect(linkTexts).toContain('Timeline')
      expect(linkTexts).toContain('Writing')
      expect(linkTexts).toContain('CV')
      expect(linkTexts).toContain('Contact')
    })

    it('has correct href attributes for all links', () => {
      render(<Navigation />)

      // Query within main navigation to avoid mobile nav duplicates
      const mainNav = screen.getByRole('navigation', { name: /main/i })

      const aboutLink = mainNav.querySelector('a[href="/about"]')
      const projectsLink = mainNav.querySelector('a[href="/projects"]')
      const timelineLink = mainNav.querySelector('a[href="/timeline"]')
      const writingLink = mainNav.querySelector('a[href="/writing"]')
      const cvLink = mainNav.querySelector('a[href="/cv"]')
      const contactLink = mainNav.querySelector('a[href="/contact"]')

      expect(aboutLink).toBeInTheDocument()
      expect(projectsLink).toBeInTheDocument()
      expect(timelineLink).toBeInTheDocument()
      expect(writingLink).toBeInTheDocument()
      expect(cvLink).toBeInTheDocument()
      expect(contactLink).toBeInTheDocument()
    })

    it('logo links to homepage', () => {
      render(<Navigation />)
      const logo = screen.getByRole('link', { name: 'Colin Rodrigues' })
      expect(logo).toHaveAttribute('href', '/')
    })
  })

  describe('Mobile Navigation', () => {
    it('renders mobile menu button', () => {
      render(<Navigation />)
      const menuButton = screen.getByRole('button', { name: /menu/i })
      expect(menuButton).toBeInTheDocument()
    })

    it('mobile menu is initially closed', () => {
      render(<Navigation />)
      // Mobile nav should not be visible initially (AnimatePresence removes it from DOM)
      const mobileNav = screen.queryByRole('navigation', { name: /mobile/i })
      expect(mobileNav).not.toBeInTheDocument()
    })

    it('opens mobile menu when button is clicked', async () => {
      const user = userEvent.setup()
      render(<Navigation />)

      const menuButton = screen.getByRole('button', { name: /menu/i })
      await user.click(menuButton)

      const mobileNav = screen.getByRole('navigation', { name: /mobile/i })
      expect(mobileNav).toBeInTheDocument()
    })

    it('closes mobile menu when clicking a link', async () => {
      const user = userEvent.setup()
      render(<Navigation />)

      // Open menu
      const menuButton = screen.getByRole('button', { name: /menu/i })
      await user.click(menuButton)

      // Click a link in mobile menu
      const mobileNav = screen.getByRole('navigation', { name: /mobile/i })
      const aboutLink = mobileNav.querySelector('a[href="/about"]')
      if (aboutLink) await user.click(aboutLink)

      // Menu should close (AnimatePresence removes it from DOM)
      await screen.findByRole('navigation', { name: /main/i }) // Wait for animation
      const closedMobileNav = screen.queryByRole('navigation', { name: /mobile/i })
      expect(closedMobileNav).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper navigation landmark', () => {
      render(<Navigation />)
      const nav = screen.getAllByRole('navigation')
      expect(nav.length).toBeGreaterThan(0)
    })

    it('mobile menu button has accessible label', () => {
      render(<Navigation />)
      const menuButton = screen.getByRole('button', { name: /menu/i })
      expect(menuButton).toHaveAccessibleName()
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<Navigation />)

      // Tab through navigation links
      await user.tab()
      const firstLink = screen.getByRole('link', { name: 'Colin Rodrigues' })
      expect(firstLink).toHaveFocus()
    })
  })

  describe('Styling', () => {
    it('applies primary color styles', () => {
      const { container } = render(<Navigation />)
      const header = container.querySelector('header')
      expect(header).toHaveClass('bg-neutral-surface/95')
    })
  })
})
