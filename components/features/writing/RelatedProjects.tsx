/**
 * RelatedProjects Component
 * Displays projects related to a blog post
 */

import Link from 'next/link'
import Image from 'next/image'
import { Project } from '@/lib/types'
import { Rocket, Code2, Lightbulb, Archive, Wrench } from 'lucide-react'

interface RelatedProjectsProps {
  projects: Project[]
}

/**
 * Get icon based on project status or type
 */
function getProjectIcon(project: Project) {
  if (project.type === 'tool') {
    return <Wrench className="h-5 w-5 text-accent-gold" />
  }

  switch (project.status) {
    case 'in-progress':
    case 'active':
      return <Code2 className="h-5 w-5 text-accent-warm" />
    case 'live':
    case 'completed':
      return <Rocket className="h-5 w-5 text-semantic-success" />
    case 'planned':
    case 'concept':
      return <Lightbulb className="h-5 w-5 text-accent-gold" />
    case 'retired':
    case 'sunset':
      return <Archive className="h-5 w-5 text-text-secondary" />
    default:
      return <Code2 className="h-5 w-5 text-text-secondary" />
  }
}

/**
 * Format status to readable label
 */
function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'in-progress': 'In Progress',
    active: 'Active',
    live: 'Live',
    completed: 'Completed',
    planned: 'Planned',
    concept: 'Concept',
    retired: 'Retired',
    sunset: 'Sunset',
  }
  return statusMap[status] || status
}

export default function RelatedProjects({ projects }: RelatedProjectsProps) {
  if (projects.length === 0) {
    return null
  }

  return (
    <section className="mt-16 pt-12 border-t border-divider">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-3">Related Projects</h2>
        <p className="text-secondary text-lg">Projects featured in this article</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <article key={project.id} className="card hover:shadow-glow transition-shadow group">
            <Link href={`/projects/${project.slug}`} className="block">
              {/* Header with icon/favicon */}
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0">
                  {project.favicon ? (
                    <div className="relative w-10 h-10 rounded overflow-hidden">
                      <Image
                        src={project.favicon}
                        alt={`${project.title} logo`}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center rounded bg-neutral-surface border border-divider">
                      {getProjectIcon(project)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-accent-warm transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-neutral-surface border border-divider text-text-secondary">
                      {formatStatus(project.status)}
                    </span>
                    {project.type === 'tool' && (
                      <span className="text-xs px-2 py-0.5 rounded bg-accent-gold/10 border border-accent-gold/30 text-accent-gold">
                        Tool
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-text-secondary mb-4 leading-relaxed line-clamp-3">
                {project.description}
              </p>

              {/* Tech Stack */}
              {project.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.techStack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-0.5 rounded bg-neutral-surface border border-divider text-text-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="text-xs text-text-secondary self-center">
                      +{project.techStack.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
