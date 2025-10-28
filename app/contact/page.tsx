import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo'
import Navigation from '@/components/layouts/Navigation'
import Footer from '@/components/layouts/Footer'
import PageTransition from '@/components/animations/PageTransition'

export const metadata: Metadata = generatePageMetadata(
  'Contact',
  "Let's connect! Reach out to discuss product strategy, technology, or interesting collaborations.",
  '/contact'
)

/**
 * Contact Page
 *
 * Simple, elegant contact page with mailto link and social profiles
 */

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <PageTransition>
        <main id="main-content" className="pt-12 pb-24 sm:pt-16 sm:pb-32">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            {/* Page Header */}
            <div className="mb-16 text-center">
              <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-6">
                Let&apos;s Connect
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
                If you&apos;re experimenting, learning, or building something; or have feedback on
                one of my projects, I&apos;d love to hear from you. I&apos;ve learned so much from
                others sharing their process, and I&apos;m always up for trading notes.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Email */}
              <div className="card text-center">
                <div className="mb-4">
                  <svg
                    className="w-12 h-12 mx-auto text-accent-warm"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text mb-2">Email</h3>
                <a
                  href="mailto:mail@colinrodrigues.com?subject=Hello from your website"
                  className="text-accent-warm hover:underline inline-block"
                >
                  mail@colinrodrigues.com
                </a>
                <p className="italic text-text-secondary mt-1">
                  Best place to start a conversation.
                </p>
              </div>

              {/* LinkedIn */}
              <div className="card text-center">
                <div className="mb-4">
                  <svg
                    className="w-12 h-12 mx-auto text-accent-warm"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text mb-2">LinkedIn</h3>
                <a
                  href="https://www.linkedin.com/in/colinrodrigues/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-warm hover:underline inline-block"
                >
                  Connect on LinkedIn
                </a>
                <p className="italic text-text-secondary mt-1">Let’s connect and swap ideas.</p>
              </div>

              {/* GitHub */}
              <div className="card text-center">
                <div className="mb-4">
                  <svg
                    className="w-12 h-12 mx-auto text-accent-warm"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text mb-2">GitHub</h3>
                <a
                  href="https://github.com/colin-rod"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-warm hover:underline inline-block"
                >
                  View on GitHub
                </a>
                <p className="italic text-text-secondary mt-1">
                  See what I’ve been tinkering with.
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="card text-center bg-gradient-to-r from-accent-warm/10 to-accent-gold/10 border-accent-warm/20">
              <h2 className="text-2xl font-bold text-text mb-4">Ready to reach out?</h2>
              <p className="text-text-secondary mb-6 max-w-xl mx-auto">
                Email&apos;s the best way to get in touch — I usually reply within a day or two
              </p>
              <a
                href="mailto:mail@colinrodrigues.com?subject=Hello from your website"
                className="btn btn-primary inline-block"
              >
                Send me an email →
              </a>
            </div>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  )
}
