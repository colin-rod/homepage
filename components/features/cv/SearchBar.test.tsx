import { render, screen, fireEvent } from '@testing-library/react'
import SearchBar, { SearchBarProps } from './SearchBar'

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Search: ({ className }: { className?: string }) => (
    <span data-testid="search-icon" className={className}>
      🔍
    </span>
  ),
  X: ({ className }: { className?: string }) => (
    <span data-testid="x-icon" className={className}>
      ✕
    </span>
  ),
}))

describe('SearchBar', () => {
  const defaultProps: SearchBarProps = {
    value: '',
    onChange: jest.fn(),
    onClear: jest.fn(),
    resultsCount: 10,
    totalCount: 10,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders search input', () => {
      render(<SearchBar {...defaultProps} />)
      const input = screen.getByLabelText('Search CV content')
      expect(input).toBeInTheDocument()
    })

    it('renders search icon', () => {
      render(<SearchBar {...defaultProps} />)
      expect(screen.getAllByTestId('search-icon').length).toBeGreaterThan(0)
    })

    it('renders with correct placeholder on desktop', () => {
      render(<SearchBar {...defaultProps} />)
      const desktopInput = screen.getByPlaceholderText(
        'Search roles, companies, skills, or descriptions...'
      )
      expect(desktopInput).toBeInTheDocument()
    })

    it('shows current value in input', () => {
      render(<SearchBar {...defaultProps} value="Product Manager" />)
      const input = screen.getByDisplayValue('Product Manager')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Search Functionality', () => {
    it('calls onChange when typing', () => {
      const onChange = jest.fn()
      render(<SearchBar {...defaultProps} onChange={onChange} />)

      const input = screen.getByLabelText('Search CV content')
      fireEvent.change(input, { target: { value: 'React' } })

      expect(onChange).toHaveBeenCalledWith('React')
    })

    it('calls onChange multiple times as user types', () => {
      const onChange = jest.fn()
      render(<SearchBar {...defaultProps} onChange={onChange} />)

      const input = screen.getByLabelText('Search CV content')
      fireEvent.change(input, { target: { value: 'R' } })
      fireEvent.change(input, { target: { value: 'Re' } })
      fireEvent.change(input, { target: { value: 'Rea' } })

      expect(onChange).toHaveBeenCalledTimes(3)
      expect(onChange).toHaveBeenLastCalledWith('Rea')
    })

    it('handles empty string input', () => {
      const onChange = jest.fn()
      render(<SearchBar {...defaultProps} value="test" onChange={onChange} />)

      const input = screen.getByLabelText('Search CV content')
      fireEvent.change(input, { target: { value: '' } })

      expect(onChange).toHaveBeenCalledWith('')
    })
  })

  describe('Clear Functionality', () => {
    it('shows clear button when value is present', () => {
      render(<SearchBar {...defaultProps} value="Product" />)
      const clearButton = screen.getByLabelText('Clear search')
      expect(clearButton).toBeInTheDocument()
    })

    it('hides clear button when value is empty', () => {
      render(<SearchBar {...defaultProps} value="" />)
      const clearButton = screen.queryByLabelText('Clear search')
      expect(clearButton).not.toBeInTheDocument()
    })

    it('calls onClear when clear button is clicked', () => {
      const onClear = jest.fn()
      render(<SearchBar {...defaultProps} value="Product" onClear={onClear} />)

      const clearButton = screen.getByLabelText('Clear search')
      fireEvent.click(clearButton)

      expect(onClear).toHaveBeenCalledTimes(1)
    })

    it('shows X icon in clear button', () => {
      render(<SearchBar {...defaultProps} value="Product" />)
      expect(screen.getAllByTestId('x-icon').length).toBeGreaterThan(0)
    })
  })

  describe('ARIA Live Region', () => {
    it('announces when showing all positions', () => {
      render(<SearchBar {...defaultProps} value="" resultsCount={5} totalCount={5} />)
      const liveRegion = screen.getByRole('status')
      expect(liveRegion).toHaveTextContent('Showing all 5 positions')
    })

    it('announces search results count (plural)', () => {
      render(<SearchBar {...defaultProps} value="React" resultsCount={3} totalCount={10} />)
      const liveRegion = screen.getByRole('status')
      expect(liveRegion).toHaveTextContent('3 results found')
    })

    it('announces search results count (singular)', () => {
      render(<SearchBar {...defaultProps} value="React" resultsCount={1} totalCount={10} />)
      const liveRegion = screen.getByRole('status')
      expect(liveRegion).toHaveTextContent('1 result found')
    })

    it('announces no results found', () => {
      render(<SearchBar {...defaultProps} value="XYZ" resultsCount={0} totalCount={10} />)
      const liveRegion = screen.getByRole('status')
      expect(liveRegion).toHaveTextContent('No results found')
    })

    it('handles single position correctly', () => {
      render(<SearchBar {...defaultProps} value="" resultsCount={1} totalCount={1} />)
      const liveRegion = screen.getByRole('status')
      expect(liveRegion).toHaveTextContent('Showing all 1 position')
    })

    it('has correct ARIA attributes', () => {
      render(<SearchBar {...defaultProps} />)
      const liveRegion = screen.getByRole('status')
      expect(liveRegion).toHaveAttribute('aria-live', 'polite')
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true')
    })

    it('is visually hidden but accessible to screen readers', () => {
      render(<SearchBar {...defaultProps} />)
      const liveRegion = screen.getByRole('status')
      expect(liveRegion).toHaveClass('sr-only')
    })
  })

  describe('Mobile Behavior', () => {
    // Note: These tests verify the component structure exists
    // Actual mobile behavior would require viewport testing

    it('renders mobile search button', () => {
      render(<SearchBar {...defaultProps} />)
      const mobileButton = screen.getByLabelText('Open search')
      expect(mobileButton).toBeInTheDocument()
    })

    it('mobile button shows "Search CV" text', () => {
      render(<SearchBar {...defaultProps} />)
      expect(screen.getByText('Search CV')).toBeInTheDocument()
    })
  })

  describe('Desktop Behavior', () => {
    it('renders desktop search input with full placeholder', () => {
      render(<SearchBar {...defaultProps} />)
      const input = screen.getByPlaceholderText(
        'Search roles, companies, skills, or descriptions...'
      )
      expect(input).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has accessible label for search input', () => {
      render(<SearchBar {...defaultProps} />)
      const input = screen.getByLabelText('Search CV content')
      expect(input).toBeInTheDocument()
    })

    it('has accessible label for clear button', () => {
      render(<SearchBar {...defaultProps} value="test" />)
      const clearButton = screen.getByLabelText('Clear search')
      expect(clearButton).toBeInTheDocument()
    })

    it('has accessible label for mobile open button', () => {
      render(<SearchBar {...defaultProps} />)
      const openButton = screen.getByLabelText('Open search')
      expect(openButton).toBeInTheDocument()
    })

    it('search input has type="text"', () => {
      render(<SearchBar {...defaultProps} />)
      const input = screen.getByLabelText('Search CV content')
      expect(input).toHaveAttribute('type', 'text')
    })

    it('supports keyboard navigation', () => {
      const onChange = jest.fn()
      render(<SearchBar {...defaultProps} onChange={onChange} />)

      const input = screen.getByLabelText('Search CV content')
      input.focus()
      expect(input).toHaveFocus()

      fireEvent.change(input, { target: { value: 'test' } })
      expect(onChange).toHaveBeenCalledWith('test')
    })
  })

  describe('Focus Management', () => {
    it('mobile input appears when search is expanded', () => {
      render(<SearchBar {...defaultProps} />)

      // Click to expand mobile search
      const openButton = screen.getByLabelText('Open search')
      fireEvent.click(openButton)

      // Find the mobile input (it has a different placeholder)
      const mobileInput = screen.getByPlaceholderText('Search roles, companies, skills...')
      expect(mobileInput).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles zero results', () => {
      render(<SearchBar {...defaultProps} resultsCount={0} totalCount={0} />)
      const liveRegion = screen.getByRole('status')
      expect(liveRegion).toHaveTextContent('Showing all 0 positions')
    })

    it('handles large result counts', () => {
      render(<SearchBar {...defaultProps} value="test" resultsCount={999} totalCount={1000} />)
      const liveRegion = screen.getByRole('status')
      expect(liveRegion).toHaveTextContent('999 results found')
    })

    it('handles special characters in value', () => {
      const onChange = jest.fn()
      render(<SearchBar {...defaultProps} onChange={onChange} />)

      const input = screen.getByLabelText('Search CV content')
      fireEvent.change(input, { target: { value: '!@#$%^&*()' } })

      expect(onChange).toHaveBeenCalledWith('!@#$%^&*()')
    })

    it('handles very long search queries', () => {
      const longQuery = 'a'.repeat(200)
      render(<SearchBar {...defaultProps} value={longQuery} />)
      const input = screen.getByDisplayValue(longQuery)
      expect(input).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('applies focus styles on input', () => {
      render(<SearchBar {...defaultProps} />)
      const input = screen.getByLabelText('Search CV content')
      expect(input.className).toContain('focus:ring-2')
      expect(input.className).toContain('focus:ring-accent-warm')
    })

    it('applies hover styles on clear button', () => {
      render(<SearchBar {...defaultProps} value="test" />)
      const clearButton = screen.getByLabelText('Clear search')
      expect(clearButton.className).toContain('hover:text-text')
    })

    it('applies transition classes', () => {
      render(<SearchBar {...defaultProps} />)
      const input = screen.getByLabelText('Search CV content')
      expect(input.className).toContain('transition')
    })
  })

  describe('Icon Display', () => {
    it('shows search icon in input', () => {
      render(<SearchBar {...defaultProps} />)
      const icons = screen.getAllByTestId('search-icon')
      expect(icons.length).toBeGreaterThan(0)
    })

    it('shows X icon when value is present', () => {
      render(<SearchBar {...defaultProps} value="test" />)
      const xIcons = screen.getAllByTestId('x-icon')
      expect(xIcons.length).toBeGreaterThan(0)
    })

    it('does not show X icon when value is empty', () => {
      render(<SearchBar {...defaultProps} value="" />)
      const xIcons = screen.queryAllByTestId('x-icon')
      expect(xIcons.length).toBe(0)
    })
  })
})
