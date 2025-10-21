/**
 * Writing/Blog Index Page
 * Lists all blog posts with metadata
 */

import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import { formatDate } from '@/lib/utils'

export const metadata = {
  title: 'Writing | Colin Rodrigues',
  description: 'Thoughts on product, strategy, and technology.',
}

export default function WritingPage() {
  const posts = getAllPosts(false) // Don't include content for list view

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Writing</h1>
          <p className="text-lg text-muted-foreground">
            Thoughts on product development, strategy, and technology.
          </p>
        </header>

        {/* Blog Posts List */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No posts yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="border-b border-border pb-8 last:border-0"
              >
                <Link
                  href={`/writing/${post.slug}`}
                  className="group block hover:opacity-80 transition-opacity"
                >
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <time dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                    {post.readingTime && (
                      <>
                        <span>•</span>
                        <span>{post.readingTime} min read</span>
                      </>
                    )}
                  </div>

                  <p className="text-foreground/80 mb-3 leading-relaxed">
                    {post.summary}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
