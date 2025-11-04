import { generatePageMetadata, siteConfig, baseMetadata, viewport } from './seo'

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
      expect(baseMetadata.openGraph).toBeDefined()
      expect(baseMetadata.openGraph?.type).toBe('website')
      expect(baseMetadata.openGraph?.locale).toBe('en_US')
      expect(baseMetadata.openGraph?.url).toBe('https://colinrodrigues.com')
      expect(baseMetadata.openGraph?.title).toBe('Colin Rodrigues')
    })

    it('includes Open Graph image with correct dimensions', () => {
      expect(baseMetadata.openGraph?.images).toBeDefined()
      const images = baseMetadata.openGraph?.images as any[]
      expect(images[0].url).toBe('/og-image.png')
      expect(images[0].width).toBe(1200)
      expect(images[0].height).toBe(630)
    })

    it('includes Twitter Card metadata', () => {
      expect(baseMetadata.twitter).toBeDefined()
      expect(baseMetadata.twitter?.card).toBe('summary_large_image')
      expect(baseMetadata.twitter?.title).toBe('Colin Rodrigues')
      expect(baseMetadata.twitter?.description).toBe(siteConfig.description)
    })

    it('includes robots configuration', () => {
      expect(baseMetadata.robots).toBeDefined()
      expect(baseMetadata.robots).toHaveProperty('index', true)
      expect(baseMetadata.robots).toHaveProperty('follow', true)
    })

    it('includes Google Bot configuration', () => {
      const googleBot = (baseMetadata.robots as any)?.googleBot
      expect(googleBot).toBeDefined()
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
      expect((baseMetadata.verification as any)?.google).toBeTruthy()
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
      expect((viewport.themeColor as any[]).length).toBe(2)
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

      const ogImages = metadata.openGraph?.images as any[]
      expect(ogImages[0].url).toBe('/custom-og.png')

      const twitterImages = metadata.twitter?.images as string[]
      expect(twitterImages[0]).toBe('/custom-og.png')
    })

    it('uses default OG image when no custom image provided', () => {
      const metadata = generatePageMetadata('Contact', 'Get in touch', '/contact')

      const ogImages = metadata.openGraph?.images as any[]
      expect(ogImages[0].url).toBe('/og-image.png')
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

      const ogImages = metadata.openGraph?.images as any[]
      expect(ogImages[0].width).toBe(1200)
      expect(ogImages[0].height).toBe(630)
    })

    it('includes alt text for Open Graph image', () => {
      const metadata = generatePageMetadata('Portfolio', 'My work', '/projects')

      const ogImages = metadata.openGraph?.images as any[]
      expect(ogImages[0].alt).toBe('Portfolio | Colin Rodrigues')
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
