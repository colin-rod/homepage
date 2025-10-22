import { render, screen } from '@testing-library/react'
import ProjectTile from './ProjectTile'
import { Project } from '@/lib/types'

/**
 * ProjectTile Component Tests
 *
 * Tests ensure the project tile component:
 * - Renders project information correctly
 * - Shows featured badge when featured: true
 * - Shows tools badge for tools
 * - Displays insight line
 * - Handles missing optional fields
 * - Applies correct styling and hover states
 */

describe('ProjectTile', () => {
  const mockProject: Project = {
    id: 'test-project',
    title: 'Test Project',
    slug: 'test-project',
    description: 'A test project description',
    summary: 'A concise summary of the test project',
    type: 'project',
    status: 'in-progress',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    tags: ['web', 'product'],
    insight: 'Built to learn modern web development',
    featured: false,
    year: 2024,
  }

  describe('Basic Rendering', () => {
    it('renders project title', () => {
      render(<ProjectTile project={mockProject} />)
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })

    it('renders project summary', () => {
      render(<ProjectTile project={mockProject} />)
      expect(screen.getByText('A concise summary of the test project')).toBeInTheDocument()
    })

    it('renders insight line in italics', () => {
      render(<ProjectTile project={mockProject} />)
      const insight = screen.getByText('Built to learn modern web development')
      expect(insight).toBeInTheDocument()
      expect(insight.tagName).toBe('P')
    })

    it('renders "Learn more" link', () => {
      render(<ProjectTile project={mockProject} />)
      const link = screen.getByRole('link', { name: /learn more/i })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/projects/test-project')
    })
  })

  describe('Tech Stack and Tags', () => {
    it('displays tech stack chips', () => {
      render(<ProjectTile project={mockProject} />)
      expect(screen.getByText('Next.js')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
      expect(screen.getByText('Tailwind CSS')).toBeInTheDocument()
    })

    it('displays category tags', () => {
      render(<ProjectTile project={mockProject} />)
      expect(screen.getByText('web')).toBeInTheDocument()
      expect(screen.getByText('product')).toBeInTheDocument()
    })

    it('limits tech stack display to 3 items', () => {
      const projectWithManyTechs: Project = {
        ...mockProject,
        techStack: ['Tech1', 'Tech2', 'Tech3', 'Tech4', 'Tech5'],
      }
      render(<ProjectTile project={projectWithManyTechs} />)
      expect(screen.getByText('Tech1')).toBeInTheDocument()
      expect(screen.getByText('Tech2')).toBeInTheDocument()
      expect(screen.getByText('Tech3')).toBeInTheDocument()
      expect(screen.getByText('+2')).toBeInTheDocument()
      expect(screen.queryByText('Tech4')).not.toBeInTheDocument()
    })
  })

  describe('Featured Badge', () => {
    it('shows star badge when project is featured', () => {
      const featuredProject: Project = { ...mockProject, featured: true }
      render(<ProjectTile project={featuredProject} />)
      // Check for star icon or "Featured" text
      const card = screen.getByRole('article')
      expect(card.textContent).toMatch(/featured/i)
    })

    it('does not show star badge when project is not featured', () => {
      render(<ProjectTile project={mockProject} />)
      const card = screen.getByRole('article')
      expect(card.textContent).not.toMatch(/featured/i)
    })
  })

  describe('Tools Badge', () => {
    it('shows tools badge for tool type projects', () => {
      const toolProject: Project = { ...mockProject, type: 'tool' }
      render(<ProjectTile project={toolProject} />)
      const card = screen.getByRole('article')
      expect(card.textContent).toMatch(/tool/i)
    })

    it('does not show tools badge for project type', () => {
      render(<ProjectTile project={mockProject} />)
      // Should not have tool badge styling or text
      const articles = screen.getAllByRole('article')
      expect(articles[0].className).not.toContain('border-accent-gold')
    })
  })

  describe('Optional Fields', () => {
    it('handles missing insight field gracefully', () => {
      const projectWithoutInsight: Project = { ...mockProject, insight: undefined }
      render(<ProjectTile project={projectWithoutInsight} />)
      // Component should still render without errors
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })

    it('handles empty tech stack', () => {
      const projectWithoutTech: Project = { ...mockProject, techStack: [] }
      render(<ProjectTile project={projectWithoutTech} />)
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })

    it('handles empty tags', () => {
      const projectWithoutTags: Project = { ...mockProject, tags: [] }
      render(<ProjectTile project={projectWithoutTags} />)
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })
  })

  describe('Styling and Layout', () => {
    it('applies fixed height class', () => {
      const { container } = render(<ProjectTile project={mockProject} />)
      // CardHover wrapper contains the card classes
      const wrapper = container.firstChild
      expect(wrapper).toBeInTheDocument()
      expect(wrapper?.className).toMatch(/h-48/)
    })

    it('applies fixed width class', () => {
      const { container } = render(<ProjectTile project={mockProject} />)
      const wrapper = container.firstChild
      expect(wrapper).toBeInTheDocument()
      expect(wrapper?.className).toMatch(/w-72/)
    })

    it('applies card styling', () => {
      const { container } = render(<ProjectTile project={mockProject} />)
      const wrapper = container.firstChild
      expect(wrapper).toBeInTheDocument()
      expect(wrapper?.className).toMatch(/card/)
    })

    it('has CardHover wrapper for animations', () => {
      const { container } = render(<ProjectTile project={mockProject} />)
      const article = container.querySelector('article')
      expect(article).toBeInTheDocument()
    })
  })

  describe('Icon Display', () => {
    it('renders an icon at the top of the card', () => {
      const { container } = render(<ProjectTile project={mockProject} />)
      // Check for SVG icon element (Lucide React renders as SVG)
      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('renders as an article element', () => {
      render(<ProjectTile project={mockProject} />)
      const article = screen.getByRole('article')
      expect(article).toBeInTheDocument()
    })

    it('has accessible link with proper text', () => {
      render(<ProjectTile project={mockProject} />)
      const link = screen.getByRole('link', { name: /learn more/i })
      expect(link).toHaveAccessibleName()
    })
  })
})
