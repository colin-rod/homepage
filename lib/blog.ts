/**
 * Blog utilities for MDX content management
 * Handles reading, parsing, and organizing blog posts from year/month/slug folder structure
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { BlogPost } from './types'

const POSTS_DIRECTORY = path.join(process.cwd(), 'content/writing')
const DRAFTS_DIRECTORY = path.join(POSTS_DIRECTORY, 'drafts')

/**
 * Parse folder path to extract year, month, slug, and draft status
 * @param folderPath - Path relative to content/writing
 * @returns Object with year, month, slug, isDraft
 */
function parseFolderPath(folderPath: string): {
  year: string | null
  month: string | null
  slug: string
  isDraft: boolean
} {
  const parts = folderPath.split(path.sep)

  // Check if it's a draft (path starts with "drafts")
  if (parts[0] === 'drafts') {
    return {
      year: null,
      month: null,
      slug: parts[1],
      isDraft: true,
    }
  }

  // Published post: year/month/slug
  return {
    year: parts[0],
    month: parts[1],
    slug: parts[2],
    isDraft: false,
  }
}

/**
 * Recursively find all index.mdx files in content/writing
 * @param dir - Directory to search (relative to content/writing)
 * @param baseDir - Base directory (content/writing)
 * @returns Array of relative paths to folders containing index.mdx
 */
function findAllPostFolders(dir: string = '', baseDir: string = POSTS_DIRECTORY): string[] {
  const fullPath = path.join(baseDir, dir)
  const folders: string[] = []

  try {
    const entries = fs.readdirSync(fullPath, { withFileTypes: true })

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const relativePath = path.join(dir, entry.name)
        const indexPath = path.join(fullPath, entry.name, 'index.mdx')

        // If this folder has index.mdx, it's a post folder
        if (fs.existsSync(indexPath)) {
          folders.push(relativePath)
        } else {
          // Otherwise, recurse into subdirectories
          folders.push(...findAllPostFolders(relativePath, baseDir))
        }
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
    return []
  }

  return folders
}

/**
 * Get all post metadata (year, month, slug, isDraft) from the content/writing directory
 * @returns Array of post metadata objects
 */
export function getPostSlugs(): Array<{
  year: string | null
  month: string | null
  slug: string
  isDraft: boolean
}> {
  const folders = findAllPostFolders()
  return folders.map(parseFolderPath)
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
 * Get a single blog post by year, month, and slug (or from drafts)
 * @param year - Year (e.g., '2025') or null for drafts
 * @param month - Month (e.g., '11') or null for drafts
 * @param slug - The post slug (folder name)
 * @returns BlogPost object with metadata and content
 * @throws Error if file doesn't exist or is invalid
 */
export function getPostBySlug(year: string | null, month: string | null, slug: string): BlogPost {
  try {
    // Build path based on whether it's a draft
    const fullPath =
      year && month
        ? path.join(POSTS_DIRECTORY, year, month, slug, 'index.mdx')
        : path.join(DRAFTS_DIRECTORY, slug, 'index.mdx')

    // Check if file exists before trying to read it
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Blog post not found: ${slug}`)
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    // Validate required frontmatter fields
    if (!data.title) {
      throw new Error(`Blog post "${slug}" is missing required field: title`)
    }
    if (!data.date) {
      throw new Error(`Blog post "${slug}" is missing required field: date`)
    }
    if (!data.summary) {
      throw new Error(`Blog post "${slug}" is missing required field: summary`)
    }

    // Ensure date is always a string (gray-matter may parse it as Date)
    const dateString = data.date instanceof Date ? data.date.toISOString().split('T')[0] : data.date

    return {
      slug,
      year: year || undefined,
      month: month || undefined,
      isDraft: !year || !month,
      title: data.title,
      date: dateString,
      summary: data.summary,
      tags: data.tags || [],
      content,
      readingTime: calculateReadingTime(content),
      draft: data.draft,
      publish: data.publish,
    }
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw our custom errors with context
      if (error.message.startsWith('Blog post')) {
        throw error
      }
      // Wrap filesystem errors
      if ('code' in error && error.code === 'ENOENT') {
        throw new Error(`Blog post not found: ${slug}`)
      }
      if ('code' in error && error.code === 'EACCES') {
        throw new Error(`Permission denied reading blog post: ${slug}`)
      }
      // Generic error
      throw new Error(`Failed to load blog post "${slug}": ${error.message}`)
    }
    throw error
  }
}

/**
 * Get all blog posts, optionally with full content
 * @param includeContent - Whether to include the full MDX content (default: false)
 * @returns Array of BlogPost objects sorted by date (newest first)
 */
export function getAllPosts(includeContent = false): BlogPost[] {
  const slugs = getPostSlugs()

  const posts = slugs.map(({ year, month, slug }) => {
    const post = getPostBySlug(year, month, slug)

    // Optionally exclude content to improve performance for list views
    if (!includeContent) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content, ...postWithoutContent } = post
      return postWithoutContent as BlogPost
    }

    return post
  })

  // Filter out unpublished posts (publish=false) in ALL environments
  // Filter out draft posts in production only
  const isProduction = process.env.NODE_ENV === 'production'
  const filteredPosts = posts.filter((post) => {
    // Always hide posts with publish=false
    if (post.publish === false) {
      return false
    }
    // In production, also hide draft posts
    if (isProduction && post.draft === true) {
      return false
    }
    return true
  })

  // Sort posts by date (newest first)
  return filteredPosts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

/**
 * Get posts filtered by tag
 * @param tag - Tag to filter by
 * @param includeContent - Whether to include full content
 * @returns Array of filtered BlogPost objects
 */
export function getPostsByTag(tag: string, includeContent = false): BlogPost[] {
  const allPosts = getAllPosts(includeContent)
  return allPosts.filter((post) => post.tags.includes(tag))
}
