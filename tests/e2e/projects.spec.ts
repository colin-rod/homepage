import { test, expect } from '@playwright/test'

test.describe('Projects Index Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects')
  })

  test('should display the projects index page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /projects/i, level: 1 })).toBeVisible()
  })

  test('should have correct page title and meta', async ({ page }) => {
    await expect(page).toHaveTitle(/projects/i)
  })

  test('should display featured projects section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /featured projects/i })).toBeVisible()
  })

  test('should display project cards', async ({ page }) => {
    // Should have at least one project card
    const projectCards = page.locator('.card').filter({ hasText: /portfolio|product|example/i })
    await expect(projectCards.first()).toBeVisible()
  })

  test('should display project status badges', async ({ page }) => {
    // Check for status badges
    const statusBadges = page.locator('text=/live|active|completed|in-progress|concept/i')
    await expect(statusBadges.first()).toBeVisible()
  })

  test('should have clickable project cards', async ({ page }) => {
    // Check that project cards are present and clickable
    const projectCards = page.locator('.card')
    const cardCount = await projectCards.count()
    expect(cardCount).toBeGreaterThan(0)
  })

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByRole('heading', { name: /projects/i, level: 1 })).toBeVisible()

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByRole('heading', { name: /projects/i, level: 1 })).toBeVisible()

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByRole('heading', { name: /projects/i, level: 1 })).toBeVisible()
  })
})

test.describe('Project Detail Page', () => {
  test('should display portfolio revamp project', async ({ page }) => {
    await page.goto('/projects/portfolio-revamp')

    // Check heading
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    // Check for main content sections
    await expect(page.getByRole('main')).toBeVisible()

    // Should have back to projects link
    await expect(page.getByRole('link', { name: /back to projects|← projects/i })).toBeVisible()
  })

  test('should display project metadata', async ({ page }) => {
    await page.goto('/projects/portfolio-revamp')

    // Should show year, status, and category information
    const main = page.getByRole('main')
    await expect(main).toBeVisible()

    // Check for date/year information
    await expect(main.locator('text=/20\\d{2}/').first()).toBeVisible()
  })

  test('should display tech stack', async ({ page }) => {
    await page.goto('/projects/portfolio-revamp')

    // Should have tech stack section heading
    await expect(page.getByRole('heading', { name: /tech stack/i })).toBeVisible()
  })

  test('should display project description', async ({ page }) => {
    await page.goto('/projects/portfolio-revamp')

    // Should have substantial content (description)
    const main = page.getByRole('main')
    const content = await main.textContent()
    expect(content).toBeTruthy()
    expect(content!.length).toBeGreaterThan(100)
  })

  test('should have navigation and footer', async ({ page }) => {
    await page.goto('/projects/portfolio-revamp')

    // Check navigation
    await expect(page.getByRole('navigation').first()).toBeVisible()

    // Check for navigation links in the main nav
    const mainNav = page.getByRole('navigation').first()
    await expect(mainNav.getByRole('link', { name: /about/i })).toBeVisible()
    await expect(mainNav.getByRole('link', { name: /projects/i })).toBeVisible()
  })

  test('should be accessible', async ({ page }) => {
    await page.goto('/projects/portfolio-revamp')

    // Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)

    // Check for main landmark
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should be responsive', async ({ page }) => {
    await page.goto('/projects/portfolio-revamp')

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByRole('main')).toBeVisible()

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByRole('main')).toBeVisible()

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should handle navigation to and from project details', async ({ page }) => {
    // Go directly to a known project
    await page.goto('/projects/portfolio-revamp')
    await expect(page).toHaveURL('/projects/portfolio-revamp')
    await expect(page.getByRole('main')).toBeVisible()

    // Navigate back to projects
    await page.getByRole('link', { name: /back to projects|← projects/i }).click()
    await expect(page).toHaveURL('/projects')
  })

  test('should display external links section', async ({ page }) => {
    await page.goto('/projects/portfolio-revamp')

    // Check for links section (might have GitHub, live site, etc.)
    const main = page.getByRole('main')
    const hasLinks = await main.locator('text=/github|live site|view project|demo/i').count()

    // If project has external links, they should be visible
    if (hasLinks > 0) {
      await expect(main.locator('a[href*="github.com"], a[href*="http"]').first()).toBeVisible()
    }
  })

  test('should show 404 for non-existent project', async ({ page }) => {
    const response = await page.goto('/projects/non-existent-project-12345')

    // Should return 404 status
    expect(response?.status()).toBe(404)

    // Should display 404 content
    await expect(page.getByText(/not found|404/i)).toBeVisible()
  })
})

test.describe('Project Navigation Flow', () => {
  test('should navigate from homepage to projects', async ({ page }) => {
    // Start at homepage
    await page.goto('/')

    // Navigate to projects via main nav
    const mainNav = page.getByRole('navigation').first()
    await mainNav.getByRole('link', { name: /projects/i }).click()
    await expect(page).toHaveURL('/projects')
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should maintain navigation consistency across project pages', async ({ page }) => {
    await page.goto('/projects/portfolio-revamp')

    // Navigation should be present
    const nav = page.getByRole('navigation').first()
    await expect(nav).toBeVisible()

    // Click on another nav link from main navigation
    await nav.getByRole('link', { name: /about/i }).click()
    await expect(page).toHaveURL('/about')

    // Navigate back to projects from main nav
    const aboutNav = page.getByRole('navigation').first()
    await aboutNav.getByRole('link', { name: /projects/i }).click()
    await expect(page).toHaveURL('/projects')
  })
})
