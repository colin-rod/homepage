import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo'
import Navigation from '@/components/layouts/Navigation'
import Footer from '@/components/layouts/Footer'

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
      <main className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-6">
              What I&apos;m Doing Now
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              A snapshot of my current focus, projects, and interests. This page is updated
              regularly to reflect what I&apos;m working on and learning right now.
            </p>
          </div>

          {/* Current Work/Projects Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-text mb-6">Current Focus</h2>
            <div className="prose prose-lg max-w-none text-text-secondary">
              <p className="mb-4">
                Right now, I&apos;m focused on building this personal portfolio to showcase my
                professional journey and projects. I&apos;m applying modern web development best
                practices using Next.js 14, TypeScript, and Tailwind CSS - while documenting the
                entire process.
              </p>
              <p>
                I&apos;m also working on several product strategy initiatives, exploring how AI can
                enhance user experiences without replacing the human element that makes products
                meaningful.
              </p>
            </div>
          </section>

          {/* Learning Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-text mb-6">Currently Learning</h2>
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-primary mb-3">
                  Advanced TypeScript Patterns
                </h3>
                <p className="text-text-secondary">
                  Deepening my understanding of TypeScript&apos;s type system, generics, and
                  advanced patterns to write more maintainable and type-safe code.
                </p>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-primary mb-3">
                  Test-Driven Development
                </h3>
                <p className="text-text-secondary">
                  Embracing TDD methodology with Jest and Playwright to build more reliable
                  applications and catch bugs before they reach production.
                </p>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-primary mb-3">AI Product Strategy</h3>
                <p className="text-text-secondary">
                  Exploring how to integrate AI capabilities thoughtfully into product experiences,
                  focusing on practical applications that solve real user problems.
                </p>
              </div>
            </div>
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
      <Footer />
    </>
  )
}
