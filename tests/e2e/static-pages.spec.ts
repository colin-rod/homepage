import { test, expect } from '@playwright/test'

/**
 * E2E Tests for Static Pages
 *
 * Tests for About, Now, and Contact pages
 */

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about')
  })

  test('should display the about page with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /about/i, level: 1 })).toBeVisible()
  })

  test('should have correct page title and meta', async ({ page }) => {
    await expect(page).toHaveTitle(/about/i)
  })

  test('should display substantial content', async ({ page }) => {
    const main = page.getByRole('main')
    const content = await main.textContent()

    // Should have substantial bio/about content
    expect(content).toBeTruthy()
    expect(content!.length).toBeGreaterThan(200)
  })

  test('should have proper page structure', async ({ page }) => {
    // Should render within a main element
    await expect(page.getByRole('main')).toBeVisible()

    // Check navigation exists
    await expect(page.getByRole('navigation').first()).toBeVisible()
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    // Should have exactly one h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)
  })

  test('should have main landmark', async ({ page }) => {
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should display GitHub contribution chart', async ({ page }) => {
    // Check for "Building in Public" section
    await expect(page.getByRole('heading', { name: /building in public/i })).toBeVisible()

    // Check for chart image from ghchart.rshah.org
    const chartImage = page.locator('img[src*="ghchart.rshah.org"]')
    await expect(chartImage).toBeVisible()

    // Verify it has proper alt text for accessibility
    await expect(chartImage).toHaveAttribute('alt', /github contribution chart/i)
  })

  test('GitHub chart should have proper username in URL', async ({ page }) => {
    const chartImage = page.locator('img[src*="ghchart.rshah.org"]')
    await expect(chartImage).toHaveAttribute('src', /colin-rod/)
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByRole('heading', { name: /about/i, level: 1 })).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByRole('heading', { name: /about/i, level: 1 })).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should be responsive on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByRole('heading', { name: /about/i, level: 1 })).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should have proper styling and spacing', async ({ page }) => {
    const main = page.getByRole('main')
    const mainClasses = await main.getAttribute('class')
    expect(mainClasses).toMatch(/py-/)
  })
})

test.describe('Now Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/now')
  })

  test('should display the now page with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /now/i, level: 1 })).toBeVisible()
  })

  test('should have correct page title and meta', async ({ page }) => {
    await expect(page).toHaveTitle(/now/i)
  })

  test('should display current activities and focus', async ({ page }) => {
    const main = page.getByRole('main')
    const content = await main.textContent()

    // Should have content about current activities
    expect(content).toBeTruthy()
    expect(content!.length).toBeGreaterThan(100)
  })

  test('should have proper page structure', async ({ page }) => {
    // Should render within a main element
    await expect(page.getByRole('main')).toBeVisible()

    // Check navigation exists
    await expect(page.getByRole('navigation').first()).toBeVisible()
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    // Should have exactly one h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)
  })

  test('should have main landmark', async ({ page }) => {
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should have last updated date', async ({ page }) => {
    const main = page.getByRole('main')
    const content = await main.textContent()

    // Should mention when the page was last updated
    expect(content).toMatch(/updated|last updated|as of/i)
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByRole('heading', { name: /now/i, level: 1 })).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByRole('heading', { name: /now/i, level: 1 })).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should be responsive on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByRole('heading', { name: /now/i, level: 1 })).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should have proper styling and spacing', async ({ page }) => {
    const main = page.getByRole('main')
    const mainClasses = await main.getAttribute('class')
    expect(mainClasses).toMatch(/py-/)
  })
})

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('should display the contact page with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /let.*connect/i, level: 1 })).toBeVisible()
  })

  test('should have correct page title and meta', async ({ page }) => {
    await expect(page).toHaveTitle(/contact/i)
  })

  test('should display contact information', async ({ page }) => {
    const main = page.getByRole('main')
    const content = await main.textContent()

    // Should have contact info or methods
    expect(content).toBeTruthy()
    expect(content!.length).toBeGreaterThan(50)
  })

  test('should display email contact method', async ({ page }) => {
    const main = page.getByRole('main')
    const content = await main.textContent()

    // Should have email information
    expect(content).toMatch(/email/i)
  })

  test('should display LinkedIn contact method', async ({ page }) => {
    const main = page.getByRole('main')
    const content = await main.textContent()

    // Should have LinkedIn information
    expect(content).toMatch(/linkedin/i)
  })

  test('should display GitHub contact method', async ({ page }) => {
    const main = page.getByRole('main')
    const content = await main.textContent()

    // Should have GitHub information
    expect(content).toMatch(/github/i)
  })

  test('should have clickable contact links', async ({ page }) => {
    // Should have at least some links (email, LinkedIn, GitHub)
    const links = await page.getByRole('link').all()

    // Filter out navigation links, should have contact-specific links
    expect(links.length).toBeGreaterThan(3)
  })

  test('should have proper page structure', async ({ page }) => {
    // Should render within a main element
    await expect(page.getByRole('main')).toBeVisible()

    // Check navigation exists
    await expect(page.getByRole('navigation').first()).toBeVisible()
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    // Should have exactly one h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)
  })

  test('should have main landmark', async ({ page }) => {
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should have accessible links', async ({ page }) => {
    const links = await page.getByRole('link').all()

    for (const link of links) {
      const text = await link.textContent()
      const ariaLabel = await link.getAttribute('aria-label')
      const href = await link.getAttribute('href')

      // Links should have text, aria-label, or both, and a valid href
      expect(text || ariaLabel).toBeTruthy()
      expect(href).toBeTruthy()
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByRole('heading', { name: /let.*connect/i, level: 1 })).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByRole('heading', { name: /let.*connect/i, level: 1 })).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should be responsive on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByRole('heading', { name: /let.*connect/i, level: 1 })).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should have proper styling and spacing', async ({ page }) => {
    const main = page.getByRole('main')
    const mainClasses = await main.getAttribute('class')
    expect(mainClasses).toMatch(/py-/)
  })
})

