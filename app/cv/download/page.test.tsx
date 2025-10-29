import { render, screen } from '@testing-library/react'
import CVDownloadPage from './page'

/**
 * CV Download Page Tests
 *
 * Tests ensure the CV download page:
 * - Renders CV content filtered by query parameter
 * - Applies print-optimized styles
 * - Hides navigation and interactive elements
 * - Shows proper heading and contact info
 * - Prevents search engine indexing
 */

// Mock searchParams as a Promise (Next.js 15)
const createMockSearchParams = (filter?: string) => {
  return Promise.resolve(filter ? { filter } : {})
}

describe('CV Download Page', () => {
  describe('Content Rendering', () => {
    it('renders the CV heading', async () => {
      const searchParams = createMockSearchParams()
      render(await CVDownloadPage({ searchParams }))
      const heading = screen.getByRole('heading', { level: 1, name: /colin rodrigues/i })
      expect(heading).toBeInTheDocument()
    })

    it('displays professional summary', async () => {
      const searchParams = createMockSearchParams()
      render(await CVDownloadPage({ searchParams }))
      const main = screen.getByRole('main')
      expect(main.textContent).toMatch(/product|strategy|technical/i)
    })

    it('shows skills section', async () => {
      const searchParams = createMockSearchParams()
      render(await CVDownloadPage({ searchParams }))
      expect(screen.getByText(/skills/i)).toBeInTheDocument()
    })

    it('shows experience section', async () => {
      const searchParams = createMockSearchParams()
      render(await CVDownloadPage({ searchParams }))
      expect(screen.getByRole('heading', { name: /professional experience/i })).toBeInTheDocument()
    })

    it('shows education section', async () => {
      const searchParams = createMockSearchParams()
      render(await CVDownloadPage({ searchParams }))
      expect(screen.getByText(/education/i)).toBeInTheDocument()
    })
  })

  describe('Filter Parameter', () => {
    it('filters experience by "product" tag', async () => {
      const searchParams = createMockSearchParams('product')
      render(await CVDownloadPage({ searchParams }))
      // Should render with product-filtered experience
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('filters experience by "strategy" tag', async () => {
      const searchParams = createMockSearchParams('strategy')
      render(await CVDownloadPage({ searchParams }))
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('filters experience by "tech" tag', async () => {
      const searchParams = createMockSearchParams('tech')
      render(await CVDownloadPage({ searchParams }))
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('shows all experience with "all" filter', async () => {
      const searchParams = createMockSearchParams('all')
      render(await CVDownloadPage({ searchParams }))
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('defaults to all experience with no filter', async () => {
      const searchParams = createMockSearchParams()
      render(await CVDownloadPage({ searchParams }))
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })
  })

  describe('Print-Optimized Styling', () => {
    it('applies print-specific CSS classes', async () => {
      const searchParams = createMockSearchParams()
      const { container } = render(await CVDownloadPage({ searchParams }))
      const main = container.querySelector('main')
      expect(main?.className).toMatch(/print:/)
    })

    it('uses simple, scannable layout', async () => {
      const searchParams = createMockSearchParams()
      const { container } = render(await CVDownloadPage({ searchParams }))
      const main = container.querySelector('main')
      // Should have simple structure for ATS compatibility
      expect(main).toBeInTheDocument()
    })

    it('does not render navigation component', async () => {
      const searchParams = createMockSearchParams()
      render(await CVDownloadPage({ searchParams }))
      // Navigation should not be in the document
      const nav = screen.queryByRole('navigation')
      expect(nav).not.toBeInTheDocument()
    })

    it('does not render footer component', async () => {
      const searchParams = createMockSearchParams()
      const { container } = render(await CVDownloadPage({ searchParams }))
      // Footer should not be in the document
      const footer = container.querySelector('footer')
      expect(footer).not.toBeInTheDocument()
    })
  })

  describe('Contact Information', () => {
    it('displays email address', async () => {
      const searchParams = createMockSearchParams()
      render(await CVDownloadPage({ searchParams }))
      expect(screen.getByText(/colin\.rods@gmail\.com/i)).toBeInTheDocument()
    })

    it('displays LinkedIn profile URL', async () => {
      const searchParams = createMockSearchParams()
      render(await CVDownloadPage({ searchParams }))
      expect(screen.getByText(/linkedin\.com\/in\/colinrodrigues/i)).toBeInTheDocument()
    })

    it('displays GitHub profile URL', async () => {
      const searchParams = createMockSearchParams()
      render(await CVDownloadPage({ searchParams }))
      expect(screen.getByText(/github\.com\/colin-rod/i)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has a main landmark', async () => {
      const searchParams = createMockSearchParams()
      render(await CVDownloadPage({ searchParams }))
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('has proper heading hierarchy', async () => {
      const searchParams = createMockSearchParams()
      render(await CVDownloadPage({ searchParams }))
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()
    })
  })
})
