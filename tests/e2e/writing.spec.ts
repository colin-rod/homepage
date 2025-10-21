/**
 * E2E Tests for Writing/Blog Pages
 * Tests the blog index and individual post pages
 */

import { test, expect } from '@playwright/test'

test.describe('Writing/Blog Pages', () => {
  test.describe('Blog Index Page', () => {
    test('renders page heading and introduction', async ({ page }) => {
      await page.goto('/writing')

      await expect(page.locator('h1')).toContainText('Writing')
      await expect(page.getByText(/thoughts/i)).toBeVisible()
    })

    test('displays list of blog posts', async ({ page }) => {
      await page.goto('/writing')

      // Should have at least the welcome post
      const posts = page.locator('article')
      await expect(posts).toHaveCountGreaterThan(0)

      // Check for welcome post
      await expect(page.getByText('Welcome to My Writing')).toBeVisible()
    })

    test('blog post cards show metadata', async ({ page }) => {
      await page.goto('/writing')

      // Each post should show date and reading time
      const article = page.locator('article').first()
      await expect(article.locator('time')).toBeVisible()
      await expect(article.getByText(/min read/i)).toBeVisible()
    })

    test('blog post cards show tags', async ({ page }) => {
      await page.goto('/writing')

      // Welcome post has product, strategy, tech tags
      await expect(page.getByText('product').first()).toBeVisible()
      await expect(page.getByText('strategy').first()).toBeVisible()
      await expect(page.getByText('tech').first()).toBeVisible()
    })

    test('clicking post title navigates to post page', async ({ page }) => {
      await page.goto('/writing')

      const postLink = page.getByRole('link', { name: /welcome to my writing/i })
      await postLink.click()

      await page.waitForURL('/writing/welcome')
      await expect(page.locator('h1')).toContainText('Welcome to My Writing')
    })

    test('page is accessible', async ({ page }) => {
      await page.goto('/writing')

      // Check basic accessibility
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('main, [role="main"]')).toBeVisible()
    })

    test('page is responsive', async ({ page }) => {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/writing')

      await expect(page.locator('h1')).toBeVisible()
      const posts = page.locator('article')
      await expect(posts.first()).toBeVisible()

      // Test desktop viewport
      await page.setViewportSize({ width: 1280, height: 720 })
      await expect(page.locator('h1')).toBeVisible()
      await expect(posts.first()).toBeVisible()
    })
  })

  test.describe('Individual Blog Post Page', () => {
    test('renders post title and content', async ({ page }) => {
      await page.goto('/writing/welcome')

      await expect(page.locator('h1')).toContainText('Welcome to My Writing')
      await expect(page.getByText(/Thanks for stopping by/i)).toBeVisible()
    })

    test('displays post metadata', async ({ page }) => {
      await page.goto('/writing/welcome')

      // Should show date and reading time
      await expect(page.locator('time')).toBeVisible()
      await expect(page.getByText(/min read/i)).toBeVisible()
    })

    test('displays post tags', async ({ page }) => {
      await page.goto('/writing/welcome')

      await expect(page.getByText('product')).toBeVisible()
      await expect(page.getByText('strategy')).toBeVisible()
      await expect(page.getByText('tech')).toBeVisible()
    })

    test('renders MDX content with proper formatting', async ({ page }) => {
      await page.goto('/writing/welcome')

      // Should render headings
      await expect(page.getByRole('heading', { name: 'Welcome', level: 1 })).toBeVisible()
      await expect(page.getByRole('heading', { name: /what you'll find here/i })).toBeVisible()
      await expect(page.getByRole('heading', { name: /why i write/i })).toBeVisible()

      // Should render lists
      const lists = page.locator('ul, ol')
      await expect(lists.first()).toBeVisible()

      // Should render links
      const links = page.locator('article a')
      await expect(links.first()).toBeVisible()
    })

    test('back to writing link works', async ({ page }) => {
      await page.goto('/writing/welcome')

      const backLink = page.getByRole('link', { name: /back to writing/i }).first()
      await backLink.click()

      await page.waitForURL('/writing')
      await expect(page.locator('h1')).toContainText('Writing')
    })

    test('page is accessible', async ({ page }) => {
      await page.goto('/writing/welcome')

      // Check basic accessibility
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('article')).toBeVisible()
      await expect(page.locator('time')).toHaveAttribute('datetime')
    })

    test('page is responsive', async ({ page }) => {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/writing/welcome')

      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('article')).toBeVisible()

      // Test desktop viewport
      await page.setViewportSize({ width: 1280, height: 720 })
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('article')).toBeVisible()
    })

    test('handles non-existent posts gracefully', async ({ page }) => {
      const response = await page.goto('/writing/non-existent-post')

      // Should return 404
      expect(response?.status()).toBe(404)
    })
  })

  test.describe('Cross-browser compatibility', () => {
    test('works in different browsers', async ({ page, browserName }) => {
      test.skip(browserName !== 'chromium' && browserName !== 'webkit', 'Run on Chromium and WebKit only')

      await page.goto('/writing')
      await expect(page.locator('h1')).toContainText('Writing')

      await page.goto('/writing/welcome')
      await expect(page.locator('h1')).toContainText('Welcome to My Writing')
    })
  })
})
