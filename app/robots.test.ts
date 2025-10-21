import robots from './robots'
import { siteConfig } from '@/lib/seo'
import { MetadataRoute } from 'next'

describe('robots.txt', () => {
  it('should return robots configuration object', () => {
    const robotsConfig = robots()

    expect(robotsConfig).toBeDefined()
    expect(robotsConfig).toHaveProperty('rules')
    expect(robotsConfig).toHaveProperty('sitemap')
    expect(robotsConfig).toHaveProperty('host')
  })

  it('should allow all user agents', () => {
    const robotsConfig = robots()
    const rules = robotsConfig.rules as MetadataRoute.Robots['rules']

    expect(rules).toHaveLength(1)
    if (Array.isArray(rules) && rules.length > 0) {
      const firstRule = rules[0] as { userAgent: string }
      expect(firstRule.userAgent).toBe('*')
    }
  })

  it('should allow root path', () => {
    const robotsConfig = robots()
    const rules = robotsConfig.rules as MetadataRoute.Robots['rules']

    if (Array.isArray(rules) && rules.length > 0) {
      const firstRule = rules[0] as { allow: string }
      expect(firstRule.allow).toBe('/')
    }
  })

  it('should disallow API routes and CV download pages', () => {
    const robotsConfig = robots()
    const rules = robotsConfig.rules as MetadataRoute.Robots['rules']

    if (Array.isArray(rules) && rules.length > 0) {
      const firstRule = rules[0] as { disallow: string[] }
      expect(firstRule.disallow).toContain('/api/')
      expect(firstRule.disallow).toContain('/cv/download')
    }
  })

  it('should include sitemap URL', () => {
    const robotsConfig = robots()

    expect(robotsConfig.sitemap).toBe(`${siteConfig.url}/sitemap.xml`)
  })

  it('should include host URL', () => {
    const robotsConfig = robots()

    expect(robotsConfig.host).toBe(siteConfig.url)
  })

  it('should have valid sitemap URL format', () => {
    const robotsConfig = robots()

    expect(robotsConfig.sitemap).toMatch(/^https?:\/\/.+\/sitemap\.xml$/)
  })

  it('should have valid host URL format', () => {
    const robotsConfig = robots()

    expect(robotsConfig.host).toMatch(/^https?:\/\/.+/)
  })
})
