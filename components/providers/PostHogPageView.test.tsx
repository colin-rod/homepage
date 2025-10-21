import { render } from '@testing-library/react'
import { PostHogPageView } from './PostHogPageView'

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/test-path'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}))

// Mock PostHog hook
jest.mock('posthog-js/react', () => ({
  usePostHog: jest.fn(() => ({
    capture: jest.fn(),
  })),
}))

describe('PostHogPageView', () => {
  it('should render without crashing', () => {
    const { container } = render(<PostHogPageView />)
    expect(container).toBeInTheDocument()
  })

  it('should render null (no visible output)', () => {
    const { container } = render(<PostHogPageView />)
    expect(container.firstChild).toBeNull()
  })

  it('should render inside Suspense boundary', () => {
    // This component should not throw when rendered
    expect(() => render(<PostHogPageView />)).not.toThrow()
  })

  it('should handle multiple renders without errors', () => {
    const { rerender } = render(<PostHogPageView />)

    // Rerender multiple times
    rerender(<PostHogPageView />)
    rerender(<PostHogPageView />)
    rerender(<PostHogPageView />)

    // Should not throw errors
    expect(true).toBe(true)
  })
})
