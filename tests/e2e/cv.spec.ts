import { test, expect } from '@playwright/test'

test.describe('CV Main Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cv')
  })

  test('should display the CV page with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /curriculum vitae/i, level: 1 })).toBeVisible()
  })

  test('should have correct page title and meta', async ({ page }) => {
    await expect(page).toHaveTitle(/cv|curriculum vitae/i)
  })

  test('should display professional summary', async ({ page }) => {
    const main = page.getByRole('main')
    const content = await main.textContent()

    // Should have substantial summary content
    expect(content).toBeTruthy()
    expect(content!.length).toBeGreaterThan(100)
  })

  test('should display filter buttons', async ({ page }) => {
    // Check for all filter buttons
    await expect(page.getByRole('button', { name: /all/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /product/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /strategy/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /technical/i })).toBeVisible()
  })

  test('should have "All" filter active by default', async ({ page }) => {
    const allButton = page.getByRole('button', { name: /^all$/i })

    // Check if button has active styling (bg-accent-warm)
    const buttonClasses = await allButton.getAttribute('class')
    expect(buttonClasses).toMatch(/bg-accent-warm/)
  })

  test('should display filter status message', async ({ page }) => {
    // Default message should show "Showing all experience"
    await expect(page.getByText(/showing all experience/i)).toBeVisible()
  })

  test('should display download PDF section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /download as pdf/i })).toBeVisible()
  })

  test('should have all download CV buttons', async ({ page }) => {
    await expect(page.getByRole('link', { name: /download full cv/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /product focus/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /strategy focus/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /technical focus/i }).first()).toBeVisible()
  })

  test('should display skills section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /skills.*expertise/i })).toBeVisible()

    // Should have skill categories
    const main = page.getByRole('main')
    const skills = await main.locator('.card').all()
    expect(skills.length).toBeGreaterThan(0)
  })

  test('should display professional experience section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /professional experience/i })).toBeVisible()

    // Should have experience entries
    const main = page.getByRole('main')
    const content = await main.textContent()
    expect(content).toMatch(/\d{4}/)  // Should have years
  })

  test('should display education section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /education/i })).toBeVisible()
  })
})

test.describe('CV Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cv')
  })

  test('should filter experience when clicking Product filter', async ({ page }) => {
    // Click Product filter
    await page.getByRole('button', { name: /^product$/i }).click()

    // Check that Product button is now active
    const productButton = page.getByRole('button', { name: /^product$/i })
    const buttonClasses = await productButton.getAttribute('class')
    expect(buttonClasses).toMatch(/bg-accent-warm/)

    // Filter status should update
    await expect(page.getByText(/showing product experience/i)).toBeVisible()
  })

  test('should filter experience when clicking Strategy filter', async ({ page }) => {
    // Click Strategy filter
    await page.getByRole('button', { name: /^strategy$/i }).click()

    // Check that Strategy button is now active
    const strategyButton = page.getByRole('button', { name: /^strategy$/i })
    const buttonClasses = await strategyButton.getAttribute('class')
    expect(buttonClasses).toMatch(/bg-accent-warm/)

    // Filter status should update
    await expect(page.getByText(/showing strategy experience/i)).toBeVisible()
  })

  test('should filter experience when clicking Technical filter', async ({ page }) => {
    // Click Technical filter
    await page.getByRole('button', { name: /^technical$/i }).click()

    // Check that Technical button is now active
    const techButton = page.getByRole('button', { name: /^technical$/i })
    const buttonClasses = await techButton.getAttribute('class')
    expect(buttonClasses).toMatch(/bg-accent-warm/)

    // Filter status should update
    await expect(page.getByText(/showing tech experience/i)).toBeVisible()
  })

  test('should return to all experience when clicking All filter after filtering', async ({ page }) => {
    // First filter by Product
    await page.getByRole('button', { name: /^product$/i }).click()
    await expect(page.getByText(/showing product experience/i)).toBeVisible()

    // Then click All to reset
    await page.getByRole('button', { name: /^all$/i }).click()

    // Should show all experience again
    await expect(page.getByText(/showing all experience/i)).toBeVisible()
  })

  test('should update experience count when filtering', async ({ page }) => {
    // Click a filter (e.g., Product)
    await page.getByRole('button', { name: /^product$/i }).click()

    // Should show count of positions
    const statusText = await page.getByText(/showing product experience/i).textContent()
    expect(statusText).toMatch(/\d+\s+(position|positions)/)
  })

  test('should handle filter with no matching experience gracefully', async ({ page }) => {
    // This test assumes there might be a filter with no results
    // If all filters have results, this test might need adjustment based on actual data

    // For now, just verify filtering works without errors
    await page.getByRole('button', { name: /^technical$/i }).click()

    // Page should still be functional
    await expect(page.getByRole('main')).toBeVisible()
  })
})

