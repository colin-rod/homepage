import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo'
import { getCVData } from '@/lib/data'
import Navigation from '@/components/layouts/Navigation'
import Footer from '@/components/layouts/Footer'
import PageTransition from '@/components/animations/PageTransition'
import CVContent from './CVContent'

export const metadata: Metadata = generatePageMetadata(
  'Curriculum Vitae',
  'View my professional experience, skills, and qualifications. Download a customized CV filtered by role type (Product, Strategy, or Technical).',
  '/cv'
)

/**
 * CV Page
 *
 * Displays professional CV with summary, skills, experience, and education
 * Includes client-side filtering by tag
 */

export default function CVPage() {
  const cv = getCVData()

  return (
    <>
      <Navigation />
      <PageTransition>
        <main id="main-content" className="py-24 sm:py-32">
          <CVContent cvData={cv} />
        </main>
      </PageTransition>
      <Footer />
    </>
  )
}
