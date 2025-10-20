import Link from 'next/link'

/**
 * Hero Section Component
 *
 * Main landing section with:
 * - Name and tagline
 * - Brief introduction
 * - Call-to-action buttons
 * - Gradient background from design system
 */

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center gradient-hero text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          {/* Main Heading */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            Colin Rodrigues
          </h1>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl font-medium text-neutral-surface mb-8">
            Product & Strategy
          </p>

          {/* Introduction */}
          <p className="text-lg sm:text-xl text-neutral-surface/90 mb-10 leading-relaxed">
            Building products that solve real problems. Passionate about strategy, user experience,
            and creating meaningful impact through technology.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-x-6">
            <Link
              href="/projects"
              className="btn btn-primary"
            >
              View Projects
            </Link>
            <Link
              href="/contact"
              className="btn btn-outline border-white text-white hover:bg-white hover:text-primary"
            >
              Contact Me
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-bg/20 pointer-events-none" />
    </section>
  )
}
