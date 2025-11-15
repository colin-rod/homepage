import { render, screen, waitFor } from '@testing-library/react'
import AboutPage from './page'

/**
 * About Page Tests
 *
 * Tests ensure the about page displays:
 * - Page heading
 * - Professional background section
 * - Skills/expertise section
 * - Personal interests (optional)
 * - Proper page structure and SEO
 */

// Mock fetch for GitHubChart component
global.fetch = jest.fn()

// Mock the ActivityCalendar component
jest.mock('react-activity-calendar', () => {
  return function MockActivityCalendar() {
    return <div data-testid="activity-calendar">Activity Calendar</div>
  }
})

describe('About Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock a failed fetch so the chart doesn't render in these tests
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 503,
    })
  })

  afterEach(async () => {
    // Wait for any pending state updates to complete
    await waitFor(() => {
      // This ensures all async operations have finished before moving to next test
    })
  })
  describe('Content', () => {
    it('renders the main page heading', async () => {
      render(<AboutPage />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading.textContent).toMatch(/about/i)
      // Wait for GitHubChart async operations to complete
      await waitFor(() => expect(fetch).toHaveBeenCalled())
    })

    it('displays professional background section', async () => {
      render(<AboutPage />)
      // Should have content about professional journey
      expect(screen.getByText(/fatherhood/i)).toBeInTheDocument()
      // Wait for GitHubChart async operations to complete
      await waitFor(() => expect(fetch).toHaveBeenCalled())
    })

    it('displays skills or expertise section', async () => {
      render(<AboutPage />)
      // Should mention building, creating, or professional background
      const page = screen.getByRole('main')
      expect(page.textContent).toMatch(/building|curiosity|builder/i)
      // Wait for GitHubChart async operations to complete
      await waitFor(() => expect(fetch).toHaveBeenCalled())
    })

    it('includes introductory text', async () => {
      render(<AboutPage />)
      // Should have substantial introductory content
      const main = screen.getByRole('main')
      expect(main.textContent?.length).toBeGreaterThan(100)
      // Wait for GitHubChart async operations to complete
      await waitFor(() => expect(fetch).toHaveBeenCalled())
    })
  })

  describe('Structure', () => {
    it('renders within a main element', async () => {
      render(<AboutPage />)
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
      // Wait for GitHubChart async operations to complete
      await waitFor(() => expect(fetch).toHaveBeenCalled())
    })

    it('has proper heading hierarchy', async () => {
      render(<AboutPage />)
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()

      const headings = screen.getAllByRole('heading')
      expect(headings.length).toBeGreaterThan(1)
      // Wait for GitHubChart async operations to complete
      await waitFor(() => expect(fetch).toHaveBeenCalled())
    })

    it('organizes content in sections', async () => {
      const { container } = render(<AboutPage />)
      const sections = container.querySelectorAll('section')
      expect(sections.length).toBeGreaterThan(0)
      // Wait for GitHubChart async operations to complete
      await waitFor(() => expect(fetch).toHaveBeenCalled())
    })
  })

  describe('Styling', () => {
    it('applies proper styling to main content', async () => {
      const { container } = render(<AboutPage />)
      const main = container.querySelector('main')
      expect(main?.className).toMatch(/pt-|pb-/)
      // Wait for GitHubChart async operations to complete
      await waitFor(() => expect(fetch).toHaveBeenCalled())
    })

    it('uses responsive container', async () => {
      const { container } = render(<AboutPage />)
      const main = container.querySelector('main')
      const responsiveContainer = main?.querySelector('[class*="max-w-"]')
      expect(responsiveContainer).toBeInTheDocument()
      // Wait for GitHubChart async operations to complete
      await waitFor(() => expect(fetch).toHaveBeenCalled())
    })
  })

  describe('Accessibility', () => {
    it('has a main landmark', async () => {
      render(<AboutPage />)
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
      // Wait for GitHubChart async operations to complete
      await waitFor(() => expect(fetch).toHaveBeenCalled())
    })

    it('headings are accessible', async () => {
      render(<AboutPage />)
      const headings = screen.getAllByRole('heading')
      headings.forEach((heading) => {
        expect(heading).toHaveAccessibleName()
      })
      // Wait for GitHubChart async operations to complete
      await waitFor(() => expect(fetch).toHaveBeenCalled())
    })
  })
})
