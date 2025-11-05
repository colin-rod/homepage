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

  describe('Draft Post Functionality', () => {
    const draftPost = {
      filename: 'test-draft-post.mdx',
      content: `---
title: Draft Test Post
date: 2025-01-25
summary: This is a draft post
tags: [draft-test]
draft: true
---

# Draft Content

This post should be hidden in production.`,
    }

    const publishedPost = {
      filename: 'test-published-post.mdx',
      content: `---
title: Published Test Post
date: 2025-01-24
summary: This is a published post
tags: [published-test]
draft: false
---

# Published Content

This post should always be visible.`,
    }

    beforeAll(() => {
      // Create draft and published test posts
      fs.writeFileSync(path.join(TEST_CONTENT_DIR, draftPost.filename), draftPost.content)
      fs.writeFileSync(path.join(TEST_CONTENT_DIR, publishedPost.filename), publishedPost.content)
    })

    afterAll(() => {
      // Clean up draft test posts
      const draftPath = path.join(TEST_CONTENT_DIR, draftPost.filename)
      const publishedPath = path.join(TEST_CONTENT_DIR, publishedPost.filename)

      if (fs.existsSync(draftPath)) {
        fs.unlinkSync(draftPath)
      }
      if (fs.existsSync(publishedPath)) {
        fs.unlinkSync(publishedPath)
      }
    })

    describe('getPostBySlug', () => {
      it('parses draft field from frontmatter', () => {
        const post = getPostBySlug('test-draft-post')

        expect(post.draft).toBe(true)
        expect(post.title).toBe('Draft Test Post')
      })

      it('parses draft=false from frontmatter', () => {
        const post = getPostBySlug('test-published-post')

        expect(post.draft).toBe(false)
        expect(post.title).toBe('Published Test Post')
      })

      it('treats posts without draft field as published (draft=undefined)', () => {
        const post = getPostBySlug('test-post-1')

        expect(post.draft).toBeUndefined()
      })
    })

    describe('getAllPosts with draft filtering', () => {
      it('excludes draft posts in production environment', () => {
        const originalEnv = process.env.NODE_ENV
        process.env.NODE_ENV = 'production'

        const posts = getAllPosts()
        const draftPostInList = posts.find((p) => p.slug === 'test-draft-post')
        const publishedPostInList = posts.find((p) => p.slug === 'test-published-post')

        expect(draftPostInList).toBeUndefined()
        expect(publishedPostInList).toBeDefined()

        process.env.NODE_ENV = originalEnv
      })

      it('includes draft posts in development environment', () => {
        const originalEnv = process.env.NODE_ENV
        process.env.NODE_ENV = 'development'

        const posts = getAllPosts()
        const draftPostInList = posts.find((p) => p.slug === 'test-draft-post')
        const publishedPostInList = posts.find((p) => p.slug === 'test-published-post')

        expect(draftPostInList).toBeDefined()
        expect(publishedPostInList).toBeDefined()

        process.env.NODE_ENV = originalEnv
      })

      it('includes draft posts when NODE_ENV is not set (development default)', () => {
        const originalEnv = process.env.NODE_ENV
        delete process.env.NODE_ENV

        const posts = getAllPosts()
        const draftPostInList = posts.find((p) => p.slug === 'test-draft-post')

        expect(draftPostInList).toBeDefined()

        process.env.NODE_ENV = originalEnv
      })

      it('includes posts with draft=false regardless of environment', () => {
        const originalEnv = process.env.NODE_ENV

        // Test in production
        process.env.NODE_ENV = 'production'
        let posts = getAllPosts()
        let publishedPost = posts.find((p) => p.slug === 'test-published-post')
        expect(publishedPost).toBeDefined()

        // Test in development
        process.env.NODE_ENV = 'development'
        posts = getAllPosts()
        publishedPost = posts.find((p) => p.slug === 'test-published-post')
        expect(publishedPost).toBeDefined()

        process.env.NODE_ENV = originalEnv
      })
    })
  })
})
