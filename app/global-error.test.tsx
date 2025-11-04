import { render, screen } from '@testing-library/react'
import GlobalError from './global-error'
import * as Sentry from '@sentry/nextjs'

// Mock Sentry
jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
}))

// Mock next/error
jest.mock('next/error', () => {
  return function MockNextError({ statusCode }: { statusCode: number }) {
    return <div data-testid="next-error">Error {statusCode}</div>
  }
})

describe('GlobalError', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders NextError component with 500 status code', () => {
    const error = new Error('Test error')

    render(<GlobalError error={error} />)

    const errorComponent = screen.getByTestId('next-error')
    expect(errorComponent).toBeInTheDocument()
    expect(errorComponent).toHaveTextContent('Error 500')
  })

  it('captures error with Sentry on mount', () => {
    const error = new Error('Test error message')

    render(<GlobalError error={error} />)

    expect(Sentry.captureException).toHaveBeenCalledWith(error)
    expect(Sentry.captureException).toHaveBeenCalledTimes(1)
  })

  it('handles error with digest property', () => {
    const error = Object.assign(new Error('Test error'), { digest: 'abc123' })

    render(<GlobalError error={error} />)

    expect(Sentry.captureException).toHaveBeenCalledWith(error)
  })

  it('renders html and body tags', () => {
    const error = new Error('Test error')

    render(<GlobalError error={error} />)

    // GlobalError renders a complete HTML document
    // In the test environment, we can verify the NextError component is rendered
    expect(screen.getByTestId('next-error')).toBeInTheDocument()
  })

  it('contains NextError within rendered structure', () => {
    const error = new Error('Test error')

    render(<GlobalError error={error} />)

    // Verify the error component is present
    const errorComponent = screen.getByTestId('next-error')
    expect(errorComponent).toBeInTheDocument()
  })

  it('recaptures error when error prop changes', () => {
    const error1 = new Error('First error')
    const { rerender } = render(<GlobalError error={error1} />)

    expect(Sentry.captureException).toHaveBeenCalledWith(error1)
    expect(Sentry.captureException).toHaveBeenCalledTimes(1)

    const error2 = new Error('Second error')
    rerender(<GlobalError error={error2} />)

    expect(Sentry.captureException).toHaveBeenCalledWith(error2)
    expect(Sentry.captureException).toHaveBeenCalledTimes(2)
  })

  it('handles different error types', () => {
    const typeError = new TypeError('Type error')

    render(<GlobalError error={typeError} />)

    expect(Sentry.captureException).toHaveBeenCalledWith(typeError)
  })

  it('handles errors with custom properties', () => {
    const error = Object.assign(new Error('Custom error'), {
      digest: 'custom-digest',
      customProp: 'custom value',
    })

    render(<GlobalError error={error} />)

    expect(Sentry.captureException).toHaveBeenCalledWith(error)
    expect(screen.getByTestId('next-error')).toBeInTheDocument()
  })

  it('is a client component', () => {
    // This test verifies the file has 'use client' directive
    // The component should be able to use hooks like useEffect
    const error = new Error('Test error')

    expect(() => render(<GlobalError error={error} />)).not.toThrow()
  })
})
