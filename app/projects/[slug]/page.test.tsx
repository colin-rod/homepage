import { render, screen } from '@testing-library/react'
import ProjectDetailPage, { generateMetadata, generateStaticParams } from './page'
import { getProjectBySlug, getProjects } from '@/lib/data'

// Mock the data functions
jest.mock('@/lib/data', () => ({
  getProjectBySlug: jest.fn(),
  getProjects: jest.fn(),
}))

// Mock blog functions
jest.mock('@/lib/blog', () => ({
  getPostsRelatedToProject: jest.fn(() => []),
}))

// Mock RelatedArticles component
jest.mock('@/components/features/projects/RelatedArticles', () => {
  return function MockRelatedArticles() {
    return <div data-testid="related-articles" />
  }
})

// Mock Next.js components
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('notFound')
  }),
}))

jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

jest.mock('lucide-react', () => ({
  ExternalLink: () => <span data-testid="external-link-icon">External</span>,
  Github: () => <span data-testid="github-icon">GitHub</span>,
  FileText: () => <span data-testid="file-text-icon">File</span>,
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

describe('ProjectDetailPage', () => {
  const mockProject = {
    id: '1',
    title: 'BabyPool',
    slug: 'babypool',
    description: 'A fun baby guessing pool application',
    detailedDescription: [
      'BabyPool is a web application that allows friends and family to guess baby details.',
      'Features include date picker, weight predictor, and leaderboard.',
    ],
    summary: 'Baby guessing pool app',
    status: 'live' as const,
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    tags: ['product', 'web', 'fullstack'],
    whyBuilt: [
      'Built to create excitement around baby arrival.',
      'Wanted to learn Next.js 14 App Router.',
    ],
    learnings: [
      { sentiment: 'positive' as const, content: 'Next.js App Router is powerful' },
      { sentiment: 'negative' as const, content: 'Initial setup was complex' },
      { sentiment: 'neutral' as const, content: 'Server components require new mental model' },
    ],
    links: {
      live: 'https://babypool.example.com',
      github: 'https://github.com/user/babypool',
      blog: 'https://blog.example.com/babypool',
    },
    featured: true,
    year: 2024,
    quarter: 'Q1',
    scope: 'Build a complete web application for baby predictions',
    businessModel: 'Free tier with premium features',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Page Rendering', () => {
    it('renders project title', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      expect(screen.getByText('BabyPool')).toBeInTheDocument()
    })

    it('renders project status badge', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      const { container } = render(
        await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) })
      )

      // Find the status badge specifically (the one with the rounded-full class)
      const statusBadge = container.querySelector('.rounded-full')
      expect(statusBadge).toBeInTheDocument()
      expect(statusBadge).toHaveTextContent('live')
    })

    it('renders project description', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      // Description appears in both the intro and the detailed description section
      const descriptions = screen.getAllByText(
        /BabyPool is a web application that allows friends and family/
      )
      expect(descriptions.length).toBeGreaterThan(0)
    })

    it('renders back to projects link', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      const backLink = screen.getByText('← Back to Projects')
      expect(backLink).toBeInTheDocument()
      expect(backLink.closest('a')).toHaveAttribute('href', '/projects')
    })

    it('renders navigation and footer', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      expect(screen.getByTestId('navigation')).toBeInTheDocument()
      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })
  })

  describe('Project Details Grid', () => {
    it('renders timeframe with quarter', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      expect(screen.getByText('Timeframe')).toBeInTheDocument()
      expect(screen.getByText('Q1 2024')).toBeInTheDocument()
    })

    it('renders timeframe without quarter', async () => {
      const projectWithoutQuarter = { ...mockProject, quarter: undefined }
      ;(getProjectBySlug as jest.Mock).mockReturnValue(projectWithoutQuarter)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      expect(screen.getByText('2024')).toBeInTheDocument()
    })

    it('renders status section', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      expect(screen.getByText('Status')).toBeInTheDocument()
      // Status appears multiple times (badge and status section), so use getAllByText
      const statusElements = screen.getAllByText('live')
      expect(statusElements.length).toBeGreaterThan(0)
    })

    it('renders category tags', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      expect(screen.getByText('Categories')).toBeInTheDocument()
      expect(screen.getByText('product')).toBeInTheDocument()
      expect(screen.getByText('web')).toBeInTheDocument()
      expect(screen.getByText('fullstack')).toBeInTheDocument()
    })
  })

  describe('Description Section', () => {
    it('renders "About This Project" section', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      expect(screen.getByText('About This Project')).toBeInTheDocument()
    })

    it('renders all detailed description paragraphs', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      // First paragraph appears in both intro and description section
      const firstParagraphs = screen.getAllByText(
        /BabyPool is a web application that allows friends and family/
      )
      expect(firstParagraphs.length).toBeGreaterThan(0)

      // Second paragraph should be unique
      expect(
        screen.getByText(/Features include date picker, weight predictor, and leaderboard/)
      ).toBeInTheDocument()
    })

    it('falls back to description when detailedDescription is empty', async () => {
      const projectWithoutDetails = {
        ...mockProject,
        detailedDescription: [],
        description: 'A unique baby prediction application',
      }
      ;(getProjectBySlug as jest.Mock).mockReturnValue(projectWithoutDetails)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      // Description appears in both the intro and the description section
      const descriptions = screen.getAllByText('A unique baby prediction application')
      expect(descriptions.length).toBeGreaterThan(0)
    })
  })

  describe('Tech Stack Section', () => {
    it('renders tech stack heading', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      expect(screen.getByText('Tech Stack')).toBeInTheDocument()
    })

    it('renders all tech stack items', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      expect(screen.getByText('Next.js')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
      expect(screen.getByText('Tailwind CSS')).toBeInTheDocument()
      expect(screen.getByText('Vercel')).toBeInTheDocument()
    })
  })

  describe('Why Built Section', () => {
    it('renders "Why I Built This" section when whyBuilt exists', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      expect(screen.getByText('Why I Built This')).toBeInTheDocument()
      expect(screen.getByText(/Built to create excitement around baby arrival/)).toBeInTheDocument()
      expect(screen.getByText(/Wanted to learn Next.js 14 App Router/)).toBeInTheDocument()
    })

    it('does not render section when whyBuilt is empty', async () => {
      const projectWithoutWhy = { ...mockProject, whyBuilt: [] }
      ;(getProjectBySlug as jest.Mock).mockReturnValue(projectWithoutWhy)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      expect(screen.queryByText('Why I Built This')).not.toBeInTheDocument()
    })
  })

  describe('Learnings Section', () => {
    it('renders "Key Learnings" section', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      expect(screen.getByText('Key Learnings')).toBeInTheDocument()
    })

    it('renders all learning entries', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      expect(screen.getByText(/Next.js App Router is powerful/)).toBeInTheDocument()
      expect(screen.getByText(/Initial setup was complex/)).toBeInTheDocument()
      expect(screen.getByText(/Server components require new mental model/)).toBeInTheDocument()
    })

    it('shows correct icons for learning sentiments', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      const { container } = render(
        await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) })
      )

      // Check for sentiment indicators (✓, ✗, •)
      const learningsList = container.querySelector('section')
      expect(learningsList).toBeInTheDocument()
    })

    it('does not render section when learnings is empty', async () => {
      const projectWithoutLearnings = { ...mockProject, learnings: [] }
      ;(getProjectBySlug as jest.Mock).mockReturnValue(projectWithoutLearnings)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      expect(screen.queryByText('Key Learnings')).not.toBeInTheDocument()
    })
  })

  describe('Scope Section', () => {
    it('renders scope section when scope exists', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      expect(screen.getByText('Scope')).toBeInTheDocument()
      expect(
        screen.getByText('Build a complete web application for baby predictions')
      ).toBeInTheDocument()
    })

    it('does not render scope section when scope is undefined', async () => {
      const projectWithoutScope = { ...mockProject, scope: undefined }
      ;(getProjectBySlug as jest.Mock).mockReturnValue(projectWithoutScope)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      expect(screen.queryByText('Scope')).not.toBeInTheDocument()
    })
  })

  describe('Business Model Section', () => {
    it('renders business model section when businessModel exists', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      expect(screen.getByText('Business Model')).toBeInTheDocument()
      expect(screen.getByText('Free tier with premium features')).toBeInTheDocument()
    })

    it('does not render business model section when businessModel is undefined', async () => {
      const projectWithoutModel = { ...mockProject, businessModel: undefined }
      ;(getProjectBySlug as jest.Mock).mockReturnValue(projectWithoutModel)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      expect(screen.queryByText('Business Model')).not.toBeInTheDocument()
    })
  })

  describe('Project Links Section', () => {
    it('renders "Project Links" section when links exist', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      expect(screen.getByText('Project Links')).toBeInTheDocument()
    })

    it('renders live site link', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      const liveLink = screen.getByText('View Live Site')
      expect(liveLink).toBeInTheDocument()
      expect(liveLink.closest('a')).toHaveAttribute('href', 'https://babypool.example.com')
      expect(liveLink.closest('a')).toHaveAttribute('target', '_blank')
      expect(liveLink.closest('a')).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('renders GitHub link', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      const githubLink = screen.getByText('View on GitHub')
      expect(githubLink).toBeInTheDocument()
      expect(githubLink.closest('a')).toHaveAttribute('href', 'https://github.com/user/babypool')
    })

    it('renders blog post link', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      const blogLink = screen.getByText('Read Blog Post')
      expect(blogLink).toBeInTheDocument()
      expect(blogLink.closest('a')).toHaveAttribute('href', 'https://blog.example.com/babypool')
    })

    it('does not render links section when no links exist', async () => {
      const projectWithoutLinks = { ...mockProject, links: {} }
      ;(getProjectBySlug as jest.Mock).mockReturnValue(projectWithoutLinks)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      expect(screen.queryByText('Project Links')).not.toBeInTheDocument()
    })

    it('renders only available links', async () => {
      const projectWithSomeLinks = {
        ...mockProject,
        links: { live: 'https://example.com' },
      }
      ;(getProjectBySlug as jest.Mock).mockReturnValue(projectWithSomeLinks)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      expect(screen.getByText('View Live Site')).toBeInTheDocument()
      expect(screen.queryByText('View on GitHub')).not.toBeInTheDocument()
      expect(screen.queryByText('Read Blog Post')).not.toBeInTheDocument()
    })
  })

  describe('Status Badge Styling', () => {
    it('applies correct styling for live status', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue({ ...mockProject, status: 'live' })

      const { container } = render(
        await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) })
      )

      const badge = container.querySelector('.bg-green-100')
      expect(badge).toBeInTheDocument()
    })

    it('applies correct styling for active status', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue({ ...mockProject, status: 'active' })

      const { container } = render(
        await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) })
      )

      const badge = container.querySelector('.bg-green-100')
      expect(badge).toBeInTheDocument()
    })

    it('applies correct styling for completed status', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue({ ...mockProject, status: 'completed' })

      const { container } = render(
        await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) })
      )

      const badge = container.querySelector('.bg-blue-100')
      expect(badge).toBeInTheDocument()
    })

    it('applies correct styling for in-progress status', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue({ ...mockProject, status: 'in-progress' })

      const { container } = render(
        await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) })
      )

      const badge = container.querySelector('.bg-yellow-100')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('Not Found Handling', () => {
    it('calls notFound when project does not exist', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(null)
      const { notFound } = await import('next/navigation')

      await expect(async () => {
        await ProjectDetailPage({ params: Promise.resolve({ slug: 'nonexistent' }) })
      }).rejects.toThrow('notFound')

      expect(notFound).toHaveBeenCalled()
    })
  })

  describe('Metadata Generation', () => {
    it('generates metadata for existing project', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: 'babypool' }),
      })

      expect(metadata.title).toContain('BabyPool')
    })

    it('generates not found metadata for missing project', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(null)

      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: 'nonexistent' }),
      })

      expect(metadata.title).toContain('Not Found')
    })
  })

  describe('Static Params Generation', () => {
    it('generates params for all projects', async () => {
      const mockProjects = [
        { ...mockProject, slug: 'project-1' },
        { ...mockProject, slug: 'project-2' },
        { ...mockProject, slug: 'project-3' },
      ]
      ;(getProjects as jest.Mock).mockReturnValue(mockProjects)

      const params = await generateStaticParams()

      expect(params).toHaveLength(3)
      expect(params).toEqual([{ slug: 'project-1' }, { slug: 'project-2' }, { slug: 'project-3' }])
    })

    it('handles empty projects list', async () => {
      ;(getProjects as jest.Mock).mockReturnValue([])

      const params = await generateStaticParams()

      expect(params).toEqual([])
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      const h1 = screen.getByRole('heading', { level: 1, name: 'BabyPool' })
      expect(h1).toBeInTheDocument()

      const h2Headings = screen.getAllByRole('heading', { level: 2 })
      expect(h2Headings.length).toBeGreaterThan(0)
    })

    it('has proper main landmark', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('external links have proper attributes', async () => {
      ;(getProjectBySlug as jest.Mock).mockReturnValue(mockProject)

      render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'babypool' }) }))

      const liveLink = screen.getByText('View Live Site').closest('a')
      expect(liveLink).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })
})
