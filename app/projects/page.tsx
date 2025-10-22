import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo'
import { getProjectsBySwimLane, getTools } from '@/lib/data'
import Navigation from '@/components/layouts/Navigation'
import Footer from '@/components/layouts/Footer'
import Swimlane from '@/components/features/Swimlane'
import { Code2, Rocket, Lightbulb, Archive, Wrench } from 'lucide-react'

export const metadata: Metadata = generatePageMetadata(
  'Projects',
  "Explore my portfolio of product, strategy, and technical projects. From concept to live implementations, see what I've built and learned.",
  '/projects'
)

/**
 * Projects Index Page
 *
 * Displays all projects in horizontal scrollable swimlanes organized by status:
 * - In Progress: Active projects under development
 * - Shipped: Live and completed projects
 * - Planned: Concept and planned projects
 * - Retired: Sunset or archived projects
 * - Tools: Small utilities and tools (all statuses)
 */

export default function ProjectsPage() {
  const inProgressProjects = getProjectsBySwimLane('in-progress')
  const shippedProjects = getProjectsBySwimLane('shipped')
  const plannedProjects = getProjectsBySwimLane('planned')
  const retiredProjects = getProjectsBySwimLane('retired')
  const tools = getTools()

  return (
    <>
      <Navigation />
      <main className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Page Header */}
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-6">
              Projects
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              A collection of things I&apos;m working on, built, launched, or investigated. Each one
              started with a question or problem I wanted to understand better. I use this space to
              document the process, what I learned, and what I&apos;d do differently next time.
            </p>
          </div>

          {/* In Progress Swimlane */}
          <Swimlane
            title="In Progress"
            icon={<Code2 className="h-6 w-6 text-accent-warm" />}
            projects={inProgressProjects}
            description="Projects currently under active development"
          />

          {/* Shipped Swimlane */}
          <Swimlane
            title="Shipped"
            icon={<Rocket className="h-6 w-6 text-semantic-success" />}
            projects={shippedProjects}
            description="Live and completed projects ready for the world"
          />

          {/* Planned Swimlane */}
          <Swimlane
            title="Planned"
            icon={<Lightbulb className="h-6 w-6 text-accent-gold" />}
            projects={plannedProjects}
            description="Concepts and ideas being explored and validated"
          />

          {/* Retired Swimlane */}
          {retiredProjects.length > 0 && (
            <Swimlane
              title="Retired"
              icon={<Archive className="h-6 w-6 text-text-secondary" />}
              projects={retiredProjects}
              description="Projects that have been sunset or archived, with lessons learned"
            />
          )}

          {/* Tools & Utilities Swimlane */}
          {tools.length > 0 && (
            <Swimlane
              title="Tools & Utilities"
              icon={<Wrench className="h-6 w-6 text-accent-gold" />}
              projects={tools}
              description="Smaller utilities and scripts built to solve specific problems"
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
