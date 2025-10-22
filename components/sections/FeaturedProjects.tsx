import Link from 'next/link'
import { getFeaturedProjects } from '@/lib/data'

/**
 * Featured Projects Section Component
 *
 * Displays a curated selection of featured projects with:
 * - Project cards with title, summary, and tags
 * - Links to project detail pages
 * - "View All Projects" CTA
 */

export default function FeaturedProjects() {
  const featuredProjects = getFeaturedProjects()

  return (
    <section className="py-24 sm:py-32 bg-neutral-bg">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Recent Projects
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Explore some of my recent work in building projects, tools or experiments.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <article key={project.id} className="card flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-x-4 text-xs mb-4">
                  <time dateTime={project.year.toString()} className="text-text-secondary">
                    {project.year}
                  </time>
                  <span
                    className={`badge ${
                      project.status === 'active'
                        ? 'badge-success'
                        : project.status === 'completed'
                          ? 'badge-primary'
                          : 'badge-accent'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <div className="group relative">
                  <h3 className="text-xl font-semibold text-text mb-3">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="hover:text-accent-warm transition-colors"
                    >
                      <span className="absolute inset-0" />
                      {project.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-text-secondary line-clamp-3 mb-4">{project.summary}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span key={tag} className="badge badge-primary">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Tech Stack */}
                <div className="text-xs text-text-secondary">
                  <span className="font-medium">Tech:</span> {project.techStack.join(', ')}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-16 flex justify-center">
          <Link href="/projects" className="btn btn-primary">
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  )
}
