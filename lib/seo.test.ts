import type { Metadata } from 'next'
import { generatePageMetadata, siteConfig, baseMetadata, viewport } from './seo'

const toArray = <T>(value: T | T[] | undefined): T[] => {
  if (value === undefined) {
    return []
  }
  return Array.isArray(value) ? value : [value]
}

const assertImageDescriptor = (
  value: unknown,
  message: string
): asserts value is {
  url: string | URL
  width?: number | string
  height?: number | string
  alt?: string
} => {
  if (typeof value !== 'object' || value === null || !('url' in value)) {
    throw new Error(message)
  }
}

type RobotsData = {
  index?: boolean
  follow?: boolean
  googleBot?: string | Record<string, unknown>
  [key: string]: unknown
}

const assertRobotsObject = (
  robots: string | RobotsData | undefined
): asserts robots is RobotsData => {
  if (!robots || typeof robots === 'string') {
    throw new Error('Expected robots configuration object')
  }
}

const assertRecord = (
  value: unknown,
  message: string
): asserts value is Record<string, unknown> => {
  if (typeof value !== 'object' || value === null) {
    throw new Error(message)
  }
}

const getFirstOpenGraphImage = (openGraph: NonNullable<Metadata['openGraph']>) => {
  const images = toArray(openGraph.images)
  expect(images).not.toHaveLength(0)
  const firstImage = images[0]
  assertImageDescriptor(firstImage, 'Expected Open Graph image descriptor')
  return firstImage
}

const getFirstTwitterImage = (twitter: NonNullable<Metadata['twitter']>) => {
  const images = toArray(twitter.images)
  expect(images).not.toHaveLength(0)
  const firstImage = images[0]
  if (typeof firstImage !== 'string') {
    throw new Error('Expected Twitter image to be a string URL')
  }
  return firstImage
}

