import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo'
import Navigation from '@/components/layouts/Navigation'
import Footer from '@/components/layouts/Footer'

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
      <main className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-6">
              About Me
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              Product & Strategy professional passionate about building meaningful solutions that
              solve real problems and create lasting impact.
            </p>
          </div>

          {/* Background Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-text mb-6">Background</h2>
            <div className="prose prose-lg max-w-none text-text-secondary">
              <p className="mb-4">
                I&apos;m a product and strategy professional with a track record of building and scaling
                digital products that solve real user problems. My approach combines strategic
                thinking with hands-on execution, bridging the gap between business objectives and
                technical implementation.
              </p>
              <p className="mb-4">
                Throughout my career, I&apos;ve focused on understanding user needs deeply, translating
                them into product requirements, and working collaboratively with cross-functional
                teams to deliver solutions that create meaningful impact.
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
                  Leading cross-functional teams through the full product lifecycle, from concept to
                  launch and iteration.
                </p>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-primary mb-3">Technical Implementation</h3>
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
      <Footer />
    </>
  )
}
