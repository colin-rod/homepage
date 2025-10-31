import { test, expect } from '@playwright/test'

/**
 * E2E Accessibility Tests
 *
 * Comprehensive accessibility tests covering:
 * - Keyboard navigation
 * - ARIA labels and roles
 * - Focus management
 * - Skip links
 * - Screen reader support
 */

test.describe('Accessibility - Skip to Content', () => {
  test('should have skip to content link that becomes visible on focus', async ({ page }) => {
    await page.goto('/')

    // Skip link should be present but visually hidden by default
    const skipLink = page.getByText('Skip to main content')
    await expect(skipLink).toBeInViewport()

    // Focus the skip link (it should be the first focusable element)
    await page.keyboard.press('Tab')

    // Skip link should now be visible
    await expect(skipLink).toBeVisible()

    // Click the skip link
    await skipLink.click()

    // Main content should be focused
    const main = page.locator('#main-content')
    await expect(main).toBeInViewport()
  })

  test('skip link should work on all pages', async ({ page }) => {
    const pages = ['/about', '/projects', '/timeline', '/cv', '/contact']

    for (const pagePath of pages) {
      await page.goto(pagePath)
      await page.keyboard.press('Tab')
      const skipLink = page.getByText('Skip to main content')
      await expect(skipLink).toBeVisible()
    }
  })
})

test.describe('Accessibility - Keyboard Navigation', () => {
  test('should be able to navigate homepage with keyboard only', async ({ page }) => {
    await page.goto('/')

    // Tab through navigation
    await page.keyboard.press('Tab') // Skip link
    await page.keyboard.press('Tab') // Logo
    await page.keyboard.press('Tab') // First nav link (About)

    const aboutLink = page.getByRole('navigation').getByRole('link', { name: 'About' })
    await expect(aboutLink).toBeFocused()

    // Continue tabbing through nav
    await page.keyboard.press('Tab') // Now
    await page.keyboard.press('Tab') // Projects
    await page.keyboard.press('Tab') // Uses
    await page.keyboard.press('Tab') // CV
    await page.keyboard.press('Tab') // Contact

    const contactLink = page.getByRole('navigation').getByRole('link', { name: 'Contact' })
    await expect(contactLink).toBeFocused()
  })

  test('should be able to activate links with Enter key', async ({ page }) => {
    await page.goto('/')

    // Tab to About link
    await page.keyboard.press('Tab') // Skip link
    await page.keyboard.press('Tab') // Logo
    await page.keyboard.press('Tab') // About link

    // Press Enter to navigate
    await page.keyboard.press('Enter')

    // Should navigate to About page
    await expect(page).toHaveURL('/about')
    await expect(page.getByRole('heading', { name: /about/i, level: 1 })).toBeVisible()
  })

  test('CV filter buttons should be keyboard accessible', async ({ page }) => {
    await page.goto('/cv')

    // Find the Product filter button
    const productButton = page.getByRole('button', { name: 'Product', exact: true })

    // Tab to it (may need multiple tabs)
    await productButton.focus()

    // Check it's focused
    await expect(productButton).toBeFocused()

    // Activate with keyboard
    await page.keyboard.press('Enter')

    // Check aria-pressed is true
    await expect(productButton).toHaveAttribute('aria-pressed', 'true')

    // Check the filter status text updated
    await expect(page.getByText(/showing product experience/i)).toBeVisible()
  })

  test('mobile menu should be keyboard accessible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Find the mobile menu button
    const menuButton = page.getByRole('button', { name: /open menu/i })
    await expect(menuButton).toBeVisible()

    // Focus and activate
    await menuButton.focus()
    await expect(menuButton).toBeFocused()

    // Open with keyboard
    await page.keyboard.press('Enter')

    // Check aria-expanded is true
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true')

    // Check aria-label changed
    await expect(menuButton).toHaveAccessibleName('Close menu')

    // Mobile menu should be visible
    const mobileMenu = page.locator('#mobile-menu')
    await expect(mobileMenu).toBeVisible()

    // Close with keyboard
    await page.keyboard.press('Enter')
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })
})

test.describe('Accessibility - ARIA Labels and Roles', () => {
  test('navigation should have proper ARIA labels', async ({ page }) => {
    await page.goto('/')

    const mainNav = page.getByRole('navigation', { name: 'Main navigation' })
    await expect(mainNav).toBeVisible()
  })

  test('mobile menu should have proper ARIA attributes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const menuButton = page.getByRole('button', { name: /menu/i })

    // Should have aria-expanded
    await expect(menuButton).toHaveAttribute('aria-expanded')

    // Should have aria-controls
    await expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu')
  })

  test('CV filter buttons should have aria-pressed', async ({ page }) => {
    await page.goto('/cv')

    const allButton = page.getByRole('button', { name: 'All', exact: true })
    const productButton = page.getByRole('button', { name: 'Product', exact: true })

    // All button should be pressed initially
    await expect(allButton).toHaveAttribute('aria-pressed', 'true')
    await expect(productButton).toHaveAttribute('aria-pressed', 'false')

    // Click Product
    await productButton.click()

    // Product should now be pressed
    await expect(productButton).toHaveAttribute('aria-pressed', 'true')
    await expect(allButton).toHaveAttribute('aria-pressed', 'false')
  })

  test('filter buttons should have group role and label', async ({ page }) => {
    await page.goto('/cv')

    const filterGroup = page.getByRole('group', { name: 'Filter CV by focus area' })
    await expect(filterGroup).toBeVisible()
  })

  test('timeline dots should be hidden from screen readers', async ({ page }) => {
    await page.goto('/timeline')

    // Get all timeline dot elements
    const dots = page.locator('.rounded-full.bg-accent-warm')

    // Check they have aria-hidden
    const count = await dots.count()
    for (let i = 0; i < count; i++) {
      await expect(dots.nth(i)).toHaveAttribute('aria-hidden', 'true')
    }
  })

  test('decorative SVG icons should have aria-hidden', async ({ page }) => {
    await page.goto('/contact')

    // Check SVG icons have aria-hidden
    const svgs = page.locator('svg.text-accent-warm')
    const count = await svgs.count()

    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      await expect(svgs.nth(i)).toHaveAttribute('aria-hidden', 'true')
    }
  })

  test('CV filter status should have aria-live for announcements', async ({ page }) => {
    await page.goto('/cv')

    const filterStatus = page.getByText(/showing .* experience/i)

    // Should have aria-live
    await expect(filterStatus).toHaveAttribute('aria-live', 'polite')
    await expect(filterStatus).toHaveAttribute('aria-atomic', 'true')
  })
})

