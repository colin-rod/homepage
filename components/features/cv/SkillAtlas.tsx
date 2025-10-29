'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CV, CVFilterType, CVExperience, HighlightEntry } from '@/lib/types'
import { cn } from '@/lib/utils'
import { staggerContainerVariants, staggerItemVariants } from '@/components/animations/variants'

type FocusKey = Exclude<CVFilterType, 'all'>
const focusOrder: FocusKey[] = ['product', 'strategy', 'tech']

interface SkillAtlasProps {
  cvData: CV
  activeSkills: Set<string>
  onSkillClick: (skill: string) => void
  activeFilter: CVFilterType
}

interface SkillContext {
  id: string
  title: string
  company?: string
  detail?: string
  focus: FocusKey[]
}

interface AtlasSkill {
  name: string
  focuses: FocusKey[]
  categories: string[]
  contexts: SkillContext[]
  isShared: boolean
}

type AtlasColumn = Record<FocusKey, AtlasSkill[]>

const focusDisplay: Record<
  FocusKey,
  {
    label: string
    headerClasses: string
    columnClasses: string
    chipClasses: string
    chipActiveClasses: string
    chipHoverClasses: string
    indicatorClasses: string
  }
> = {
  product: {
    label: 'Product',
    headerClasses: 'text-purple-700 dark:text-purple-200',
    columnClasses:
      'border-purple-200/80 dark:border-purple-500/40 bg-purple-50/80 dark:bg-purple-500/5',
    chipClasses: 'border-purple-200/60 dark:border-purple-500/30 bg-white/80 dark:bg-purple-950/30',
    chipActiveClasses:
      'bg-purple-600 text-white border-purple-600 dark:bg-purple-500 dark:border-purple-500',
    chipHoverClasses: 'hover:border-purple-400 hover:bg-purple-100/80 dark:hover:bg-purple-500/10',
    indicatorClasses: 'bg-purple-400 dark:bg-purple-500',
  },
  strategy: {
    label: 'Strategy',
    headerClasses: 'text-amber-700 dark:text-amber-200',
    columnClasses:
      'border-amber-200/80 dark:border-amber-500/40 bg-amber-50/80 dark:bg-amber-500/5',
    chipClasses: 'border-amber-200/60 dark:border-amber-500/30 bg-white/80 dark:bg-amber-950/30',
    chipActiveClasses:
      'bg-amber-600 text-white border-amber-600 dark:bg-amber-500 dark:border-amber-500',
    chipHoverClasses: 'hover:border-amber-400 hover:bg-amber-100/80 dark:hover:bg-amber-500/10',
    indicatorClasses: 'bg-amber-400 dark:bg-amber-500',
  },
  tech: {
    label: 'Technical',
    headerClasses: 'text-emerald-700 dark:text-emerald-200',
    columnClasses:
      'border-emerald-200/80 dark:border-emerald-500/40 bg-emerald-50/80 dark:bg-emerald-500/5',
    chipClasses:
      'border-emerald-200/60 dark:border-emerald-500/30 bg-white/80 dark:bg-emerald-950/30',
    chipActiveClasses:
      'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500',
    chipHoverClasses:
      'hover:border-emerald-400 hover:bg-emerald-100/80 dark:hover:bg-emerald-500/10',
    indicatorClasses: 'bg-emerald-400 dark:bg-emerald-500',
  },
}

function getFocusesFromCategory(category: string): FocusKey[] {
  const normalized = category.toLowerCase()
  const focusSet = new Set<FocusKey>()

  if (normalized.includes('product')) {
    focusSet.add('product')
  }
  if (normalized.includes('strategy')) {
    focusSet.add('strategy')
  }
  if (
    normalized.includes('tech') ||
    normalized.includes('devops') ||
    normalized.includes('development') ||
    normalized.includes('api') ||
    normalized.includes('engineering')
  ) {
    focusSet.add('tech')
  }
  if (normalized.includes('analytics') || normalized.includes('data')) {
    focusSet.add('strategy')
    focusSet.add('tech')
  }
  if (normalized.includes('design')) {
    focusSet.add('product')
    focusSet.add('tech')
  }
  if (normalized.includes('productivity') || normalized.includes('collaboration')) {
    focusSet.add('product')
    focusSet.add('strategy')
  }

  if (focusSet.size === 0) {
    focusSet.add('product')
  }

  return Array.from(focusSet)
}

