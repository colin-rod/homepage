import robots from './robots'
import { siteConfig } from '@/lib/seo'

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

    expect(robotsConfig.rules).toHaveLength(1)
    expect(robotsConfig.rules[0].userAgent).toBe('*')
  })

  it('should allow root path', () => {
    const robotsConfig = robots()

    expect(robotsConfig.rules[0].allow).toBe('/')
  })

  it('should disallow API routes and CV download pages', () => {
    const robotsConfig = robots()

    expect(robotsConfig.rules[0].disallow).toContain('/api/')
    expect(robotsConfig.rules[0].disallow).toContain('/cv/download')
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
