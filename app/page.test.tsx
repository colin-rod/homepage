import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Home Page', () => {
  it('renders the homepage with navigation and hero', () => {
    render(<Home />)

    // Check for name in both nav and hero
    expect(screen.getAllByText('Colin Rodrigues').length).toBeGreaterThan(0)
    // Check for tagline content
    expect(screen.getByText(/Building, Reflecting & Sharing/i)).toBeInTheDocument()
    // Check for hero intro text
    expect(screen.getByText(/part portfolio, part journal/i)).toBeInTheDocument()
  })

  it('displays the correct heading', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Colin Rodrigues')
  })

  it('renders navigation component', () => {
    render(<Home />)

    // Navigation should have links
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })

  it('renders hero section with CTAs', () => {
    render(<Home />)

    const viewProjectsCta = screen.getByRole('link', { name: /explore my work/i })
    const connectCta = screen.getByRole('link', { name: /connect/i })

    expect(viewProjectsCta).toBeInTheDocument()
    expect(connectCta).toBeInTheDocument()
  })
})
