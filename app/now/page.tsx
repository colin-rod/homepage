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
                A snapshot of what I&apos;m building, learning, and exploring right now.
              </p>
            </div>

            {/* Current Work/Projects Section */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-text mb-6">Current Focus</h2>
              <ul className="list-disc list-inside prose prose-lg max-w-none text-text-secondary space-y-4">
                <li>
                  Designing and shipping this site using Next.js 15, TypeScript, and Tailwind CSS. I
                  want to work on my frontend skills and experiment a bit more on the ux.
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
                <li>Audiograph - Designing a way to visualise and explore Spotify data.</li>
                <li>
                  TribeUpdate - Building a slow social media tool to help people share and consume
                  content more thoughtfully.
                </li>
              </ul>
            </section>

            {/* Workflow Section */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-text mb-6">How I Work</h2>
              <div className="prose prose-lg max-w-none text-text-secondary">
                <p className="mb-4">
                  My current workflow is as follows: I manage a backlog of ideas in Linear. I've
                  accumulated these over time when inspiration strikes me or when I think "Hey
                  wouldn't it be cool if X did Y" or "I wonder if this exists" Typically these files
                  have been living in various spreadsheets, docs and notes files across multiple
                  platforms and I am consolidatingn them in Linear. I then categorize them into 1 of
                  Project, Project Expansion, Tool or Experiment. From there I prioritize them based
                  on a mix of impact, effort, and personal interest. Each week, I select a few items
                  from the backlog to focus on and dive deeper into scoping them out. I conduct some
                  high level research to validate the idea, understand the problem space, and
                  identify current solutions. Typically I will turn to ChatGPT as a resource here to
                  act as asparring aprtner. As part of this scoping I will generate a PRD (Product
                  Requirements Document) to outline the problem, target audience, goals, and success
                  metrics. If the idea is monetizable I will also do a quick market analysis to
                  understand the business model and tradeoffs Once I have a solid understanding, I
                  then move into creating a project plan in Linear. I start by breaking down the
                  project into Epics and Issues. At this stage I try to group the epics into
                  milestones and identify critical dependencies. I like Linear's ability to
                  visualise blocking and blocked issues as it helps me manage the flow of work. I
                  also use Fibonnacie story points to estimate effort and complexity at the issue
                  level. This helps me prioritize and plan sprints and cycles more effectively. I
                  start. with Codex for architectural decisions since I find it better at high level
                  design and thinking through tradeoffs. Once I have a solid architecture planned
                  out, I then move into development, following Test-Driven Development (TDD)
                  principles. I write tests first to define the expected behavior and outcomes. This
                  approach helps me clarify requirements, catch edge cases early, and ensure code
                  quality. Typically I like to use Codex at this stage to scope out the test
                  reuirements and ensure completeness. At this stage I switch to Claude Code as my
                  AI pair programmer to help with code generation and refactoring. Throughout
                  development, I continuously integrate and deploy changes using GitHub Actions.
                  This allows me to review and give feedback quickly and iterate on the product. I
                  also make use of automated testing tools such as Jest and Playwright to automate
                  the testing process.
                </p>
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
