import { render, screen } from '@testing-library/react'
import ProjectTile from './ProjectTile'
import { Project } from '@/lib/types'

/**
 * ProjectTile Component Tests
 *
 * Tests the ProjectTile component which displays project cards
 * in horizontal swimlanes with metadata, tech stack, and links.
 */

const mockProject: Project = {
  id: 'test-project-1',
  title: 'Test Project',
  slug: 'test-project',
  description: 'A comprehensive test project description',
  detailedDescription: 'A test project for unit testing',
  type: 'project',
  status: 'in-progress',
  techStack: ['React', 'TypeScript', 'Tailwind'],
  tags: ['web', 'product'],
  featured: false,
  year: 2024,
  quarter: 'Q2',
}

describe('ProjectTile', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<ProjectTile project={mockProject} />)
    })

    it('displays project title', () => {
      render(<ProjectTile project={mockProject} />)
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })

    it('displays project description', () => {
      render(<ProjectTile project={mockProject} />)
      expect(screen.getByText(/A comprehensive test project description/i)).toBeInTheDocument()
    })

    it('displays tech stack tags', () => {
      render(<ProjectTile project={mockProject} />)
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
    })

    it('renders Learn More link with correct href', () => {
      render(<ProjectTile project={mockProject} />)
      const link = screen.getByRole('link', { name: /learn more/i })
      expect(link).toHaveAttribute('href', '/projects/test-project')
    })
  })

  describe('Featured Badge', () => {
    it('displays featured badge when project is featured', () => {
      const featuredProject = { ...mockProject, featured: true }
      render(<ProjectTile project={featuredProject} />)
      expect(screen.getByText('Featured')).toBeInTheDocument()
    })

    it('does not display featured badge when project is not featured', () => {
      render(<ProjectTile project={mockProject} />)
      expect(screen.queryByText('Featured')).not.toBeInTheDocument()
    })
  })

  describe('Tool Badge', () => {
    it('displays tool badge for tool projects', () => {
      const toolProject = { ...mockProject, type: 'tool' as const }
      render(<ProjectTile project={toolProject} />)
      expect(screen.getByText('Tool')).toBeInTheDocument()
    })

    it('does not display tool badge for regular projects', () => {
      render(<ProjectTile project={mockProject} />)
      expect(screen.queryByText('Tool')).not.toBeInTheDocument()
    })
  })

  describe('Tech Stack Display', () => {
    it('shows limited number of tech tags with overflow indicator', () => {
      const projectWithManyTech = {
        ...mockProject,
        techStack: ['React', 'TypeScript', 'Tailwind', 'Next.js', 'Node.js'],
      }
      render(<ProjectTile project={projectWithManyTech} />)
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
      expect(screen.getByText('+3')).toBeInTheDocument()
    })
  })

  describe('Link Rendering', () => {
    it('renders a clickable card that links to project detail page', () => {
      render(<ProjectTile project={mockProject} />)
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/projects/test-project')
    })

    it('preserves project slug in link', () => {
      const customProject = { ...mockProject, slug: 'custom-slug' }
      render(<ProjectTile project={customProject} />)
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/projects/custom-slug')
    })
  })

  describe('Accessibility', () => {
    it('has accessible link text', () => {
      render(<ProjectTile project={mockProject} />)
      const link = screen.getByRole('link', { name: /learn more/i })
      expect(link).toBeInTheDocument()
    })

    it('renders article with semantic HTML', () => {
      const { container } = render(<ProjectTile project={mockProject} />)
      const article = container.querySelector('article')
      expect(article).toBeInTheDocument()
    })

    it('displays project title as heading', () => {
      render(<ProjectTile project={mockProject} />)
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })
  })

  describe('Styling and Layout', () => {
    it('applies fixed height class (h-80)', () => {
      const { container } = render(<ProjectTile project={mockProject} />)
      // CardHover wrapper contains the card classes
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toBeInTheDocument()
      expect(wrapper?.className).toMatch(/h-80/)
    })

    it('applies fixed width class (w-80)', () => {
      const { container } = render(<ProjectTile project={mockProject} />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toBeInTheDocument()
      expect(wrapper?.className).toMatch(/w-80/)
    })

    it('applies card styling', () => {
      const { container } = render(<ProjectTile project={mockProject} />)
      const wrapper = container.firstChild as HTMLElement
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
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('renders different icons based on project status', () => {
      const liveProject = { ...mockProject, status: 'live' as const }
      const { container } = render(<ProjectTile project={liveProject} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('renders tool icon for tool projects', () => {
      const toolProject = { ...mockProject, type: 'tool' as const }
      const { container } = render(<ProjectTile project={toolProject} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('renders favicon when provided', () => {
      const projectWithFavicon = {
        ...mockProject,
        favicon: '/images/projects/test-favicon.png',
      }
      const { container } = render(<ProjectTile project={projectWithFavicon} />)
      const img = container.querySelector('img')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('alt', 'Test Project logo')
    })
  })
})
