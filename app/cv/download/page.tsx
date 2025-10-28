import { Metadata } from 'next'
import { getCVData } from '@/lib/data'
import { formatDate } from '@/lib/utils'
import { HighlightEntry } from '@/lib/types'

interface CVDownloadPageProps {
  searchParams: Promise<{
    filter?: string
  }>
}

export const metadata: Metadata = {
  title: 'CV - Colin Rodrigues',
  description: 'Professional CV and resume for Colin Rodrigues',
  robots: {
    index: false,
    follow: false,
  },
}

/**
 * CV Download Page
 *
 * Print-optimized CV page for downloading as PDF
 * Accepts filter query parameter: product, strategy, tech, all (default)
 */

export default async function CVDownloadPage({ searchParams }: CVDownloadPageProps) {
  const params = await searchParams
  const filter = params.filter || 'all'
  const cv = getCVData()

  // Filter experience based on query parameter
  const filteredExperience =
    filter === 'all' ? cv.experience : cv.experience.filter((exp) => exp.tags.includes(filter))

  return (
    <main className="cv-download print:p-8">
      {/* Header */}
      <header className="mb-8 pb-6 border-b-2 border-divider print:border-black">
        <h1 className="text-4xl font-bold text mb-2 print:text-3xl">Colin Rodrigues</h1>
        <div className="text-secondary space-y-1 print:text-sm">
          <p>Email: colin.rods@gmail.com</p>
          <p>LinkedIn: linkedin.com/in/colinrodrigues</p>
          <p>GitHub: github.com/colin-rod</p>
        </div>
      </header>

      {/* Professional Summary */}
      <section className="mb-8 print:mb-6 print:page-break-inside-avoid">
        <h2 className="text-2xl font-bold text mb-3 print:text-xl">Professional Summary</h2>
        <p className="text-secondary leading-relaxed print:text-sm">{cv.summary}</p>
      </section>

      {/* Skills */}
      <section className="mb-8 print:mb-6 print:page-break-inside-avoid">
        <h2 className="text-2xl font-bold text mb-3 print:text-xl">Skills</h2>
        <div className="space-y-3 print:space-y-2">
          {cv.skills.map((skillCategory) => (
            <div key={skillCategory.category}>
              <h3 className="text-lg font-semibold text mb-1 print:text-base">
                {skillCategory.category}
              </h3>
              <p className="text-secondary print:text-sm">{skillCategory.items.join(', ')}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="mb-8 print:mb-6">
        <h2 className="text-2xl font-bold text mb-4 print:text-xl">Professional Experience</h2>
        <div className="space-y-6 print:space-y-4">
          {filteredExperience.map((exp) => (
            <div key={exp.id} className="print:page-break-inside-avoid">
              <div className="mb-2">
                <h3 className="text-xl font-semibold text print:text-lg">{exp.title}</h3>
                <p className="text-secondary font-medium print:text-sm">
                  {exp.company} • {exp.location}
                </p>
                <p className="text-secondary text-sm print:text-xs">
                  {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                </p>
              </div>
              <p className="text-secondary mb-2 print:text-sm">{exp.description}</p>
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="list-disc list-inside space-y-1 text-secondary print:text-sm">
                  {exp.highlights.map((highlight, idx) => {
                    // Handle both string and HighlightEntry formats
                    const text = typeof highlight === 'string' ? highlight : highlight.text
                    // Strip markdown syntax for print
                    const plainText = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                    return <li key={idx}>{plainText}</li>
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="print:page-break-inside-avoid">
        <h2 className="text-2xl font-bold text mb-4 print:text-xl">Education</h2>
        <div className="space-y-4 print:space-y-2">
          {cv.education.map((edu, idx) => (
            <div key={idx}>
              <h3 className="text-xl font-semibold text print:text-lg">{edu.degree}</h3>
              <p className="text-secondary font-medium print:text-sm">{edu.institution}</p>
              <p className="text-secondary text-sm print:text-xs">{edu.year}</p>
              {edu.description && (
                <p className="text-secondary mt-1 print:text-sm">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
