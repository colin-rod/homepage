/**
 * GitHub Contributions API Route
 *
 * Fetches GitHub contribution data for the last 6 months
 * Implements ISR caching with 24-hour revalidation
 */

import { NextResponse } from 'next/server'
import { fetchLastSixMonthsContributions } from '@/lib/github'

export const dynamic = 'force-dynamic'
export const revalidate = 86400 // 24 hours

export async function GET(request: Request) {
  try {
    // Get username from query parameters
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json({ error: 'Username parameter is required' }, { status: 400 })
    }

    // Fetch contributions from GitHub
    const contributions = await fetchLastSixMonthsContributions(username)

    if (!contributions) {
      // Return 503 Service Unavailable if GitHub API fails
      // This allows the component to gracefully handle the error
      return NextResponse.json({ error: 'Failed to fetch GitHub contributions' }, { status: 503 })
    }

    // Return the contributions data
    return NextResponse.json(
      {
        username,
        contributions,
        lastUpdated: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
        },
      }
    )
  } catch (error) {
    console.error('Error in GitHub contributions API route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
