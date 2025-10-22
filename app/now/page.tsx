import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo'
import Navigation from '@/components/layouts/Navigation'
import Footer from '@/components/layouts/Footer'
import PageTransition from '@/components/animations/PageTransition'

export const metadata: Metadata = generatePageMetadata(
  'Now',
  'What Colin Rodrigues is currently working on, learning, and exploring. Updated regularly to reflect current focus areas and interests.',
  '/now'
)

/**
 * Now Page
 *
 * Inspired by Derek Sivers' /now page movement (https://nownownow.com/about)
 * A snapshot of current focus, projects, and interests - updated regularly
 */

export default function NowPage() {
  const lastUpdated = 'October 2025'

  return (
    <>
      <Navigation />
      <PageTransition>
        <main className="py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            {/* Page Header */}
            <div className="mb-16">
              <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-6">
                What I&apos;m Doing Now
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed">
                A snapshot of what I&apos;m building, learning, and exploring right now; both in
                work and life. I update this page regularly to reflect what&apos;s keeping me
                curious, what I&apos;m experimenting with, and where my focus is shifting.
              </p>
            </div>

            {/* Current Work/Projects Section */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-text mb-6">Current Focus</h2>
              <ul className="list-disc list-inside prose prose-lg max-w-none text-text-secondary space-y-4">
                <li>
                  Designing and shipping this portfolio using Next.js 15, TypeScript, and Tailwind
                  CSS.
                </li>
                <li>
                  Working in Linear to scope and manage projects, applying project management
                  principles to timebox work, manage estimates, and reduce scope creep during “vibe
                  engineering.”
                </li>
                <li>
                  Implementing Test-Driven Development (TDD) methodologies to build things correctly
                  from the start.
                </li>
                <li>
                  Exploring how AI can enhance product strategy and user experience without removing
                  the human element.
                </li>
                <li>
                  Balancing structure and creativity to maintain discipline while following
                  curiosity.
                </li>
              </ul>
            </section>

            {/* Reading/Interests Section */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-text mb-6">Reading & Exploring</h2>
              <div className="prose prose-lg max-w-none text-text-secondary">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-accent-warm mr-2">•</span>
                    <span>
                      Reading about product discovery frameworks and how to validate ideas before
                      building
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-warm mr-2">•</span>
                    <span>
                      Exploring modern web performance optimization techniques and Core Web Vitals
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-warm mr-2">•</span>
                    <span>
                      Learning about accessibility best practices and inclusive design principles
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-warm mr-2">•</span>
                    <span>
                      Studying effective data visualization and storytelling with analytics
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Side Projects Section */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-text mb-6">Building</h2>
              <div className="prose prose-lg max-w-none text-text-secondary">
                <p className="mb-4">
                  Beyond this portfolio, I&apos;m working on a few side projects that combine my
                  interests in product, technology, and solving everyday problems:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-accent-warm mr-2">•</span>
                    <span>
                      A tool for product managers to track and visualize feature adoption metrics
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-warm mr-2">•</span>
                    <span>
                      Experimenting with interactive timeline visualizations for career stories
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-warm mr-2">•</span>
                    <span>
                      Audiograph — a visual way to explore Spotify listening history and patterns
                      over time.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-warm mr-2">•</span>
                    <span>
                      Career Timeline — rethinking how CVs can show both personal and professional
                      growth as evolving narratives.
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Last Updated */}
            <section className="border-t border-divider pt-8">
              <p className="text-sm text-text-secondary italic">
                Last updated: <time dateTime="2025-10">{lastUpdated}</time>
              </p>
              <p className="text-sm text-text-secondary mt-2">
                This page is inspired by{' '}
                <a
                  href="https://nownownow.com/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-warm hover:underline"
                >
                  Derek Sivers&apos; /now page movement
                </a>
                .
              </p>
            </section>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  )
}