describe('seo', () => {
  describe('siteConfig', () => {
    it('exports site configuration with required fields', () => {
      expect(siteConfig).toBeDefined()
      expect(siteConfig.name).toBe('Colin Rodrigues')
      expect(siteConfig.title).toBe('Colin Rodrigues')
      expect(siteConfig.url).toBe('https://colinrodrigues.com')
      expect(siteConfig.ogImage).toBe('/og-image.png')
    })

    it('includes description', () => {
      expect(siteConfig.description).toContain('portfolio')
      expect(siteConfig.description).toContain('product management')
    })

    it('includes keywords array', () => {
      expect(siteConfig.keywords).toBeInstanceOf(Array)
      expect(siteConfig.keywords).toContain('Colin Rodrigues')
      expect(siteConfig.keywords).toContain('Product Management')
    })

    it('includes author information', () => {
      expect(siteConfig.author.name).toBe('Colin Rodrigues')
      expect(siteConfig.author.email).toBe('mail@colinrodrigues.com')
    })
  })

  describe('baseMetadata', () => {
    it('exports base metadata object', () => {
      expect(baseMetadata).toBeDefined()
      expect(baseMetadata.title).toBe('Colin Rodrigues')
      expect(baseMetadata.description).toBe(siteConfig.description)
    })

    it('includes Open Graph metadata', () => {
      const openGraph = baseMetadata.openGraph
      expect(openGraph).toBeDefined()
      if (!openGraph) {
        throw new Error('Expected Open Graph metadata')
      }
      if (!('type' in openGraph)) {
        throw new Error('Expected Open Graph metadata to include type')
      }
      expect(openGraph.type).toBe('website')
      expect(openGraph.locale).toBe('en_US')
      expect(openGraph.url).toBe('https://colinrodrigues.com')
      expect(openGraph.title).toBe('Colin Rodrigues')
    })

    it('includes Open Graph image with correct dimensions', () => {
      const openGraph = baseMetadata.openGraph
      expect(openGraph).toBeDefined()
      if (!openGraph) {
        throw new Error('Expected Open Graph metadata')
      }
      const images = toArray(openGraph.images)
      expect(images).not.toHaveLength(0)
      const firstImage = images[0]
      assertImageDescriptor(firstImage, 'Expected Open Graph image descriptor')
      expect(firstImage).toMatchObject({
        url: '/og-image.png',
        width: 1200,
        height: 630,
      })
    })

    it('includes Twitter Card metadata', () => {
      const twitter = baseMetadata.twitter
      expect(twitter).toBeDefined()
      if (!twitter) {
        throw new Error('Expected Twitter metadata')
      }
      if (!('card' in twitter)) {
        throw new Error('Expected Twitter metadata to include card')
      }
      expect(twitter.card).toBe('summary_large_image')
      expect(twitter.title).toBe('Colin Rodrigues')
      expect(twitter.description).toBe(siteConfig.description)
    })

    it('includes robots configuration', () => {
      const robots = baseMetadata.robots
      expect(robots).toBeDefined()
      assertRobotsObject(robots)
      if (typeof robots.index !== 'boolean') {
        throw new Error('Expected robots.index to be a boolean')
      }
      if (typeof robots.follow !== 'boolean') {
        throw new Error('Expected robots.follow to be a boolean')
      }
      expect(robots.index).toBe(true)
      expect(robots.follow).toBe(true)
    })

    it('includes Google Bot configuration', () => {
      const robots = baseMetadata.robots
      expect(robots).toBeDefined()
      assertRobotsObject(robots)
      const googleBot = robots.googleBot
      expect(googleBot).toBeDefined()
      assertRecord(googleBot, 'Expected googleBot configuration to be an object')
      if (typeof googleBot.index !== 'boolean') {
        throw new Error('Expected googleBot.index to be a boolean')
      }
      if (typeof googleBot.follow !== 'boolean') {
        throw new Error('Expected googleBot.follow to be a boolean')
      }
      expect(googleBot.index).toBe(true)
      expect(googleBot.follow).toBe(true)
    })

    it('includes icons configuration', () => {
      expect(baseMetadata.icons).toBeDefined()
      expect(baseMetadata.icons).toHaveProperty('icon', '/favicon.ico')
      expect(baseMetadata.icons).toHaveProperty('apple', '/apple-touch-icon.png')
    })

    it('includes manifest path', () => {
      expect(baseMetadata.manifest).toBe('/site.webmanifest')
    })

    it('includes Google verification token', () => {
      expect(baseMetadata.verification).toBeDefined()
      expect(baseMetadata.verification?.google).toBeTruthy()
    })
  })

  describe('viewport', () => {
    it('exports viewport configuration', () => {
      expect(viewport).toBeDefined()
      expect(viewport.width).toBe('device-width')
      expect(viewport.initialScale).toBe(1)
      expect(viewport.maximumScale).toBe(5)
    })

    it('includes theme color for light and dark modes', () => {
      expect(viewport.themeColor).toBeDefined()
      expect(viewport.themeColor).toBeInstanceOf(Array)
      if (Array.isArray(viewport.themeColor)) {
        expect(viewport.themeColor).toHaveLength(2)
      } else {
        throw new Error('Expected themeColor to be an array')
      }
    })
  })

  describe('generatePageMetadata', () => {
    it('generates metadata with title, description, and default path', () => {
      const metadata = generatePageMetadata('About', 'Learn more about Colin')

      expect(metadata.title).toBe('About | Colin Rodrigues')
      expect(metadata.description).toBe('Learn more about Colin')
    })

    it('generates metadata with custom path', () => {
      const metadata = generatePageMetadata('Projects', 'View my projects', '/projects')

      expect(metadata.openGraph?.url).toBe('https://colinrodrigues.com/projects')
      expect(metadata.alternates?.canonical).toBe('https://colinrodrigues.com/projects')
    })

    it('generates metadata with custom image', () => {
      const metadata = generatePageMetadata(
        'Blog Post',
        'Read this post',
        '/writing/post',
        '/custom-og.png'
      )

      const openGraph = metadata.openGraph
      expect(openGraph).toBeDefined()
      if (!openGraph) {
        throw new Error('Expected Open Graph metadata')
      }
      expect(getFirstOpenGraphImage(openGraph)).toMatchObject({ url: '/custom-og.png' })

      const twitter = metadata.twitter
      expect(twitter).toBeDefined()
      if (!twitter) {
        throw new Error('Expected Twitter metadata')
      }
      expect(getFirstTwitterImage(twitter)).toBe('/custom-og.png')
    })

    it('uses default OG image when no custom image provided', () => {
      const metadata = generatePageMetadata('Contact', 'Get in touch', '/contact')

      const openGraph = metadata.openGraph
      expect(openGraph).toBeDefined()
      if (!openGraph) {
        throw new Error('Expected Open Graph metadata')
      }
      expect(getFirstOpenGraphImage(openGraph)).toMatchObject({ url: '/og-image.png' })
    })

    it('includes formatted page title in Open Graph', () => {
      const metadata = generatePageMetadata('Timeline', 'My journey', '/timeline')

      expect(metadata.openGraph?.title).toBe('Timeline | Colin Rodrigues')
    })

    it('includes formatted page title in Twitter Card', () => {
      const metadata = generatePageMetadata('CV', 'View my resume', '/cv')

      expect(metadata.twitter?.title).toBe('CV | Colin Rodrigues')
    })

    it('includes description in Open Graph', () => {
      const metadata = generatePageMetadata('Now', 'What I am doing now', '/now')

      expect(metadata.openGraph?.description).toBe('What I am doing now')
    })

    it('includes description in Twitter Card', () => {
      const metadata = generatePageMetadata('Uses', 'Tools I use', '/uses')

      expect(metadata.twitter?.description).toBe('Tools I use')
    })

    it('includes image dimensions in Open Graph', () => {
      const metadata = generatePageMetadata('Test', 'Test page', '/test')

      const openGraph = metadata.openGraph
      expect(openGraph).toBeDefined()
      if (!openGraph) {
        throw new Error('Expected Open Graph metadata')
      }
      expect(getFirstOpenGraphImage(openGraph)).toMatchObject({
        width: 1200,
        height: 630,
      })
    })

    it('includes alt text for Open Graph image', () => {
      const metadata = generatePageMetadata('Portfolio', 'My work', '/projects')

      const openGraph = metadata.openGraph
      expect(openGraph).toBeDefined()
      if (!openGraph) {
        throw new Error('Expected Open Graph metadata')
      }
      expect(getFirstOpenGraphImage(openGraph)).toMatchObject({
        alt: 'Portfolio | Colin Rodrigues',
      })
    })

    it('generates canonical URL correctly', () => {
      const metadata = generatePageMetadata('Writing', 'My thoughts', '/writing')

      expect(metadata.alternates?.canonical).toBe('https://colinrodrigues.com/writing')
    })

    it('handles empty path string', () => {
      const metadata = generatePageMetadata('Home', 'Homepage', '')

      expect(metadata.openGraph?.url).toBe('https://colinrodrigues.com')
      expect(metadata.alternates?.canonical).toBe('https://colinrodrigues.com')
    })

    it('handles path without leading slash', () => {
      const metadata = generatePageMetadata('Page', 'Test page', '/test')

      expect(metadata.openGraph?.url).toBe('https://colinrodrigues.com/test')
    })

    it('generates complete metadata object structure', () => {
      const metadata = generatePageMetadata('Complete', 'Full test', '/complete')

      expect(metadata).toHaveProperty('title')
      expect(metadata).toHaveProperty('description')
      expect(metadata).toHaveProperty('openGraph')
      expect(metadata).toHaveProperty('twitter')
      expect(metadata).toHaveProperty('alternates')
    })
  })
})
