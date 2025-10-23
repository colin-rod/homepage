import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo'
import Navigation from '@/components/layouts/Navigation'
import Footer from '@/components/layouts/Footer'
import PageTransition from '@/components/animations/PageTransition'
import { getUsesCategories } from '@/lib/data'
import { ExternalLink } from 'lucide-react'

export const metadata: Metadata = generatePageMetadata(
  'Uses',
  'Explore the hardware, software, and rituals powering my daily work and experimentation.',
  '/uses'
)

export default function UsesPage() {
  const categories = getUsesCategories()

  return (
    <>
      <Navigation />
      <PageTransition>
        <main id="main-content" className="py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <header className="mb-12 sm:mb-16">
              <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-4">
                Uses
              </h1>
              <p className="text-lg text-text-secondary leading-relaxed">
                Inspired by the community at uses.tech, this page captures the tools and habits that
                support my work. Each entry includes a context panel so future me can remember why a
                tool stuck around—or why it didn&apos;t.
              </p>
            </header>

            <div className="space-y-16">
              {categories.map((category) => (
                <section
                  key={category.id}
                  aria-labelledby={`${category.id}-title`}
                  className="space-y-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <h2 id={`${category.id}-title`} className="text-2xl font-semibold text-text">
                        {category.title}
                      </h2>
                      {category.description && (
                        <p className="mt-2 text-base text-text-secondary">{category.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {category.items.map((item) => (
                      <article
                        key={item.name}
                        className="rounded-2xl border border-divider/80 bg-neutral-surface/80 p-5 shadow-sm backdrop-blur-sm"
                      >
                        <div className="grid gap-4 md:grid-cols-[minmax(0,18rem)_1fr] md:gap-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              {item.favicon && (
                                <img
                                  src={item.favicon}
                                  alt={`${item.name} icon`}
                                  className="h-6 w-6 rounded-md border border-divider/60 bg-white object-contain p-0.5 shadow-sm"
                                  loading="lazy"
                                  width={24}
                                  height={24}
                                />
                              )}
                              <h3 className="text-lg font-semibold text-text">{item.name}</h3>
                              {item.link && (
                                <a
                                  href={item.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-sm font-medium text-accent-warm transition-colors hover:text-accent-gold"
                                >
                                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                                  <span className="sr-only">Open {item.name}</span>
                                </a>
                              )}
                            </div>
                            {item.details && (
                              <p className="text-sm text-text-secondary">{item.details}</p>
                            )}
                            {item.tags && item.tags.length > 0 && (
                              <div
                                className="flex flex-wrap gap-2"
                                aria-label={`${item.name} tags`}
                              >
                                {item.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center rounded-full border border-divider/70 bg-neutral-surface px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-text-secondary"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="rounded-xl border border-divider/70 bg-neutral-surface px-4 py-3 text-sm leading-relaxed text-text-secondary">
                            {item.context}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  )
}
