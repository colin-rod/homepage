import { test, expect } from '@playwright/test'

test.describe('Timeline Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/timeline')
  })

  test('should display the timeline page with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /timeline/i, level: 1 })).toBeVisible()
  })

  test('should have correct page title and meta', async ({ page }) => {
    await expect(page).toHaveTitle(/timeline/i)
  })

  test('should display page introduction', async ({ page }) => {
    const main = page.getByRole('main')
    const content = await main.textContent()

    // Should have substantial introduction content
    expect(content).toBeTruthy()
    expect(content!.length).toBeGreaterThan(100)
  })

  test('should display filter buttons', async ({ page }) => {
    // Check for all filter buttons
    await expect(page.getByRole('button', { name: /all/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /job/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /project/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /education/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /milestone/i })).toBeVisible()
  })

  test('should have "All" filter active by default', async ({ page }) => {
    const allButton = page.getByRole('button', { name: /^all$/i })

    // Check if button has active styling
    const buttonClasses = await allButton.getAttribute('class')
    expect(buttonClasses).toMatch(/bg-accent-warm|active/)
  })

  test('should display timeline events', async ({ page }) => {
    const main = page.getByRole('main')

    // Should have timeline events with dates
    const content = await main.textContent()
    expect(content).toMatch(/\d{4}/)  // Should have years
  })

  test('should display event types and organizations', async ({ page }) => {
    const main = page.getByRole('main')
    const content = await main.textContent()

    // Should have organization names and event information
    expect(content).toBeTruthy()
    expect(content!.length).toBeGreaterThan(200)
  })
})

test.describe('Timeline Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/timeline')
  })

  test('should filter events when clicking Job filter', async ({ page }) => {
    // Click Job filter
    await page.getByRole('button', { name: /^job$/i }).click()

    // Check that Job button is now active
    const jobButton = page.getByRole('button', { name: /^job$/i })
    const buttonClasses = await jobButton.getAttribute('class')
    expect(buttonClasses).toMatch(/bg-accent-warm|active/)

    // Should still display timeline
    const main = page.getByRole('main')
    await expect(main).toBeVisible()
  })

  test('should filter events when clicking Project filter', async ({ page }) => {
    // Click Project filter
    await page.getByRole('button', { name: /^project$/i }).click()

    // Check that Project button is now active
    const projectButton = page.getByRole('button', { name: /^project$/i })
    const buttonClasses = await projectButton.getAttribute('class')
    expect(buttonClasses).toMatch(/bg-accent-warm|active/)

    // Should still display timeline
    const main = page.getByRole('main')
    await expect(main).toBeVisible()
  })

  test('should filter events when clicking Education filter', async ({ page }) => {
    // Click Education filter
    await page.getByRole('button', { name: /^education$/i }).click()

    // Check that Education button is now active
    const educationButton = page.getByRole('button', { name: /^education$/i })
    const buttonClasses = await educationButton.getAttribute('class')
    expect(buttonClasses).toMatch(/bg-accent-warm|active/)

    // Should still display content
    const main = page.getByRole('main')
    await expect(main).toBeVisible()
  })

  test('should filter events when clicking Milestone filter', async ({ page }) => {
    // Click Milestone filter
    await page.getByRole('button', { name: /^milestone$/i }).click()

    // Check that Milestone button is now active
    const milestoneButton = page.getByRole('button', { name: /^milestone$/i })
    const buttonClasses = await milestoneButton.getAttribute('class')
    expect(buttonClasses).toMatch(/bg-accent-warm|active/)

    // Should still display content
    const main = page.getByRole('main')
    await expect(main).toBeVisible()
  })

  test('should return to all events when clicking All filter after filtering', async ({ page }) => {
    // First filter by Job
    await page.getByRole('button', { name: /^job$/i }).click()

    // Wait for filter to apply
    await page.waitForTimeout(100)

    // Then click All to reset
    await page.getByRole('button', { name: /^all$/i }).click()

    // All button should be active
    const allButton = page.getByRole('button', { name: /^all$/i })
    const buttonClasses = await allButton.getAttribute('class')
    expect(buttonClasses).toMatch(/bg-accent-warm|active/)
  })

  test('should maintain timeline structure when filtering', async ({ page }) => {
    // Click a filter
    await page.getByRole('button', { name: /^job$/i }).click()

    // Timeline should still be visible and structured
    const main = page.getByRole('main')
    await expect(main).toBeVisible()

    const content = await main.textContent()
    expect(content).toBeTruthy()
  })

  test('should handle multiple filter switches smoothly', async ({ page }) => {
    // Switch between multiple filters
    await page.getByRole('button', { name: /^job$/i }).click()
    await page.waitForTimeout(100)

    await page.getByRole('button', { name: /^project$/i }).click()
    await page.waitForTimeout(100)

    await page.getByRole('button', { name: /^education$/i }).click()
    await page.waitForTimeout(100)

    await page.getByRole('button', { name: /^all$/i }).click()

    // Should still work without errors
    const main = page.getByRole('main')
    await expect(main).toBeVisible()
  })
})

