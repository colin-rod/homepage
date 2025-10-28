'use client'

/**
 * SkillCategoryCard Component
 *
 * Displays a skill category with its associated skills as clickable badges.
 * Clicking a skill filters the experience section to show only roles using that skill.
 * Used in the Skills & Expertise section of the CV page.
 */

import CardHover from '@/components/animations/CardHover'

export interface SkillCategoryCardProps {
  category: string
  skills: string[]
  activeSkills?: Set<string>
  onSkillClick?: (skill: string) => void
}

export default function SkillCategoryCard({
  category,
  skills,
  activeSkills = new Set(),
  onSkillClick,
}: SkillCategoryCardProps) {
  return (
    <CardHover className="card">
      <h3 className="text-lg font-semibold text-primary mb-4">{category}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => {
          const isActive = activeSkills.has(skill)
          const isClickable = !!onSkillClick

          return (
            <button
              key={skill}
              onClick={isClickable ? () => onSkillClick(skill) : undefined}
              disabled={!isClickable}
              className={`text-sm px-3 py-1 rounded-full border transition-all duration-200 ${
                isActive
                  ? 'bg-accent-warm text-white border-accent-warm'
                  : 'bg-neutral-surface border-divider text-text hover:border-accent-warm hover:bg-accent-warm/5'
              } ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
            >
              {skill}
            </button>
          )
        })}
      </div>
    </CardHover>
  )
}
