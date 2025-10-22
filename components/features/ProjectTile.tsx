import Link from 'next/link'
import { Project } from '@/lib/types'
import { Star, Wrench, Code2, Rocket, Lightbulb, Archive } from 'lucide-react'

interface ProjectTileProps {
  project: Project
}

/**
 * Get icon based on project status or type
 */
function getProjectIcon(project: Project) {
  if (project.type === 'tool') {
    return <Wrench className="h-6 w-6 text-accent-gold" />
  }

  switch (project.status) {
    case 'in-progress':
    case 'active':
      return <Code2 className="h-6 w-6 text-accent-warm" />
    case 'live':
    case 'completed':
      return <Rocket className="h-6 w-6 text-semantic-success" />
    case 'planned':
    case 'concept':
      return <Lightbulb className="h-6 w-6 text-accent-gold" />
    case 'retired':
    case 'sunset':
      return <Archive className="h-6 w-6 text-text-secondary" />
    default:
      return <Code2 className="h-6 w-6 text-text-secondary" />
  }
}

/**
 * ProjectTile Component
 *
 * Compact, fixed-height card for displaying projects in horizontal swimlanes.
 * Shows project icon, title, summary, tags, insight line, and link.
 */
export default function ProjectTile({ project }: ProjectTileProps) {
  const isToolProject = project.type === 'tool'

  return (
    <article
      className={`
        card
        flex-shrink-0
        w-72
        h-48
        flex
        flex-col
        overflow-hidden
        hover:-translate-y-1
        transition-transform
        duration-200
        ${isToolProject ? 'border-2 border-accent-gold/30' : ''}
      `}
    >
      {/* Header: Icon and Featured Badge */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-shrink-0">{getProjectIcon(project)}</div>
        {project.featured && (
          <div className="flex items-center gap-1 text-xs text-accent-gold">
            <Star className="h-3 w-3 fill-current" />
            <span>Featured</span>
          </div>
        )}
        {isToolProject && (
          <div className="flex items-center gap-1 text-xs text-accent-gold">
            <Wrench className="h-3 w-3" />
            <span>Tool</span>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-primary mb-2 line-clamp-1">{project.title}</h3>

      {/* Summary */}
      <p className="text-sm text-text-secondary mb-3 line-clamp-2">{project.summary}</p>

      {/* Tech Stack Tags and Category Tags */}
      <div className="mb-2">
        {/* Tech Stack */}
        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1">
            {project.techStack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-xs px-2 py-0.5 rounded bg-neutral-surface border border-divider text-text-secondary"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="text-xs px-2 py-0.5 text-text-secondary">
                +{project.techStack.length - 3}
              </span>
            )}
          </div>
        )}
        {/* Category Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded bg-accent-warm/10 text-accent-warm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Insight Line */}
      {project.insight && (
        <p className="text-xs italic text-text-secondary mb-3 line-clamp-1">{project.insight}</p>
      )}

      {/* Spacer to push link to bottom */}
      <div className="flex-grow"></div>

      {/* Learn More Link */}
      <div className="mt-auto pt-2 border-t border-divider">
        <Link
          href={`/projects/${project.slug}`}
          className="text-sm text-accent-warm hover:underline"
        >
          Learn more →
        </Link>
      </div>
    </article>
  )
}
