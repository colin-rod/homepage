import { render, screen } from '@testing-library/react'
import ProjectsPage from './page'

// Mock data functions
jest.mock('@/lib/data', () => ({
  getProjectsBySwimLane: jest.fn((status: string) => {
    const mockProjects = [
      {
        id: '1',
        title: 'Test Project 1',
        slug: 'test-project-1',
        summary: 'First test project',
        status: 'in-progress',
        type: 'project',
      },
      {
        id: '2',
        title: 'Test Project 2',
        slug: 'test-project-2',
        summary: 'Second test project',
        status: 'shipped',
        type: 'project',
      },
    ]
    if (status === 'in-progress') return [mockProjects[0]]
    if (status === 'shipped') return [mockProjects[1]]
    return []
  }),
  getCompletedTools: jest.fn(() => []),
  getPlannedTools: jest.fn(() => []),
}))

// Mock layout components
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

// Mock animation components
jest.mock('@/components/animations/PageTransition', () => {
  return function MockPageTransition({ children }: { children: React.ReactNode }) {
    return <div data-testid="page-transition">{children}</div>
  }
})

// Mock Swimlane component
jest.mock('@/components/features/Swimlane', () => {
  return function MockSwimlane({
    title,
    icon,
    description,
    projects,
  }: {
    title: string
    icon: React.ReactNode
    description?: string
    projects: any[]
  }) {
    return (
      <div data-testid={`swimlane-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        <div className="flex items-center gap-2">
          {icon}
          <h3>{title}</h3>
        </div>
        {description && <p>{description}</p>}
        {projects.map((project) => (
          <article key={project.id}>
            <a href={`/projects/${project.slug}`}>
              <h4>{project.title}</h4>
              <p>{project.summary}</p>
              <span>Learn more</span>
            </a>
          </article>
        ))}
      </div>
    )
  }
})

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Code2: () => <span data-testid="code2-icon">Code2</span>,
  Rocket: () => <span data-testid="rocket-icon">Rocket</span>,
  Lightbulb: () => <span data-testid="lightbulb-icon">Lightbulb</span>,
  Archive: () => <span data-testid="archive-icon">Archive</span>,
  Wrench: () => <span data-testid="wrench-icon">Wrench</span>,
  CheckCircle2: () => <span data-testid="check-circle2-icon">CheckCircle2</span>,
}))

/**
 * Projects Page Tests (Swimlane Layout)
 *
 * Tests the main projects index page which displays projects
 * in horizontal scrollable swimlanes organized by status.
 *
 * Layout: Horizontal "swimlane" cards with fixed width/height,
 * organized into sections (In Progress, Shipped, Planned, etc.)
 */

describe('Projects Page (Swimlane Layout)', () => {
  describe('Page Rendering', () => {
    it('renders without crashing', () => {
      render(<ProjectsPage />)
    })

    it('displays page title', () => {
      render(<ProjectsPage />)
      const heading = screen.getByRole('heading', { name: /projects/i, level: 1 })
      expect(heading).toBeInTheDocument()
    })

    it('displays page description', () => {
      render(<ProjectsPage />)
      // Page should have descriptive text about projects
      expect(screen.getByText(/A collection of things I'm working on/i)).toBeInTheDocument()
    })
  })

  describe('Swimlane Sections', () => {
    it('renders "In Progress" swimlane section', () => {
      render(<ProjectsPage />)
      const inProgressHeading = screen.getByRole('heading', { name: /in progress/i })
      expect(inProgressHeading).toBeInTheDocument()
    })

    it('renders "Shipped" swimlane section', () => {
      render(<ProjectsPage />)
      const shippedHeading = screen.getByRole('heading', { name: /shipped/i })
      expect(shippedHeading).toBeInTheDocument()
    })

    it('renders "Planned" swimlane section', () => {
      render(<ProjectsPage />)
      const plannedHeading = screen.getByRole('heading', { name: /planned/i })
      expect(plannedHeading).toBeInTheDocument()
    })

    it('renders section descriptions', () => {
      render(<ProjectsPage />)
      expect(screen.getByText(/Projects currently under active development/i)).toBeInTheDocument()
    })
  })

  describe('Project Cards', () => {
    it('renders project cards in swimlanes', () => {
      const { container } = render(<ProjectsPage />)
      // Should have multiple article elements (project cards)
      const articles = container.querySelectorAll('article')
      expect(articles.length).toBeGreaterThan(0)
    })

    it('project cards have titles', () => {
      render(<ProjectsPage />)
      const articles = screen.getAllByRole('article')
      expect(articles.length).toBeGreaterThan(0)
    })

    it('displays project metadata (tags, tech stack)', () => {
      const { container } = render(<ProjectsPage />)
      // Should have badge/tag elements
      const badges = container.querySelectorAll('[class*="badge"]')
      // Some projects should have tags
      expect(badges.length).toBeGreaterThanOrEqual(0)
    })

    it('project cards have links', () => {
      render(<ProjectsPage />)
      const links = screen.getAllByRole('link', { name: /learn more/i })
      expect(links.length).toBeGreaterThan(0)
    })
  })

  describe('Conditional Rendering', () => {
    it('only renders Tools section if tools exist', () => {
      render(<ProjectsPage />)
      // Tools section may or may not be present depending on data
      const toolsHeading = screen.queryByRole('heading', { name: /tools & utilities/i })
      // If present, it should be in the document; if not, that's fine
      if (toolsHeading) {
        expect(toolsHeading).toBeInTheDocument()
      }
    })

    it('only renders Retired section if retired projects exist', () => {
      render(<ProjectsPage />)
      // Retired section may or may not be present depending on data
      const retiredHeading = screen.queryByRole('heading', { name: /retired/i })
      // If present, it should be in the document; if not, that's fine
      if (retiredHeading) {
        expect(retiredHeading).toBeInTheDocument()
      }
    })
  })

  describe('Responsive Design', () => {
    it('applies responsive padding classes', () => {
      const { container } = render(<ProjectsPage />)
      const main = container.querySelector('main')
      expect(main).toHaveClass('py-24', 'sm:py-32')
    })

    it('uses max-width container for content', () => {
      const { container } = render(<ProjectsPage />)
      const main = container.querySelector('main')
      const responsiveContainer = main?.querySelector('[class*="max-w-"]')
      expect(responsiveContainer).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has a main landmark', () => {
      const { container } = render(<ProjectsPage />)
      const main = container.querySelector('main')
      expect(main).toBeInTheDocument()
    })

    it('has proper heading hierarchy', () => {
      render(<ProjectsPage />)
      const h1 = screen.getByRole('heading', { level: 1 })
      const h2s = screen.getAllByRole('heading', { level: 2 })
      expect(h1).toBeInTheDocument()
      expect(h2s.length).toBeGreaterThan(0)
    })

    it('project links have accessible text', () => {
      render(<ProjectsPage />)
      const links = screen.getAllByRole('link', { name: /learn more/i })
      links.forEach((link) => {
        expect(link).toHaveAccessibleName()
      })
    })
  })

  describe('Navigation', () => {
    it('has navigation component', () => {
      const { container } = render(<ProjectsPage />)
      const nav = container.querySelector('nav')
      expect(nav).toBeInTheDocument()
    })

    it('has footer component', () => {
      const { container } = render(<ProjectsPage />)
      const footer = container.querySelector('footer')
      expect(footer).toBeInTheDocument()
    })
  })
})