function getHighlightForSkill(experience: CVExperience, skill: string): string | undefined {
  const lowerSkill = skill.toLowerCase()

  for (const highlight of experience.highlights || []) {
    if (typeof highlight === 'string') {
      if (highlight.toLowerCase().includes(lowerSkill)) {
        return highlight
      }
      continue
    }

    const structuredHighlight = highlight as HighlightEntry

    if (structuredHighlight.skills && structuredHighlight.skills.includes(skill)) {
      return structuredHighlight.text
    }

    if (structuredHighlight.text?.toLowerCase().includes(lowerSkill)) {
      return structuredHighlight.text
    }
  }

  return undefined
}

function buildAtlasData(cvData: CV): AtlasColumn {
  const skillMap = new Map<
    string,
    {
      name: string
      focuses: Set<FocusKey>
      categories: Set<string>
      contexts: Map<string, SkillContext>
    }
  >()

  const getOrCreateSkill = (name: string) => {
    if (!skillMap.has(name)) {
      skillMap.set(name, {
        name,
        focuses: new Set<FocusKey>(),
        categories: new Set<string>(),
        contexts: new Map<string, SkillContext>(),
      })
    }

    return skillMap.get(name)!
  }

  // Seed from top-level skill categories
  cvData.skills.forEach((category) => {
    const focuses = getFocusesFromCategory(category.category)

    category.items.forEach((skill) => {
      const entry = getOrCreateSkill(skill)
      focuses.forEach((focus) => entry.focuses.add(focus))
      entry.categories.add(category.category)
    })
  })

  // Enrich with experience data for focus mapping + context
  cvData.experience.forEach((experience) => {
    const focusTags = experience.tags.filter((tag): tag is FocusKey =>
      focusOrder.includes(tag as FocusKey)
    )

    if (!experience.skills) {
      return
    }

    experience.skills.forEach((skill) => {
      const entry = getOrCreateSkill(skill)
      const highlight = getHighlightForSkill(experience, skill)
      const contexts = entry.contexts
      const focus = focusTags.length ? focusTags : focusOrder

      focus.forEach((tag) => entry.focuses.add(tag))

      contexts.set(experience.id, {
        id: experience.id,
        title: experience.title,
        company: experience.company,
        detail: highlight,
        focus,
      })
    })
  })

  const columns: AtlasColumn = {
    product: [],
    strategy: [],
    tech: [],
  }

  skillMap.forEach((entry) => {
    const focuses = entry.focuses.size > 0 ? Array.from(entry.focuses) : focusOrder
    const contexts = Array.from(entry.contexts.values())

    const atlasSkill: AtlasSkill = {
      name: entry.name,
      focuses,
      categories: Array.from(entry.categories),
      contexts,
      isShared: focuses.length > 1,
    }

    focuses.forEach((focus) => {
      columns[focus].push(atlasSkill)
    })
  })

  const sortSkills = (a: AtlasSkill, b: AtlasSkill) => {
    const contextDelta = b.contexts.length - a.contexts.length
    if (contextDelta !== 0) {
      return contextDelta
    }
    return a.name.localeCompare(b.name)
  }

  focusOrder.forEach((focus) => {
    columns[focus].sort(sortSkills)
  })

  return columns
}

