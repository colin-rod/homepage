import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Home Page', () => {
  it('renders the homepage with coming soon message', () => {
    render(<Home />)

    expect(screen.getByText('Colin Rodrigues')).toBeInTheDocument()
    expect(screen.getByText(/Product & Strategy/i)).toBeInTheDocument()
    expect(screen.getByText('Coming Soon')).toBeInTheDocument()
  })

  it('displays the correct heading', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Colin Rodrigues')
  })
})
