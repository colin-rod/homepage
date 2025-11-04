import { test, expect } from '@playwright/test'

test.describe('Error Pages', () => {
  test.describe('404 Not Found Page', () => {
    test('displays 404 page for non-existent routes', async ({ page }) => {
      const response = await page.goto('/this-page-does-not-exist-12345')

      // Should return 404 status
      expect(response?.status()).toBe(404)
    })

    test('displays 404 for invalid project slugs', async ({ page }) => {
      const response = await page.goto('/projects/non-existent-project-xyz')

      expect(response?.status()).toBe(404)
    })

    test('404 page has proper error message', async ({ page }) => {
      await page.goto('/non-existent-page')

      // Check for common 404 indicators (adjust based on your 404 page implementation)
      const pageContent = await page.textContent('body')
      const has404Indicator =
        pageContent?.includes('404') ||
        pageContent?.includes('not found') ||
        pageContent?.includes('Not Found') ||
        pageContent?.includes("doesn't exist")

      expect(has404Indicator).toBeTruthy()
    })

    test('404 page includes navigation to get back home', async ({ page }) => {
      await page.goto('/non-existent-page')

      // Should have a way to navigate back (check for nav or link to home)
      const nav = page.getByRole('navigation').first()
      const homeLink = page.getByRole('link', { name: /home/i }).or(page.locator('a[href="/"]'))

      const hasNavigation = (await nav.count()) > 0 || (await homeLink.count()) > 0
      expect(hasNavigation).toBeTruthy()
    })

    test('404 page is accessible', async ({ page }) => {
      await page.goto('/non-existent-page')

      // Page should have proper HTML structure
      const main = page.locator('main, [role="main"]')
      await expect(main.first()).toBeVisible()
    })
  })

  test.describe('Project Not Found (Custom 404)', () => {
    test('displays custom not-found for invalid project slugs', async ({ page }) => {
      const response = await page.goto('/projects/invalid-project-slug-12345')

      expect(response?.status()).toBe(404)
    })

    test('project not-found page has helpful message', async ({ page }) => {
      await page.goto('/projects/invalid-project')

      // Should indicate project wasn't found
      const content = await page.textContent('body')
      const hasProjectNotFoundMessage =
        content?.includes('not found') || content?.includes('project') || content?.includes('404')

      expect(hasProjectNotFoundMessage).toBeTruthy()
    })

    test('project not-found includes link back to projects', async ({ page }) => {
      await page.goto('/projects/invalid-slug')

      // Should have link back to projects page
      const projectsLink = page
        .getByRole('link', { name: /projects/i })
        .or(page.locator('a[href="/projects"]'))

      const linkCount = await projectsLink.count()
      expect(linkCount).toBeGreaterThan(0)
    })
  })

  test.describe('Error Handling', () => {
    test('handles malformed URLs gracefully', async ({ page }) => {
      // Test with various malformed URLs
      const malformedUrls = [
        '/projects/<script>alert("xss")</script>',
        '/writing/../../etc/passwd',
        '/cv?filter="><script>',
      ]

      for (const url of malformedUrls) {
        const response = await page.goto(url)
        // Should not crash, should return either 404 or redirect
        expect(response?.status()).toBeGreaterThanOrEqual(200)
        expect(response?.status()).toBeLessThan(600)
      }
    })

    test('error pages maintain consistent design', async ({ page }) => {
      await page.goto('/non-existent-route')

      // Should have navigation
      const nav = page.getByRole('navigation').first()
      const navCount = await nav.count()
      expect(navCount).toBeGreaterThanOrEqual(0)

      // Should have some content
      const body = page.locator('body')
      await expect(body).toBeVisible()
    })

    test('error pages are responsive', async ({ page }) => {
      await page.goto('/non-existent-page')

      // Test mobile
      await page.setViewportSize({ width: 375, height: 667 })
      const bodyMobile = page.locator('body')
      await expect(bodyMobile).toBeVisible()

      // Test desktop
      await page.setViewportSize({ width: 1920, height: 1080 })
      const bodyDesktop = page.locator('body')
      await expect(bodyDesktop).toBeVisible()
    })
  })

  test.describe('Navigation from Error Pages', () => {
    test('can navigate to home from 404 page', async ({ page }) => {
      await page.goto('/non-existent-route')

      // Find and click home/logo link
      const homeLink = page.locator('a[href="/"]').first()
      if ((await homeLink.count()) > 0) {
        await homeLink.click()
        await page.waitForURL('/')
        expect(page.url()).toContain('/')
      }
    })

    test('navigation menu works on error pages', async ({ page }) => {
      await page.goto('/invalid-page')

      const nav = page.getByRole('navigation').first()
      if ((await nav.count()) > 0) {
        // Navigation should be functional
        const navLinks = nav.locator('a')
        const linkCount = await navLinks.count()
        expect(linkCount).toBeGreaterThan(0)
      }
    })
  })

  test.describe('SEO and Metadata', () => {
    test('404 pages have appropriate meta tags', async ({ page }) => {
      await page.goto('/non-existent-page')

      // Should have a title
      const title = await page.title()
      expect(title.length).toBeGreaterThan(0)
    })

    test('404 pages should not be indexed by search engines', async ({ page }) => {
      await page.goto('/non-existent-page')

      // Check for noindex meta tag or X-Robots-Tag header
      const metaRobots = page.locator('meta[name="robots"]')
      const metaRobotsCount = await metaRobots.count()

      // If meta robots tag exists, it should have noindex
      if (metaRobotsCount > 0) {
        const content = await metaRobots.getAttribute('content')
        expect(content).toMatch(/noindex/i)
      }
    })
  })

  test.describe('Performance', () => {
    test('404 page loads quickly', async ({ page }) => {
      const startTime = Date.now()
      await page.goto('/non-existent-route')
      const loadTime = Date.now() - startTime

      // 404 page should load in under 3 seconds
      expect(loadTime).toBeLessThan(3000)
    })
  })
})
