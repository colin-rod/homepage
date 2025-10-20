import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/seo'

/**
 * Generate robots.txt for search engine crawlers
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/cv/download'], // Don't index API routes and CV download pages
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  }
}
