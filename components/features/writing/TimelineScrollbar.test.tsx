import { render, screen } from '@testing-library/react'
import TimelineScrollbar from './TimelineScrollbar'

describe('TimelineScrollbar', () => {
  const mockPosts = [
    { date: '2024-03-15', slug: 'post-1', title: 'First Post' },
    { date: '2024-02-20', slug: 'post-2', title: 'Second Post' },
    { date: '2024-01-10', slug: 'post-3', title: 'Third Post' },
    { date: '2023-12-05', slug: 'post-4', title: 'Fourth Post' },
  ]

  it('renders timeline with months from posts', () => {
    render(<TimelineScrollbar posts={mockPosts} />)

    // Should display months in chronological order (generates ALL months between oldest and newest)
    expect(screen.getByText('Mar 2024')).toBeInTheDocument()
    // Timeline generates all months between Mar 2024 and Dec 2023
    expect(screen.getByText('Dec 2023')).toBeInTheDocument()
  })

  it('renders nothing when posts array is empty', () => {
    const { container } = render(<TimelineScrollbar posts={[]} />)

    expect(container.firstChild).toBeNull()
  })

  it('generates timeline from newest to oldest', () => {
    const { container } = render(<TimelineScrollbar posts={mockPosts} />)

    const labels = container.querySelectorAll('.space-y-4 > div')
    const firstLabel = labels[0].textContent

    // First label should be newest (March 2024)
    expect(firstLabel).toContain('Mar')
    // Note: Timeline generates all months between newest and oldest
  })

  it('highlights year start markers', () => {
    const postsAcrossYears = [
      { date: '2024-02-01', slug: 'post-1', title: 'Post 1' },
      { date: '2024-01-15', slug: 'post-2', title: 'Post 2' },
      { date: '2023-12-20', slug: 'post-3', title: 'Post 3' },
    ]

    render(<TimelineScrollbar posts={postsAcrossYears} />)

    // January (month 0) should be highlighted as year start
    const januaryLabel = screen.getByText('Jan 2024')
    expect(januaryLabel).toHaveClass('text-text', 'font-semibold')
  })

  it('highlights first month marker', () => {
    const { container } = render(<TimelineScrollbar posts={mockPosts} />)

    // First marker should have accent styling
    const dots = container.querySelectorAll('.rounded-full')
    const firstDot = dots[0]
    expect(firstDot).toHaveClass('bg-accent-warm')
  })

  it('displays abbreviated month names for non-highlighted months', () => {
    const posts = [
      { date: '2024-04-01', slug: 'post-1', title: 'Post 1' },
      { date: '2024-02-01', slug: 'post-2', title: 'Post 2' },
    ]

    render(<TimelineScrollbar posts={posts} />)

    // March (not first, not year start, not last) should show abbreviated
    expect(screen.getByText('Mar')).toBeInTheDocument()
  })

  it('applies sticky positioning class', () => {
    const { container } = render(<TimelineScrollbar posts={mockPosts} />)

    const stickyContainer = container.querySelector('.sticky')
    expect(stickyContainer).toBeInTheDocument()
    expect(stickyContainer).toHaveClass('top-24', 'h-fit')
  })

  it('renders vertical timeline bar', () => {
    const { container } = render(<TimelineScrollbar posts={mockPosts} />)

    const timelineBar = container.querySelector('.absolute.left-3.w-px')
    expect(timelineBar).toBeInTheDocument()
    expect(timelineBar).toHaveClass(
      'bg-gradient-to-b',
      'from-accent-warm',
      'via-divider',
      'to-accent-warm'
    )
  })

  it('renders marker dots for each timeline entry', () => {
    const { container } = render(<TimelineScrollbar posts={mockPosts} />)

    const dots = container.querySelectorAll('.rounded-full.w-3.h-3')
    // Should have multiple dots (one per month in the range)
    expect(dots.length).toBeGreaterThan(0)
  })

  it('handles single post', () => {
    const singlePost = [{ date: '2024-01-15', slug: 'post-1', title: 'Single Post' }]

    render(<TimelineScrollbar posts={singlePost} />)

    expect(screen.getByText('Jan 2024')).toBeInTheDocument()
  })

  it('handles posts from same month', () => {
    const sameMonthPosts = [
      { date: '2024-03-20', slug: 'post-1', title: 'Post 1' },
      { date: '2024-03-15', slug: 'post-2', title: 'Post 2' },
      { date: '2024-03-10', slug: 'post-3', title: 'Post 3' },
    ]

    render(<TimelineScrollbar posts={sameMonthPosts} />)

    // Should only show March once (at the top)
    const marchLabels = screen.getAllByText('Mar 2024')
    expect(marchLabels.length).toBe(1)
  })

  it('generates all intermediate months in timeline', () => {
    const posts = [
      { date: '2024-06-01', slug: 'post-1', title: 'June Post' },
      { date: '2024-03-01', slug: 'post-2', title: 'March Post' },
    ]

    render(<TimelineScrollbar posts={posts} />)

    // Should generate June, May, April, March
    expect(screen.getByText('Jun 2024')).toBeInTheDocument()
    expect(screen.getByText('May')).toBeInTheDocument()
    expect(screen.getByText('Apr')).toBeInTheDocument()
    expect(screen.getByText('Mar 2024')).toBeInTheDocument()
  })

  it('applies correct styling to year-start markers', () => {
    const posts = [
      { date: '2024-02-01', slug: 'post-1', title: 'Post 1' },
      { date: '2024-01-01', slug: 'post-2', title: 'Post 2' },
      { date: '2023-12-01', slug: 'post-3', title: 'Post 3' },
    ]

    render(<TimelineScrollbar posts={posts} />)

    const januaryLabel = screen.getByText('Jan 2024')
    expect(januaryLabel).toHaveClass('font-semibold')
  })

  it('applies secondary text styling to non-highlighted months', () => {
    const posts = [
      { date: '2024-04-01', slug: 'post-1', title: 'Post 1' },
      { date: '2024-02-01', slug: 'post-2', title: 'Post 2' },
    ]

    render(<TimelineScrollbar posts={posts} />)

    // Mar (not first, not year start, not last) should have secondary styling
    const marLabel = screen.getByText('Mar')
    expect(marLabel).toHaveClass('text-text-secondary')
  })
})
