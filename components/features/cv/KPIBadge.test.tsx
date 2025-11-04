import { render, screen, waitFor, act } from '@testing-library/react'
import KPIBadge, { type KPIBadgeProps } from './KPIBadge'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  useInView: jest.fn(() => true), // Always in view for testing
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  DollarSign: () => <svg data-testid="dollar-icon" />,
  Users: () => <svg data-testid="users-icon" />,
  TrendingUp: () => <svg data-testid="trending-icon" />,
  BarChart3: () => <svg data-testid="chart-icon" />,
  PiggyBank: () => <svg data-testid="piggy-icon" />,
}))

describe('KPIBadge', () => {
  beforeEach(() => {
    jest.clearAllTimers()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('renders label and value', () => {
    const props: KPIBadgeProps = {
      label: 'Revenue Growth',
      value: '$2.5M',
      category: 'revenue',
    }

    render(<KPIBadge {...props} />)

    expect(screen.getByText('Revenue Growth')).toBeInTheDocument()
    expect(screen.getByText('$2.5M')).toBeInTheDocument()
  })

  it('renders correct icon for revenue category', () => {
    const props: KPIBadgeProps = {
      label: 'Revenue',
      value: '$1M',
      category: 'revenue',
    }

    const { container } = render(<KPIBadge {...props} />)

    expect(container.querySelector('[data-testid="dollar-icon"]')).toBeInTheDocument()
  })

  it('renders correct icon for team category', () => {
    const props: KPIBadgeProps = {
      label: 'Team Size',
      value: '50',
      category: 'team',
    }

    const { container } = render(<KPIBadge {...props} />)

    expect(container.querySelector('[data-testid="users-icon"]')).toBeInTheDocument()
  })

  it('renders correct icon for efficiency category', () => {
    const props: KPIBadgeProps = {
      label: 'Efficiency',
      value: '80%',
      category: 'efficiency',
    }

    const { container } = render(<KPIBadge {...props} />)

    expect(container.querySelector('[data-testid="trending-icon"]')).toBeInTheDocument()
  })

  it('renders correct icon for growth category', () => {
    const props: KPIBadgeProps = {
      label: 'Growth',
      value: '150%',
      category: 'growth',
    }

    const { container } = render(<KPIBadge {...props} />)

    expect(container.querySelector('[data-testid="chart-icon"]')).toBeInTheDocument()
  })

  it('renders correct icon for cost category', () => {
    const props: KPIBadgeProps = {
      label: 'Cost Savings',
      value: '$500K',
      category: 'cost',
    }

    const { container } = render(<KPIBadge {...props} />)

    expect(container.querySelector('[data-testid="piggy-icon"]')).toBeInTheDocument()
  })

  it('applies correct color styles for revenue category', () => {
    const props: KPIBadgeProps = {
      label: 'Revenue',
      value: '$1M',
      category: 'revenue',
    }

    const { container } = render(<KPIBadge {...props} />)
    const badge = container.firstChild as HTMLElement

    expect(badge).toHaveClass('bg-emerald-50', 'text-emerald-700', 'border-emerald-200')
  })

  it('applies correct color styles for team category', () => {
    const props: KPIBadgeProps = {
      label: 'Team',
      value: '20',
      category: 'team',
    }

    const { container } = render(<KPIBadge {...props} />)
    const badge = container.firstChild as HTMLElement

    expect(badge).toHaveClass('bg-blue-50', 'text-blue-700', 'border-blue-200')
  })

  it('applies correct color styles for efficiency category', () => {
    const props: KPIBadgeProps = {
      label: 'Efficiency',
      value: '90%',
      category: 'efficiency',
    }

    const { container } = render(<KPIBadge {...props} />)
    const badge = container.firstChild as HTMLElement

    expect(badge).toHaveClass('bg-purple-50', 'text-purple-700', 'border-purple-200')
  })

  it('handles count-up animation for simple numbers', async () => {
    const props: KPIBadgeProps = {
      label: 'Users',
      value: '100',
      category: 'team',
    }

    render(<KPIBadge {...props} />)

    // Animation should start - initial value is static
    expect(screen.getByText('100')).toBeInTheDocument()

    // Fast-forward through animation
    act(() => {
      jest.advanceTimersByTime(800)
    })

    await waitFor(() => {
      expect(screen.getByText('100')).toBeInTheDocument()
    })
  })

  it('handles count-up animation for values with K suffix', async () => {
    const props: KPIBadgeProps = {
      label: 'Users',
      value: '50K',
      category: 'team',
    }

    render(<KPIBadge {...props} />)

    // Fast-forward through animation
    act(() => {
      jest.advanceTimersByTime(800)
    })

    await waitFor(() => {
      expect(screen.getByText('50K')).toBeInTheDocument()
    })
  })

  it('handles count-up animation for values with M suffix', async () => {
    const props: KPIBadgeProps = {
      label: 'Revenue',
      value: '$2.5M',
      category: 'revenue',
    }

    render(<KPIBadge {...props} />)

    // Fast-forward through animation
    act(() => {
      jest.advanceTimersByTime(800)
    })

    await waitFor(() => {
      expect(screen.getByText('$2.5M')).toBeInTheDocument()
    })
  })

  it('handles count-up animation for percentage values', async () => {
    const props: KPIBadgeProps = {
      label: 'Growth',
      value: '75%',
      category: 'growth',
    }

    render(<KPIBadge {...props} />)

    // Fast-forward through animation
    act(() => {
      jest.advanceTimersByTime(800)
    })

    await waitFor(() => {
      expect(screen.getByText('75%')).toBeInTheDocument()
    })
  })

  it('handles values with dollar sign prefix', () => {
    const props: KPIBadgeProps = {
      label: 'Revenue',
      value: '$1,500',
      category: 'revenue',
    }

    render(<KPIBadge {...props} />)

    expect(screen.getByText('$1,500')).toBeInTheDocument()
  })

  it('handles values with plus sign suffix', () => {
    const props: KPIBadgeProps = {
      label: 'Customers',
      value: '1M+',
      category: 'growth',
    }

    render(<KPIBadge {...props} />)

    // Initial render shows the value (value is set as initial state)
    expect(screen.getByText('1M+')).toBeInTheDocument()
  })

  it('displays non-numeric values without animation', () => {
    const props: KPIBadgeProps = {
      label: 'Status',
      value: 'Active',
      category: 'team',
    }

    render(<KPIBadge {...props} />)

    expect(screen.getByText('Active')).toBeInTheDocument()

    // No animation should occur
    act(() => {
      jest.advanceTimersByTime(800)
    })

    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders with correct structure and layout classes', () => {
    const props: KPIBadgeProps = {
      label: 'Test',
      value: '100',
      category: 'team',
    }

    const { container } = render(<KPIBadge {...props} />)
    const badge = container.firstChild as HTMLElement

    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'gap-2',
      'px-3',
      'py-2',
      'rounded-lg',
      'border'
    )
  })

  it('applies transition classes', () => {
    const props: KPIBadgeProps = {
      label: 'Test',
      value: '100',
      category: 'team',
    }

    const { container } = render(<KPIBadge {...props} />)
    const badge = container.firstChild as HTMLElement

    expect(badge).toHaveClass('transition-all', 'duration-300')
  })
})
