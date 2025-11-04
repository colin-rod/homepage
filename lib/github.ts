/**
 * GitHub API Client Utilities
 *
 * Provides functions to fetch GitHub contribution data via GraphQL API
 */

export interface GitHubContribution {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

interface GitHubContributionDay {
  date: string
  contributionCount: number
}

interface GitHubContributionWeek {
  contributionDays: GitHubContributionDay[]
}

interface GitHubContributionsResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number
          weeks: GitHubContributionWeek[]
        }
      }
    }
  }
}

/**
 * Calculate the date 6 months ago from today
 */
export function getSixMonthsAgo(): Date {
  const today = new Date()
  const sixMonthsAgo = new Date(today)
  sixMonthsAgo.setMonth(today.getMonth() - 6)
  return sixMonthsAgo
}

/**
 * Convert contribution count to intensity level (0-4)
 */
export function getContributionLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (count <= 2) return 1
  if (count <= 5) return 2
  if (count <= 10) return 3
  return 4
}

/**
 * Fetch GitHub contributions for a user within a date range
 */
export async function fetchGitHubContributions(
  username: string,
  from: Date,
  to: Date
): Promise<GitHubContribution[] | null> {
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    console.error('GITHUB_TOKEN is not configured')
    return null
  }

  const query = `
    query($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          login: username,
          from: from.toISOString(),
          to: to.toISOString(),
        },
      }),
      // Revalidate every 24 hours
      next: { revalidate: 86400 },
    })

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status} ${response.statusText}`)
      return null
    }

    const data: GitHubContributionsResponse = await response.json()

    if (!data.data?.user?.contributionsCollection) {
      console.error('Invalid GitHub API response structure')
      return null
    }

    // Flatten weeks into a single array of contributions
    const contributions: GitHubContribution[] = []
    const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks

    for (const week of weeks) {
      for (const day of week.contributionDays) {
        contributions.push({
          date: day.date,
          count: day.contributionCount,
          level: getContributionLevel(day.contributionCount),
        })
      }
    }

    return contributions
  } catch (error) {
    console.error('Failed to fetch GitHub contributions:', error)
    return null
  }
}

/**
 * Fetch GitHub contributions for the last 6 months
 */
export async function fetchLastSixMonthsContributions(
  username: string
): Promise<GitHubContribution[] | null> {
  const to = new Date()
  const from = getSixMonthsAgo()

  return fetchGitHubContributions(username, from, to)
}
