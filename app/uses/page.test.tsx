import { render, screen } from '@testing-library/react'
import UsesPage from './page'
import { getUsesCategories } from '@/lib/data'

// Mock dependencies
jest.mock('@/lib/data', () => ({
  getUsesCategories: jest.fn(),
}))

jest.mock('@/components/layouts/Navigation', () => {
  return function MockNavigation() {
    return <nav data-testid="navigation">Navigation</nav>
  }
})

jest.mock('@/components/layouts/Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>
  }
})

jest.mock('@/components/animations/PageTransition', () => {
  return function MockPageTransition({ children }: { children: React.ReactNode }) {
    return <div data-testid="page-transition">{children}</div>
  }
})

// Mock lucide-react
jest.mock('lucide-react', () => ({
  ExternalLink: () => <svg data-testid="external-link-icon" />,
}))

describe('UsesPage', () => {
  const mockCategories = [
    {
      id: 'hardware',
      title: 'Hardware',
      description: 'Physical tools and devices',
      items: [
        {
          name: 'MacBook Pro',
          details: '16-inch, M1 Max',
          context: 'Primary work machine for development and design',
          link: 'https://apple.com',
          favicon: '/favicon-apple.png',
          tags: ['laptop', 'apple'],
        },
        {
          name: 'Magic Keyboard',
          details: 'Space Gray',
          context: 'Comfortable for long coding sessions',
          link: null,
          favicon: null,
          tags: ['keyboard'],
        },
      ],
    },
    {
      id: 'software',
      title: 'Software',
      description: 'Applications and tools',
      items: [
        {
          name: 'VS Code',
          details: 'Code editor',
          context: 'Main editor for all development work',
          link: 'https://code.visualstudio.com',
          favicon: '/favicon-vscode.png',
          tags: ['editor', 'development'],
        },
      ],
    },
  ]

  beforeEach(() => {
    ;(getUsesCategories as jest.Mock).mockReturnValue(mockCategories)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders page title', () => {
    render(<UsesPage />)

    expect(screen.getByRole('heading', { level: 1, name: 'Uses' })).toBeInTheDocument()
  })

  it('renders page description', () => {
    render(<UsesPage />)

    expect(screen.getByText(/Inspired by the community at uses.tech/i)).toBeInTheDocument()
  })

  it('renders Navigation component', () => {
    render(<UsesPage />)

    expect(screen.getByTestId('navigation')).toBeInTheDocument()
  })

  it('renders Footer component', () => {
    render(<UsesPage />)

    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('wraps content in PageTransition', () => {
    render(<UsesPage />)

    expect(screen.getByTestId('page-transition')).toBeInTheDocument()
  })

  it('renders all categories', () => {
    render(<UsesPage />)

    expect(screen.getByRole('heading', { level: 2, name: 'Hardware' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Software' })).toBeInTheDocument()
  })

  it('renders category descriptions', () => {
    render(<UsesPage />)

    expect(screen.getByText('Physical tools and devices')).toBeInTheDocument()
    expect(screen.getByText('Applications and tools')).toBeInTheDocument()
  })

  it('renders all items within categories', () => {
    render(<UsesPage />)

    expect(screen.getByRole('heading', { level: 3, name: 'MacBook Pro' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Magic Keyboard' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'VS Code' })).toBeInTheDocument()
  })

  it('renders item details', () => {
    render(<UsesPage />)

    expect(screen.getByText('16-inch, M1 Max')).toBeInTheDocument()
    expect(screen.getByText('Space Gray')).toBeInTheDocument()
    expect(screen.getByText('Code editor')).toBeInTheDocument()
  })

  it('renders item context', () => {
    render(<UsesPage />)

    expect(screen.getByText('Primary work machine for development and design')).toBeInTheDocument()
    expect(screen.getByText('Comfortable for long coding sessions')).toBeInTheDocument()
    expect(screen.getByText('Main editor for all development work')).toBeInTheDocument()
  })

  it('renders external links when provided', () => {
    render(<UsesPage />)

    const macbookLink = screen.getByRole('link', { name: /Open MacBook Pro/i })
    expect(macbookLink).toHaveAttribute('href', 'https://apple.com')
    expect(macbookLink).toHaveAttribute('target', '_blank')
    expect(macbookLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('does not render link when link is null', () => {
    render(<UsesPage />)

    // Magic Keyboard has no link, so should not have an external link icon
    const magicKeyboardSection = screen.getByRole('heading', {
      level: 3,
      name: 'Magic Keyboard',
    }).parentElement!
    const linkInSection = magicKeyboardSection.querySelector('a[target="_blank"]')
    expect(linkInSection).toBeNull()
  })

  it('renders favicons when provided', () => {
    render(<UsesPage />)

    const macbookFavicon = screen.getByAltText('MacBook Pro icon')
    const macbookSrc = macbookFavicon.getAttribute('src')
    expect(macbookSrc).toBeTruthy()
    const macbookImageUrl = new URL(`http://localhost${macbookSrc}`)
    expect(macbookImageUrl.searchParams.get('url')).toBe('/favicon-apple.png')
  })

  it('does not render favicon when not provided', () => {
    render(<UsesPage />)

    expect(screen.queryByAltText('Magic Keyboard icon')).not.toBeInTheDocument()
  })

  it('renders tags when provided', () => {
    render(<UsesPage />)

    expect(screen.getByText('laptop')).toBeInTheDocument()
    expect(screen.getByText('apple')).toBeInTheDocument()
    expect(screen.getByText('keyboard')).toBeInTheDocument()
    expect(screen.getByText('editor')).toBeInTheDocument()
    expect(screen.getByText('development')).toBeInTheDocument()
  })

  it('renders correct number of tags for each item', () => {
    render(<UsesPage />)

    // MacBook Pro has 2 tags
    const macbookSection = screen
      .getByRole('heading', { level: 3, name: 'MacBook Pro' })
      .closest('article')!
    const macbookTags = macbookSection.querySelectorAll('.uppercase.tracking-wide')
    expect(macbookTags).toHaveLength(2)
  })

  it('applies correct ARIA labels', () => {
    render(<UsesPage />)

    expect(screen.getByRole('region', { name: /Hardware/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /Software/i })).toBeInTheDocument()
  })

  it('applies correct semantic structure', () => {
    render(<UsesPage />)

    const main = screen.getByRole('main')
    expect(main).toHaveAttribute('id', 'main-content')
  })

  it('renders items as articles', () => {
    const { container } = render(<UsesPage />)

    const articles = container.querySelectorAll('article')
    expect(articles.length).toBe(3) // MacBook Pro, Magic Keyboard, VS Code
  })

  it('handles empty categories', () => {
    ;(getUsesCategories as jest.Mock).mockReturnValue([])

    render(<UsesPage />)

    expect(screen.getByRole('heading', { level: 1, name: 'Uses' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument()
  })

  it('renders ExternalLink icons for items with links', () => {
    render(<UsesPage />)

    const externalLinkIcons = screen.getAllByTestId('external-link-icon')
    expect(externalLinkIcons.length).toBe(2) // MacBook Pro and VS Code have links
  })

  it('applies correct styling classes to main container', () => {
    render(<UsesPage />)

    const main = screen.getByRole('main')
    expect(main).toHaveClass('pt-12', 'pb-24', 'sm:pt-16', 'sm:pb-32')
  })

  it('renders items in grid layout', () => {
    const { container } = render(<UsesPage />)

    const gridElements = container.querySelectorAll(
      '.grid.gap-4.md\\:grid-cols-\\[minmax\\(0\\,18rem\\)_1fr\\]'
    )
    expect(gridElements.length).toBe(3)
  })
})
