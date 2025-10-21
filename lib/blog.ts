/**
 * Blog utilities for MDX content management
 * Handles reading, parsing, and organizing blog posts
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { BlogPost } from './types'

const POSTS_DIRECTORY = path.join(process.cwd(), 'content/writing')

/**
 * Get all post slugs from the content/writing directory
 * @returns Array of post slugs (filenames without .mdx extension)
 */
export function getPostSlugs(): string[] {
  try {
    const files = fs.readdirSync(POSTS_DIRECTORY)
    return files
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => file.replace(/\.mdx$/, ''))
  } catch {
    // Directory doesn't exist yet or is empty
    return []
  }
}

/**
 * Calculate reading time in minutes based on word count
 * Average reading speed: 200 words per minute
 * @param content - The text content to analyze
 * @returns Reading time in minutes (rounded up)
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / wordsPerMinute)
  return readingTime
}

/**
 * Get a single blog post by slug
 * @param slug - The post slug (filename without extension)
 * @returns BlogPost object with metadata and content
 * @throws Error if file doesn't exist
 */
export function getPostBySlug(slug: string): BlogPost {
  const fullPath = path.join(POSTS_DIRECTORY, `${slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  // Ensure date is always a string (gray-matter may parse it as Date)
  const dateString =
    data.date instanceof Date
      ? data.date.toISOString().split('T')[0]
      : data.date

  return {
    slug,
    title: data.title,
    date: dateString,
    summary: data.summary,
    tags: data.tags || [],
    content,
    readingTime: calculateReadingTime(content),
  }
}

/**
 * Get all blog posts, optionally with full content
 * @param includeContent - Whether to include the full MDX content (default: false)
 * @returns Array of BlogPost objects sorted by date (newest first)
 */
export function getAllPosts(includeContent = false): BlogPost[] {
  const slugs = getPostSlugs()

  const posts = slugs.map((slug) => {
    const post = getPostBySlug(slug)

    // Optionally exclude content to improve performance for list views
    if (!includeContent) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content, ...postWithoutContent } = post
      return postWithoutContent as BlogPost
    }

    return post
  })

  // Sort posts by date (newest first)
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

/**
 * Get posts filtered by tag
 * @param tag - Tag to filter by
 * @param includeContent - Whether to include full content
 * @returns Array of filtered BlogPost objects
 */
export function getPostsByTag(
  tag: string,
  includeContent = false
): BlogPost[] {
  const allPosts = getAllPosts(includeContent)
  return allPosts.filter((post) => post.tags.includes(tag))
}
