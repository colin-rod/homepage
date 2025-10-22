'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { buttonHoverVariants } from '@/components/animations/variants'

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
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center gradient-hero text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          {/* Main Heading */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">Colin Rodrigues</h1>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl font-medium text-neutral-surface mb-8">
            Building, Reflecting & Sharing - a Work in{' '}
            <span className="text-accent-gold font-bold">Progress</span>
          </p>

          {/* Introduction */}
          <p className="text-lg sm:text-xl text-neutral-surface/90 mb-10 leading-relaxed">
            This site is part portfolio, part journal.
            <br />
            A place for me to think out loud about
            <br />
            what I&apos;m building,
            <br />
            what I&apos;m learning,
            <br />
            and what I&apos;m still figuring out.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-x-6">
            {shouldReduceMotion ? (
              <>
                <Link href="/projects" className="btn btn-primary">
                  Explore My Work
                </Link>
                <Link
                  href="/contact"
                  className="btn btn-outline border-white text-white hover:bg-white hover:text-primary"
                >
                  Connect
                </Link>
              </>
            ) : (
              <>
                <motion.div
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonHoverVariants}
                >
                  <Link href="/projects" className="btn btn-primary">
                    Explore My Work
                  </Link>
                </motion.div>
                <motion.div
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonHoverVariants}
                >
                  <Link
                    href="/contact"
                    className="btn btn-outline border-white text-white hover:bg-white hover:text-primary"
                  >
                    Connect
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-bg/20 pointer-events-none" />
    </section>
  )
}
