/**
 * Reflections Index Page
 * Lists all blog posts with metadata
 */

import Link from 'next/link'
import { Clock } from 'lucide-react'
import { getAllPosts } from '@/lib/blog'
import { formatDate } from '@/lib/utils'
import Navigation from '@/components/layouts/Navigation'
import Footer from '@/components/layouts/Footer'
import PageTransition from '@/components/animations/PageTransition'

export const metadata = {
  title: 'Reflections | Colin Rodrigues',
  description: 'Thoughts on product, strategy, and technology.',
}

export default function WritingPage() {
  const posts = getAllPosts(false) // Don't include content for list view
  const latestPost = posts[0]
  const olderPosts = posts.slice(1)

  return (
    <>
      <Navigation />
      <PageTransition>
        <main className="py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            {/* Header */}
            <header className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Reflections</h1>
              <p className="text-lg text-secondary">
                Thoughts on product development, strategy, and technology.
              </p>
            </header>

            {/* Blog Posts List */}
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-secondary text-lg">No posts yet. Check back soon!</p>
              </div>
            ) : (
              <>
                {/* Latest Post - Featured */}
                {latestPost && (
                  <section className="mb-16">
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-sm font-semibold text-accent-warm uppercase tracking-wide">
                        Latest
                      </h2>
                      <div className="h-px flex-1 bg-gradient-to-r from-accent-warm to-transparent"></div>
                    </div>
                    <article className="card hover:shadow-glow transition-shadow">
                      <Link href={`/writing/${latestPost.slug}`} className="group block">
                        <h3 className="text-3xl md:text-4xl font-bold mb-3 group-hover:text-accent-warm transition-colors">
                          {latestPost.title}
                        </h3>

                        <div className="flex items-center gap-2 text-xs text-text-secondary mb-4">
                          <time dateTime={latestPost.date}>{formatDate(latestPost.date)}</time>
                          {latestPost.readingTime && (
                            <>
                              <span className="text-divider">|</span>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{latestPost.readingTime} min read</span>
                              </div>
                            </>
                          )}
                        </div>

                        <p className="text-text-secondary mb-4 leading-relaxed text-lg">
                          {latestPost.summary}
                        </p>

                        {latestPost.tags && latestPost.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {latestPost.tags.map((tag) => (
                              <span key={tag} className="badge badge-accent">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </Link>
                    </article>
                  </section>
                )}

                {/* Older Posts */}
                {olderPosts.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
                        All Posts
                      </h2>
                      <div className="h-px flex-1 bg-divider"></div>
                    </div>
                    <div className="space-y-8">
                      {olderPosts.map((post) => (
                        <article
                          key={post.slug}
                          className="border-b border-divider pb-8 last:border-0"
                        >
                          <Link
                            href={`/writing/${post.slug}`}
                            className="group block hover:opacity-80 transition-opacity"
                          >
                            <h3 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-accent-warm transition-colors">
                              {post.title}
                            </h3>

                            <div className="flex items-center gap-2 text-xs text-text-secondary mb-3">
                              <time dateTime={post.date}>{formatDate(post.date)}</time>
                              {post.readingTime && (
                                <>
                                  <span className="text-divider">|</span>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{post.readingTime} min read</span>
                                  </div>
                                </>
                              )}
                            </div>

                            <p className="text-text-secondary mb-3 leading-relaxed">
                              {post.summary}
                            </p>

                            {post.tags && post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                  <span key={tag} className="badge badge-primary">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </Link>
                        </article>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  )
}