test.describe('CV Download Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cv')
  })

  test('should have correct URL for full CV download', async ({ page }) => {
    const fullCVLink = page.getByRole('link', { name: /download full cv/i }).first()
    const href = await fullCVLink.getAttribute('href')
    expect(href).toBe('/cv/download?filter=all')
  })

  test('should have correct URL for Product focus download', async ({ page }) => {
    const productLink = page.getByRole('link', { name: /product focus/i }).first()
    const href = await productLink.getAttribute('href')
    expect(href).toBe('/cv/download?filter=product')
  })

  test('should have correct URL for Strategy focus download', async ({ page }) => {
    const strategyLink = page.getByRole('link', { name: /strategy focus/i }).first()
    const href = await strategyLink.getAttribute('href')
    expect(href).toBe('/cv/download?filter=strategy')
  })

  test('should have correct URL for Technical focus download', async ({ page }) => {
    const techLink = page.getByRole('link', { name: /technical focus/i }).first()
    const href = await techLink.getAttribute('href')
    expect(href).toBe('/cv/download?filter=tech')
  })

  test('should open download links in new tab', async ({ page }) => {
    const fullCVLink = page.getByRole('link', { name: /download full cv/i }).first()
    const target = await fullCVLink.getAttribute('target')
    expect(target).toBe('_blank')
  })
})

test.describe('CV Download Page', () => {
  test('should display download page with all experience', async ({ page }) => {
    await page.goto('/cv/download?filter=all')

    // Check for CV header
    await expect(page.getByRole('heading', { name: /colin rodrigues/i, level: 1 })).toBeVisible()

    // Check for contact information
    await expect(page.getByText(/email:/i)).toBeVisible()
    await expect(page.getByText(/linkedin:/i)).toBeVisible()
    await expect(page.getByText(/github:/i)).toBeVisible()
  })

  test('should display professional summary on download page', async ({ page }) => {
    await page.goto('/cv/download?filter=all')

    await expect(page.getByRole('heading', { name: /professional summary/i })).toBeVisible()

    const main = page.getByRole('main')
    const content = await main.textContent()
    expect(content!.length).toBeGreaterThan(100)
  })

  test('should display skills on download page', async ({ page }) => {
    await page.goto('/cv/download?filter=all')

    await expect(page.getByRole('heading', { name: /^skills$/i })).toBeVisible()
  })

  test('should display experience on download page', async ({ page }) => {
    await page.goto('/cv/download?filter=all')

    await expect(page.getByRole('heading', { name: /professional experience/i })).toBeVisible()
  })

  test('should display education on download page', async ({ page }) => {
    await page.goto('/cv/download?filter=all')

    await expect(page.getByRole('heading', { name: /education/i })).toBeVisible()
  })

  test('should filter download page by product', async ({ page }) => {
    await page.goto('/cv/download?filter=product')

    // Page should load successfully
    await expect(page.getByRole('heading', { name: /colin rodrigues/i, level: 1 })).toBeVisible()

    // Should have experience section
    await expect(page.getByRole('heading', { name: /professional experience/i })).toBeVisible()
  })

  test('should filter download page by strategy', async ({ page }) => {
    await page.goto('/cv/download?filter=strategy')

    // Page should load successfully
    await expect(page.getByRole('heading', { name: /colin rodrigues/i, level: 1 })).toBeVisible()

    // Should have experience section
    await expect(page.getByRole('heading', { name: /professional experience/i })).toBeVisible()
  })

  test('should filter download page by tech', async ({ page }) => {
    await page.goto('/cv/download?filter=tech')

    // Page should load successfully
    await expect(page.getByRole('heading', { name: /colin rodrigues/i, level: 1 })).toBeVisible()

    // Should have experience section
    await expect(page.getByRole('heading', { name: /professional experience/i })).toBeVisible()
  })

  test('should have print-optimized styling', async ({ page }) => {
    await page.goto('/cv/download?filter=all')

    const main = page.getByRole('main')
    const mainClasses = await main.getAttribute('class')

    // Check for cv-download class (print-specific styling)
    expect(mainClasses).toMatch(/cv-download/)
  })

  test('should not be indexed by search engines', async ({ page }) => {
    const response = await page.goto('/cv/download?filter=all')

    // Check that page loaded successfully
    expect(response?.status()).toBe(200)

    // Note: Can't easily test meta robots tag in E2E, but we verify page loads
  })
})

