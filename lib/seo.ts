import { Metadata, Viewport } from 'next'

/**
 * Site Configuration for SEO
 */
export const siteConfig = {
  name: 'Colin Rodrigues',
  title: 'Colin Rodrigues',
  description:
    'Interactive portfolio showcasing professional journey, projects, and expertise in product management and strategy.',
  url: 'https://colinrodrigues.com',
  ogImage: '/og-image.png',
  twitterHandle: undefined, // No Twitter account
  keywords: [
    'Colin Rodrigues',
    'Product Management',
    'Strategy',
    'Portfolio',
    'Product Manager',
    'Digital Strategy',
    'Technology Leadership',
  ],
  author: {
    name: 'Colin Rodrigues',
    email: 'mail@colinrodrigues.com',
  },
}

/**
 * Base metadata configuration for the site
 * This should be used in the root layout.tsx
 */
export const baseMetadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  metadataBase: new URL(siteConfig.url),

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    creator: siteConfig.twitterHandle,
    images: [siteConfig.ogImage],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },

  // Manifest
  manifest: '/site.webmanifest',

  // Verification (for search console)
  // To get Google Search Console verification code:
  // 1. Go to https://search.google.com/search-console
  // 2. Add your property (colinrodrigues.com)
  // 3. Choose "HTML tag" verification method
  // 4. Copy the content value from the meta tag (e.g., "abc123xyz...")
  // 5. Add it to the google field below
  verification: {
    google: '', // Add Google Search Console verification code here
    // yandex: '',
    // yahoo: '',
  },
}

/**
 * Helper function to generate metadata for individual pages
 * @param title - Page title
 * @param description - Page description
 * @param path - Page path (e.g., '/about')
 * @param image - Optional custom OG image
 * @returns Metadata object
 */
export function generatePageMetadata(
  title: string,
  description: string,
  path: string = '',
  image?: string
): Metadata {
  const pageTitle = `${title} | ${siteConfig.name}`
  const pageUrl = `${siteConfig.url}${path}`
  const pageImage = image || siteConfig.ogImage

  return {
    title: pageTitle,
    description,
    openGraph: {
      title: pageTitle,
      description,
      url: pageUrl,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      title: pageTitle,
      description,
      images: [pageImage],
    },
    alternates: {
      canonical: pageUrl,
    },
  }
}

/**
 * Viewport configuration for the site
 * Must be exported separately in Next.js 15+
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF8F5' },
    { media: '(prefers-color-scheme: dark)', color: '#20465B' },
  ],
}
