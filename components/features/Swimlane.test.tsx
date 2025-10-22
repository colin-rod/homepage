import { render, screen } from '@testing-library/react'
import Swimlane from './Swimlane'
import { Project } from '@/lib/types'
import { Code2 } from 'lucide-react'

/**
 * Swimlane Component Tests
 *
 * Tests ensure the swimlane component:
 * - Renders title and icon
 * - Displays optional description
 * - Renders all project tiles
 * - Applies horizontal scroll container classes
 * - Handles empty swimlanes
 * - Applies proper styling
 */

describe('Swimlane', () => {
  const mockProjects: Project[] = [
    {
      id: 'project-1',
      title: 'Project One',
      slug: 'project-one',
      description: 'First test project',
      summary: 'Summary of project one',
      type: 'project',
      status: 'in-progress',
      techStack: ['React'],
      tags: ['web'],
      featured: false,
      year: 2024,
    },
    {
      id: 'project-2',
      title: 'Project Two',
      slug: 'project-two',
      description: 'Second test project',
      summary: 'Summary of project two',
      type: 'project',
      status: 'in-progress',
      techStack: ['Vue'],
      tags: ['web'],
      featured: false,
      year: 2024,
    },
  ]

  describe('Basic Rendering', () => {
    it('renders swimlane title', () => {
      render(
        <Swimlane
          title="In Progress"
          icon={<Code2 className="h-6 w-6" />}
          projects={mockProjects}
        />
      )
      expect(screen.getByRole('heading', { name: /in progress/i })).toBeInTheDocument()
    })

    it('renders the icon', () => {
      const { container } = render(
        <Swimlane
          title="In Progress"
          icon={<Code2 className="h-6 w-6" data-testid="code-icon" />}
          projects={mockProjects}
        />
      )
      // Check for SVG element (Lucide icons render as SVG)
      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('renders optional description', () => {
      render(
        <Swimlane
          title="In Progress"
          icon={<Code2 className="h-6 w-6" />}
          projects={mockProjects}
          description="Projects currently under development"
        />
      )
      expect(screen.getByText('Projects currently under development')).toBeInTheDocument()
    })

    it('does not render description when not provided', () => {
      render(
        <Swimlane
          title="In Progress"
          icon={<Code2 className="h-6 w-6" />}
          projects={mockProjects}
        />
      )
      // Should not have any paragraph element with description text
      const section = screen.getByRole('region')
      const paragraphs = section.querySelectorAll('p')
      expect(paragraphs.length).toBeLessThan(3) // Only project summaries, no swimlane description
    })
  })

  describe('Project Tiles', () => {
    it('renders all project tiles', () => {
      render(
        <Swimlane
          title="In Progress"
          icon={<Code2 className="h-6 w-6" />}
          projects={mockProjects}
        />
      )
      expect(screen.getByText('Project One')).toBeInTheDocument()
      expect(screen.getByText('Project Two')).toBeInTheDocument()
    })

    it('renders correct number of project articles', () => {
      render(
        <Swimlane
          title="In Progress"
          icon={<Code2 className="h-6 w-6" />}
          projects={mockProjects}
        />
      )
      const articles = screen.getAllByRole('article')
      expect(articles).toHaveLength(2)
    })
  })

  describe('Empty State', () => {
    it('handles empty projects array', () => {
      render(<Swimlane title="In Progress" icon={<Code2 className="h-6 w-6" />} projects={[]} />)
      // Should still render the heading
      expect(screen.getByRole('heading', { name: /in progress/i })).toBeInTheDocument()
      // Should not render any articles
      const articles = screen.queryAllByRole('article')
      expect(articles).toHaveLength(0)
    })

    it('displays empty state message when no projects', () => {
      render(<Swimlane title="In Progress" icon={<Code2 className="h-6 w-6" />} projects={[]} />)
      expect(screen.getByText(/no projects/i)).toBeInTheDocument()
    })
  })

  describe('Styling and Layout', () => {
    it('applies horizontal scroll container class', () => {
      const { container } = render(
        <Swimlane
          title="In Progress"
          icon={<Code2 className="h-6 w-6" />}
          projects={mockProjects}
        />
      )
      const scrollContainer = container.querySelector('[class*="overflow-x-auto"]')
      expect(scrollContainer).toBeInTheDocument()
    })

    it('applies scroll snap classes', () => {
      const { container } = render(
        <Swimlane
          title="In Progress"
          icon={<Code2 className="h-6 w-6" />}
          projects={mockProjects}
        />
      )
      const scrollContainer = container.querySelector('[class*="snap-"]')
      expect(scrollContainer).toBeInTheDocument()
    })

    it('applies flex layout for horizontal arrangement', () => {
      const { container } = render(
        <Swimlane
          title="In Progress"
          icon={<Code2 className="h-6 w-6" />}
          projects={mockProjects}
        />
      )
      const scrollContainer = container.querySelector('[class*="flex"]')
      expect(scrollContainer).toBeInTheDocument()
    })

    it('applies gap between project tiles', () => {
      const { container } = render(
        <Swimlane
          title="In Progress"
          icon={<Code2 className="h-6 w-6" />}
          projects={mockProjects}
        />
      )
      const scrollContainer = container.querySelector('[class*="gap-"]')
      expect(scrollContainer).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('renders as a section with region role', () => {
      render(
        <Swimlane
          title="In Progress"
          icon={<Code2 className="h-6 w-6" />}
          projects={mockProjects}
        />
      )
      const section = screen.getByRole('region')
      expect(section).toBeInTheDocument()
    })

    it('has accessible heading', () => {
      render(
        <Swimlane
          title="In Progress"
          icon={<Code2 className="h-6 w-6" />}
          projects={mockProjects}
        />
      )
      const heading = screen.getByRole('heading', { name: /in progress/i })
      expect(heading).toHaveAccessibleName()
    })

    it('section has aria-label with swimlane title', () => {
      const { container } = render(
        <Swimlane
          title="In Progress"
          icon={<Code2 className="h-6 w-6" />}
          projects={mockProjects}
        />
      )
      const section = container.querySelector('section')
      expect(section).toHaveAttribute('aria-label')
    })
  })

  describe('Responsive Behavior', () => {
    it('maintains horizontal scroll on mobile viewport', () => {
      const { container } = render(
        <Swimlane
          title="In Progress"
          icon={<Code2 className="h-6 w-6" />}
          projects={mockProjects}
        />
      )
      // Horizontal scroll should be present regardless of viewport
      const scrollContainer = container.querySelector('[class*="overflow-x-auto"]')
      expect(scrollContainer).toBeInTheDocument()
    })
  })
})
