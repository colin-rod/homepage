import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should display the coming soon page', async ({ page }) => {
    await page.goto('/')

    // Check for heading
    await expect(page.getByRole('heading', { name: 'Colin Rodrigues' })).toBeVisible()

    // Check for tagline
    await expect(page.getByText(/Product & Strategy/i)).toBeVisible()

    // Check for coming soon message
    await expect(page.getByText('Coming Soon')).toBeVisible()
  })

  test('should have correct page title', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/Colin Rodrigues/)
  })

  test('should be responsive', async ({ page }) => {
    await page.goto('/')

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByRole('heading', { name: 'Colin Rodrigues' })).toBeVisible()

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByRole('heading', { name: 'Colin Rodrigues' })).toBeVisible()

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByRole('heading', { name: 'Colin Rodrigues' })).toBeVisible()
  })
})
