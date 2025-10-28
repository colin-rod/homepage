'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Project } from '@/lib/types'
import { Star, Wrench, Code2, Rocket, Lightbulb, Archive } from 'lucide-react'
import CardHover from '@/components/animations/CardHover'

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
 * Streamlined card for displaying projects in horizontal swimlanes.
 * Shows project favicon/icon, title, description, tech stack, and link.
 */
export default function ProjectTile({ project }: ProjectTileProps) {
  const isToolProject = project.type === 'tool'

  return (
    <CardHover
      className={`
        group
        card
        flex-shrink-0
        w-72 sm:w-80
        h-80
        flex
        flex-col
        overflow-hidden
        hover:shadow-lg
        transition-shadow
        duration-200
        ${isToolProject ? 'border-2 border-accent-gold/30' : ''}
      `}
    >
      <article className="h-full flex flex-col">
        {/* Header: Icon/Favicon and Featured Badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-shrink-0">
            {project.favicon ? (
              <div className="relative w-8 h-8 rounded overflow-hidden">
                <Image
                  src={project.favicon}
                  alt={`${project.title} logo`}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
            ) : (
              getProjectIcon(project)
            )}
          </div>
          {project.featured && (
            <div className="flex items-center gap-1 text-xs text-accent-gold">
              <Star className="h-3 w-3 fill-current" />
              <span>Featured</span>
            </div>
          )}
          {isToolProject && !project.featured && (
            <div className="flex items-center gap-1 text-xs text-accent-gold">
              <Wrench className="h-3 w-3" />
              <span>Tool</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-primary mb-3 line-clamp-2">{project.title}</h3>

        {/* Description - Now the main content, more lines visible */}
        <p className="text-sm text-text mb-4 line-clamp-8 leading-relaxed">{project.description}</p>

        {/* Tech Stack */}
        {project.techStack.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {project.techStack.slice(0, 2).map((tech) => (
              <span
                key={tech}
                className="text-xs px-2 py-0.5 rounded bg-neutral-surface border border-divider text-text-secondary"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 2 && (
              <span className="text-xs px-2 py-0.5 text-text-secondary">
                +{project.techStack.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Spacer to push link to bottom */}
        <div className="flex-grow"></div>

        {/* Learn More Link - Always visible now for better space usage */}
        <div className="mt-auto pt-2">
          <Link
            href={`/projects/${project.slug}`}
            className="text-sm font-medium text-accent-warm hover:underline inline-flex items-center gap-1"
          >
            Learn more →
          </Link>
        </div>
      </article>
    </CardHover>
  )
}
