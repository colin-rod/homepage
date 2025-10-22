import { ReactNode } from 'react'
import { Project } from '@/lib/types'
import ProjectTile from './ProjectTile'

interface SwimlaneProps {
  title: string
  icon: ReactNode
  projects: Project[]
  description?: string
}

/**
 * Swimlane Component
 *
 * Horizontal scrolling container for project tiles.
 * Features:
 * - Section header with icon and title
 * - Horizontal scroll with snap points
 * - Empty state handling
 * - Responsive design (stacks on mobile, scrolls horizontally)
 */
export default function Swimlane({ title, icon, projects, description }: SwimlaneProps) {
  return (
    <section className="mb-16" role="region" aria-label={`${title} projects`}>
      {/* Swimlane Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          {icon}
          <h2 className="text-2xl font-bold text-text">{title}</h2>
        </div>
        {description && <p className="text-text-secondary text-sm">{description}</p>}
      </div>

      {/* Horizontal Scroll Container */}
      {projects.length > 0 ? (
        <div
          className="
            flex
            gap-6
            overflow-x-auto
            overflow-y-hidden
            scroll-smooth
            snap-x
            snap-mandatory
            pb-4
            -mx-6
            px-6
            md:mx-0
            md:px-0
            [&::-webkit-scrollbar]:hidden
          "
          style={{
            scrollbarWidth: 'none' /* Firefox */,
          }}
        >
          {projects.map((project) => (
            <div key={project.id} className="snap-start">
              <ProjectTile project={project} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-text-secondary">
          <p>No projects in this category yet.</p>
        </div>
      )}
    </section>
  )
}
