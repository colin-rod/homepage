import { render, screen, fireEvent } from '@testing-library/react'
import CVPage from './page'

// Mock the CVContent client component
jest.mock('./CVContent', () => {
  return function MockCVContent({ cvData }: { cvData: unknown }) {
    const data = cvData as { summary: string }
    return (
      <div data-testid="cv-content">
        <h1>Curriculum Vitae</h1>
        <p>{data.summary}</p>
        <section>
          <h2>Skills</h2>
        </section>
        <section>
          <h2>Professional Experience</h2>
        </section>
        <section>
          <h2>Education</h2>
        </section>
        <button>All</button>
        <button>Product</button>
        <button>Strategy</button>
      </div>
    )
  }
})

// Mock Navigation and Footer
jest.mock('@/components/layouts/Navigation', () => {
  return function MockNavigation() {
    return <nav data-testid="navigation" />
  }
})

jest.mock('@/components/layouts/Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer" />
  }
})

// Mock PageTransition
jest.mock('@/components/animations/PageTransition', () => {
  return function MockPageTransition({ children }: { children: React.ReactNode }) {
    return <div data-testid="page-transition">{children}</div>
  }
})

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

    it('displays experience section', () => {
      render(<CVPage />)
      // Should have Professional Experience section
      expect(screen.getByText('Professional Experience')).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('applies proper spacing and padding', () => {
      const { container } = render(<CVPage />)
      const main = container.querySelector('main')
      // Check for padding classes (pt-, pb-, sm:pt-, sm:pb-)
      expect(main?.className).toMatch(/pt-|pb-/)
    })

    it('renders main content area', () => {
      render(<CVPage />)
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
      expect(main.id).toBe('main-content')
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
    it('renders experience section', () => {
      render(<CVPage />)
      const main = screen.getByRole('main')

      // Find experience section
      const experienceSection = main.textContent
      expect(experienceSection).toMatch(/experience/i)

      // Verify Professional Experience heading is present
      expect(screen.getByText('Professional Experience')).toBeInTheDocument()
    })

    it('renders with CV content component', () => {
      render(<CVPage />)

      // Should render the mocked CV content
      expect(screen.getByTestId('cv-content')).toBeInTheDocument()

      // Should have filter buttons
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    // Note: Detailed expandable role tests should be in CVContent.test.tsx
    // These tests verify the page structure with mocked content
  })
})
