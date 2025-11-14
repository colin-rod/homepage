/**
 * Individual Blog Post Page
 * Renders MDX content for a specific reflection
 * Supports both year/month/slug and slug-only URLs
 */

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug, getPostSlugs } from '@/lib/blog'
import { getProjectBySlug } from '@/lib/data'
import { formatDate } from '@/lib/utils'
import Navigation from '@/components/layouts/Navigation'
import Footer from '@/components/layouts/Footer'
import PageTransition from '@/components/animations/PageTransition'
import RelatedProjects from '@/components/features/writing/RelatedProjects'

interface BlogPostPageProps {
  params: Promise<{
    slug: string[]
  }>
}

export async function generateStaticParams() {
  const slugs = getPostSlugs()
  return slugs.map(({ year, month, slug, isDraft }) => {
    // For published posts: ['2025', '11', 'my-post']
    // For drafts: ['drafts', 'my-post']
    if (isDraft) {
      return { slug: ['drafts', slug] }
    }
    return { slug: [year!, month!, slug] }
  })
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug: slugArray } = await params

  try {
    // Parse slug array to extract year, month, and slug
    let year: string | null = null
    let month: string | null = null
    let slug: string

    if (slugArray[0] === 'drafts') {
      // Draft post: ['drafts', 'my-post']
      slug = slugArray[1]
    } else if (slugArray.length === 3) {
      // Published post: ['2025', '11', 'my-post']
      year = slugArray[0]
      month = slugArray[1]
      slug = slugArray[2]
    } else {
      // Invalid format
      return {
        title: 'Post Not Found | Colin Rodrigues',
      }
    }

    const post = getPostBySlug(year, month, slug)
    return {
      title: `${post.title} | Colin Rodrigues`,
      description: post.summary,
    }
  } catch {
    return {
      title: 'Post Not Found | Colin Rodrigues',
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug: slugArray } = await params

  // Parse slug array to extract year, month, and slug
  let year: string | null = null
  let month: string | null = null
  let slug: string

  if (slugArray[0] === 'drafts') {
    // Draft post: ['drafts', 'my-post']
    slug = slugArray[1]
  } else if (slugArray.length === 3) {
    // Published post: ['2025', '11', 'my-post']
    year = slugArray[0]
    month = slugArray[1]
    slug = slugArray[2]
  } else {
    // Invalid format
    notFound()
  }

  let post
  try {
    post = getPostBySlug(year, month, slug)
  } catch {
    notFound()
  }

  // Get related project if explicitly linked
  let relatedProject = null
  if (post.project) {
    try {
      relatedProject = getProjectBySlug(post.project)
    } catch {
      // Project not found, continue without related project
    }
  }

  return (
    <>
      <Navigation />
      <PageTransition>
        <main className="py-24 sm:py-32">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            {/* Back Link */}
            <Link
              href="/writing"
              className="inline-flex items-center text-sm text-secondary hover:text transition-colors mb-8"
            >
              ← Back to Reflections
            </Link>

            {/* Post Header */}
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

              <div className="flex items-center gap-4 text-sm text-secondary mb-4">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                {post.readingTime && (
                  <>
                    <span>•</span>
                    <span>{post.readingTime} min read</span>
                  </>
                )}
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="badge badge-primary">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Post Content */}
            <article className="prose prose-lg dark:prose-invert max-w-none">
              <MDXRemote source={post.content || ''} />
            </article>

            {/* Related Projects Section */}
            {relatedProject && <RelatedProjects projects={[relatedProject]} />}

            {/* Footer with back link */}
            <footer className="mt-12 pt-8 border-t border-divider">
              <Link
                href="/writing"
                className="inline-flex items-center text-sm text-secondary hover:text transition-colors"
              >
                ← Back to Reflections
              </Link>
            </footer>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  )
}