test.describe('Static Pages Navigation', () => {
  test('should navigate between static pages', async ({ page }) => {
    await page.goto('/about')
    await expect(page).toHaveURL('/about')

    // Check if mobile viewport
    const viewport = page.viewportSize()
    const isMobile = viewport && viewport.width < 768

    if (!isMobile) {
      const nav = page.getByRole('navigation').first()

      // Navigate to Now page
      const nowLink = nav.getByRole('link', { name: /now/i })
      if (await nowLink.isVisible()) {
        await nowLink.click()
        await expect(page).toHaveURL('/now')
        await expect(page.getByRole('heading', { name: /now/i })).toBeVisible()
      }
    }
  })

  test('should navigate from homepage to about', async ({ page }) => {
    await page.goto('/')

    const viewport = page.viewportSize()
    const isMobile = viewport && viewport.width < 768

    if (!isMobile) {
      const nav = page.getByRole('navigation').first()
      const aboutLink = nav.getByRole('link', { name: /about/i })

      if (await aboutLink.isVisible()) {
        await aboutLink.click()
        await expect(page).toHaveURL('/about')
        await expect(page.getByRole('heading', { name: /about/i })).toBeVisible()
      }
    }
  })

  test('should navigate from homepage to contact', async ({ page }) => {
    await page.goto('/')

    const viewport = page.viewportSize()
    const isMobile = viewport && viewport.width < 768

    if (!isMobile) {
      const nav = page.getByRole('navigation').first()
      const contactLink = nav.getByRole('link', { name: /contact/i })

      if (await contactLink.isVisible()) {
        await contactLink.click()
        await expect(page).toHaveURL('/contact')
        await expect(page.getByRole('heading', { name: /let.*connect/i })).toBeVisible()
      }
    }
  })
})

test.describe('Static Pages Accessibility', () => {
  const pages = [
    { url: '/about', name: 'About' },
    { url: '/now', name: 'Now' },
    { url: '/contact', name: 'Contact' },
  ]

  for (const pageInfo of pages) {
    test(`${pageInfo.name} page should be accessible`, async ({ page }) => {
      await page.goto(pageInfo.url)

      // Should have exactly one h1
      const h1Count = await page.locator('h1').count()
      expect(h1Count).toBe(1)

      // Should have main landmark
      await expect(page.getByRole('main')).toBeVisible()

      // All headings should have accessible text
      const headings = await page.getByRole('heading').all()
      for (const heading of headings) {
        const text = await heading.textContent()
        expect(text).toBeTruthy()
        expect(text!.trim().length).toBeGreaterThan(0)
      }
    })
  }
})

test.describe('Static Pages Performance', () => {
  const pages = [
    { url: '/about', name: 'About' },
    { url: '/now', name: 'Now' },
    { url: '/contact', name: 'Contact' },
  ]

  for (const pageInfo of pages) {
    test(`${pageInfo.name} page should load quickly`, async ({ page }) => {
      const startTime = Date.now()
      await page.goto(pageInfo.url)
      await expect(page.getByRole('main')).toBeVisible()
      const loadTime = Date.now() - startTime

      // Page should load in reasonable time (less than 3 seconds)
      expect(loadTime).toBeLessThan(3000)
    })
  }
})
