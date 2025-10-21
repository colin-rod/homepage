import { Metadata } from 'next'
import Link from 'next/link'
import { generatePageMetadata } from '@/lib/seo'
import { getProjects } from '@/lib/data'
import Navigation from '@/components/layouts/Navigation'
import Footer from '@/components/layouts/Footer'

export const metadata: Metadata = generatePageMetadata(
  'Projects',
  'Explore my portfolio of product, strategy, and technical projects. From concept to live implementations, see what I\'ve built and learned.',
  '/projects'
)

/**
 * Projects Index Page
 *
 * Displays all projects with filtering, status badges, and links to detail pages
 */

export default function ProjectsPage() {
  const projects = getProjects()
  const featuredProjects = projects.filter((p) => p.featured)
  const otherProjects = projects.filter((p) => !p.featured)

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
              A collection of work I&apos;ve built, from product strategy frameworks to
              technical implementations. Each project represents learning, experimentation, and
              solving real problems.
            </p>
          </div>

          {/* Featured Projects Section */}
          {featuredProjects.length > 0 && (
            <section className="mb-20">
              <h2 className="text-2xl font-bold text-text mb-8">Featured Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProjects.map((project) => (
                  <article
                    key={project.id}
                    className="card hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-primary">{project.title}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            project.status === 'active' || project.status === 'live'
                              ? 'bg-green-100 text-green-800'
                              : project.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : project.status === 'in-progress'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm">{project.summary}</p>
                    </div>

                    {/* Tech Stack Tags */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      {project.techStack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 rounded bg-neutral-surface border border-divider text-text-secondary"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="text-xs px-2 py-1 text-text-secondary">
                          +{project.techStack.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded bg-accent-warm/10 text-accent-warm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex gap-4 pt-4 border-t border-divider">
                      {project.links?.live && (
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-accent-warm hover:underline"
                        >
                          View Live →
                        </a>
                      )}
                      {project.links?.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-accent-warm hover:underline"
                        >
                          GitHub →
                        </a>
                      )}
                      <Link
                        href={`/projects/${project.slug}`}
                        className="text-sm text-accent-warm hover:underline ml-auto"
                      >
                        Learn more →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Other Projects Section */}
          {otherProjects.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-text mb-8">
                {featuredProjects.length > 0 ? 'Other Projects' : 'All Projects'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherProjects.map((project) => (
                  <article
                    key={project.id}
                    className="card hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-primary">{project.title}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            project.status === 'active' || project.status === 'live'
                              ? 'bg-green-100 text-green-800'
                              : project.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : project.status === 'in-progress'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm">{project.summary}</p>
                    </div>

                    {/* Tech Stack Tags */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      {project.techStack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 rounded bg-neutral-surface border border-divider text-text-secondary"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="text-xs px-2 py-1 text-text-secondary">
                          +{project.techStack.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded bg-accent-warm/10 text-accent-warm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex gap-4 pt-4 border-t border-divider">
                      {project.links?.live && (
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-accent-warm hover:underline"
                        >
                          View Live →
                        </a>
                      )}
                      {project.links?.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-accent-warm hover:underline"
                        >
                          GitHub →
                        </a>
                      )}
                      <Link
                        href={`/projects/${project.slug}`}
                        className="text-sm text-accent-warm hover:underline ml-auto"
                      >
                        Learn more →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
