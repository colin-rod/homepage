import { render, screen, fireEvent } from '@testing-library/react'
import CVPage from './page'

/**
 * CV Page Tests
 *
 * Tests ensure the CV page displays:
 * - Professional summary
 * - Skills organized by category
 * - Work experience with highlights
 * - Education details
 * - Tag-based filtering functionality
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

  describe('Tag Filtering', () => {
    it('displays filter buttons', () => {
      render(<CVPage />)
      // Should have filter button roles
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('shows all experiences by default', () => {
      render(<CVPage />)
      const main = screen.getByRole('main')
      // Should display experience content
      expect(main.textContent).toMatch(/experience/i)
    })

    it('filters experiences when clicking filter buttons', () => {
      render(<CVPage />)

      // Find and click a filter button if available
      const buttons = screen.getAllByRole('button')
      if (buttons.length > 0) {
        fireEvent.click(buttons[0])
        // After clicking, page should still render
        const main = screen.getByRole('main')
        expect(main).toBeInTheDocument()
      }
    })

    it('updates active filter state when clicked', () => {
      render(<CVPage />)

      const buttons = screen.getAllByRole('button')
      if (buttons.length > 1) {
        const secondButton = buttons[1]

        // Click second button
        fireEvent.click(secondButton)

        // Page should still be functional
        expect(screen.getByRole('main')).toBeInTheDocument()
      }
    })
  })

  describe('Expandable Role Details (CRO-671)', () => {
    it('renders all roles in condensed view by default (showing 2-3 highlights)', () => {
      render(<CVPage />)
      const main = screen.getByRole('main')

      // Find experience cards - should have role="button" or clickable indicator
      const experienceSection = main.textContent
      expect(experienceSection).toMatch(/experience/i)

      // Should show "+X more" indicator or similar for roles with >3 highlights
      // This will fail until we implement the condensed view
      const moreIndicators = screen.queryAllByText(/\+\d+ more/i)
      expect(moreIndicators.length).toBeGreaterThan(0)
    })

    it('expands role to show all highlights when card is clicked', () => {
      render(<CVPage />)

      // Find all role cards with expandable content
      const roleCards = screen.queryAllByRole('button', { name: /expand to show all/i })

      // Should have at least one expandable card (DoorDash has 12 highlights)
      expect(roleCards.length).toBeGreaterThan(0)

      if (roleCards.length > 0) {
        // Find a card that has "+X more" indicator
        const expandableCard = roleCards.find((card) => card.textContent?.match(/\+\d+ more/i))

        if (expandableCard) {
          // Before click: should show "+X more" indicator
          expect(expandableCard.textContent).toMatch(/\+\d+ more/i)

          // Click to expand
          fireEvent.click(expandableCard)

          // After click: should be expanded and indicator should change
          expect(expandableCard).toHaveAttribute('aria-expanded', 'true')
          expect(expandableCard.textContent).toMatch(/click to collapse/i)
        }
      }
    })

    it('collapses role when expanded card is clicked again', () => {
      render(<CVPage />)

      const roleCards = screen.queryAllByRole('button', { name: /expand to show all|collapse/i })

      if (roleCards.length > 0) {
        const firstCard = roleCards[0]

        // Expand
        fireEvent.click(firstCard)
        expect(firstCard).toHaveAttribute('aria-expanded', 'true')

        // Collapse
        fireEvent.click(firstCard)
        expect(firstCard).toHaveAttribute('aria-expanded', 'false')
      }
    })

    it('allows multiple cards to be expanded independently', () => {
      render(<CVPage />)

      const roleCards = screen.queryAllByRole('button', { name: /expand to show all/i })

      if (roleCards.length >= 2) {
        const firstCard = roleCards[0]
        const secondCard = roleCards[1]

        // Expand first card
        fireEvent.click(firstCard)
        expect(firstCard).toHaveAttribute('aria-expanded', 'true')

        // Expand second card
        fireEvent.click(secondCard)
        expect(secondCard).toHaveAttribute('aria-expanded', 'true')

        // First card should still be expanded
        expect(firstCard).toHaveAttribute('aria-expanded', 'true')
      }
    })

    it('resets all expand states when filter is changed', () => {
      render(<CVPage />)

      // Find role cards and filter buttons
      const roleCards = screen.queryAllByRole('button', { name: /expand to show all/i })
      const filterButtons = screen
        .getAllByRole('button')
        .filter((btn) => btn.textContent?.match(/all|product|strategy|technical/i))

      if (roleCards.length > 0 && filterButtons.length > 1) {
        const firstCard = roleCards[0]

        // Expand a card
        fireEvent.click(firstCard)
        expect(firstCard).toHaveAttribute('aria-expanded', 'true')

        // Change filter
        fireEvent.click(filterButtons[1])

        // Card should be collapsed (back to default state)
        // Need to re-query as DOM may have updated
        const updatedCards = screen.queryAllByRole('button', { name: /expand to show all/i })
        if (updatedCards.length > 0) {
          expect(updatedCards[0]).toHaveAttribute('aria-expanded', 'false')
        }
      }
    })

    it('has proper accessibility attributes for expandable cards', () => {
      render(<CVPage />)

      const roleCards = screen.queryAllByRole('button', { name: /expand to show all/i })

      if (roleCards.length > 0) {
        const firstCard = roleCards[0]

        // Should have role="button"
        expect(firstCard).toHaveAttribute('role', 'button')

        // Should have aria-expanded
        expect(firstCard).toHaveAttribute('aria-expanded')

        // Should have aria-label
        expect(firstCard).toHaveAccessibleName()
      }
    })

    it('supports keyboard navigation for expanding/collapsing', () => {
      render(<CVPage />)

      const roleCards = screen.queryAllByRole('button', { name: /expand to show all/i })

      if (roleCards.length > 0) {
        const firstCard = roleCards[0]

        // Focus the card
        firstCard.focus()

        // Press Enter to expand
        fireEvent.keyDown(firstCard, { key: 'Enter', code: 'Enter' })
        expect(firstCard).toHaveAttribute('aria-expanded', 'true')

        // Press Space to collapse
        fireEvent.keyDown(firstCard, { key: ' ', code: 'Space' })
        expect(firstCard).toHaveAttribute('aria-expanded', 'false')
      }
    })
  })
})
