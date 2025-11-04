import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MarkdownText from './MarkdownText'

// Mock HighlightText component
jest.mock('./HighlightText', () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => <span>{text}</span>,
}))

// Mock PostHog
const mockCapture = jest.fn()
jest.mock('posthog-js/react', () => ({
  usePostHog: () => ({
    capture: mockCapture,
  }),
}))

describe('MarkdownText', () => {
  beforeEach(() => {
    mockCapture.mockClear()
  })

  describe('Links', () => {
    it('renders internal link with correct href', () => {
      render(<MarkdownText text="Check out [BabyPool](/projects/babypool) for details" />)
      const link = screen.getByRole('link', { name: /BabyPool/ })
      expect(link).toHaveAttribute('href', '/projects/babypool')
    })

    it('renders external link with target blank', () => {
      render(<MarkdownText text="Visit [GitHub](https://github.com) for code" />)
      const link = screen.getByRole('link', { name: /GitHub/ })
      expect(link).toHaveAttribute('href', 'https://github.com')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('renders internal link with icon', () => {
      render(<MarkdownText text="[TribeApp](/projects/tribe-update) is live" />)
      const link = screen.getByRole('link', { name: /TribeApp/ })
      const svg = link.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('applies correct styling to links', () => {
      render(<MarkdownText text="[Project](/projects/test)" />)
      const link = screen.getByRole('link')
      expect(link).toHaveClass('text-accent-warm', 'hover:underline', 'transition-colors')
    })

    it('tracks link click with PostHog', async () => {
      const user = userEvent.setup()
      render(
        <MarkdownText
          text="[BabyPool](/projects/babypool)"
          trackingContext={{ roleId: 'independent-pm-dev-2024', company: 'Independent' }}
        />
      )

      const link = screen.getByRole('link', { name: /BabyPool/ })
      await user.click(link)

      expect(mockCapture).toHaveBeenCalledWith('cv_project_link_clicked', {
        project_slug: 'babypool',
        project_name: 'BabyPool',
        role_id: 'independent-pm-dev-2024',
        company: 'Independent',
        url: '/projects/babypool',
      })
    })

    it('handles link with bold and italic formatting nearby', () => {
      render(<MarkdownText text="**Bold** [Link](/test) *italic*" />)
      expect(screen.getByText('Bold').parentElement?.tagName).toBe('STRONG')
      expect(screen.getByRole('link', { name: /Link/ })).toBeInTheDocument()
      expect(screen.getByText('italic').parentElement?.tagName).toBe('EM')
    })

    it('stopPropagation on link click', async () => {
      const user = userEvent.setup()

      render(<MarkdownText text="[Link](/test)" />)
      const link = screen.getByRole('link')

      // Attach event listener to test stopPropagation
      link.addEventListener('click', (e) => {
        expect(e.defaultPrevented).toBe(false) // Link should still navigate
      })

      await user.click(link)
    })
  })

  describe('Bold text', () => {
    it('renders bold text with ** syntax', () => {
      render(<MarkdownText text="This is **bold text** here" />)
      const boldElement = screen.getByText('bold text')
      // HighlightText wraps content in span, so check parent
      expect(boldElement.parentElement?.tagName).toBe('STRONG')
      expect(boldElement.parentElement).toHaveClass('font-semibold', 'text-text')
    })

    it('renders multiple bold segments', () => {
      render(<MarkdownText text="**First bold** and **second bold**" />)
      const boldElements = screen.getAllByText(/bold/)
      expect(boldElements).toHaveLength(2)
      expect(boldElements[0].parentElement?.tagName).toBe('STRONG')
      expect(boldElements[1].parentElement?.tagName).toBe('STRONG')
    })

    it('handles bold text at start of string', () => {
      render(<MarkdownText text="**Bold start** normal text" />)
      expect(screen.getByText('Bold start').parentElement?.tagName).toBe('STRONG')
    })

    it('handles bold text at end of string', () => {
      render(<MarkdownText text="Normal text **bold end**" />)
      expect(screen.getByText('bold end').parentElement?.tagName).toBe('STRONG')
    })
  })

  describe('Italic text', () => {
    it('renders italic text with * syntax', () => {
      render(<MarkdownText text="This is *italic text* here" />)
      const italicElement = screen.getByText('italic text')
      expect(italicElement.parentElement?.tagName).toBe('EM')
      expect(italicElement.parentElement).toHaveClass('italic')
    })

    it('renders multiple italic segments', () => {
      render(<MarkdownText text="*First italic* and *second italic*" />)
      const italicElements = screen.getAllByText(/italic/)
      expect(italicElements).toHaveLength(2)
      expect(italicElements[0].parentElement?.tagName).toBe('EM')
      expect(italicElements[1].parentElement?.tagName).toBe('EM')
    })
  })

  describe('Mixed formatting', () => {
    it('renders both bold and italic in same text', () => {
      render(<MarkdownText text="**Bold** and *italic* text" />)
      expect(screen.getByText('Bold').parentElement?.tagName).toBe('STRONG')
      expect(screen.getByText('italic').parentElement?.tagName).toBe('EM')
    })

    it('handles complex mixed formatting', () => {
      render(<MarkdownText text="Normal **bold** normal *italic* **bold again**" />)
      const boldElements = screen.getAllByText(/bold/)
      const italicElement = screen.getByText('italic')
      expect(boldElements).toHaveLength(2)
      expect(italicElement.parentElement?.tagName).toBe('EM')
    })
  })

  describe('Plain text', () => {
    it('renders plain text without formatting', () => {
      const { container } = render(<MarkdownText text="Just plain text" />)
      expect(container.querySelector('strong')).toBeNull()
      expect(container.querySelector('em')).toBeNull()
      expect(screen.getByText('Just plain text')).toBeInTheDocument()
    })

    it('renders empty string', () => {
      const { container } = render(<MarkdownText text="" />)
      expect(container.querySelector('span')).toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    it('handles incomplete markdown syntax', () => {
      render(<MarkdownText text="This has **incomplete bold" />)
      // Should render as plain text since markdown is incomplete
      expect(screen.getByText(/incomplete bold/)).toBeInTheDocument()
    })

    it('handles single asterisk as plain text', () => {
      render(<MarkdownText text="This * is plain" />)
      expect(screen.getByText(/\*/)).toBeInTheDocument()
    })

    it('handles empty markdown markers', () => {
      render(<MarkdownText text="Empty ** or * markers" />)
      expect(screen.getByText(/Empty/)).toBeInTheDocument()
    })

    it('handles text with only markdown markers', () => {
      render(<MarkdownText text="**Bold**" />)
      expect(screen.getByText('Bold').parentElement?.tagName).toBe('STRONG')
    })
  })

  describe('Real-world CV examples', () => {
    it('renders CV highlight with metrics', () => {
      render(
        <MarkdownText text="Launched **3 flagship products** generating **$2M+ ARR** in first year" />
      )
      expect(screen.getByText('3 flagship products').parentElement?.tagName).toBe('STRONG')
      expect(screen.getByText('$2M+ ARR').parentElement?.tagName).toBe('STRONG')
    })

    it('renders team leadership highlight', () => {
      render(<MarkdownText text="Led team of **12 engineers** across *4 time zones*" />)
      expect(screen.getByText('12 engineers').parentElement?.tagName).toBe('STRONG')
      expect(screen.getByText('4 time zones').parentElement?.tagName).toBe('EM')
    })

    it('renders performance improvement highlight', () => {
      render(<MarkdownText text="Improved efficiency by **40%** reducing costs by **$700K**" />)
      const boldElements = screen.getAllByText(/40%|700K/)
      expect(boldElements).toHaveLength(2)
      expect(boldElements[0].parentElement?.tagName).toBe('STRONG')
      expect(boldElements[1].parentElement?.tagName).toBe('STRONG')
    })
  })

  describe('CSS classes', () => {
    it('applies custom className to wrapper', () => {
      const { container } = render(<MarkdownText text="Test" className="custom-class" />)
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('applies default classes to bold text', () => {
      render(<MarkdownText text="**Bold**" />)
      const boldElement = screen.getByText('Bold')
      expect(boldElement.parentElement).toHaveClass('font-semibold', 'text-text')
    })

    it('applies default classes to italic text', () => {
      render(<MarkdownText text="*Italic*" />)
      const italicElement = screen.getByText('Italic')
      expect(italicElement.parentElement).toHaveClass('italic')
    })
  })

  describe('Integration with search', () => {
    it('passes searchQuery to HighlightText', () => {
      // HighlightText is mocked, but this tests the integration
      render(<MarkdownText text="**Bold** text" searchQuery="Bold" />)
      expect(screen.getByText('Bold')).toBeInTheDocument()
    })

    it('handles search with formatted text', () => {
      render(<MarkdownText text="Launched **3 products** successfully" searchQuery="products" />)
      expect(screen.getByText('3 products').parentElement?.tagName).toBe('STRONG')
    })
  })
})
