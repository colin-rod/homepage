import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/seo'

/**
 * Generate sitemap for search engines
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about',
    '/now',
    '/projects',
    '/timeline',
    '/writing',
    '/cv',
    '/contact',
  ]

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }))
}
