/**
 * RelatedArticles Component
 * Displays blog posts related to a project
 */

import Link from 'next/link'
import { Clock } from 'lucide-react'
import { BlogPost } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface RelatedArticlesProps {
  posts: BlogPost[]
  projectTags: string[]
  projectSlug?: string
}

export default function RelatedArticles({ posts, projectTags, projectSlug }: RelatedArticlesProps) {
  if (posts.length === 0) {
    return null
  }

  return (
    <section className="mt-16 pt-12 border-t border-divider">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-3">Related Articles</h2>
        <p className="text-secondary text-lg">Blog posts about this project and related topics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => {
          const postUrl = post.isDraft
            ? `/writing/drafts/${post.slug}`
            : `/writing/${post.year}/${post.month}/${post.slug}`

          // Find matching tags for highlighting
          const matchingTags = post.tags.filter((tag) => projectTags.includes(tag))

          // Check if this post explicitly links to this project
          const isExplicitLink = projectSlug && post.project === projectSlug

          return (
            <article key={post.slug} className="card hover:shadow-glow transition-shadow group">
              <Link href={postUrl} className="block">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-xl font-bold group-hover:text-accent-warm transition-colors flex-1">
                    {post.title}
                  </h3>
                  {isExplicitLink && (
                    <span className="badge badge-accent shrink-0 text-xs">Featured</span>
                  )}
                </div>

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

                <p className="text-text-secondary mb-4 leading-relaxed line-clamp-3">
                  {post.summary}
                </p>

                {/* Show matching tags */}
                {matchingTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {matchingTags.map((tag) => (
                      <span key={tag} className="badge badge-accent">
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > matchingTags.length && (
                      <span className="text-xs text-text-secondary self-center">
                        +{post.tags.length - matchingTags.length} more
                      </span>
                    )}
                  </div>
                )}
              </Link>
            </article>
          )
        })}
      </div>
    </section>
  )
}
