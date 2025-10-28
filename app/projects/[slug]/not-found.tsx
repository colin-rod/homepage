import Link from 'next/link'
import Navigation from '@/components/layouts/Navigation'
import Footer from '@/components/layouts/Footer'

/**
 * Not Found Page for Project Detail
 *
 * Displayed when a project slug doesn't exist
 */
export default function ProjectNotFound() {
  return (
    <>
      <Navigation />
      <main className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-6">
            Project Not Found
          </h1>
          <p className="text-xl text-text-secondary mb-8">
            The project you&apos;re looking for doesn&apos;t exist or may have been removed.
          </p>
          <Link href="/projects" className="btn btn-primary">
            View All Projects
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
