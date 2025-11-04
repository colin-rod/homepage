import { Metadata } from 'next'
import { baseMetadata, siteConfig, generatePageMetadata, viewport } from '@/lib/seo'

/**
 * SEO Metadata Tests
 *
 * Tests ensure proper SEO configuration including:
 * - Base metadata (title, description)
 * - Open Graph tags
 * - Twitter Card tags
 * - Canonical URLs
 * - Author and creator tags
 */

describe('SEO Metadata Configuration', () => {
  const metadata: Metadata = baseMetadata

  describe('Base Metadata', () => {
    it('has a title', () => {
      expect(metadata.title).toBeDefined()
      expect(typeof metadata.title).toBe('string')
    })

    it('has a description', () => {
      expect(metadata.description).toBeDefined()
      expect(typeof metadata.description).toBe('string')
      // Description should be between 50-160 characters for optimal SEO
      if (typeof metadata.description === 'string') {
        expect(metadata.description.length).toBeGreaterThanOrEqual(50)
        expect(metadata.description.length).toBeLessThanOrEqual(160)
      }
    })

    it('has keywords defined', () => {
      expect(metadata.keywords).toBeDefined()
      if (Array.isArray(metadata.keywords)) {
        expect(metadata.keywords.length).toBeGreaterThan(0)
      }
    })

    it('has author information', () => {
      expect(metadata.authors).toBeDefined()
    })

    it('has creator information', () => {
      expect(metadata.creator).toBeDefined()
    })
  })

  describe('Open Graph Tags', () => {
    it('has Open Graph title', () => {
      expect(metadata.openGraph?.title).toBeDefined()
    })

    it('has Open Graph description', () => {
      expect(metadata.openGraph?.description).toBeDefined()
    })

    it('has Open Graph type', () => {
      expect(metadata.openGraph).toBeDefined()
      if (metadata.openGraph && 'type' in metadata.openGraph) {
        expect(metadata.openGraph.type).toBe('website')
      }
    })

    it('has Open Graph URL', () => {
      expect(metadata.openGraph?.url).toBeDefined()
      expect(metadata.openGraph?.url).toContain('colinrodrigues.com')
    })

    it('has Open Graph site name', () => {
      expect(metadata.openGraph?.siteName).toBeDefined()
    })

    it('has Open Graph locale', () => {
      expect(metadata.openGraph?.locale).toBeDefined()
      expect(metadata.openGraph?.locale).toBe('en_US')
    })

    it('has Open Graph images', () => {
      expect(metadata.openGraph?.images).toBeDefined()
      if (Array.isArray(metadata.openGraph?.images)) {
        expect(metadata.openGraph.images.length).toBeGreaterThan(0)
      }
    })
  })

  describe('Twitter Card Tags', () => {
    it('has Twitter card type', () => {
      expect(metadata.twitter).toBeDefined()
      if (metadata.twitter && 'card' in metadata.twitter) {
        expect(metadata.twitter.card).toBe('summary_large_image')
      }
    })

    it('has Twitter title', () => {
      expect(metadata.twitter?.title).toBeDefined()
    })

    it('has Twitter description', () => {
      expect(metadata.twitter?.description).toBeDefined()
    })

    it('has Twitter images', () => {
      expect(metadata.twitter?.images).toBeDefined()
    })

    it('does not have Twitter creator handle when not configured', () => {
      // Twitter creator is optional - only present if twitterHandle is configured
      expect(metadata.twitter?.creator).toBeUndefined()
    })
  })

  describe('Technical SEO', () => {
    it('has robots configuration', () => {
      expect(metadata.robots).toBeDefined()
    })

    it('allows indexing and following', () => {
      if (typeof metadata.robots === 'object' && metadata.robots !== null) {
        expect(metadata.robots.index).toBe(true)
        expect(metadata.robots.follow).toBe(true)
      }
    })
  })

  describe('Viewport Configuration', () => {
    it('has viewport configuration', () => {
      expect(viewport).toBeDefined()
    })

    it('has correct viewport width', () => {
      expect(viewport.width).toBe('device-width')
    })

    it('has initial scale', () => {
      expect(viewport.initialScale).toBe(1)
    })

    it('has theme color', () => {
      expect(viewport.themeColor).toBeDefined()
    })
  })

  describe('Content Guidelines', () => {
    it('title should be concise (under 60 characters)', () => {
      if (typeof metadata.title === 'string') {
        expect(metadata.title.length).toBeLessThanOrEqual(60)
      }
    })

    it('description should not contain double quotes', () => {
      if (typeof metadata.description === 'string') {
        expect(metadata.description).not.toContain('"')
      }
    })

    it('Open Graph title matches base title', () => {
      if (typeof metadata.title === 'string') {
        expect(metadata.openGraph?.title).toBe(metadata.title)
      }
    })

    it('Twitter title matches base title', () => {
      if (typeof metadata.title === 'string') {
        expect(metadata.twitter?.title).toBe(metadata.title)
      }
    })
  })

  describe('Site Configuration', () => {
    it('has a valid site name', () => {
      expect(siteConfig.name).toBeDefined()
      expect(typeof siteConfig.name).toBe('string')
    })

    it('has a valid URL', () => {
      expect(siteConfig.url).toBeDefined()
      expect(siteConfig.url).toMatch(/^https?:\/\//)
    })

    it('has keywords array', () => {
      expect(Array.isArray(siteConfig.keywords)).toBe(true)
      expect(siteConfig.keywords.length).toBeGreaterThan(0)
    })

    it('has author information', () => {
      expect(siteConfig.author).toBeDefined()
      expect(siteConfig.author.name).toBeDefined()
    })
  })

  describe('Page Metadata Generator', () => {
    it('generates metadata with custom title', () => {
      const pageMetadata = generatePageMetadata(
        'About',
        'Learn more about Colin Rodrigues',
        '/about'
      )

      expect(pageMetadata.title).toContain('About')
      expect(pageMetadata.title).toContain(siteConfig.name)
    })

    it('generates metadata with custom description', () => {
      const description = 'Learn more about Colin Rodrigues'
      const pageMetadata = generatePageMetadata('About', description, '/about')

      expect(pageMetadata.description).toBe(description)
    })

    it('generates correct canonical URL', () => {
      const pageMetadata = generatePageMetadata('Projects', 'View my projects', '/projects')

      expect(pageMetadata.alternates?.canonical).toBe(`${siteConfig.url}/projects`)
    })

    it('generates Open Graph metadata for pages', () => {
      const pageMetadata = generatePageMetadata('CV', 'View my CV', '/cv')

      expect(pageMetadata.openGraph?.title).toContain('CV')
      expect(pageMetadata.openGraph?.description).toBe('View my CV')
      expect(pageMetadata.openGraph?.url).toBe(`${siteConfig.url}/cv`)
    })

    it('generates Twitter Card metadata for pages', () => {
      const pageMetadata = generatePageMetadata('Reflections', 'Read my reflections', '/writing')

      expect(pageMetadata.twitter?.title).toContain('Reflections')
      expect(pageMetadata.twitter?.description).toBe('Read my reflections')
    })

    it('uses custom image when provided', () => {
      const customImage = '/custom-og-image.png'
      const pageMetadata = generatePageMetadata(
        'Special Page',
        'Special description',
        '/special',
        customImage
      )

      expect(pageMetadata.twitter?.images).toContain(customImage)
    })
  })
})
