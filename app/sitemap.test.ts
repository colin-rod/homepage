import sitemap from './sitemap'
import { siteConfig } from '@/lib/seo'

describe('sitemap.xml', () => {
  it('should return an array of sitemap entries', () => {
    const sitemapEntries = sitemap()

    expect(Array.isArray(sitemapEntries)).toBe(true)
    expect(sitemapEntries.length).toBeGreaterThan(0)
  })

  it('should include homepage', () => {
    const sitemapEntries = sitemap()

    const homepage = sitemapEntries.find((entry) => entry.url === siteConfig.url)
    expect(homepage).toBeDefined()
  })

  it('should include all main pages', () => {
    const sitemapEntries = sitemap()
    const urls = sitemapEntries.map((entry) => entry.url)

    expect(urls).toContain(`${siteConfig.url}/about`)
    expect(urls).toContain(`${siteConfig.url}/now`)
    expect(urls).toContain(`${siteConfig.url}/projects`)
    expect(urls).toContain(`${siteConfig.url}/timeline`)
    expect(urls).toContain(`${siteConfig.url}/cv`)
    expect(urls).toContain(`${siteConfig.url}/contact`)
  })

  it('should have lastModified date for all entries', () => {
    const sitemapEntries = sitemap()

    sitemapEntries.forEach((entry) => {
      expect(entry.lastModified).toBeInstanceOf(Date)
    })
  })

  it('should have changeFrequency for all entries', () => {
    const sitemapEntries = sitemap()

    sitemapEntries.forEach((entry) => {
      expect(entry.changeFrequency).toBeDefined()
      expect(['daily', 'weekly']).toContain(entry.changeFrequency)
    })
  })

  it('should have priority for all entries', () => {
    const sitemapEntries = sitemap()

    sitemapEntries.forEach((entry) => {
      expect(entry.priority).toBeDefined()
      expect(typeof entry.priority).toBe('number')
      expect(entry.priority).toBeGreaterThanOrEqual(0)
      expect(entry.priority).toBeLessThanOrEqual(1)
    })
  })

  it('should give homepage highest priority', () => {
    const sitemapEntries = sitemap()

    const homepage = sitemapEntries.find((entry) => entry.url === siteConfig.url)
    expect(homepage?.priority).toBe(1.0)
  })

  it('should give homepage daily change frequency', () => {
    const sitemapEntries = sitemap()

    const homepage = sitemapEntries.find((entry) => entry.url === siteConfig.url)
    expect(homepage?.changeFrequency).toBe('daily')
  })

  it('should give other pages weekly change frequency', () => {
    const sitemapEntries = sitemap()

    const aboutPage = sitemapEntries.find((entry) => entry.url === `${siteConfig.url}/about`)
    expect(aboutPage?.changeFrequency).toBe('weekly')
  })

  it('should give other pages priority of 0.8', () => {
    const sitemapEntries = sitemap()

    const aboutPage = sitemapEntries.find((entry) => entry.url === `${siteConfig.url}/about`)
    expect(aboutPage?.priority).toBe(0.8)
  })

  it('should have valid URL format for all entries', () => {
    const sitemapEntries = sitemap()

    sitemapEntries.forEach((entry) => {
      expect(entry.url).toMatch(/^https?:\/\/.+/)
    })
  })

  it('should include writing page', () => {
    const sitemapEntries = sitemap()
    const urls = sitemapEntries.map((entry) => entry.url)

    expect(urls).toContain(`${siteConfig.url}/writing`)
  })
})
