import { render, screen, fireEvent } from '@testing-library/react'
import SearchResultsPanel, { SearchResultItem, SearchResultsPanelProps } from './SearchResultsPanel'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

// Mock lucide-react
jest.mock('lucide-react', () => ({
  X: ({ className }: { className?: string }) => (
    <span data-testid="x-icon" className={className}>
      ✕
    </span>
  ),
}))

describe('SearchResultsPanel', () => {
  const mockResults: SearchResultItem[] = [
    {
      id: 'exp-1',
      title: 'Senior Product Manager',
      company: 'Tech Corp',
      matchCount: 3,
      previewText: 'Led product strategy and development...',
    },
    {
      id: 'exp-2',
      title: 'Product Manager',
      company: 'Startup Inc',
      matchCount: 1,
      previewText: 'Managed product lifecycle...',
    },
  ]

  const defaultProps: SearchResultsPanelProps = {
    results: mockResults,
    query: 'Product',
    onResultClick: jest.fn(),
    onClose: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders search results panel', () => {
      render(<SearchResultsPanel {...defaultProps} />)
      expect(screen.getByText(/2 matches found/)).toBeInTheDocument()
    })

    it('renders query in header', () => {
      render(<SearchResultsPanel {...defaultProps} />)
      const productText = screen.getAllByText(/Product/)
      expect(productText.length).toBeGreaterThan(0)
    })

    it('renders search icon emoji', () => {
      render(<SearchResultsPanel {...defaultProps} />)
      expect(screen.getByText('🔍')).toBeInTheDocument()
    })

    it('renders close button', () => {
      render(<SearchResultsPanel {...defaultProps} />)
      expect(screen.getByLabelText('Close search results')).toBeInTheDocument()
    })

    it('renders all search results', () => {
      render(<SearchResultsPanel {...defaultProps} />)
      expect(screen.getByText('Tech Corp — Senior Product Manager')).toBeInTheDocument()
      expect(screen.getByText('Startup Inc — Product Manager')).toBeInTheDocument()
    })

    it('renders match counts', () => {
      render(<SearchResultsPanel {...defaultProps} />)
      expect(screen.getByText('3 matches')).toBeInTheDocument()
      expect(screen.getByText('1 match')).toBeInTheDocument()
    })

    it('renders preview text when provided', () => {
      render(<SearchResultsPanel {...defaultProps} />)
      expect(screen.getByText('Led product strategy and development...')).toBeInTheDocument()
      expect(screen.getByText('Managed product lifecycle...')).toBeInTheDocument()
    })

    it('renders without preview text', () => {
      const resultsWithoutPreview = [
        {
          id: 'exp-1',
          title: 'Senior Product Manager',
          company: 'Tech Corp',
          matchCount: 3,
        },
      ]
      render(<SearchResultsPanel {...defaultProps} results={resultsWithoutPreview} />)
      expect(screen.getByText('Tech Corp — Senior Product Manager')).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('returns null when results array is empty', () => {
      const { container } = render(<SearchResultsPanel {...defaultProps} results={[]} />)
      expect(container.firstChild).toBeNull()
    })

    it('does not render panel with no results', () => {
      render(<SearchResultsPanel {...defaultProps} results={[]} />)
      expect(screen.queryByText(/matches found/)).not.toBeInTheDocument()
    })
  })

  describe('Result Count Text', () => {
    it('uses singular "match" for 1 result', () => {
      const singleResult = [mockResults[0]]
      render(<SearchResultsPanel {...defaultProps} results={singleResult} />)
      expect(screen.getByText(/1 match found for/)).toBeInTheDocument()
      const productText = screen.getAllByText(/Product/)
      expect(productText.length).toBeGreaterThan(0)
    })

    it('uses plural "matches" for multiple results', () => {
      render(<SearchResultsPanel {...defaultProps} />)
      expect(screen.getByText(/2 matches found for/)).toBeInTheDocument()
      const productText = screen.getAllByText(/Product/)
      expect(productText.length).toBeGreaterThan(0)
    })

    it('uses singular "match" in badge for 1 match', () => {
      const singleMatchResult = [{ ...mockResults[0], matchCount: 1 }]
      render(<SearchResultsPanel {...defaultProps} results={singleMatchResult} />)
      expect(screen.getByText('1 match')).toBeInTheDocument()
    })

    it('uses plural "matches" in badge for multiple matches', () => {
      render(<SearchResultsPanel {...defaultProps} />)
      expect(screen.getByText('3 matches')).toBeInTheDocument()
    })
  })

  describe('Click Interactions', () => {
    it('calls onResultClick when result is clicked', () => {
      const onResultClick = jest.fn()
      render(<SearchResultsPanel {...defaultProps} onResultClick={onResultClick} />)

      const firstResult = screen.getByText('Tech Corp — Senior Product Manager')
      fireEvent.click(firstResult)

      expect(onResultClick).toHaveBeenCalledWith('exp-1')
    })

    it('calls onResultClick with correct id for second result', () => {
      const onResultClick = jest.fn()
      render(<SearchResultsPanel {...defaultProps} onResultClick={onResultClick} />)

      const secondResult = screen.getByText('Startup Inc — Product Manager')
      fireEvent.click(secondResult)

      expect(onResultClick).toHaveBeenCalledWith('exp-2')
    })

    it('calls onClose when close button is clicked', () => {
      const onClose = jest.fn()
      render(<SearchResultsPanel {...defaultProps} onClose={onClose} />)

      const closeButton = screen.getByLabelText('Close search results')
      fireEvent.click(closeButton)

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('does not call onResultClick when clicking close button', () => {
      const onResultClick = jest.fn()
      const onClose = jest.fn()
      render(
        <SearchResultsPanel {...defaultProps} onResultClick={onResultClick} onClose={onClose} />
      )

      const closeButton = screen.getByLabelText('Close search results')
      fireEvent.click(closeButton)

      expect(onResultClick).not.toHaveBeenCalled()
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Keyboard Interactions', () => {
    it('calls onClose when Escape key is pressed', () => {
      const onClose = jest.fn()
      render(<SearchResultsPanel {...defaultProps} onClose={onClose} />)

      fireEvent.keyDown(document, { key: 'Escape' })

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('does not call onClose for other keys', () => {
      const onClose = jest.fn()
      render(<SearchResultsPanel {...defaultProps} onClose={onClose} />)

      fireEvent.keyDown(document, { key: 'Enter' })
      fireEvent.keyDown(document, { key: 'Space' })
      fireEvent.keyDown(document, { key: 'a' })

      expect(onClose).not.toHaveBeenCalled()
    })

    it('cleans up keyboard event listener on unmount', () => {
      const { unmount } = render(<SearchResultsPanel {...defaultProps} />)
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener')

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
      removeEventListenerSpy.mockRestore()
    })
  })

  describe('Accessibility', () => {
    it('has role="list" on results container', () => {
      render(<SearchResultsPanel {...defaultProps} />)
      const list = screen.getByRole('list')
      expect(list).toBeInTheDocument()
    })

    it('has role="listitem" on each result', () => {
      render(<SearchResultsPanel {...defaultProps} />)
      const listItems = screen.getAllByRole('listitem')
      expect(listItems.length).toBe(2)
    })

    it('has accessible label for close button', () => {
      render(<SearchResultsPanel {...defaultProps} />)
      expect(screen.getByLabelText('Close search results')).toBeInTheDocument()
    })

    it('has ARIA live region for screen readers', () => {
      render(<SearchResultsPanel {...defaultProps} />)
      const liveRegion = screen.getByRole('status')
      expect(liveRegion).toBeInTheDocument()
      expect(liveRegion).toHaveAttribute('aria-live', 'polite')
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true')
    })

    it('announces result count in live region', () => {
      render(<SearchResultsPanel {...defaultProps} />)
      const liveRegion = screen.getByRole('status')
      expect(liveRegion).toHaveTextContent('2 results found. Press Escape to close.')
    })

    it('uses singular "result" in live region for 1 result', () => {
      const singleResult = [mockResults[0]]
      render(<SearchResultsPanel {...defaultProps} results={singleResult} />)
      const liveRegion = screen.getByRole('status')
      expect(liveRegion).toHaveTextContent('1 result found. Press Escape to close.')
    })

    it('live region is visually hidden', () => {
      render(<SearchResultsPanel {...defaultProps} />)
      const liveRegion = screen.getByRole('status')
      expect(liveRegion).toHaveClass('sr-only')
    })

    it('result buttons have focus styles', () => {
      const { container } = render(<SearchResultsPanel {...defaultProps} />)
      const resultButtons = container.querySelectorAll('button[role="listitem"]')

      resultButtons.forEach((button) => {
        expect(button).toHaveClass('focus:ring-2')
        expect(button).toHaveClass('focus:ring-accent-warm')
      })
    })

    it('result buttons are keyboard accessible', () => {
      render(<SearchResultsPanel {...defaultProps} />)
      const firstResult = screen.getByText('Tech Corp — Senior Product Manager').closest('button')

      firstResult?.focus()
      expect(firstResult).toHaveFocus()
    })
  })

  describe('Styling', () => {
    it('applies card styling to panel', () => {
      const { container } = render(<SearchResultsPanel {...defaultProps} />)
      const panel = container.querySelector('.card')
      expect(panel).toBeInTheDocument()
      expect(panel).toHaveClass('bg-neutral-surface')
      expect(panel).toHaveClass('border-accent-warm/30')
    })

    it('applies hover styles to result buttons', () => {
      const { container } = render(<SearchResultsPanel {...defaultProps} />)
      const resultButtons = container.querySelectorAll('button[role="listitem"]')

      resultButtons.forEach((button) => {
        expect(button).toHaveClass('hover:bg-accent-warm/5')
        expect(button).toHaveClass('hover:border-accent-warm/20')
      })
    })

    it('styles match count badge correctly', () => {
      const { container } = render(<SearchResultsPanel {...defaultProps} />)
      const badges = container.querySelectorAll('.bg-accent-warm\\/10')
      expect(badges.length).toBe(2)
    })

    it('truncates preview text', () => {
      const { container } = render(<SearchResultsPanel {...defaultProps} />)
      const previews = container.querySelectorAll('.truncate')
      expect(previews.length).toBeGreaterThan(0)
    })

    it('applies border to header', () => {
      const { container } = render(<SearchResultsPanel {...defaultProps} />)
      const header = container.querySelector('.border-b')
      expect(header).toBeInTheDocument()
    })
  })

  describe('Layout', () => {
    it('uses flex layout for header', () => {
      const { container } = render(<SearchResultsPanel {...defaultProps} />)
      const header = container.querySelector('.flex.items-center.justify-between')
      expect(header).toBeInTheDocument()
    })

    it('spaces results with gap', () => {
      const { container } = render(<SearchResultsPanel {...defaultProps} />)
      const resultsList = container.querySelector('.space-y-2')
      expect(resultsList).toBeInTheDocument()
    })

    it('prevents text overflow in result titles', () => {
      const { container } = render(<SearchResultsPanel {...defaultProps} />)
      const resultContents = container.querySelectorAll('.min-w-0')
      expect(resultContents.length).toBe(2)
    })

    it('prevents badge from wrapping', () => {
      const { container } = render(<SearchResultsPanel {...defaultProps} />)
      const badges = container.querySelectorAll('.flex-shrink-0')
      expect(badges.length).toBeGreaterThan(0)
    })
  })

  describe('Edge Cases', () => {
    it('handles very long query strings', () => {
      const longQuery = 'a'.repeat(100)
      render(<SearchResultsPanel {...defaultProps} query={longQuery} />)
      expect(screen.getByText(new RegExp(longQuery))).toBeInTheDocument()
    })

    it('handles very long company names', () => {
      const longCompanyResult: SearchResultItem[] = [
        {
          id: 'exp-1',
          title: 'PM',
          company: 'Very Long Company Name That Should Be Handled Properly',
          matchCount: 1,
        },
      ]
      render(<SearchResultsPanel {...defaultProps} results={longCompanyResult} />)
      expect(
        screen.getByText(/Very Long Company Name That Should Be Handled Properly/)
      ).toBeInTheDocument()
    })

    it('handles very long preview text', () => {
      const longPreviewResult: SearchResultItem[] = [
        {
          id: 'exp-1',
          title: 'PM',
          company: 'Tech Corp',
          matchCount: 1,
          previewText: 'a'.repeat(200),
        },
      ]
      render(<SearchResultsPanel {...defaultProps} results={longPreviewResult} />)
      // Should render without error
      expect(screen.getByText('Tech Corp — PM')).toBeInTheDocument()
    })

    it('handles zero match count', () => {
      const zeroMatchResult: SearchResultItem[] = [
        {
          id: 'exp-1',
          title: 'PM',
          company: 'Tech Corp',
          matchCount: 0,
        },
      ]
      render(<SearchResultsPanel {...defaultProps} results={zeroMatchResult} />)
      expect(screen.getByText('0 matches')).toBeInTheDocument()
    })

    it('handles large match counts', () => {
      const largeMatchResult: SearchResultItem[] = [
        {
          id: 'exp-1',
          title: 'PM',
          company: 'Tech Corp',
          matchCount: 999,
        },
      ]
      render(<SearchResultsPanel {...defaultProps} results={largeMatchResult} />)
      expect(screen.getByText('999 matches')).toBeInTheDocument()
    })

    it('handles many results', () => {
      const manyResults: SearchResultItem[] = Array.from({ length: 50 }, (_, i) => ({
        id: `exp-${i}`,
        title: `Title ${i}`,
        company: `Company ${i}`,
        matchCount: i,
      }))
      render(<SearchResultsPanel {...defaultProps} results={manyResults} />)
      expect(screen.getByText(/50 matches found for/)).toBeInTheDocument()
      const productText = screen.getAllByText(/Product/)
      expect(productText.length).toBeGreaterThan(0)
    })

    it('handles special characters in query', () => {
      render(<SearchResultsPanel {...defaultProps} query="C++ & JavaScript" />)
      expect(screen.getByText(/C\+\+ & JavaScript/)).toBeInTheDocument()
    })

    it('handles undefined preview text', () => {
      const resultWithoutPreview: SearchResultItem[] = [
        {
          id: 'exp-1',
          title: 'PM',
          company: 'Tech Corp',
          matchCount: 1,
          previewText: undefined,
        },
      ]
      render(<SearchResultsPanel {...defaultProps} results={resultWithoutPreview} />)
      expect(screen.getByText('Tech Corp — PM')).toBeInTheDocument()
    })
  })

  describe('Interactive States', () => {
    it('applies transition classes for animations', () => {
      const { container } = render(<SearchResultsPanel {...defaultProps} />)
      const resultButtons = container.querySelectorAll('button[role="listitem"]')

      resultButtons.forEach((button) => {
        expect(button).toHaveClass('transition-all')
        expect(button).toHaveClass('duration-200')
      })
    })

    it('close button has hover state', () => {
      render(<SearchResultsPanel {...defaultProps} />)
      const closeButton = screen.getByLabelText('Close search results')
      expect(closeButton).toHaveClass('hover:text-text')
    })

    it('all result buttons are full width', () => {
      const { container } = render(<SearchResultsPanel {...defaultProps} />)
      const resultButtons = container.querySelectorAll('button[role="listitem"]')

      resultButtons.forEach((button) => {
        expect(button).toHaveClass('w-full')
        expect(button).toHaveClass('text-left')
      })
    })
  })
})