export default function SkillAtlas({
  cvData,
  activeSkills,
  onSkillClick,
  activeFilter,
}: SkillAtlasProps) {
  const [hoveredFocus, setHoveredFocus] = useState<FocusKey | null>(null)
  const [activeTooltip, setActiveTooltip] = useState<{ focus: FocusKey; skill: string } | null>(
    null
  )

  const atlasData = useMemo(() => buildAtlasData(cvData), [cvData])
  const visibleFocuses: FocusKey[] =
    activeFilter === 'all' ? focusOrder : [activeFilter as FocusKey]
  const gridColsClass =
    visibleFocuses.length === 3
      ? 'md:grid-cols-3'
      : visibleFocuses.length === 2
        ? 'md:grid-cols-2'
        : 'md:grid-cols-1'

  return (
    <section id="skills" className="mb-16">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
          Skill Atlas
        </p>
        <h2 className="text-3xl font-bold text-text sm:text-4xl">Explore skills by focus area</h2>
        <p className="mt-3 text-sm text-text-secondary max-w-2xl">
          Hover over a skill to see which roles these were used in. Click on the skill to filter the
          experience and explore where each capability was used.
        </p>
      </div>

      {/* Mobile horizontal scroll */}
      <div className="-mx-6 mb-6 md:hidden">
        <motion.div
          className={cn(
            'flex gap-4 px-6 pb-4',
            visibleFocuses.length > 1 ? 'overflow-x-auto' : 'overflow-visible'
          )}
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {visibleFocuses.map((focus) => {
            const meta = focusDisplay[focus]
            const skills = atlasData[focus]
            const isSingleFocus = visibleFocuses.length === 1
            return (
              <motion.div
                key={focus}
                variants={staggerItemVariants}
                className={cn(
                  'relative flex-shrink-0 rounded-2xl border backdrop-blur px-5 py-6 shadow-sm',
                  meta.columnClasses,
                  isSingleFocus ? 'min-w-full' : 'min-w-[80%]'
                )}
              >
                <div className="sticky top-0 mb-4 bg-transparent">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={cn('h-2 w-2 rounded-full', meta.indicatorClasses)}
                    />
                    <h3 className={cn('text-lg font-semibold', meta.headerClasses)}>
                      {meta.label}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => {
                    const isActive = activeSkills.has(skill.name)
                    const isShared = skill.isShared

                    return (
                      <button
                        key={`${focus}-${skill.name}`}
                        type="button"
                        onClick={() => onSkillClick(skill.name)}
                        className={cn(
                          'relative rounded-full border px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                          meta.chipClasses,
                          meta.chipHoverClasses,
                          isActive && meta.chipActiveClasses,
                          !isActive && isShared && 'opacity-80'
                        )}
                      >
                        {skill.name}
                        {skill.contexts.length > 0 && (
                          <span className="ml-2 rounded-full bg-neutral-surface/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                            {skill.contexts.length} {skill.contexts.length === 1 ? 'role' : 'roles'}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Desktop grid */}
      <motion.div
        className={cn('hidden gap-6 md:grid', gridColsClass)}
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {visibleFocuses.map((focus) => {
          const meta = focusDisplay[focus]
          const skills = atlasData[focus]
          const isDimmed =
            visibleFocuses.length > 1 && hoveredFocus !== null && hoveredFocus !== focus

          return (
            <motion.div
              key={focus}
              variants={staggerItemVariants}
              onMouseEnter={() => setHoveredFocus(focus)}
              onMouseLeave={() => setHoveredFocus(null)}
              className={cn(
                'relative rounded-2xl border px-6 py-7 backdrop-blur transition-all duration-200 shadow-sm',
                meta.columnClasses,
                isDimmed ? 'opacity-50' : 'opacity-100'
              )}
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={cn('h-2.5 w-2.5 rounded-full', meta.indicatorClasses)}
                    />
                    <h3 className={cn('text-lg font-semibold', meta.headerClasses)}>
                      {meta.label}
                    </h3>
                  </div>
                </div>
                {skills.length > 0 && (
                  <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    {skills.length} skill{skills.length === 1 ? '' : 's'}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => {
                  const isActive = activeSkills.has(skill.name)
                  const isShared = skill.isShared
                  const showTooltip =
                    activeTooltip?.skill === skill.name && activeTooltip.focus === focus

                  return (
                    <div key={`${focus}-${skill.name}`} className="relative">
                      <button
                        type="button"
                        onClick={() => onSkillClick(skill.name)}
                        onMouseEnter={() => setActiveTooltip({ focus, skill: skill.name })}
                        onMouseLeave={() => setActiveTooltip(null)}
                        onFocus={() => setActiveTooltip({ focus, skill: skill.name })}
                        onBlur={() => setActiveTooltip(null)}
                        className={cn(
                          'relative rounded-full border px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                          meta.chipClasses,
                          meta.chipHoverClasses,
                          isActive && meta.chipActiveClasses,
                          !isActive && isShared && 'opacity-80'
                        )}
                      >
                        {skill.name}
                        {skill.contexts.length > 0 && (
                          <span className="ml-2 rounded-full bg-neutral-surface/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                            {skill.contexts.length} {skill.contexts.length === 1 ? 'role' : 'roles'}
                          </span>
                        )}
                      </button>

                      <AnimatePresence>
                        {showTooltip && skill.contexts.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.15 }}
                            className="pointer-events-none absolute left-1/2 z-20 mt-3 w-64 -translate-x-1/2 rounded-xl border border-divider bg-neutral-surface/95 p-4 text-left shadow-xl backdrop-blur"
                          >
                            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                              Used in
                            </p>
                            <ul className="mt-2 space-y-2">
                              {skill.contexts.slice(0, 3).map((context) => (
                                <li key={context.id} className="text-xs text-text-secondary">
                                  <span className="block font-semibold text-text">
                                    {context.title}
                                    {context.company ? ` · ${context.company}` : ''}
                                  </span>
                                  {context.detail && (
                                    <span className="mt-0.5 block text-[11px] text-text-secondary/90">
                                      {context.detail}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                            {skill.contexts.length > 3 && (
                              <p className="mt-2 text-[10px] uppercase tracking-wide text-text-secondary/80">
                                +{skill.contexts.length - 3} more roles
                              </p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
useEffect(() => {
  setHoveredFocus(null)
  setActiveTooltip(null)
}, [activeFilter])
