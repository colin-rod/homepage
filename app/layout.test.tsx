import RootLayout, { metadata, viewport } from './layout'
import { baseMetadata, viewport as baseViewport } from '@/lib/seo'

// Mock the PostHog providers
jest.mock('@/components/providers/PostHogProvider', () => ({
  PostHogProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="posthog-provider">{children}</div>
  ),
}))

jest.mock('@/components/providers/PostHogPageView', () => ({
  PostHogPageView: () => <div data-testid="posthog-pageview" />,
}))

describe('RootLayout', () => {
  describe('Metadata Export', () => {
    it('should export metadata from baseMetadata', () => {
      expect(metadata).toBeDefined()
      expect(metadata).toEqual(baseMetadata)
    })

    it('should have correct title', () => {
      expect(metadata.title).toBe('Colin Rodrigues - Product & Strategy')
    })

    it('should have correct description', () => {
      expect(metadata.description).toBe(
        'Interactive portfolio showcasing professional journey, projects, and expertise in product management and strategy.'
      )
    })

    it('should have keywords array', () => {
      expect(metadata.keywords).toBeDefined()
      expect(Array.isArray(metadata.keywords)).toBe(true)
      expect((metadata.keywords as string[]).length).toBeGreaterThan(0)
    })

    it('should have Open Graph configuration', () => {
      expect(metadata.openGraph).toBeDefined()
      const og = metadata.openGraph as Record<string, unknown>
      expect(og?.type).toBe('website')
      expect(og?.locale).toBe('en_US')
      expect(og?.url).toBe('https://colinrodrigues.com')
    })

    it('should have Twitter Card configuration', () => {
      expect(metadata.twitter).toBeDefined()
      const twitter = metadata.twitter as Record<string, unknown>
      expect(twitter?.card).toBe('summary_large_image')
    })

    it('should have robots configuration', () => {
      expect(metadata.robots).toBeDefined()
      const robots = metadata.robots as { index: boolean; follow: boolean }
      expect(robots.index).toBe(true)
      expect(robots.follow).toBe(true)
    })

    it('should have icons configuration', () => {
      expect(metadata.icons).toBeDefined()
    })
  })

  describe('Viewport Export', () => {
    it('should export viewport from baseViewport', () => {
      expect(viewport).toBeDefined()
      expect(viewport).toEqual(baseViewport)
    })

    it('should have device-width', () => {
      expect(viewport.width).toBe('device-width')
    })

    it('should have initialScale of 1', () => {
      expect(viewport.initialScale).toBe(1)
    })

    it('should have maximumScale of 5', () => {
      expect(viewport.maximumScale).toBe(5)
    })

    it('should have theme colors', () => {
      expect(viewport.themeColor).toBeDefined()
      expect(Array.isArray(viewport.themeColor)).toBe(true)
    })
  })

  describe('Component Structure', () => {
    it('should be a valid React component', () => {
      expect(typeof RootLayout).toBe('function')
    })

    it('should accept children prop', () => {
      // RootLayout type signature requires children
      const layoutProps = { children: <div>Test</div> }
      expect(() => RootLayout(layoutProps)).not.toThrow()
    })

    it('should return JSX with html element', () => {
      const result = RootLayout({ children: <div>Test</div> })
      expect(result.type).toBe('html')
    })

    it('should have lang="en" on html element', () => {
      const result = RootLayout({ children: <div>Test</div> })
      expect(result.props.lang).toBe('en')
    })

    it('should have body element as child of html', () => {
      const result = RootLayout({ children: <div>Test</div> })
      const body = result.props.children
      expect(body.type).toBe('body')
    })

    it('should have correct classes on body element', () => {
      const result = RootLayout({ children: <div>Test</div> })
      const body = result.props.children
      expect(body.props.className).toContain('antialiased')
      expect(body.props.className).toContain('bg-neutral-bg')
      expect(body.props.className).toContain('text-text')
    })

    it('should include skip-to-content link', () => {
      const result = RootLayout({ children: <div>Test</div> })
      const body = result.props.children
      const bodyChildren = body.props.children

      // Body should have multiple children (skip link + provider)
      expect(Array.isArray(bodyChildren)).toBe(true)

      // First child should be the skip link
      const skipLink = bodyChildren[0]
      expect(skipLink.type).toBe('a')
      expect(skipLink.props.href).toBe('#main-content')
      expect(skipLink.props.children).toBe('Skip to main content')
    })

    it('should wrap content with PostHogProvider', () => {
      const result = RootLayout({ children: <div>Test</div> })
      const body = result.props.children
      const bodyChildren = body.props.children
      const provider = bodyChildren[1] // Provider is second child after skip link

      // Provider component type should be PostHogProvider (mocked)
      expect(provider.type).toBeDefined()
    })

    it('should include children within PostHogProvider', () => {
      const result = RootLayout({ children: <div>Test</div> })
      const body = result.props.children
      const bodyChildren = body.props.children
      const provider = bodyChildren[1] // Provider is second child after skip link
      const providerChildren = provider.props.children

      // Provider should have children
      expect(providerChildren).toBeDefined()
    })

    it('should pass children to provider', () => {
      const testChild = <div>Test Content</div>
      const result = RootLayout({ children: testChild })
      const body = result.props.children
      const bodyChildren = body.props.children
      const provider = bodyChildren[1] // Provider is second child after skip link
      const providerChildren = provider.props.children

      // Second child should be the original children
      expect(providerChildren[1]).toBe(testChild)
    })

    it('should handle multiple children correctly', () => {
      const multipleChildren = (
        <>
          <div>Child 1</div>
          <div>Child 2</div>
        </>
      )
      const result = RootLayout({ children: multipleChildren })
      const body = result.props.children
      const bodyChildren = body.props.children
      const provider = bodyChildren[1] // Provider is second child after skip link
      const providerChildren = provider.props.children

      // Children should be preserved
      expect(providerChildren[1]).toBe(multipleChildren)
    })
  })
})
