import { render, screen, fireEvent } from '@testing-library/react'
import KPIBadgeRow from './KPIBadgeRow'
import { KPI } from '@/lib/types'

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronLeft: ({ className }: { className?: string }) => (
    <span data-testid="chevron-left-icon" className={className}>
      ←
    </span>
  ),
  ChevronRight: ({ className }: { className?: string }) => (
    <span data-testid="chevron-right-icon" className={className}>
      →
    </span>
  ),
}))

// Mock KPIBadge component
jest.mock('./KPIBadge', () => {
  return function MockKPIBadge({ label, value }: { label: string; value: string }) {
    return (
      <div data-testid="kpi-badge">
        <span>{label}</span>: <span>{value}</span>
      </div>
    )
  }
})

describe('KPIBadgeRow', () => {
  const mockKPIs: KPI[] = [
    { label: 'Revenue Growth', value: '+40%', category: 'financial' },
    { label: 'User Growth', value: '+50%', category: 'growth' },
    { label: 'Team Size', value: '25', category: 'team' },
  ]

  beforeEach(() => {
    // Mock scrollWidth and clientWidth for scroll tests
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      value: 1000,
    })
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      value: 500,
    })
    Object.defineProperty(HTMLElement.prototype, 'scrollLeft', {
      configurable: true,
      writable: true,
      value: 0,
    })
  })

  describe('Rendering', () => {
    it('renders all KPI badges', () => {
      render(<KPIBadgeRow kpis={mockKPIs} />)
      const badges = screen.getAllByTestId('kpi-badge')
      expect(badges.length).toBe(3)
    })

    it('renders KPI labels', () => {
      render(<KPIBadgeRow kpis={mockKPIs} />)
      expect(screen.getByText('Revenue Growth')).toBeInTheDocument()
      expect(screen.getByText('User Growth')).toBeInTheDocument()
      expect(screen.getByText('Team Size')).toBeInTheDocument()
    })

    it('renders KPI values', () => {
      render(<KPIBadgeRow kpis={mockKPIs} />)
      expect(screen.getByText('+40%')).toBeInTheDocument()
      expect(screen.getByText('+50%')).toBeInTheDocument()
      expect(screen.getByText('25')).toBeInTheDocument()
    })

    it('renders with border and padding classes', () => {
      const { container } = render(<KPIBadgeRow kpis={mockKPIs} />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('border-t')
      expect(wrapper).toHaveClass('border-divider')
      expect(wrapper).toHaveClass('pt-4')
      expect(wrapper).toHaveClass('mt-4')
    })
  })

  describe('Empty State', () => {
    it('returns null when kpis array is empty', () => {
      const { container } = render(<KPIBadgeRow kpis={[]} />)
      expect(container.firstChild).toBeNull()
    })

    it('returns null when kpis is null', () => {
      const { container } = render(<KPIBadgeRow kpis={null as unknown as KPI[]} />)
      expect(container.firstChild).toBeNull()
    })

    it('returns null when kpis is undefined', () => {
      const { container } = render(<KPIBadgeRow kpis={undefined as unknown as KPI[]} />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Scroll Container', () => {
    it('renders scrollable container', () => {
      const { container } = render(<KPIBadgeRow kpis={mockKPIs} />)
      const scrollContainer = container.querySelector('.overflow-x-auto')
      expect(scrollContainer).toBeInTheDocument()
    })

    it('hides scrollbar with CSS classes', () => {
      const { container } = render(<KPIBadgeRow kpis={mockKPIs} />)
      const scrollContainer = container.querySelector('.scrollbar-hide')
      expect(scrollContainer).toBeInTheDocument()
    })

    it('has scrollbar-hide class on scroll container', () => {
      const { container } = render(<KPIBadgeRow kpis={mockKPIs} />)
      const scrollContainer = container.querySelector('.overflow-x-auto')
      expect(scrollContainer).toHaveClass('scrollbar-hide')
    })

    it('makes badges flex-shrink-0 to prevent wrapping', () => {
      const { container } = render(<KPIBadgeRow kpis={mockKPIs} />)
      const badgeWrappers = container.querySelectorAll('.flex-shrink-0')
      expect(badgeWrappers.length).toBe(3)
    })
  })

  describe('Scroll Arrows', () => {
    it('initially hides left arrow when not scrolled', () => {
      render(<KPIBadgeRow kpis={mockKPIs} />)
      expect(screen.queryByLabelText('Scroll left')).not.toBeInTheDocument()
    })

    it('shows left arrow when scrolled', () => {
      const { container } = render(<KPIBadgeRow kpis={mockKPIs} />)
      const scrollContainer = container.querySelector('.overflow-x-auto') as HTMLElement

      // Simulate scrolling
      Object.defineProperty(scrollContainer, 'scrollLeft', { value: 100, writable: true })
      fireEvent.scroll(scrollContainer)

      expect(screen.getByLabelText('Scroll left')).toBeInTheDocument()
    })

    it('shows right arrow when content is wider than container', () => {
      render(<KPIBadgeRow kpis={mockKPIs} />)
      // With mocked scrollWidth (1000) > clientWidth (500), right arrow should show
      expect(screen.getByLabelText('Scroll right')).toBeInTheDocument()
    })

    it('renders chevron icons in arrow buttons', () => {
      const { container } = render(<KPIBadgeRow kpis={mockKPIs} />)
      const scrollContainer = container.querySelector('.overflow-x-auto') as HTMLElement

      // Show left arrow by scrolling
      Object.defineProperty(scrollContainer, 'scrollLeft', { value: 100, writable: true })
      fireEvent.scroll(scrollContainer)

      expect(screen.getByTestId('chevron-left-icon')).toBeInTheDocument()
      expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument()
    })

    it('applies correct styling to arrow buttons', () => {
      render(<KPIBadgeRow kpis={mockKPIs} />)
      const rightArrow = screen.getByLabelText('Scroll right')

      expect(rightArrow).toHaveClass('absolute')
      expect(rightArrow).toHaveClass('bg-white')
      expect(rightArrow).toHaveClass('rounded-full')
      expect(rightArrow).toHaveClass('shadow-md')
    })

    it('positions left arrow correctly', () => {
      const { container } = render(<KPIBadgeRow kpis={mockKPIs} />)
      const scrollContainer = container.querySelector('.overflow-x-auto') as HTMLElement

      Object.defineProperty(scrollContainer, 'scrollLeft', { value: 100, writable: true })
      fireEvent.scroll(scrollContainer)

      const leftArrow = screen.getByLabelText('Scroll left')
      expect(leftArrow).toHaveClass('left-2')
      expect(leftArrow).toHaveClass('top-1/2')
      expect(leftArrow).toHaveClass('-translate-y-1/2')
    })

    it('positions right arrow correctly', () => {
      render(<KPIBadgeRow kpis={mockKPIs} />)
      const rightArrow = screen.getByLabelText('Scroll right')

      expect(rightArrow).toHaveClass('right-2')
      expect(rightArrow).toHaveClass('top-1/2')
      expect(rightArrow).toHaveClass('-translate-y-1/2')
    })

    it('shows arrows only on mobile (md:hidden)', () => {
      render(<KPIBadgeRow kpis={mockKPIs} />)
      const rightArrow = screen.getByLabelText('Scroll right')
      expect(rightArrow).toHaveClass('md:hidden')
    })
  })

  describe('Scroll Functionality', () => {
    it('scrolls left when left arrow is clicked', () => {
      const { container } = render(<KPIBadgeRow kpis={mockKPIs} />)
      const scrollContainer = container.querySelector('.overflow-x-auto') as HTMLElement

      // Set up scrolled state
      Object.defineProperty(scrollContainer, 'scrollLeft', { value: 300, writable: true })
      fireEvent.scroll(scrollContainer)

      const scrollToSpy = jest.fn()
      scrollContainer.scrollTo = scrollToSpy

      const leftArrow = screen.getByLabelText('Scroll left')
      fireEvent.click(leftArrow)

      expect(scrollToSpy).toHaveBeenCalledWith({
        left: 100, // 300 - 200
        behavior: 'smooth',
      })
    })

    it('scrolls right when right arrow is clicked', () => {
      const { container } = render(<KPIBadgeRow kpis={mockKPIs} />)
      const scrollContainer = container.querySelector('.overflow-x-auto') as HTMLElement

      const scrollToSpy = jest.fn()
      scrollContainer.scrollTo = scrollToSpy

      const rightArrow = screen.getByLabelText('Scroll right')
      fireEvent.click(rightArrow)

      expect(scrollToSpy).toHaveBeenCalledWith({
        left: 200, // 0 + 200
        behavior: 'smooth',
      })
    })

    it('uses scroll amount of 200px', () => {
      const { container } = render(<KPIBadgeRow kpis={mockKPIs} />)
      const scrollContainer = container.querySelector('.overflow-x-auto') as HTMLElement

      const scrollToSpy = jest.fn()
      scrollContainer.scrollTo = scrollToSpy

      const rightArrow = screen.getByLabelText('Scroll right')
      fireEvent.click(rightArrow)

      expect(scrollToSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          left: 200,
        })
      )
    })

    it('updates arrow visibility on scroll', () => {
      const { container } = render(<KPIBadgeRow kpis={mockKPIs} />)
      const scrollContainer = container.querySelector('.overflow-x-auto') as HTMLElement

      // Initially no left arrow
      expect(screen.queryByLabelText('Scroll left')).not.toBeInTheDocument()

      // Scroll and trigger update
      Object.defineProperty(scrollContainer, 'scrollLeft', { value: 100, writable: true })
      fireEvent.scroll(scrollContainer)

      // Now left arrow should appear
      expect(screen.getByLabelText('Scroll left')).toBeInTheDocument()
    })
  })

  describe('Fade Gradients', () => {
    it('shows left fade gradient when left arrow is visible', () => {
      const { container } = render(<KPIBadgeRow kpis={mockKPIs} />)
      const scrollContainer = container.querySelector('.overflow-x-auto') as HTMLElement

      Object.defineProperty(scrollContainer, 'scrollLeft', { value: 100, writable: true })
      fireEvent.scroll(scrollContainer)

      const leftGradient = container.querySelector('.bg-gradient-to-r')
      expect(leftGradient).toBeInTheDocument()
      expect(leftGradient).toHaveClass('from-white')
      expect(leftGradient).toHaveClass('to-transparent')
    })

    it('shows right fade gradient when right arrow is visible', () => {
      const { container } = render(<KPIBadgeRow kpis={mockKPIs} />)

      const rightGradient = container.querySelector('.bg-gradient-to-l')
      expect(rightGradient).toBeInTheDocument()
      expect(rightGradient).toHaveClass('from-white')
      expect(rightGradient).toHaveClass('to-transparent')
    })

    it('positions gradients correctly', () => {
      const { container } = render(<KPIBadgeRow kpis={mockKPIs} />)
      const scrollContainer = container.querySelector('.overflow-x-auto') as HTMLElement

      Object.defineProperty(scrollContainer, 'scrollLeft', { value: 100, writable: true })
      fireEvent.scroll(scrollContainer)

      const leftGradient = container.querySelector('.bg-gradient-to-r')
      const rightGradient = container.querySelector('.bg-gradient-to-l')

      expect(leftGradient).toHaveClass('left-0')
      expect(rightGradient).toHaveClass('right-0')
    })

    it('makes gradients non-interactive', () => {
      const { container } = render(<KPIBadgeRow kpis={mockKPIs} />)
      const scrollContainer = container.querySelector('.overflow-x-auto') as HTMLElement

      Object.defineProperty(scrollContainer, 'scrollLeft', { value: 100, writable: true })
      fireEvent.scroll(scrollContainer)

      const leftGradient = container.querySelector('.bg-gradient-to-r')
      expect(leftGradient).toHaveClass('pointer-events-none')
    })

    it('shows gradients only on mobile', () => {
      const { container } = render(<KPIBadgeRow kpis={mockKPIs} />)

      const rightGradient = container.querySelector('.bg-gradient-to-l')
      expect(rightGradient).toHaveClass('md:hidden')
    })
  })

  describe('Responsive Behavior', () => {
    it('allows flex-wrap on desktop', () => {
      const { container } = render(<KPIBadgeRow kpis={mockKPIs} />)
      const scrollContainer = container.querySelector('.overflow-x-auto')
      expect(scrollContainer).toHaveClass('md:flex-wrap')
    })

    it('removes overflow on desktop', () => {
      const { container } = render(<KPIBadgeRow kpis={mockKPIs} />)
      const scrollContainer = container.querySelector('.overflow-x-auto')
      expect(scrollContainer).toHaveClass('md:overflow-visible')
    })
  })

  describe('Accessibility', () => {
    it('has accessible labels for scroll buttons', () => {
      const { container } = render(<KPIBadgeRow kpis={mockKPIs} />)
      const scrollContainer = container.querySelector('.overflow-x-auto') as HTMLElement

      Object.defineProperty(scrollContainer, 'scrollLeft', { value: 100, writable: true })
      fireEvent.scroll(scrollContainer)

      expect(screen.getByLabelText('Scroll left')).toBeInTheDocument()
      expect(screen.getByLabelText('Scroll right')).toBeInTheDocument()
    })

    it('scroll buttons are keyboard accessible', () => {
      const { container } = render(<KPIBadgeRow kpis={mockKPIs} />)
      const scrollContainer = container.querySelector('.overflow-x-auto') as HTMLElement

      Object.defineProperty(scrollContainer, 'scrollLeft', { value: 100, writable: true })
      fireEvent.scroll(scrollContainer)

      const leftArrow = screen.getByLabelText('Scroll left')
      leftArrow.focus()
      expect(leftArrow).toHaveFocus()
    })
  })

  describe('Edge Cases', () => {
    it('handles single KPI', () => {
      const singleKPI: KPI[] = [{ label: 'Revenue', value: '+40%', category: 'financial' }]
      render(<KPIBadgeRow kpis={singleKPI} />)
      expect(screen.getByTestId('kpi-badge')).toBeInTheDocument()
    })

    it('handles many KPIs', () => {
      const manyKPIs: KPI[] = Array.from({ length: 20 }, (_, i) => ({
        label: `Metric ${i}`,
        value: `${i}%`,
        category: 'test',
      }))
      render(<KPIBadgeRow kpis={manyKPIs} />)
      const badges = screen.getAllByTestId('kpi-badge')
      expect(badges.length).toBe(20)
    })

    it('handles KPIs without category', () => {
      const kpisWithoutCategory: KPI[] = [
        { label: 'Revenue', value: '+40%', category: undefined as unknown as string },
      ]
      render(<KPIBadgeRow kpis={kpisWithoutCategory} />)
      expect(screen.getByTestId('kpi-badge')).toBeInTheDocument()
    })
  })

  describe('Layout', () => {
    it('applies gap between badges', () => {
      const { container } = render(<KPIBadgeRow kpis={mockKPIs} />)
      const scrollContainer = container.querySelector('.overflow-x-auto')
      expect(scrollContainer).toHaveClass('gap-3')
    })

    it('has relative positioning on wrapper', () => {
      const { container } = render(<KPIBadgeRow kpis={mockKPIs} />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('relative')
    })

    it('applies z-index to gradients and arrows', () => {
      const { container } = render(<KPIBadgeRow kpis={mockKPIs} />)

      const rightGradient = container.querySelector('.bg-gradient-to-l')
      const rightArrow = screen.getByLabelText('Scroll right')

      expect(rightGradient).toHaveClass('z-10')
      expect(rightArrow).toHaveClass('z-20')
    })
  })
})
