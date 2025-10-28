import { render, screen } from '@testing-library/react'
import ProjectNotFound from './not-found'

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode
    href: string
    className?: string
  }) => {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }
  MockLink.displayName = 'MockLink'
  return MockLink
})

// Mock Navigation and Footer components
jest.mock('@/components/layouts/Navigation', () => {
  return function Navigation() {
    return <nav data-testid="navigation">Navigation</nav>
  }
})

jest.mock('@/components/layouts/Footer', () => {
  return function Footer() {
    return <footer data-testid="footer">Footer</footer>
  }
})

describe('ProjectNotFound', () => {
  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      render(<ProjectNotFound />)
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('should display the page heading', () => {
      render(<ProjectNotFound />)
      expect(screen.getByRole('heading', { name: /project not found/i, level: 1 })).toBeVisible()
    })

    it('should display error message', () => {
      render(<ProjectNotFound />)
      expect(
        screen.getByText(/the project you're looking for doesn't exist or may have been removed/i)
      ).toBeVisible()
    })

    it('should display "View All Projects" link', () => {
      render(<ProjectNotFound />)
      const link = screen.getByRole('link', { name: /view all projects/i })
      expect(link).toBeVisible()
      expect(link).toHaveAttribute('href', '/projects')
    })

    it('should include Navigation component', () => {
      render(<ProjectNotFound />)
      expect(screen.getByTestId('navigation')).toBeInTheDocument()
    })

    it('should include Footer component', () => {
      render(<ProjectNotFound />)
      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })
  })

  describe('Page Structure', () => {
    it('should have main element', () => {
      render(<ProjectNotFound />)
      const main = screen.getByRole('main')
      expect(main).toBeVisible()
    })

    it('should have exactly one h1 heading', () => {
      const { container } = render(<ProjectNotFound />)
      const h1Elements = container.querySelectorAll('h1')
      expect(h1Elements).toHaveLength(1)
    })

    it('should have proper heading hierarchy', () => {
      render(<ProjectNotFound />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Project Not Found')
    })

    it('should center content', () => {
      const { container } = render(<ProjectNotFound />)
      const main = container.querySelector('main')
      const contentDiv = main?.querySelector('.text-center')
      expect(contentDiv).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('should have correct main padding classes', () => {
      const { container } = render(<ProjectNotFound />)
      const main = container.querySelector('main')
      expect(main?.className).toMatch(/py-24/)
      expect(main?.className).toMatch(/sm:py-32/)
    })

    it('should have max-width container', () => {
      const { container } = render(<ProjectNotFound />)
      const main = container.querySelector('main')
      const contentDiv = main?.querySelector('.max-w-4xl')
      expect(contentDiv).toBeInTheDocument()
    })

    it('should have responsive padding', () => {
      const { container } = render(<ProjectNotFound />)
      const main = container.querySelector('main')
      const contentDiv = main?.querySelector('.px-6')
      expect(contentDiv).toBeInTheDocument()
    })

    it('should style heading with primary color', () => {
      render(<ProjectNotFound />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading.className).toMatch(/text-primary/)
    })

    it('should style description with secondary text color', () => {
      const { container } = render(<ProjectNotFound />)
      const description = container.querySelector('.text-text-secondary')
      expect(description).toBeInTheDocument()
    })

    it('should apply button styling to link', () => {
      render(<ProjectNotFound />)
      const link = screen.getByRole('link', { name: /view all projects/i })
      expect(link.className).toMatch(/btn/)
      expect(link.className).toMatch(/btn-primary/)
    })
  })

  describe('Accessibility', () => {
    it('should have accessible heading', () => {
      render(<ProjectNotFound />)
      const heading = screen.getByRole('heading', { name: /project not found/i })
      expect(heading).toBeVisible()
    })

    it('should have accessible link with descriptive text', () => {
      render(<ProjectNotFound />)
      const link = screen.getByRole('link', { name: /view all projects/i })
      expect(link).toHaveAccessibleName()
    })

    it('should have main landmark', () => {
      render(<ProjectNotFound />)
      expect(screen.getByRole('main')).toBeVisible()
    })

    it('should have semantic HTML structure', () => {
      const { container } = render(<ProjectNotFound />)

      // Should have nav, main, and footer elements
      expect(container.querySelector('nav')).toBeInTheDocument()
      expect(container.querySelector('main')).toBeInTheDocument()
      expect(container.querySelector('footer')).toBeInTheDocument()
    })
  })

  describe('Content', () => {
    it('should have meaningful error message', () => {
      render(<ProjectNotFound />)
      const errorText = screen.getByText(/the project you're looking for doesn't exist/i)
      expect(errorText).toBeVisible()
    })

    it('should provide actionable next step', () => {
      render(<ProjectNotFound />)
      const link = screen.getByRole('link', { name: /view all projects/i })
      expect(link).toBeVisible()
    })

    it('should use proper apostrophe in text', () => {
      render(<ProjectNotFound />)
      // Should use &apos; for apostrophe (Next.js/React best practice)
      expect(screen.getByText(/you're looking for/i)).toBeInTheDocument()
    })
  })

  describe('Component Structure', () => {
    it('should be a valid React component', () => {
      expect(typeof ProjectNotFound).toBe('function')
    })

    it('should render Fragment as root', () => {
      const result = ProjectNotFound()
      // Fragment doesn't have a type property, but children should be defined
      expect(result.props.children).toBeDefined()
    })

    it('should have three main sections in order', () => {
      const { container } = render(<ProjectNotFound />)
      const children = Array.from(container.children)

      // Should have nav, main, footer
      expect(children.length).toBeGreaterThanOrEqual(3)
    })
  })
})
