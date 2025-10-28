'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

/**
 * PostHog Analytics Provider
 *
 * Initializes PostHog for client-side analytics tracking
 * Requires NEXT_PUBLIC_POSTHOG_KEY and NEXT_PUBLIC_POSTHOG_HOST environment variables
 */

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize PostHog if we have the required environment variables
    if (
      typeof window !== 'undefined' &&
      process.env.NEXT_PUBLIC_POSTHOG_KEY &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        // Disable in development
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') posthog.opt_out_capturing()
        },
        capture_pageview: false, // We'll handle pageviews manually in the app
        capture_pageleave: true,
      })
    }
  }, [])

  // If PostHog is not configured, just return children without provider
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || !process.env.NEXT_PUBLIC_POSTHOG_HOST) {
    return <>{children}</>
  }

  return <PHProvider client={posthog}>{children}</PHProvider>
}
