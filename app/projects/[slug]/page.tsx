import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProjects, getProjectBySlug } from '@/lib/data'
import { generatePageMetadata } from '@/lib/seo'
import Navigation from '@/components/layouts/Navigation'
import Footer from '@/components/layouts/Footer'

interface ProjectPageProps {
  params: {
    slug: string
  }
}

/**
 * Generate metadata for project detail pages
 */
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = getProjectBySlug(params.slug)

  if (!project) {
    return generatePageMetadata('Project Not Found', 'The requested project could not be found.', '/projects')
  }

  return generatePageMetadata(
    project.title,
    project.summary,
    `/projects/${project.slug}`
  )
}

/**
 * Generate static params for all projects (SSG)
 */
export async function generateStaticParams() {
  const projects = getProjects()

  return projects.map((project) => ({
    slug: project.slug,
  }))
}

/**
 * Project Detail Page
 *
 * Displays complete information about a specific project
 */
export default function ProjectDetailPage({ params }: ProjectPageProps) {
  const project = getProjectBySlug(params.slug)

  if (!project) {
    notFound()
  }

  return (
    <>
      <Navigation />
      <main className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/projects"
            className="inline-flex items-center text-sm text-accent-warm hover:underline mb-8"
          >
            ← Back to Projects
          </Link>

          {/* Project Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                {project.title}
              </h1>
              <span
                className={`text-sm px-3 py-1 rounded-full ${
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
            <p className="text-xl text-text-secondary leading-relaxed">{project.summary}</p>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Year */}
            <div className="card">
              <h3 className="text-sm font-semibold text-text-secondary uppercase mb-2">Year</h3>
              <p className="text-lg text-text">{project.year}</p>
            </div>

            {/* Status */}
            <div className="card">
              <h3 className="text-sm font-semibold text-text-secondary uppercase mb-2">Status</h3>
              <p className="text-lg text-text capitalize">{project.status}</p>
            </div>

            {/* Category Tags */}
            <div className="card">
              <h3 className="text-sm font-semibold text-text-secondary uppercase mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded bg-accent-warm/10 text-accent-warm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-text mb-6">About This Project</h2>
            <div className="prose prose-lg max-w-none text-text-secondary">
              <p>{project.description}</p>
            </div>
          </section>

          {/* Tech Stack */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-text mb-6">Tech Stack</h2>
            <div className="flex flex-wrap gap-3">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-lg bg-neutral-surface border border-divider text-text"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* Why Built Section */}
          {project.whyBuilt && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-text mb-6">Why I Built This</h2>
              <div className="prose prose-lg max-w-none text-text-secondary">
                <p>{project.whyBuilt}</p>
              </div>
            </section>
          )}

          {/* Learnings Section */}
          {project.learnings && project.learnings.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-text mb-6">Key Learnings</h2>
              <ul className="space-y-3">
                {project.learnings.map((learning, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-accent-warm mr-3">•</span>
                    <span className="text-text-secondary">{learning}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Scope Section */}
          {project.scope && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-text mb-6">Scope</h2>
              <div className="prose prose-lg max-w-none text-text-secondary">
                <p>{project.scope}</p>
              </div>
            </section>
          )}

          {/* Business Model Section */}
          {project.businessModel && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-text mb-6">Business Model</h2>
              <div className="prose prose-lg max-w-none text-text-secondary">
                <p>{project.businessModel}</p>
              </div>
            </section>
          )}

          {/* Links Section */}
          {(project.links?.live || project.links?.github || project.links?.blog) && (
            <section className="border-t border-divider pt-12">
              <h2 className="text-2xl font-bold text-text mb-6">Project Links</h2>
              <div className="flex flex-wrap gap-4">
                {project.links.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    View Live Site →
                  </a>
                )}
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    View on GitHub →
                  </a>
                )}
                {project.links.blog && (
                  <a
                    href={project.links.blog}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    Read Blog Post →
                  </a>
                )}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
