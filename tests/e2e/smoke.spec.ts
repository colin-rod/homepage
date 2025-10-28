import { test, expect } from '@playwright/test'

/**
 * Smoke Tests - Critical User Flows
 *
 * These tests cover the most critical user journeys and should run quickly (~2-3 minutes).
 * They are designed to catch major regressions before deployment.
 *
 * Run with: npm run test:e2e:smoke
 */

test.describe('Smoke Tests - Critical Paths', () => {
  test('homepage should load and display core content', async ({ page }) => {
    await page.goto('/')

    // Verify page loads
    await expect(page).toHaveTitle(/Colin Rodrigues/)

    // Verify hero section
    await expect(page.getByRole('heading', { name: 'Colin Rodrigues', level: 1 })).toBeVisible()
    await expect(page.getByText(/Building, Reflecting & Sharing/i)).toBeVisible()
  })

  test('projects page should display project cards', async ({ page }) => {
    await page.goto('/projects')

    // Verify page loads
    await expect(page).toHaveTitle(/projects/i)
    await expect(page.getByRole('heading', { name: /projects/i, level: 1 })).toBeVisible()

    // Verify at least one project card is visible
    const projectCards = page.locator('.card')
    await expect(projectCards.first()).toBeVisible()
  })

  test('CV page should load with all filters', async ({ page }) => {
    await page.goto('/cv')

    // Verify page loads
    await expect(page).toHaveTitle(/cv|curriculum vitae/i)
    await expect(page.getByRole('heading', { name: /curriculum vitae/i, level: 1 })).toBeVisible()

    // Verify filter buttons exist
    await expect(page.getByRole('button', { name: /all/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /product/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /strategy/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /technical/i })).toBeVisible()
  })

  test('CV filtering should work correctly', async ({ page }) => {
    await page.goto('/cv')

    // Click Product filter
    await page.getByRole('button', { name: /^product$/i }).click()

    // Verify filter status message updates
    await expect(page.getByText(/showing product experience/i)).toBeVisible()

    // Verify Product button has active styling
    const productButton = page.getByRole('button', { name: /^product$/i })
    const buttonClasses = await productButton.getAttribute('class')
    expect(buttonClasses).toMatch(/bg-accent-warm/)
  })

  test('CV download links should be present', async ({ page }) => {
    await page.goto('/cv')

    // Verify download section exists
    await expect(page.getByRole('heading', { name: /download as pdf/i })).toBeVisible()

    // Verify at least one download link exists
    const downloadLinks = page.getByRole('link', { name: /download.*cv/i })
    await expect(downloadLinks.first()).toBeVisible()
  })

  test('timeline page should load and display events', async ({ page }) => {
    await page.goto('/timeline')

    // Verify page loads
    await expect(page).toHaveTitle(/timeline/i)
    await expect(page.getByRole('heading', { name: /timeline/i, level: 1 })).toBeVisible()

    // Verify timeline content is present (at least one event)
    const main = page.getByRole('main')
    const content = await main.textContent()
    expect(content).toBeTruthy()
    expect(content!.length).toBeGreaterThan(100)
  })

  test('navigation between pages should work', async ({ page }) => {
    // Start at homepage
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Colin Rodrigues', level: 1 })).toBeVisible()

    // Navigate to projects (if navigation link exists)
    const projectsLink = page.getByRole('link', { name: /projects/i }).first()
    if (await projectsLink.isVisible()) {
      await projectsLink.click()
      await expect(page).toHaveURL(/\/projects/)
    }
  })

  test('about page should load', async ({ page }) => {
    await page.goto('/about')

    // Verify page loads
    await expect(page).toHaveTitle(/about/i)
    await expect(page.getByRole('heading', { name: /about/i, level: 1 })).toBeVisible()
  })

  test('contact page should load with form or contact info', async ({ page }) => {
    await page.goto('/contact')

    // Verify page loads
    await expect(page).toHaveTitle(/contact/i)
    await expect(
      page.getByRole('heading', { name: /let's connect|connect/i, level: 1 })
    ).toBeVisible()

    // Verify main content exists
    const main = page.getByRole('main')
    const content = await main.textContent()
    expect(content).toBeTruthy()
  })

  test('site should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Test homepage
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Colin Rodrigues', level: 1 })).toBeVisible()

    // Test projects page
    await page.goto('/projects')
    await expect(page.getByRole('heading', { name: /projects/i, level: 1 })).toBeVisible()

    // Test CV page
    await page.goto('/cv')
    await expect(page.getByRole('heading', { name: /curriculum vitae/i, level: 1 })).toBeVisible()
  })
})