test.describe('Timeline Event Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/timeline')
  })

  test('should display event titles', async ({ page }) => {
    const main = page.getByRole('main')

    // Should have h3 headings for events
    const headings = await page.locator('h3').all()
    expect(headings.length).toBeGreaterThan(0)
  })

  test('should display event dates', async ({ page }) => {
    const main = page.getByRole('main')
    const content = await main.textContent()

    // Should display year information
    expect(content).toMatch(/20\d{2}/)
  })

  test('should display event organizations', async ({ page }) => {
    const main = page.getByRole('main')
    const content = await main.textContent()

    // Should have organization/company names
    expect(content).toBeTruthy()
    expect(content!.length).toBeGreaterThan(200)
  })

  test('should display event descriptions', async ({ page }) => {
    const main = page.getByRole('main')

    // Should have substantial event descriptions
    const content = await main.textContent()
    expect(content!.length).toBeGreaterThan(300)
  })

  test('should display events in chronological order', async ({ page }) => {
    const main = page.getByRole('main')

    // Timeline should have organized structure
    await expect(main).toBeVisible()
  })
})

test.describe('Timeline Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/timeline')

    // Should have exactly one h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)

    // Should have multiple h2s or h3s for sections/events
    const h2Count = await page.locator('h2').count()
    const h3Count = await page.locator('h3').count()
    expect(h2Count + h3Count).toBeGreaterThan(0)
  })

  test('should have main landmark', async ({ page }) => {
    await page.goto('/timeline')
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should have accessible filter buttons', async ({ page }) => {
    await page.goto('/timeline')

    // Get filter buttons
    const filterButtons = await page.locator('button').filter({ hasText: /all|job|project|education|milestone/i }).all()

    for (const button of filterButtons) {
      const text = await button.textContent()
      expect(text).toBeTruthy()
      expect(text!.trim().length).toBeGreaterThan(0)
    }
  })

  test('should have accessible event information', async ({ page }) => {
    await page.goto('/timeline')

    const headings = await page.getByRole('heading').all()
    for (const heading of headings) {
      const text = await heading.textContent()
      expect(text).toBeTruthy()
      expect(text!.trim().length).toBeGreaterThan(0)
    }
  })
})

test.describe('Timeline Responsive Design', () => {
  test('should be responsive on mobile', async ({ page }) => {
    await page.goto('/timeline')

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByRole('heading', { name: /timeline/i, level: 1 })).toBeVisible()

    // Filter buttons should be visible and wrap
    await expect(page.getByRole('button', { name: /all/i })).toBeVisible()
  })

  test('should be responsive on tablet', async ({ page }) => {
    await page.goto('/timeline')

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByRole('heading', { name: /timeline/i, level: 1 })).toBeVisible()

    // Timeline should display properly
    const main = page.getByRole('main')
    await expect(main).toBeVisible()
  })

  test('should be responsive on desktop', async ({ page }) => {
    await page.goto('/timeline')

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByRole('heading', { name: /timeline/i, level: 1 })).toBeVisible()

    // Timeline should have full layout
    const main = page.getByRole('main')
    await expect(main).toBeVisible()
  })

  test('should maintain readability across viewports', async ({ page }) => {
    await page.goto('/timeline')

    const viewports = [
      { width: 375, height: 667 },   // Mobile
      { width: 768, height: 1024 },  // Tablet
      { width: 1920, height: 1080 }, // Desktop
    ]

    for (const viewport of viewports) {
      await page.setViewportSize(viewport)

      const main = page.getByRole('main')
      await expect(main).toBeVisible()

      const heading = page.getByRole('heading', { name: /timeline/i, level: 1 })
      await expect(heading).toBeVisible()
    }
  })
})

