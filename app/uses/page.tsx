import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo'
import Navigation from '@/components/layouts/Navigation'
import Footer from '@/components/layouts/Footer'
import PageTransition from '@/components/animations/PageTransition'

export const metadata: Metadata = generatePageMetadata(
  'Uses',
  'Tools, software, and hardware that Colin Rodrigues uses for product management, development, and daily work. A detailed look at my tech stack and workflow.',
  '/uses'
)

/**
 * Uses Page
 *
 * Inspired by Wes Bos' /uses page (https://uses.tech/)
 * A detailed breakdown of tools, software, and hardware used daily
 */

export default function UsesPage() {
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
                What I Use
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed">
                Tools, software, and hardware that power my workflow. This is a living document of
                my current setup for product management, development, and daily work.
              </p>
            </div>

            {/* Development Tools */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-text mb-6">Development</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text mb-2">Editor & Terminal</h3>
                  <ul className="list-disc list-inside prose prose-lg max-w-none text-text-secondary space-y-2">
                    <li>[Your editor - e.g., VS Code, Cursor, etc.]</li>
                    <li>[Your terminal - e.g., iTerm2, Warp, etc.]</li>
                    <li>[Shell - e.g., zsh, fish, etc.]</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text mb-2">Languages & Frameworks</h3>
                  <ul className="list-disc list-inside prose prose-lg max-w-none text-text-secondary space-y-2">
                    <li>TypeScript / JavaScript</li>
                    <li>Next.js, React</li>
                    <li>Tailwind CSS</li>
                    <li>[Other languages/frameworks you use]</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Productivity & Project Management */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-text mb-6">
                Productivity & Project Management
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text mb-2">Core Tools</h3>
                  <ul className="list-disc list-inside prose prose-lg max-w-none text-text-secondary space-y-2">
                    <li>
                      <strong>Linear</strong> — Project management, issue tracking, and sprint
                      planning
                    </li>
                    <li>[Note-taking app - e.g., Notion, Obsidian, etc.]</li>
                    <li>[Calendar/scheduling tool]</li>
                    <li>[Communication tools - e.g., Slack, Discord, etc.]</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* AI & Automation */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-text mb-6">AI & Automation</h2>
              <ul className="list-disc list-inside prose prose-lg max-w-none text-text-secondary space-y-2">
                <li>
                  <strong>Claude (Anthropic)</strong> — AI pair programming, code review, and
                  architectural guidance
                </li>
                <li>
                  <strong>OpenAI (ChatGPT)</strong> — Content generation, brainstorming, and
                  ideation
                </li>
                <li>[Other AI tools you use]</li>
              </ul>
            </section>

            {/* Design Tools */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-text mb-6">Design</h2>
              <ul className="list-disc list-inside prose prose-lg max-w-none text-text-secondary space-y-2">
                <li>[Design tool - e.g., Figma, Sketch, etc.]</li>
                <li>[Prototyping tools]</li>
                <li>[Color/design utilities]</li>
              </ul>
            </section>

            {/* DevOps & Infrastructure */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-text mb-6">DevOps & Infrastructure</h2>
              <ul className="list-disc list-inside prose prose-lg max-w-none text-text-secondary space-y-2">
                <li>
                  <strong>GitHub</strong> — Version control, CI/CD, and code hosting
                </li>
                <li>
                  <strong>Vercel</strong> — Deployment and hosting
                </li>
                <li>
                  <strong>PostHog</strong> — Analytics and session replay
                </li>
                <li>
                  <strong>Sentry</strong> — Error monitoring and performance tracking
                </li>
                <li>[Other services you use]</li>
              </ul>
            </section>

            {/* Hardware */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-text mb-6">Hardware</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text mb-2">Computer & Peripherals</h3>
                  <ul className="list-disc list-inside prose prose-lg max-w-none text-text-secondary space-y-2">
                    <li>[Your computer - e.g., MacBook Pro M3, etc.]</li>
                    <li>[Monitor setup]</li>
                    <li>[Keyboard]</li>
                    <li>[Mouse/trackpad]</li>
                    <li>[Desk setup]</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text mb-2">Audio & Video</h3>
                  <ul className="list-disc list-inside prose prose-lg max-w-none text-text-secondary space-y-2">
                    <li>[Headphones]</li>
                    <li>[Microphone]</li>
                    <li>[Webcam]</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Other Tools */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-text mb-6">Other Tools</h2>
              <ul className="list-disc list-inside prose prose-lg max-w-none text-text-secondary space-y-2">
                <li>[Browser(s)]</li>
                <li>[Password manager]</li>
                <li>[Backup solution]</li>
                <li>[Any other tools worth mentioning]</li>
              </ul>
            </section>

            {/* Philosophy */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-text mb-6">Philosophy</h2>
              <div className="prose prose-lg max-w-none text-text-secondary">
                <p className="mb-4">
                  [Add your philosophy about tools - e.g., &quot;I believe in using the right tool
                  for the job, not the newest or most popular one. My setup focuses on...&quot; or
                  &quot;I optimize for deep work and minimal context switching...&quot;]
                </p>
                <p>
                  [Maybe mention how you evaluate new tools, what matters to you in a tool, or any
                  principles that guide your choices]
                </p>
              </div>
            </section>

            {/* Last Updated */}
            <section className="border-t border-divider pt-8">
              <p className="text-sm text-text-secondary italic">
                Last updated: <time dateTime="2025-10">{lastUpdated}</time>
              </p>
              <p className="text-sm text-text-secondary mt-2">
                Inspired by{' '}
                <a
                  href="https://uses.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-warm hover:underline"
                >
                  uses.tech
                </a>{' '}
                — a list of /uses pages by developers sharing their setups.
              </p>
            </section>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  )
}
