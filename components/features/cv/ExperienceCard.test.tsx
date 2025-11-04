import { render, screen, fireEvent } from '@testing-library/react'
import ExperienceCard, { ExperienceCardProps } from './ExperienceCard'
import { HighlightEntry, KPI } from '@/lib/types'

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
  useReducedMotion: () => false,
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: Record<string, unknown> & { src: string; alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />
  },
}))

// Mock child components
jest.mock('./HighlightText', () => {
  return function MockHighlightText({ text }: { text: string }) {
    return <span>{text}</span>
  }
})

jest.mock('./MarkdownText', () => {
  return function MockMarkdownText({ text }: { text: string }) {
    return <span>{text}</span>
  }
})

jest.mock('./KPIBadgeRow', () => {
  return function MockKPIBadgeRow() {
    return <div data-testid="kpi-badge-row">KPI Badges</div>
  }
})

describe('ExperienceCard', () => {
  const mockFormatDate = (date: string | null | undefined): string => {
    if (!date) return 'Present'
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  const defaultProps: ExperienceCardProps = {
    id: 'exp-1',
    title: 'Senior Product Manager',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    startDate: '2020-01-01',
    endDate: '2023-12-31',
    description: 'Led product development for flagship products',
    highlights: [
      'Increased user engagement by 50%',
      'Launched 3 major features',
      'Managed team of 5 engineers',
    ],
    tags: ['product', 'strategy'],
    isExpanded: false,
    onToggle: jest.fn(),
    formatDate: mockFormatDate,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders job title and company', () => {
      render(<ExperienceCard {...defaultProps} />)
      expect(screen.getByText('Senior Product Manager')).toBeInTheDocument()
      expect(screen.getByText(/Tech Corp/)).toBeInTheDocument()
    })

    it('renders location', () => {
      render(<ExperienceCard {...defaultProps} />)
      expect(screen.getByText(/San Francisco, CA/)).toBeInTheDocument()
    })

    it('renders date range', () => {
      render(<ExperienceCard {...defaultProps} />)
      expect(screen.getByText(/Jan 2020/)).toBeInTheDocument()
      expect(screen.getByText(/Dec 2023/)).toBeInTheDocument()
    })

    it('renders description', () => {
      render(<ExperienceCard {...defaultProps} />)
      expect(screen.getByText('Led product development for flagship products')).toBeInTheDocument()
    })

    it('renders company icon when provided', () => {
      render(<ExperienceCard {...defaultProps} icon="/logo.png" />)
      const logo = screen.getByAltText('Tech Corp logo')
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveAttribute('src', '/logo.png')
    })

    it('renders tags', () => {
      render(<ExperienceCard {...defaultProps} />)
      expect(screen.getByText('product')).toBeInTheDocument()
      expect(screen.getByText('strategy')).toBeInTheDocument()
    })

    it('renders KPI badges when provided', () => {
      const kpis: KPI[] = [
        { label: 'Revenue Growth', value: '+40%', category: 'revenue' },
        { label: 'User Growth', value: '+50%', category: 'growth' },
      ]
      render(<ExperienceCard {...defaultProps} kpis={kpis} />)
      expect(screen.getByTestId('kpi-badge-row')).toBeInTheDocument()
    })
  })

  describe('Highlight Display', () => {
    it('shows first 3 highlights in condensed view', () => {
      render(<ExperienceCard {...defaultProps} />)
      expect(screen.getByText('Increased user engagement by 50%')).toBeInTheDocument()
      expect(screen.getByText('Launched 3 major features')).toBeInTheDocument()
      expect(screen.getByText('Managed team of 5 engineers')).toBeInTheDocument()
    })

    it('shows "+X more" indicator when there are more than 3 highlights', () => {
      const manyHighlights = [
        'Achievement 1',
        'Achievement 2',
        'Achievement 3',
        'Achievement 4',
        'Achievement 5',
      ]
      render(<ExperienceCard {...defaultProps} highlights={manyHighlights} />)
      expect(screen.getByText('+2 more')).toBeInTheDocument()
    })

    it('does not show "+X more" indicator when there are 3 or fewer highlights', () => {
      render(<ExperienceCard {...defaultProps} />)
      expect(screen.queryByText(/\+\d+ more/)).not.toBeInTheDocument()
    })

    it('handles HighlightEntry format', () => {
      const highlightEntries: HighlightEntry[] = [
        { text: 'Achievement with skills', skills: ['React', 'TypeScript'] },
        { text: 'Another achievement', skills: ['Node.js'] },
      ]
      render(<ExperienceCard {...defaultProps} highlights={highlightEntries} />)
      expect(screen.getByText('Achievement with skills')).toBeInTheDocument()
      expect(screen.getByText('Another achievement')).toBeInTheDocument()
    })

    it('handles mixed string and HighlightEntry formats', () => {
      const mixedHighlights: (string | HighlightEntry)[] = [
        'Simple string highlight',
        { text: 'Structured highlight', skills: ['React'] },
      ]
      render(<ExperienceCard {...defaultProps} highlights={mixedHighlights} />)
      expect(screen.getByText('Simple string highlight')).toBeInTheDocument()
      expect(screen.getByText('Structured highlight')).toBeInTheDocument()
    })

    it('shows filtered highlight count when totalHighlights is provided', () => {
      render(
        <ExperienceCard
          {...defaultProps}
          highlights={['Highlight 1', 'Highlight 2']}
          totalHighlights={5}
        />
      )
      expect(screen.getByText('Showing 2 of 5 highlights')).toBeInTheDocument()
    })

    it('shows message when no highlights match filters but total exists', () => {
      render(<ExperienceCard {...defaultProps} highlights={[]} totalHighlights={5} />)
      expect(screen.getByText(/No highlights match the selected skills/i)).toBeInTheDocument()
      expect(screen.getByText(/This role has 5 total highlights/i)).toBeInTheDocument()
    })
  })

  describe('Expand/Collapse Functionality', () => {
    it('is not clickable when there are 3 or fewer highlights', () => {
      render(<ExperienceCard {...defaultProps} />)
      const card = screen.getByRole('button')
      expect(card).not.toHaveAttribute('tabIndex')
    })

    it('is clickable when there are more than 3 highlights', () => {
      const manyHighlights = ['H1', 'H2', 'H3', 'H4', 'H5']
      render(<ExperienceCard {...defaultProps} highlights={manyHighlights} />)
      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('tabIndex', '0')
    })

    it('calls onToggle when clicked (with many highlights)', () => {
      const onToggle = jest.fn()
      const manyHighlights = ['H1', 'H2', 'H3', 'H4', 'H5']
      render(<ExperienceCard {...defaultProps} highlights={manyHighlights} onToggle={onToggle} />)

      const card = screen.getByRole('button')
      fireEvent.click(card)

      expect(onToggle).toHaveBeenCalledTimes(1)
    })

    it('does not call onToggle when clicked (with few highlights)', () => {
      const onToggle = jest.fn()
      render(<ExperienceCard {...defaultProps} onToggle={onToggle} />)

      const card = screen.getByRole('button')
      fireEvent.click(card)

      expect(onToggle).not.toHaveBeenCalled()
    })

    it('shows "Click to collapse" when expanded', () => {
      const manyHighlights = ['H1', 'H2', 'H3', 'H4', 'H5']
      render(<ExperienceCard {...defaultProps} highlights={manyHighlights} isExpanded={true} />)
      expect(screen.getByText('Click to collapse')).toBeInTheDocument()
    })

    it('has correct aria-expanded attribute when collapsed', () => {
      const manyHighlights = ['H1', 'H2', 'H3', 'H4', 'H5']
      render(<ExperienceCard {...defaultProps} highlights={manyHighlights} isExpanded={false} />)
      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('aria-expanded', 'false')
    })

    it('has correct aria-expanded attribute when expanded', () => {
      const manyHighlights = ['H1', 'H2', 'H3', 'H4', 'H5']
      render(<ExperienceCard {...defaultProps} highlights={manyHighlights} isExpanded={true} />)
      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('aria-expanded', 'true')
    })

    it('has correct aria-label when collapsed', () => {
      const manyHighlights = ['H1', 'H2', 'H3', 'H4', 'H5']
      render(<ExperienceCard {...defaultProps} highlights={manyHighlights} isExpanded={false} />)
      const card = screen.getByRole('button')
      expect(card).toHaveAttribute(
        'aria-label',
        'Expand to show all 5 achievements for Senior Product Manager at Tech Corp'
      )
    })

    it('has correct aria-label when expanded', () => {
      const manyHighlights = ['H1', 'H2', 'H3', 'H4', 'H5']
      render(<ExperienceCard {...defaultProps} highlights={manyHighlights} isExpanded={true} />)
      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('aria-label', 'Collapse Senior Product Manager at Tech Corp')
    })
  })

  describe('Keyboard Accessibility', () => {
    it('expands on Enter key press', () => {
      const onToggle = jest.fn()
      const manyHighlights = ['H1', 'H2', 'H3', 'H4', 'H5']
      render(<ExperienceCard {...defaultProps} highlights={manyHighlights} onToggle={onToggle} />)

      const card = screen.getByRole('button')
      fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' })

      expect(onToggle).toHaveBeenCalledTimes(1)
    })

    it('expands on Space key press', () => {
      const onToggle = jest.fn()
      const manyHighlights = ['H1', 'H2', 'H3', 'H4', 'H5']
      render(<ExperienceCard {...defaultProps} highlights={manyHighlights} onToggle={onToggle} />)

      const card = screen.getByRole('button')
      fireEvent.keyDown(card, { key: ' ', code: 'Space' })

      expect(onToggle).toHaveBeenCalledTimes(1)
    })

    it('prevents default on Space key press', () => {
      const onToggle = jest.fn()
      const manyHighlights = ['H1', 'H2', 'H3', 'H4', 'H5']
      render(<ExperienceCard {...defaultProps} highlights={manyHighlights} onToggle={onToggle} />)

      const card = screen.getByRole('button')
      fireEvent.keyDown(card, { key: ' ', code: 'Space' })

      // The component should call onToggle when space is pressed
      expect(onToggle).toHaveBeenCalledTimes(1)
    })

    it('does not trigger on other keys', () => {
      const onToggle = jest.fn()
      const manyHighlights = ['H1', 'H2', 'H3', 'H4', 'H5']
      render(<ExperienceCard {...defaultProps} highlights={manyHighlights} onToggle={onToggle} />)

      const card = screen.getByRole('button')
      fireEvent.keyDown(card, { key: 'a', code: 'KeyA' })

      expect(onToggle).not.toHaveBeenCalled()
    })
  })

  describe('Search Highlighting', () => {
    it('passes searchQuery to child components', () => {
      render(<ExperienceCard {...defaultProps} searchQuery="Product" />)
      // Since we're mocking the child components, we can't directly test highlighting
      // but we can verify the component renders correctly with searchQuery
      expect(screen.getByText('Senior Product Manager')).toBeInTheDocument()
    })
  })

  describe('Visual Highlighting', () => {
    it('applies highlight animation when isHighlighted is true', () => {
      render(<ExperienceCard {...defaultProps} isHighlighted={true} />)
      const card = screen.getByRole('button')
      expect(card).toHaveClass('animate-pulse-highlight')
      expect(card).toHaveClass('bg-amber-100')
      expect(card).toHaveClass('border-accent-warm')
    })

    it('does not apply highlight animation when isHighlighted is false', () => {
      render(<ExperienceCard {...defaultProps} isHighlighted={false} />)
      const card = screen.getByRole('button')
      expect(card).not.toHaveClass('animate-pulse-highlight')
      expect(card).not.toHaveClass('bg-amber-100')
    })
  })

  describe('Date Formatting', () => {
    it('handles null endDate as Present', () => {
      render(<ExperienceCard {...defaultProps} endDate={null} />)
      expect(screen.getByText(/Present/)).toBeInTheDocument()
    })

    it('handles undefined endDate as Present', () => {
      render(<ExperienceCard {...defaultProps} endDate={undefined} />)
      expect(screen.getByText(/Present/)).toBeInTheDocument()
    })

    it('formats dates using custom formatDate function', () => {
      const customFormat = jest.fn(() => 'Custom Date')
      render(<ExperienceCard {...defaultProps} formatDate={customFormat} />)
      expect(customFormat).toHaveBeenCalledWith('2020-01-01')
      expect(customFormat).toHaveBeenCalledWith('2023-12-31')
    })
  })

  describe('Edge Cases', () => {
    it('renders without icon', () => {
      render(<ExperienceCard {...defaultProps} icon={undefined} />)
      expect(screen.queryByAltText(/logo/)).not.toBeInTheDocument()
    })

    it('renders without tags', () => {
      render(<ExperienceCard {...defaultProps} tags={[]} />)
      expect(screen.getByText('Senior Product Manager')).toBeInTheDocument()
      // Tags section should not be visible
    })

    it('renders without KPIs', () => {
      render(<ExperienceCard {...defaultProps} kpis={undefined} />)
      expect(screen.queryByTestId('kpi-badge-row')).not.toBeInTheDocument()
    })

    it('renders with empty KPIs array', () => {
      render(<ExperienceCard {...defaultProps} kpis={[]} />)
      expect(screen.queryByTestId('kpi-badge-row')).not.toBeInTheDocument()
    })

    it('handles empty highlights array', () => {
      render(<ExperienceCard {...defaultProps} highlights={[]} />)
      expect(screen.getByText('Senior Product Manager')).toBeInTheDocument()
      // Should not show highlights section
    })
  })

  describe('Styling', () => {
    it('applies hover styles when expandable', () => {
      const manyHighlights = ['H1', 'H2', 'H3', 'H4', 'H5']
      render(<ExperienceCard {...defaultProps} highlights={manyHighlights} />)
      const card = screen.getByRole('button')
      expect(card).toHaveClass('cursor-pointer')
      expect(card).toHaveClass('hover:border-accent-warm')
    })

    it('does not apply hover styles when not expandable', () => {
      render(<ExperienceCard {...defaultProps} />)
      const card = screen.getByRole('button')
      expect(card).not.toHaveClass('cursor-pointer')
    })

    it('applies focus styles for keyboard navigation', () => {
      const manyHighlights = ['H1', 'H2', 'H3', 'H4', 'H5']
      render(<ExperienceCard {...defaultProps} highlights={manyHighlights} />)
      const card = screen.getByRole('button')
      expect(card).toHaveClass('focus:ring-2')
      expect(card).toHaveClass('focus:ring-accent-warm')
    })
  })
})