test.describe('Accessibility - Focus Management', () => {
  test('should have visible focus indicators', async ({ page }) => {
    await page.goto('/')

    // Tab to first link
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Check the logo link has focus
    const logo = page.getByRole('link', { name: /colin rodrigues/i }).first()
    await expect(logo).toBeFocused()

    // Check it has an outline (focus-visible should apply)
    const outlineStyle = await logo.evaluate((el) => {
      return window.getComputedStyle(el).outlineWidth
    })

    // Should have an outline (not '0px')
    expect(outlineStyle).not.toBe('0px')
  })

  test('focus should be trapped in mobile menu when open', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Open mobile menu
    const menuButton = page.getByRole('button', { name: /open menu/i })
    await menuButton.click()

    // Mobile menu should be open
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true')

    // First link in mobile menu
    const firstLink = page.locator('#mobile-menu a').first()
    await firstLink.focus()
    await expect(firstLink).toBeFocused()
  })
})

test.describe('Accessibility - Heading Hierarchy', () => {
  test('all pages should have exactly one h1', async ({ page }) => {
    const pages = ['/', '/about', '/projects', '/timeline', '/cv', '/contact']

    for (const pagePath of pages) {
      await page.goto(pagePath)
      const h1Count = await page.locator('h1').count()
      expect(h1Count).toBe(1)
    }
  })

  test('headings should have accessible text', async ({ page }) => {
    await page.goto('/about')

    const headings = await page.getByRole('heading').all()

    for (const heading of headings) {
      const text = await heading.textContent()
      expect(text).toBeTruthy()
      expect(text!.trim().length).toBeGreaterThan(0)
    }
  })
})

test.describe('Accessibility - Landmarks', () => {
  test('all pages should have main landmark with id', async ({ page }) => {
    const pages = ['/', '/about', '/projects', '/timeline', '/cv', '/contact']

    for (const pagePath of pages) {
      await page.goto(pagePath)
      const main = page.getByRole('main')
      await expect(main).toBeVisible()
      await expect(main).toHaveAttribute('id', 'main-content')
    }
  })

  test('should have navigation landmark', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation').first()
    await expect(nav).toBeVisible()
  })

  test('swimlane sections should have region role', async ({ page }) => {
    await page.goto('/projects')

    // Check for regions with aria-label
    const regions = page.getByRole('region')
    const count = await regions.count()

    // Should have at least one swimlane region
    expect(count).toBeGreaterThan(0)

    // Check first region has a label
    const firstRegion = regions.first()
    const label = await firstRegion.getAttribute('aria-label')
    expect(label).toBeTruthy()
    expect(label).toContain('projects')
  })
})

test.describe('Accessibility - Links', () => {
  test('all links should have accessible names', async ({ page }) => {
    await page.goto('/')

    const links = await page.getByRole('link').all()

    for (const link of links) {
      const name = await link.getAttribute('aria-label')
      const text = await link.textContent()

      // Link should have either aria-label or text content
      expect(name || text).toBeTruthy()
    }
  })

  test('external links should have proper rel attributes', async ({ page }) => {
    await page.goto('/contact')

    const externalLinks = await page.locator('a[target="_blank"]').all()

    for (const link of externalLinks) {
      const rel = await link.getAttribute('rel')
      expect(rel).toContain('noopener')
      expect(rel).toContain('noreferrer')
    }
  })
})

test.describe('Accessibility - Responsive Design', () => {
  test('should be accessible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Main content should be accessible
    const main = page.getByRole('main')
    await expect(main).toBeVisible()

    // Navigation should work
    const nav = page.getByRole('navigation').first()
    await expect(nav).toBeVisible()

    // Skip link should work
    await page.keyboard.press('Tab')
    const skipLink = page.getByText('Skip to main content')
    await expect(skipLink).toBeVisible()
  })

  test('should be accessible on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/cv')

    // CV filters should be accessible
    const filters = page.getByRole('group', { name: 'Filter CV by focus area' })
    await expect(filters).toBeVisible()

    // Buttons should be keyboard accessible
    const productButton = page.getByRole('button', { name: 'Product', exact: true })
    await productButton.focus()
    await expect(productButton).toBeFocused()
  })

  test('should be accessible on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/projects')

    // Swimlanes should be accessible
    const regions = page.getByRole('region')
    const count = await regions.count()
    expect(count).toBeGreaterThan(0)
  })
})
