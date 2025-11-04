import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo'
import Navigation from '@/components/layouts/Navigation'
import Footer from '@/components/layouts/Footer'
import PageTransition from '@/components/animations/PageTransition'
import GitHubChart from '@/components/features/GitHubChart'

export const metadata: Metadata = generatePageMetadata(
  'About',
  'Learn more about Colin Rodrigues - Product & Strategy professional with expertise in building meaningful solutions through technology.',
  '/about'
)

/**
 * About Page
 *
 * Professional background, expertise, and personal introduction
 */

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <PageTransition>
        <main id="main-content" className="pt-12 pb-24 sm:pt-16 sm:pb-32">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            {/* Page Header */}
            <div className="mb-16">
              <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-6">
                About Me
              </h1>
            </div>

            {/* Background Section */}
            <section className="mb-16">
              <div className="prose prose-lg max-w-none text-text-secondary space-y-6">
                <p>
                  Hi, I&apos;m Colin. I&apos;m a builder, a father, and someone who&apos;s
                  constantly curious about how ideas turn into things that matter.
                </p>
                <p>
                  Fatherhood changed a lot for me: It&apos;s ceratinly changed how I spend my time,
                  and it&apos;s changed how I think about work and what I create (spoiler alert:
                  lately it&apos;s mostly just a lot of tech thats meant to solve my own problems).
                  This site is my way of showcasing how my creativity, experience and everyday life
                  intersect. A home for what I&apos;m learning, experimenting with, and still
                  figuring out.
                </p>
                <h2 className="text-2xl font-bold text-text mb-4">Building Through Curiosity</h2>
                <p>
                  I started my career in engineering, and lately, I&apos;ve found myself drawn back
                  to it. I&apos;m rediscovering the creative and problem-solving itch that first got
                  me into building. Tools like{' '}
                  <a href="https://claude.ai" target="_blank" rel="noopener noreferrer">
                    Claude Code
                  </a>
                  , and{' '}
                  <a
                    href="https://openai.com/blog/openai-codex"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Codex
                  </a>{' '}
                  have changed the velocity of creation, letting me translate half-formed thoughts
                  into experiments and projects at a pace that feels exciting. It&apos;s what Simon
                  Willison calls{' '}
                  <a
                    href="https://simonwillison.net/2025/Oct/7/vibe-engineering/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    “vibe engineering”
                  </a>{' '}
                  and perfectly captures the spirit behind what I&apos;m trying to do here.
                </p>
                <h2 className="text-2xl font-bold text-text mb-4">Why I&apos;m Sharing</h2>
                <p>
                  Most of what I build starts as a personal problem; something small and specific I
                  want to solve. Some stay that way and others evolve into larger projects. I use
                  this space to document that process; to chart the path from idea to experiment to
                  something more tangible, and to share it openly so others can learn from it too.
                </p>
                <p>
                  I&apos;ve learned so much from the generosity of others who shared their code,
                  notes, and reflections online. This site is my way of paying that forward; a small
                  corner of the internet where I can contribute back to the same community
                  that&apos;s taught me so much.
                </p>
              </div>
            </section>

            {/* Recent Activity Section */}

            <GitHubChart username="colin-rod" color="D3643E" />

            {/* CTA Section */}
            <section className="border-t border-divider pt-12">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-text mb-4">Let&apos;s Connect</h2>
                <p className="text-lg text-text-secondary mb-8">
                  If something here resonates
                  <br /> Whether you&apos;re a builder, a parent
                  <br /> or just figuring things out along the way
                  <br /> I&apos;d love to connect.
                </p>
                <a href="/contact" className="btn btn-primary">
                  Get in Touch
                </a>
              </div>
            </section>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  )
}
