import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo'
import { getProjectsBySwimLane, getCompletedTools, getPlannedTools } from '@/lib/data'
import Navigation from '@/components/layouts/Navigation'
import Footer from '@/components/layouts/Footer'
import PageTransition from '@/components/animations/PageTransition'
import Swimlane from '@/components/features/Swimlane'
import { Code2, Rocket, Lightbulb, Archive, Wrench, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = generatePageMetadata(
  'Projects',
  "Explore my portfolio of product, strategy, and technical projects. From concept to live implementations, see what I've built and learned.",
  '/projects'
)

/**
 * Projects Index Page
 *
 * Displays all projects in horizontal scrollable swimlanes organized by status:
 *
 * Projects Section:
 * - In Progress: Active projects under development
 * - Shipped: Live and completed projects
 * - Planned: Concept and planned projects
 * - Retired: Sunset or archived projects
 *
 * Tools Section:
 * - Completed: Live and completed tools
 * - Planned: Concept and planned tools
 */

export default function ProjectsPage() {
  const inProgressProjects = getProjectsBySwimLane('in-progress')
  const shippedProjects = getProjectsBySwimLane('shipped')
  const plannedProjects = getProjectsBySwimLane('planned')
  const retiredProjects = getProjectsBySwimLane('retired')
  const completedTools = getCompletedTools()
  const plannedTools = getPlannedTools()

  return (
    <>
      <Navigation />
      <PageTransition>
        <main id="main-content" className="py-24 sm:py-32 pb-24 sm:pb-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* Page Header */}
            <div className="mx-auto max-w-2xl text-center mb-10">
              <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-3">
                Projects & Tools
              </h1>
              <p className="text-base text-text-secondary leading-relaxed">
                A collection of things I&apos;m working on, built, launched, or investigated.
              </p>
            </div>

            {/* PROJECTS SECTION */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold tracking-tight text-primary mb-8">Projects</h2>
            {/* In Progress Swimlane */}
            <Swimlane
              title="In Progress"
              icon={<Code2 className="h-5 w-5 text-accent-warm" />}
              projects={inProgressProjects}
              description="Projects currently under active development"
              index={0}
            />

              {/* In Progress Swimlane */}
              <Swimlane
                title="In Progress"
                icon={<Code2 className="h-5 w-5 text-accent-warm" />}
                projects={inProgressProjects}
                description="Projects currently under active development"
                index={0}
              />

              {/* Visual Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-divider to-transparent my-8" />

              {/* Shipped Swimlane */}
              <Swimlane
                title="Shipped"
                icon={<Rocket className="h-5 w-5 text-semantic-success" />}
                projects={shippedProjects}
                description="Live and completed projects ready for the world"
                index={1}
              />

              {/* Visual Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-divider to-transparent my-8" />

              {/* Planned Swimlane */}
              <Swimlane
                title="Planned"
                icon={<Lightbulb className="h-5 w-5 text-accent-gold" />}
                projects={plannedProjects}
                description="Concepts and ideas being explored and validated"
                index={2}
              />

              {/* Retired Swimlane */}
              {retiredProjects.length > 0 && (
                <>
                  {/* Visual Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-divider to-transparent my-8" />
                  <Swimlane
                    title="Retired"
                    icon={<Archive className="h-5 w-5 text-text-secondary" />}
                    projects={retiredProjects}
                    description="Projects that have been sunset or archived, with lessons learned"
                    index={3}
                  />
                </>
              )}
            </div>

            {/* TOOLS SECTION */}
            {(completedTools.length > 0 || plannedTools.length > 0) && (
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-primary mb-8">Tools</h2>

                {/* Completed Tools Swimlane */}
                {completedTools.length > 0 && (
                  <Swimlane
                    title="Completed"
                    icon={<CheckCircle2 className="h-5 w-5 text-semantic-success" />}
                    projects={completedTools}
                    description="Live tools ready to use and solve specific problems"
                    index={4}
                  />
                )}

                {/* Visual Divider */}
                {completedTools.length > 0 && plannedTools.length > 0 && (
                  <div className="h-px bg-gradient-to-r from-transparent via-divider to-transparent my-8" />
                )}

                {/* Planned Tools Swimlane */}
                {plannedTools.length > 0 && (
                  <Swimlane
                    title="Planned"
                    icon={<Wrench className="h-5 w-5 text-accent-gold" />}
                    projects={plannedTools}
                    description="Tools being designed and planned for future development"
                    index={5}
                  />
                )}
              </div>
            )}
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  )
}
