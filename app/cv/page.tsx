import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo'
import { getCVData } from '@/lib/data'
import Navigation from '@/components/layouts/Navigation'
import Footer from '@/components/layouts/Footer'

export const metadata: Metadata = generatePageMetadata(
  'Curriculum Vitae',
  'View my professional experience, skills, and qualifications. Download a customized CV filtered by role type (Product, Strategy, or Technical).',
  '/cv'
)

/**
 * CV Page
 *
 * Displays professional CV with summary, skills, experience, and education
 */

export default function CVPage() {
  const cv = getCVData()

  // Helper function to format dates
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Present'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  return (
    <>
      <Navigation />
      <main className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-6">
              Curriculum Vitae
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">{cv.summary}</p>
          </div>

          {/* Skills Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-text mb-8">Skills & Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cv.skills.map((skillCategory) => (
                <div key={skillCategory.category} className="card">
                  <h3 className="text-lg font-semibold text-primary mb-4">
                    {skillCategory.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillCategory.items.map((skill) => (
                      <span
                        key={skill}
                        className="text-sm px-3 py-1 rounded-full bg-neutral-surface border border-divider text-text"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Experience Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-text mb-8">Professional Experience</h2>
            <div className="space-y-8">
              {cv.experience.map((exp) => (
                <div key={exp.id} className="card">
                  {/* Position Header */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-primary mb-1">{exp.title}</h3>
                    <p className="text-lg text-text-secondary">
                      {exp.company} • {exp.location}
                    </p>
                    <p className="text-sm text-text-secondary mt-1">
                      {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-text-secondary mb-4">{exp.description}</p>

                  {/* Highlights */}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-text uppercase mb-3">
                        Key Achievements
                      </h4>
                      <ul className="space-y-2">
                        {exp.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-accent-warm mr-2">•</span>
                            <span className="text-text-secondary">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tags */}
                  {exp.tags && exp.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-divider">
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded bg-accent-warm/10 text-accent-warm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Education Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-text mb-8">Education</h2>
            <div className="space-y-6">
              {cv.education.map((edu, index) => (
                <div key={index} className="card">
                  <h3 className="text-xl font-bold text-primary mb-1">{edu.degree}</h3>
                  <p className="text-lg text-text-secondary mb-2">{edu.institution}</p>
                  <p className="text-sm text-text-secondary">{edu.year}</p>
                  {edu.description && (
                    <p className="text-text-secondary mt-3">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="border-t border-divider pt-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-text mb-4">Download CV</h2>
              <p className="text-lg text-text-secondary mb-8">
                Get a customized version of my CV tailored to specific role types
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/cv/download?filter=product" className="btn btn-primary">
                  Download Product CV
                </a>
                <a href="/cv/download?filter=strategy" className="btn btn-primary">
                  Download Strategy CV
                </a>
                <a href="/cv/download?filter=tech" className="btn btn-primary">
                  Download Technical CV
                </a>
                <a href="/cv/download?filter=all" className="btn btn-secondary">
                  Download Full CV
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
