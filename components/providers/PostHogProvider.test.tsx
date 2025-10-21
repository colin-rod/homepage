import { render } from '@testing-library/react'
import { PostHogProvider } from './PostHogProvider'

// Mock posthog-js
jest.mock('posthog-js', () => ({
  init: jest.fn(),
  opt_out_capturing: jest.fn(),
}))

// Mock posthog-js/react
jest.mock('posthog-js/react', () => ({
  PostHogProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="posthog-provider">{children}</div>,
}))

describe('PostHogProvider', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('should render children when PostHog is not configured', () => {
    // Clear environment variables
    delete process.env.NEXT_PUBLIC_POSTHOG_KEY
    delete process.env.NEXT_PUBLIC_POSTHOG_HOST

    const { getByText } = render(
      <PostHogProvider>
        <div>Test Child</div>
      </PostHogProvider>
    )

    expect(getByText('Test Child')).toBeInTheDocument()
  })

  it('should render PostHog provider when configured', () => {
    // Set environment variables
    process.env.NEXT_PUBLIC_POSTHOG_KEY = 'test-key'
    process.env.NEXT_PUBLIC_POSTHOG_HOST = 'https://test.posthog.com'

    const { getByText, getByTestId } = render(
      <PostHogProvider>
        <div>Test Child</div>
      </PostHogProvider>
    )

    expect(getByTestId('posthog-provider')).toBeInTheDocument()
    expect(getByText('Test Child')).toBeInTheDocument()
  })

  it('should render children without provider when key is missing', () => {
    process.env.NEXT_PUBLIC_POSTHOG_HOST = 'https://test.posthog.com'
    delete process.env.NEXT_PUBLIC_POSTHOG_KEY

    const { getByText, queryByTestId } = render(
      <PostHogProvider>
        <div>Test Child</div>
      </PostHogProvider>
    )

    expect(queryByTestId('posthog-provider')).not.toBeInTheDocument()
    expect(getByText('Test Child')).toBeInTheDocument()
  })

  it('should render children without provider when host is missing', () => {
    process.env.NEXT_PUBLIC_POSTHOG_KEY = 'test-key'
    delete process.env.NEXT_PUBLIC_POSTHOG_HOST

    const { getByText, queryByTestId } = render(
      <PostHogProvider>
        <div>Test Child</div>
      </PostHogProvider>
    )

    expect(queryByTestId('posthog-provider')).not.toBeInTheDocument()
    expect(getByText('Test Child')).toBeInTheDocument()
  })

  it('should render multiple children correctly', () => {
    process.env.NEXT_PUBLIC_POSTHOG_KEY = 'test-key'
    process.env.NEXT_PUBLIC_POSTHOG_HOST = 'https://test.posthog.com'

    const { getByText } = render(
      <PostHogProvider>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </PostHogProvider>
    )

    expect(getByText('Child 1')).toBeInTheDocument()
    expect(getByText('Child 2')).toBeInTheDocument()
    expect(getByText('Child 3')).toBeInTheDocument()
  })
})
