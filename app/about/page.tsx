import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo'
import Navigation from '@/components/layouts/Navigation'
import Footer from '@/components/layouts/Footer'
import PageTransition from '@/components/animations/PageTransition'

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
        <main className="py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            {/* Page Header */}
            <div className="mb-16">
              <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-6">
                About Me
              </h1>
            </div>

            {/* Background Section */}
            <section className="mb-16">
              <div className="prose prose-lg max-w-none text-text-secondary">
                <p className="mb-4">
                  Hi, I’m Colin; a builder, a dad, and someone who’s constantly curious about how
                  ideas turn into things that matter.
                  <br />
                  As a new father a lot shifted for me; not just how I spend my time but also what I
                  want that time to mean.
                  <br />
                  It’s changed the way I look at work and the products I build.
                  <br />
                  These days, I’m less focused on scale for its own sake and more on harmony;
                  finding ways to connect creativity, technology, and everyday life in a way that
                  feels balanced and meaningful.
                  <br />
                  This site is my way of bringing those threads together — a home to share what I’m
                  learning, experimenting with, and still figuring out.
                </p>
                <p className="mb-4">
                  Throughout my career, I&apos;ve focused on understanding user needs deeply,
                  translating them into product requirements, and working collaboratively with
                  cross-functional teams to deliver solutions that create meaningful impact.
                </p>
                <p>
                  I believe the best products are built at the intersection of user research,
                  strategic thinking, and technical execution. This philosophy guides my work in
                  product management, strategy, and digital innovation.
                </p>
              </div>
            </section>

            {/* Expertise Section */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-text mb-6">Areas of Expertise</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-primary mb-3">Product Strategy</h3>
                  <p className="text-text-secondary">
                    Developing product roadmaps, defining vision, and aligning stakeholders around
                    clear objectives that drive business value.
                  </p>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-primary mb-3">User Research</h3>
                  <p className="text-text-secondary">
                    Conducting user interviews, surveys, and usability testing to uncover insights
                    that inform product decisions.
                  </p>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-primary mb-3">Product Development</h3>
                  <p className="text-text-secondary">
                    Leading cross-functional teams through the full product lifecycle, from concept
                    to launch and iteration.
                  </p>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-primary mb-3">
                    Technical Implementation
                  </h3>
                  <p className="text-text-secondary">
                    Building with modern web technologies (React, Next.js, TypeScript) to create
                    responsive, user-friendly interfaces.
                  </p>
                </div>
              </div>
            </section>

            {/* Values Section */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-text mb-6">What Drives Me</h2>
              <div className="prose prose-lg max-w-none text-text-secondary">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-accent-warm mr-2">•</span>
                    <span>
                      <strong>User-Centered Thinking:</strong> Every decision should start with
                      understanding the people we&apos;re building for and the problems they face.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-warm mr-2">•</span>
                    <span>
                      <strong>Strategic Execution:</strong> Great strategy means nothing without
                      excellent execution. I focus on both.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-warm mr-2">•</span>
                    <span>
                      <strong>Continuous Learning:</strong> Technology and user expectations evolve
                      constantly. Staying curious and adaptable is essential.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-warm mr-2">•</span>
                    <span>
                      <strong>Collaborative Impact:</strong> The best products are built by diverse
                      teams working together toward a shared vision.
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA Section */}
            <section className="border-t border-divider pt-12">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-text mb-4">Let&apos;s Connect</h2>
                <p className="text-lg text-text-secondary mb-8">
                  Interested in working together or just want to chat about product strategy?
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
