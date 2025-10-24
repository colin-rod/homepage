'use client'

/**
 * EducationCard Component
 *
 * Displays education details (degree, institution, year, description).
 * Used in the Education section of the CV page.
 */

import CardHover from '@/components/animations/CardHover'

export interface EducationCardProps {
  degree: string
  institution: string
  year: number
  location?: string
  description?: string
}

export default function EducationCard({
  degree,
  institution,
  year,
  location,
  description,
}: EducationCardProps) {
  return (
    <CardHover className="card">
      <h3 className="text-xl font-bold text-primary mb-1">{degree}</h3>
      <p className="text-lg text-text-secondary mb-2">
        {institution}
        {location && ` • ${location}`}
      </p>
      <p className="text-sm text-text-secondary">{year}</p>
      {description && <p className="text-text-secondary mt-3">{description}</p>}
    </CardHover>
  )
}