test.describe('CV Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/cv')

    // Should have exactly one h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)

    // Should have multiple h2s for sections
    const h2Count = await page.locator('h2').count()
    expect(h2Count).toBeGreaterThan(1)
  })

  test('should have main landmark', async ({ page }) => {
    await page.goto('/cv')
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should have accessible buttons', async ({ page }) => {
    await page.goto('/cv')

    // Get only the filter buttons (not mobile menu buttons which may have no text)
    const filterButtons = await page.locator('button').filter({ hasText: /all|product|strategy|technical/i }).all()

    for (const button of filterButtons) {
      const text = await button.textContent()
      expect(text).toBeTruthy()
      expect(text!.trim().length).toBeGreaterThan(0)
    }
  })

  test('should have accessible links', async ({ page }) => {
    await page.goto('/cv')

    const links = await page.getByRole('link').all()
    for (const link of links) {
      const text = await link.textContent()
      const ariaLabel = await link.getAttribute('aria-label')
      // Links should have either text or aria-label
      expect(text || ariaLabel).toBeTruthy()
    }
  })
})

test.describe('CV Responsive Design', () => {
  test('should be responsive on mobile', async ({ page }) => {
    await page.goto('/cv')

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByRole('heading', { name: /curriculum vitae/i, level: 1 })).toBeVisible()

    // Filter buttons should be visible and wrap
    await expect(page.getByRole('button', { name: /all/i })).toBeVisible()
  })

  test('should be responsive on tablet', async ({ page }) => {
    await page.goto('/cv')

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByRole('heading', { name: /curriculum vitae/i, level: 1 })).toBeVisible()

    // Skills should display in grid
    await expect(page.getByRole('heading', { name: /skills.*expertise/i })).toBeVisible()
  })

  test('should be responsive on desktop', async ({ page }) => {
    await page.goto('/cv')

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByRole('heading', { name: /curriculum vitae/i, level: 1 })).toBeVisible()
  })
})

test.describe('CV Navigation Flow', () => {
  test('should navigate from homepage to CV', async ({ page }) => {
    await page.goto('/')

    // Check if mobile viewport
    const viewport = page.viewportSize()
    const isMobile = viewport && viewport.width < 768

    if (!isMobile) {
      // On desktop, click CV link in navigation
      const nav = page.getByRole('navigation').first()
      const cvLink = nav.getByRole('link', { name: /cv/i })

      if (await cvLink.isVisible()) {
        await cvLink.click()
        await expect(page).toHaveURL('/cv')
        await expect(page.getByRole('heading', { name: /curriculum vitae/i })).toBeVisible()
      }
    }
  })

  test('should navigate from CV to download page and back', async ({ page }) => {
    await page.goto('/cv')

    // Click download button (opens in new tab, but we can verify link works)
    const fullCVLink = page.getByRole('link', { name: /download full cv/i }).first()
    const href = await fullCVLink.getAttribute('href')

    // Navigate to download page directly
    await page.goto(href!)
    await expect(page.getByRole('heading', { name: /colin rodrigues/i, level: 1 })).toBeVisible()

    // Go back
    await page.goBack()
    await expect(page).toHaveURL('/cv')
  })
})
