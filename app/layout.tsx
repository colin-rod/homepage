import type { Metadata, Viewport } from 'next'
import { baseMetadata, viewport as baseViewport } from '@/lib/seo'
import { Analytics } from '@vercel/analytics/react'
import { PostHogProvider } from '@/components/providers/PostHogProvider'
import { PostHogPageView } from '@/components/providers/PostHogPageView'
import './globals.css'

export const metadata: Metadata = baseMetadata
export const viewport: Viewport = baseViewport

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-neutral-bg text-text">
        {/* Skip to main content link for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-warm focus:text-white focus:rounded-lg focus:shadow-lg"
        >
          Skip to main content
        </a>
        <PostHogProvider>
          <PostHogPageView />
          {children}
        </PostHogProvider>
        <Analytics />
      </body>
    </html>
  )
}
