/**
 * Tests for blog utilities
 * Integration tests using actual file system operations with year/month/slug structure
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import * as fs from 'fs'
import * as path from 'path'
import { getAllPosts, getPostBySlug, getPostSlugs } from './blog'

const setNodeEnv = (value: string | undefined) => {
  if (value === undefined) {
    Reflect.deleteProperty(process.env, 'NODE_ENV')
  } else {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value,
      writable: true,
      configurable: true,
      enumerable: true,
    })
  }
}

const TEST_CONTENT_DIR = path.join(process.cwd(), 'content/writing')

describe('Blog Utilities', () => {
  const testPosts = [
    {
      path: '2025/01/test-post-1',
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
      path: '2025/01/test-post-2',
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
      path: '2024/06/test-post-3',
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
    // Create test posts in year/month/slug structure
    testPosts.forEach((post) => {
      const postDir = path.join(TEST_CONTENT_DIR, post.path)
      fs.mkdirSync(postDir, { recursive: true })
      fs.writeFileSync(path.join(postDir, 'index.mdx'), post.content)
    })
  })

  afterAll(() => {
    // Clean up test posts
    testPosts.forEach((post) => {
      const postDir = path.join(TEST_CONTENT_DIR, post.path)
      const indexPath = path.join(postDir, 'index.mdx')
      if (fs.existsSync(indexPath)) {
        fs.unlinkSync(indexPath)
      }
      // Remove directories in reverse order (slug, month, year)
      const parts = post.path.split('/')
      for (let i = parts.length; i > 0; i--) {
        const dirPath = path.join(TEST_CONTENT_DIR, ...parts.slice(0, i))
        try {
          if (fs.existsSync(dirPath) && fs.readdirSync(dirPath).length === 0) {
            fs.rmdirSync(dirPath)
          }
        } catch {
          // Directory not empty or doesn't exist, skip
        }
      }
    })
  })

  describe('getPostSlugs', () => {
    it('returns array of post metadata with year, month, slug, isDraft', () => {
      const slugs = getPostSlugs()

      const testPost1 = slugs.find((s) => s.slug === 'test-post-1')
      const testPost2 = slugs.find((s) => s.slug === 'test-post-2')
      const testPost3 = slugs.find((s) => s.slug === 'test-post-3')

      expect(testPost1).toBeDefined()
      expect(testPost1?.year).toBe('2025')
      expect(testPost1?.month).toBe('01')
      expect(testPost1?.isDraft).toBe(false)

      expect(testPost2).toBeDefined()
      expect(testPost3).toBeDefined()
    })

    it('handles both year/month and drafts structure', () => {
      const slugs = getPostSlugs()

      slugs.forEach((slug) => {
        if (slug.isDraft) {
          expect(slug.year).toBeNull()
          expect(slug.month).toBeNull()
        } else {
          expect(slug.year).toBeTruthy()
          expect(slug.month).toBeTruthy()
        }
      })
    })
  })

  describe('getPostBySlug', () => {
    it('parses MDX file from year/month/slug structure and extracts frontmatter', () => {
      const post = getPostBySlug('2025', '01', 'test-post-1')

      expect(post.slug).toBe('test-post-1')
      expect(post.year).toBe('2025')
      expect(post.month).toBe('01')
      expect(post.isDraft).toBe(false)
      expect(post.title).toBe('First Test Post')
      expect(post.date).toBe('2025-01-15')
      expect(post.summary).toBe('This is the first test post')
      expect(post.tags).toEqual(['product', 'tech'])
      expect(post.content).toContain('# Hello World')
      expect(post.content).toContain('This is the content of the first test post')
    })

    it('calculates reading time based on word count', () => {
      const post = getPostBySlug('2025', '01', 'test-post-1')

      expect(post.readingTime).toBeGreaterThan(0)
      expect(post.readingTime).toBeDefined()
      expect(typeof post.readingTime).toBe('number')
    })

    it('throws error if file does not exist', () => {
      expect(() => getPostBySlug('2025', '01', 'non-existent-post')).toThrow()
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

    it('includes year and month in post metadata', () => {
      const posts = getAllPosts()
      const testPost = posts.find((p) => p.slug === 'test-post-1')

      expect(testPost).toBeDefined()
      expect(testPost!.year).toBe('2025')
      expect(testPost!.month).toBe('01')
      expect(testPost!.isDraft).toBe(false)
    })
  })

  describe('Draft Post Functionality', () => {
    const draftPost = {
      path: 'drafts/test-draft-post',
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
      path: '2025/01/test-published-post',
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
      const draftDir = path.join(TEST_CONTENT_DIR, draftPost.path)
      const publishedDir = path.join(TEST_CONTENT_DIR, publishedPost.path)

      fs.mkdirSync(draftDir, { recursive: true })
      fs.mkdirSync(publishedDir, { recursive: true })

      fs.writeFileSync(path.join(draftDir, 'index.mdx'), draftPost.content)
      fs.writeFileSync(path.join(publishedDir, 'index.mdx'), publishedPost.content)
    })

    afterAll(() => {
      // Clean up draft test posts
      const draftPath = path.join(TEST_CONTENT_DIR, draftPost.path, 'index.mdx')
      const publishedPath = path.join(TEST_CONTENT_DIR, publishedPost.path, 'index.mdx')

      if (fs.existsSync(draftPath)) {
        fs.unlinkSync(draftPath)
        fs.rmdirSync(path.join(TEST_CONTENT_DIR, draftPost.path))
      }
      if (fs.existsSync(publishedPath)) {
        fs.unlinkSync(publishedPath)
        const publishedDir = path.join(TEST_CONTENT_DIR, publishedPost.path)
        fs.rmdirSync(publishedDir)
        // Try to clean up parent directories if empty
        try {
          fs.rmdirSync(path.join(TEST_CONTENT_DIR, '2025', '01'))
          fs.rmdirSync(path.join(TEST_CONTENT_DIR, '2025'))
        } catch {
          // Not empty, skip
        }
      }
    })

    describe('getPostBySlug', () => {
      it('parses draft field from frontmatter (from drafts folder)', () => {
        const post = getPostBySlug(null, null, 'test-draft-post')

        expect(post.draft).toBe(true)
        expect(post.isDraft).toBe(true)
        expect(post.year).toBeUndefined()
        expect(post.month).toBeUndefined()
        expect(post.title).toBe('Draft Test Post')
      })

      it('parses draft=false from frontmatter (from year/month folder)', () => {
        const post = getPostBySlug('2025', '01', 'test-published-post')

        expect(post.draft).toBe(false)
        expect(post.isDraft).toBe(false)
        expect(post.year).toBe('2025')
        expect(post.month).toBe('01')
        expect(post.title).toBe('Published Test Post')
      })

      it('treats posts without draft field as published (draft=undefined)', () => {
        const post = getPostBySlug('2025', '01', 'test-post-1')

        expect(post.draft).toBeUndefined()
      })
    })

    describe('getAllPosts with draft filtering', () => {
      it('excludes draft posts in production environment', () => {
        const originalEnv = process.env.NODE_ENV
        setNodeEnv('production')

        const posts = getAllPosts()
        const draftPostInList = posts.find((p) => p.slug === 'test-draft-post')
        const publishedPostInList = posts.find((p) => p.slug === 'test-published-post')

        expect(draftPostInList).toBeUndefined()
        expect(publishedPostInList).toBeDefined()

        setNodeEnv(originalEnv)
      })

      it('includes draft posts in development environment', () => {
        const originalEnv = process.env.NODE_ENV
        setNodeEnv('development')

        const posts = getAllPosts()
        const draftPostInList = posts.find((p) => p.slug === 'test-draft-post')
        const publishedPostInList = posts.find((p) => p.slug === 'test-published-post')

        expect(draftPostInList).toBeDefined()
        expect(publishedPostInList).toBeDefined()

        setNodeEnv(originalEnv)
      })

      it('includes draft posts when NODE_ENV is not set (development default)', () => {
        const originalEnv = process.env.NODE_ENV
        setNodeEnv(undefined)

        const posts = getAllPosts()
        const draftPostInList = posts.find((p) => p.slug === 'test-draft-post')

        expect(draftPostInList).toBeDefined()

        setNodeEnv(originalEnv)
      })

      it('includes posts with draft=false regardless of environment', () => {
        const originalEnv = process.env.NODE_ENV

        // Test in production
        setNodeEnv('production')
        let posts = getAllPosts()
        let publishedPost = posts.find((p) => p.slug === 'test-published-post')
        expect(publishedPost).toBeDefined()

        // Test in development
        setNodeEnv('development')
        posts = getAllPosts()
        publishedPost = posts.find((p) => p.slug === 'test-published-post')
        expect(publishedPost).toBeDefined()

        setNodeEnv(originalEnv)
      })
    })
  })

  describe('Publish Flag Functionality', () => {
    const unpublishedPost = {
      path: '2025/01/test-unpublished-post',
      content: `---
title: Unpublished Test Post
date: 2025-01-26
summary: This post is not published
tags: [unpublished-test]
publish: false
---

# Unpublished Content

This post should be hidden in both dev and production.`,
    }

    const publishedFlagPost = {
      path: '2025/01/test-published-flag-post',
      content: `---
title: Published Flag Test Post
date: 2025-01-27
summary: This post is explicitly published
tags: [published-test]
publish: true
---

# Published Flag Content

This post should always be visible.`,
    }

    const noPublishFlagPost = {
      path: '2025/01/test-no-publish-flag-post',
      content: `---
title: No Publish Flag Test Post
date: 2025-01-28
summary: This post has no publish flag
tags: [default-test]
---

# Default Content

This post should be visible by default (backward compatibility).`,
    }

    beforeAll(() => {
      // Create test posts for publish flag testing
      ;[unpublishedPost, publishedFlagPost, noPublishFlagPost].forEach((post) => {
        const postDir = path.join(TEST_CONTENT_DIR, post.path)
        fs.mkdirSync(postDir, { recursive: true })
        fs.writeFileSync(path.join(postDir, 'index.mdx'), post.content)
      })
    })

    afterAll(() => {
      // Clean up publish flag test posts
      ;[unpublishedPost, publishedFlagPost, noPublishFlagPost].forEach((post) => {
        const indexPath = path.join(TEST_CONTENT_DIR, post.path, 'index.mdx')
        const postDir = path.join(TEST_CONTENT_DIR, post.path)

        if (fs.existsSync(indexPath)) {
          fs.unlinkSync(indexPath)
        }
        if (fs.existsSync(postDir)) {
          fs.rmdirSync(postDir)
        }
      })

      // Try to clean up parent directories if empty
      try {
        fs.rmdirSync(path.join(TEST_CONTENT_DIR, '2025', '01'))
        fs.rmdirSync(path.join(TEST_CONTENT_DIR, '2025'))
      } catch {
        // Not empty, skip
      }
    })

    describe('getPostBySlug', () => {
      it('parses publish field from frontmatter', () => {
        const post = getPostBySlug('2025', '01', 'test-unpublished-post')

        expect(post.publish).toBe(false)
        expect(post.title).toBe('Unpublished Test Post')
      })

      it('parses publish=true from frontmatter', () => {
        const post = getPostBySlug('2025', '01', 'test-published-flag-post')

        expect(post.publish).toBe(true)
        expect(post.title).toBe('Published Flag Test Post')
      })

      it('treats posts without publish field as published (publish=undefined)', () => {
        const post = getPostBySlug('2025', '01', 'test-no-publish-flag-post')

        expect(post.publish).toBeUndefined()
        expect(post.title).toBe('No Publish Flag Test Post')
      })
    })

    describe('getAllPosts with publish filtering', () => {
      it('excludes unpublished posts (publish=false) in production', () => {
        const originalEnv = process.env.NODE_ENV
        setNodeEnv('production')

        const posts = getAllPosts()
        const unpublishedPostInList = posts.find((p) => p.slug === 'test-unpublished-post')
        const publishedPostInList = posts.find((p) => p.slug === 'test-published-flag-post')
        const noFlagPostInList = posts.find((p) => p.slug === 'test-no-publish-flag-post')

        expect(unpublishedPostInList).toBeUndefined()
        expect(publishedPostInList).toBeDefined()
        expect(noFlagPostInList).toBeDefined()

        setNodeEnv(originalEnv)
      })

      it('excludes unpublished posts (publish=false) in development', () => {
        const originalEnv = process.env.NODE_ENV
        setNodeEnv('development')

        const posts = getAllPosts()
        const unpublishedPostInList = posts.find((p) => p.slug === 'test-unpublished-post')
        const publishedPostInList = posts.find((p) => p.slug === 'test-published-flag-post')
        const noFlagPostInList = posts.find((p) => p.slug === 'test-no-publish-flag-post')

        expect(unpublishedPostInList).toBeUndefined()
        expect(publishedPostInList).toBeDefined()
        expect(noFlagPostInList).toBeDefined()

        setNodeEnv(originalEnv)
      })

      it('excludes unpublished posts (publish=false) when NODE_ENV is not set', () => {
        const originalEnv = process.env.NODE_ENV
        setNodeEnv(undefined)

        const posts = getAllPosts()
        const unpublishedPostInList = posts.find((p) => p.slug === 'test-unpublished-post')

        expect(unpublishedPostInList).toBeUndefined()

        setNodeEnv(originalEnv)
      })

      it('includes posts with publish=true in all environments', () => {
        const originalEnv = process.env.NODE_ENV

        // Test in production
        setNodeEnv('production')
        let posts = getAllPosts()
        let publishedPost = posts.find((p) => p.slug === 'test-published-flag-post')
        expect(publishedPost).toBeDefined()

        // Test in development
        setNodeEnv('development')
        posts = getAllPosts()
        publishedPost = posts.find((p) => p.slug === 'test-published-flag-post')
        expect(publishedPost).toBeDefined()

        // Test with no NODE_ENV
        setNodeEnv(undefined)
        posts = getAllPosts()
        publishedPost = posts.find((p) => p.slug === 'test-published-flag-post')
        expect(publishedPost).toBeDefined()

        setNodeEnv(originalEnv)
      })

      it('includes posts without publish field (backward compatibility)', () => {
        const originalEnv = process.env.NODE_ENV

        // Test in production
        setNodeEnv('production')
        let posts = getAllPosts()
        let noFlagPost = posts.find((p) => p.slug === 'test-no-publish-flag-post')
        expect(noFlagPost).toBeDefined()

        // Test in development
        setNodeEnv('development')
        posts = getAllPosts()
        noFlagPost = posts.find((p) => p.slug === 'test-no-publish-flag-post')
        expect(noFlagPost).toBeDefined()

        setNodeEnv(originalEnv)
      })
    })
  })
})