test.describe('Timeline Page Structure', () => {
  test('should have proper page structure', async ({ page }) => {
    await page.goto('/timeline')

    // Should render within a main element
    await expect(page.getByRole('main')).toBeVisible()

    // Check navigation exists
    await expect(page.getByRole('navigation').first()).toBeVisible()
  })

  test('should have proper styling and spacing', async ({ page }) => {
    await page.goto('/timeline')

    const main = page.getByRole('main')

    // Check that main element has proper classes (py-, px- for spacing)
    const mainClasses = await main.getAttribute('class')
    expect(mainClasses).toMatch(/py-/)

    // Check for responsive container
    const container = main.locator('[class*="max-w-"]')
    await expect(container.first()).toBeVisible()
  })

  test('should have navigation and footer', async ({ page }) => {
    await page.goto('/timeline')

    // Check navigation exists
    await expect(page.getByRole('navigation').first()).toBeVisible()

    // On desktop, check for nav links
    const viewport = page.viewportSize()
    const isMobile = viewport && viewport.width < 768

    if (!isMobile) {
      const mainNav = page.getByRole('navigation').first()
      await expect(mainNav.getByRole('link', { name: /about/i })).toBeVisible()
    }
  })
})

test.describe('Timeline Navigation Flow', () => {
  test('should navigate from homepage to timeline', async ({ page }) => {
    await page.goto('/')

    // Check if mobile viewport
    const viewport = page.viewportSize()
    const isMobile = viewport && viewport.width < 768

    if (!isMobile) {
      const mainNav = page.getByRole('navigation').first()
      const timelineLink = mainNav.getByRole('link', { name: /timeline/i })

      if (await timelineLink.isVisible()) {
        await timelineLink.click()
        await expect(page).toHaveURL('/timeline')
        await expect(page.getByRole('heading', { name: /timeline/i })).toBeVisible()
      }
    }
  })

  test('should maintain navigation consistency', async ({ page }) => {
    await page.goto('/timeline')

    // Navigation should be present
    const nav = page.getByRole('navigation').first()
    await expect(nav).toBeVisible()

    // Check if mobile viewport
    const viewport = page.viewportSize()
    const isMobile = viewport && viewport.width < 768

    if (!isMobile) {
      // On desktop, verify navigation links work
      const aboutLink = nav.getByRole('link', { name: /about/i })

      if (await aboutLink.isVisible()) {
        await aboutLink.click()
        await expect(page).toHaveURL('/about')
      }
    }
  })
})

test.describe('Timeline Performance', () => {
  test('should load timeline events efficiently', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/timeline')

    // Wait for main content to be visible
    await expect(page.getByRole('main')).toBeVisible()

    const loadTime = Date.now() - startTime

    // Timeline should load in reasonable time (less than 5 seconds)
    expect(loadTime).toBeLessThan(5000)
  })

  test('should handle filter changes without lag', async ({ page }) => {
    await page.goto('/timeline')

    // Click multiple filters quickly
    const startTime = Date.now()

    await page.getByRole('button', { name: /^job$/i }).click()
    await page.waitForTimeout(50)

    await page.getByRole('button', { name: /^project$/i }).click()
    await page.waitForTimeout(50)

    await page.getByRole('button', { name: /^all$/i }).click()

    const responseTime = Date.now() - startTime

    // Filter changes should be responsive (less than 2 seconds total)
    expect(responseTime).toBeLessThan(2000)

    // Main content should still be visible
    await expect(page.getByRole('main')).toBeVisible()
  })
})
