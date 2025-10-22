import { ReactNode } from 'react'
import { Project } from '@/lib/types'
import ProjectTile from './ProjectTile'

interface SwimlaneProps {
  title: string
  icon: ReactNode
  projects: Project[]
  description?: string
  index?: number
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
 * - Alternating background colors for visual rhythm
 */
export default function Swimlane({ title, icon, projects, description, index = 0 }: SwimlaneProps) {
  // Alternate background colors for visual rhythm with enhanced distinction
  const isEven = index % 2 === 0
  const bgClass = isEven
    ? 'bg-neutral-bg border-y border-divider shadow-inner'
    : 'bg-gradient-to-br from-neutral-surface to-neutral-bg/50 border-y border-primary/5 shadow-inner'

  return (
    <section
      className={`-mx-6 px-6 lg:-mx-8 lg:px-8 py-8 ${bgClass}`}
      role="region"
      aria-label={`${title} projects`}
    >
      <div className="mx-auto max-w-7xl">
        {/* Swimlane Header - Polished */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            {icon}
            <h2 className="text-xl font-bold text-text">{title}</h2>
          </div>
          {/* Accent rule under title */}
          <div className="h-0.5 w-12 bg-accent-warm/30 mb-2" />
          {description && (
            <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
          )}
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
      </div>
    </section>
  )
}
