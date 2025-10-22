import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo'
import { getTimelineEvents } from '@/lib/data'
import Navigation from '@/components/layouts/Navigation'
import Footer from '@/components/layouts/Footer'
import PageTransition from '@/components/animations/PageTransition'

export const metadata: Metadata = generatePageMetadata(
  'Timeline',
  'My professional and personal journey - a chronological timeline of career milestones, projects, education, and learning experiences.',
  '/timeline'
)

/**
 * Timeline Page
 *
 * Displays chronological timeline of career events, projects, education, and milestones
 */

export default function TimelinePage() {
  const events = getTimelineEvents()

  // Sort events by date (most recent first)
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.startDate)
    const dateB = new Date(b.startDate)
    return dateB.getTime() - dateA.getTime()
  })

  // Helper function to format dates
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Present'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  // Helper function to get event type badge color
  const getEventTypeBadge = (type: string): string => {
    const badges: Record<string, string> = {
      job: 'bg-blue-100 text-blue-800',
      project: 'bg-green-100 text-green-800',
      education: 'bg-purple-100 text-purple-800',
      milestone: 'bg-yellow-100 text-yellow-800',
      learning: 'bg-pink-100 text-pink-800',
    }
    return badges[type] || 'bg-gray-100 text-gray-800'
  }

  return (
    <>
      <Navigation />
      <PageTransition>
        <main className="py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            {/* Page Header */}
            <div className="mb-16">
              <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-6">
                Timeline
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed">
                A chronological journey through my professional experiences, projects, education,
                and key milestones. Each event represents a step in my continuous growth and
                learning.
              </p>
            </div>

            {/* Timeline */}
            <div className="space-y-8">
              {sortedEvents.map((event) => (
                <div key={event.id} className="relative pl-8 border-l-2 border-divider">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-accent-warm border-2 border-background" />

                  {/* Event Card */}
                  <div className="card mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-primary mb-1">{event.title}</h3>
                        <p className="text-lg text-text-secondary">{event.organization}</p>
                      </div>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ml-4 ${getEventTypeBadge(
                          event.type
                        )}`}
                      >
                        {event.type}
                      </span>
                    </div>

                    <p className="text-sm text-text-secondary mb-3">
                      {formatDate(event.startDate)}
                      {event.endDate && ` – ${formatDate(event.endDate)}`}
                      {event.location && ` • ${event.location}`}
                    </p>

                    <p className="text-text-secondary mb-4">{event.summary}</p>

                    {event.description && (
                      <p className="text-text-secondary mb-4">{event.description}</p>
                    )}

                    {/* Tags */}
                    {event.tags && event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {event.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 rounded bg-accent-warm/10 text-accent-warm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Link */}
                    {event.link && (
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-accent-warm hover:underline"
                      >
                        Learn more →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {sortedEvents.length === 0 && (
              <div className="card text-center py-12">
                <p className="text-text-secondary">No timeline events found.</p>
              </div>
            )}
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  )
}
