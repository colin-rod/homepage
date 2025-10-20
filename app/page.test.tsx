import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Home Page', () => {
  it('renders the homepage with navigation and hero', () => {
    render(<Home />)

    // Check for name in both nav and hero
    expect(screen.getAllByText('Colin Rodrigues').length).toBeGreaterThan(0)
    // Product & Strategy appears in multiple places (hero and footer)
    expect(screen.getAllByText(/Product & Strategy/i).length).toBeGreaterThan(0)
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

    const viewProjectsCta = screen.getByRole('link', { name: /view projects/i })
    const contactCta = screen.getByRole('link', { name: /contact me/i })

    expect(viewProjectsCta).toBeInTheDocument()
    expect(contactCta).toBeInTheDocument()
  })
})
