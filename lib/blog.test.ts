/**
 * Tests for blog utilities
 * Integration tests using actual file system operations
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import * as fs from 'fs'
import * as path from 'path'
import { getAllPosts, getPostBySlug, getPostSlugs } from './blog'

const TEST_CONTENT_DIR = path.join(process.cwd(), 'content/writing')

describe('Blog Utilities', () => {
  const testPosts = [
    {
      filename: 'test-post-1.mdx',
      content: `---
title: First Test Post
date: 2025-01-15
summary: This is the first test post
tags: [product, tech]
---

# Hello World

This is the content of the first test post with about two hundred words repeated many times. ${'word '.repeat(200)}`,
    },
    {
      filename: 'test-post-2.mdx',
      content: `---
title: Second Test Post
date: 2025-01-20
summary: This is the second test post
tags: [strategy]
---

# Second Post

This is a shorter post.`,
    },
    {
      filename: 'test-post-3.mdx',
      content: `---
title: Old Test Post
date: 2024-06-01
summary: An older test post
tags: [tech, learning]
---

# Older Content

This is an older post for testing sorting.`,
    },
  ]

  beforeAll(() => {
    // Create test posts
    if (!fs.existsSync(TEST_CONTENT_DIR)) {
      fs.mkdirSync(TEST_CONTENT_DIR, { recursive: true })
    }

    testPosts.forEach((post) => {
      fs.writeFileSync(path.join(TEST_CONTENT_DIR, post.filename), post.content)
    })
  })

  afterAll(() => {
    // Clean up test posts
    testPosts.forEach((post) => {
      const filePath = path.join(TEST_CONTENT_DIR, post.filename)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    })
  })

  describe('getPostSlugs', () => {
    it('returns array of slugs from MDX files', () => {
      const slugs = getPostSlugs()

      expect(slugs).toContain('test-post-1')
      expect(slugs).toContain('test-post-2')
      expect(slugs).toContain('test-post-3')
      expect(slugs.length).toBeGreaterThanOrEqual(3)
    })

    it('returns only MDX files, excluding other file types', () => {
      const slugs = getPostSlugs()

      // Should not include non-MDX files
      slugs.forEach((slug) => {
        expect(slug).not.toContain('.txt')
        expect(slug).not.toContain('.md')
        expect(slug).not.toContain('.DS_Store')
      })
    })
  })

  describe('getPostBySlug', () => {
    it('parses MDX file and extracts frontmatter', () => {
      const post = getPostBySlug('test-post-1')

      expect(post.slug).toBe('test-post-1')
      expect(post.title).toBe('First Test Post')
      expect(post.date).toBe('2025-01-15')
      expect(post.summary).toBe('This is the first test post')
      expect(post.tags).toEqual(['product', 'tech'])
      expect(post.content).toContain('# Hello World')
      expect(post.content).toContain('This is the content of the first test post')
    })

    it('calculates reading time based on word count', () => {
      const post = getPostBySlug('test-post-1')

      expect(post.readingTime).toBeGreaterThan(0)
      expect(post.readingTime).toBeDefined()
      expect(typeof post.readingTime).toBe('number')
    })

    it('throws error if file does not exist', () => {
      expect(() => getPostBySlug('non-existent-post')).toThrow()
    })
  })

  describe('getAllPosts', () => {
    it('returns all posts sorted by date (newest first)', () => {
      const posts = getAllPosts()

      // Find our test posts
      const testPostTitles = posts.map((p) => p.title)

      // Check that newest post comes before older posts
      const secondIndex = testPostTitles.indexOf('Second Test Post')
      const firstIndex = testPostTitles.indexOf('First Test Post')
      const oldIndex = testPostTitles.indexOf('Old Test Post')

      expect(secondIndex).toBeLessThan(firstIndex)
      expect(firstIndex).toBeLessThan(oldIndex)
    })

    it('excludes content field when includeContent is false', () => {
      const posts = getAllPosts(false)
      const testPost = posts.find((p) => p.slug === 'test-post-1')

      expect(testPost).toBeDefined()
      expect(testPost!.content).toBeUndefined()
    })

    it('includes content field when includeContent is true', () => {
      const posts = getAllPosts(true)
      const testPost = posts.find((p) => p.slug === 'test-post-1')

      expect(testPost).toBeDefined()
      expect(testPost!.content).toBeDefined()
      expect(testPost!.content).toContain('# Hello World')
    })

    it('returns at least the test posts we created', () => {
      const posts = getAllPosts()

      expect(posts.length).toBeGreaterThanOrEqual(3)
    })
  })
})
