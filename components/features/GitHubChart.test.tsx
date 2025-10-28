import { render, screen } from '@testing-library/react'
import GitHubChart from './GitHubChart'

describe('GitHubChart', () => {
  it('renders GitHub contribution chart image', () => {
    render(<GitHubChart username="colin-rod" />)

    const chart = screen.getByAltText(/GitHub contribution chart/i)
    expect(chart).toBeInTheDocument()
    expect(chart).toHaveAttribute('src', 'https://ghchart.rshah.org/006400/colin-rod')
  })

  it('uses default color when no color prop provided', () => {
    render(<GitHubChart username="colin-rod" />)

    const chart = screen.getByAltText(/GitHub contribution chart/i)
    expect(chart).toHaveAttribute('src', expect.stringContaining('006400'))
  })

  it('accepts custom color prop', () => {
    render(<GitHubChart username="colin-rod" color="D3643E" />)

    const chart = screen.getByAltText(/GitHub contribution chart/i)
    expect(chart).toHaveAttribute('src', expect.stringContaining('D3643E'))
  })

  it('renders with optional title', () => {
    render(<GitHubChart username="colin-rod" title="My GitHub Activity" />)

    expect(screen.getByText('My GitHub Activity')).toBeInTheDocument()
  })

  it('renders without title when not provided', () => {
    render(<GitHubChart username="colin-rod" />)

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<GitHubChart username="colin-rod" className="custom-class" />)

    const outerDiv = container.querySelector('.custom-class')
    expect(outerDiv).toBeInTheDocument()
  })

  it('has proper alt text for accessibility', () => {
    render(<GitHubChart username="colin-rod" />)

    const chart = screen.getByAltText("colin-rod's GitHub contribution chart")
    expect(chart).toBeInTheDocument()
  })
})
