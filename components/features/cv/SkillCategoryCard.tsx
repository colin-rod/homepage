'use client'

/**
 * SkillCategoryCard Component
 *
 * Displays a skill category with its associated skills as badges.
 * Used in the Skills & Expertise section of the CV page.
 */

import CardHover from '@/components/animations/CardHover'

export interface SkillCategoryCardProps {
  category: string
  skills: string[]
}

export default function SkillCategoryCard({ category, skills }: SkillCategoryCardProps) {
  return (
    <CardHover className="card">
      <h3 className="text-lg font-semibold text-primary mb-4">{category}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="text-sm px-3 py-1 rounded-full bg-neutral-surface border border-divider text-text"
          >
            {skill}
          </span>
        ))}
      </div>
    </CardHover>
  )
}
