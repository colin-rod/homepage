import { render, screen, waitFor } from '@testing-library/react'
import GitHubChart from './GitHubChart'

// Mock the fetch function
global.fetch = jest.fn()

// Mock the ActivityCalendar component
jest.mock('react-activity-calendar', () => {
  return function MockActivityCalendar({ data }: { data: unknown[] }) {
    return <div data-testid="activity-calendar">Activity Calendar ({data.length} days)</div>
  }
})

describe('GitHubChart', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockContributionsResponse = {
    username: 'colin-rod',
    contributions: [
      { date: '2024-05-01', count: 5, level: 2 },
      { date: '2024-05-02', count: 10, level: 3 },
      { date: '2024-05-03', count: 0, level: 0 },
    ],
    lastUpdated: '2024-05-04T00:00:00Z',
  }

  it('renders chart with fetched contributions', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockContributionsResponse,
    })

    render(<GitHubChart username="colin-rod" />)

    await waitFor(() => {
      expect(screen.getByTestId('activity-calendar')).toBeInTheDocument()
    })

    expect(screen.getByText(/Activity Calendar \(3 days\)/)).toBeInTheDocument()
  })

  it('fetches from correct API endpoint', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockContributionsResponse,
    })

    render(<GitHubChart username="colin-rod" />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/github-contributions?username=colin-rod')
    })
  })

  it('renders with optional title', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockContributionsResponse,
    })

    render(<GitHubChart username="colin-rod" title="My GitHub Activity" />)

    await waitFor(() => {
      expect(screen.getByText('My GitHub Activity')).toBeInTheDocument()
    })
  })

  it('renders without title when not provided', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockContributionsResponse,
    })

    render(<GitHubChart username="colin-rod" />)

    await waitFor(() => {
      expect(screen.getByTestId('activity-calendar')).toBeInTheDocument()
    })

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('applies custom className', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockContributionsResponse,
    })

    const { container } = render(<GitHubChart username="colin-rod" className="custom-class" />)

    await waitFor(() => {
      const outerDiv = container.querySelector('.custom-class')
      expect(outerDiv).toBeInTheDocument()
    })
  })

  it('has link to GitHub profile', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockContributionsResponse,
    })

    render(<GitHubChart username="colin-rod" />)

    await waitFor(() => {
      const links = screen.getAllByRole('link')
      // Should have two links: one for the logo and one for the chart
      expect(links).toHaveLength(2)
      links.forEach((link) => {
        expect(link).toHaveAttribute('href', 'https://github.com/colin-rod')
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })
  })

  it('has proper aria-label for accessibility', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockContributionsResponse,
    })

    render(<GitHubChart username="colin-rod" />)

    await waitFor(() => {
      const link = screen.getByLabelText("View colin-rod's GitHub profile")
      expect(link).toBeInTheDocument()
    })
  })

  it('does not render when API fails', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 503,
    })

    const { container } = render(<GitHubChart username="colin-rod" />)

    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    })
  })

  it('does not render when fetch throws error', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const { container } = render(<GitHubChart username="colin-rod" />)

    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    })
  })

  it('does not render during loading state', () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise(() => {
          // Never resolves to keep loading state
        })
    )

    const { container } = render(<GitHubChart username="colin-rod" />)

    // Should not render anything while loading
    expect(container.firstChild).toBeNull()
  })

  it('accepts username with different formats', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...mockContributionsResponse,
        username: 'test-user-123',
      }),
    })

    render(<GitHubChart username="test-user-123" />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/github-contributions?username=test-user-123')
    })

    await waitFor(() => {
      const links = screen.getAllByRole('link')
      // All links should point to the correct username's GitHub profile
      links.forEach((link) => {
        expect(link).toHaveAttribute('href', 'https://github.com/test-user-123')
      })
    })
  })
})
