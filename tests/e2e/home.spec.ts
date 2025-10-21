import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should display the homepage', async ({ page }) => {
    await page.goto('/')

    // Check for main heading (h1)
    await expect(page.getByRole('heading', { name: 'Colin Rodrigues', level: 1 })).toBeVisible()

    // Check for tagline (exact match to avoid footer/title)
    await expect(page.getByText('Product & Strategy', { exact: true })).toBeVisible()
  })

  test('should have correct page title', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/Colin Rodrigues/)
  })

  test('should be responsive', async ({ page }) => {
    await page.goto('/')

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByRole('heading', { name: 'Colin Rodrigues', level: 1 })).toBeVisible()

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByRole('heading', { name: 'Colin Rodrigues', level: 1 })).toBeVisible()

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByRole('heading', { name: 'Colin Rodrigues', level: 1 })).toBeVisible()
  })
})
