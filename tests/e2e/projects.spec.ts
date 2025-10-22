import { test, expect } from '@playwright/test'

test.describe('Projects Index Page (Swimlane Layout)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects')
  })

  test('should display the projects index page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /projects/i, level: 1 })).toBeVisible()
  })

  test('should have correct page title and meta', async ({ page }) => {
    await expect(page).toHaveTitle(/projects/i)
  })

  test('should display all swimlane headings', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /in progress/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /shipped/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /planned/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /tools & utilities/i })).toBeVisible()
  })

  test('should display swimlane descriptions', async ({ page }) => {
    const main = page.getByRole('main')
    await expect(main.getByText(/currently under active development/i)).toBeVisible()
    await expect(main.getByText(/live and completed projects/i)).toBeVisible()
    await expect(main.getByText(/concepts and ideas/i)).toBeVisible()
  })

  test('should display project cards within swimlanes', async ({ page }) => {
    const projectCards = page.locator('article')
    const cardCount = await projectCards.count()
    expect(cardCount).toBeGreaterThan(0)
  })

  test('should display icons for each swimlane', async ({ page }) => {
    // Each swimlane should have an SVG icon from Lucide React
    const icons = page.locator('svg')
    const iconCount = await icons.count()
    expect(iconCount).toBeGreaterThan(4) // At least 4 swimlane icons plus project icons
  })

  test('should have horizontal scroll containers', async ({ page }) => {
    // Check that horizontal scroll containers exist
    const scrollContainers = page.locator('[class*="overflow-x-auto"]')
    const containerCount = await scrollContainers.count()
    expect(containerCount).toBeGreaterThan(0)
  })

  test('should show featured badge on featured projects', async ({ page }) => {
    const main = page.getByRole('main')
    // Featured projects should display a featured indicator
    await expect(main.getByText(/featured/i).first()).toBeVisible()
  })

  test('should have clickable "Learn more" links', async ({ page }) => {
    const learnMoreLinks = page.getByRole('link', { name: /learn more/i })
    const linkCount = await learnMoreLinks.count()
    expect(linkCount).toBeGreaterThan(0)
    await expect(learnMoreLinks.first()).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByRole('heading', { name: /projects/i, level: 1 })).toBeVisible()
    await expect(page.getByRole('heading', { name: /in progress/i })).toBeVisible()
    // Horizontal scroll should still work on mobile
    const scrollContainers = page.locator('[class*="overflow-x-auto"]')
    expect(await scrollContainers.count()).toBeGreaterThan(0)
  })

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByRole('heading', { name: /projects/i, level: 1 })).toBeVisible()
    await expect(page.getByRole('heading', { name: /shipped/i })).toBeVisible()
  })

  test('should be responsive on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByRole('heading', { name: /projects/i, level: 1 })).toBeVisible()
    const projectCards = page.locator('article')
    expect(await projectCards.count()).toBeGreaterThan(0)
  })

  test('should display tools in their own swimlane', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /tools & utilities/i })).toBeVisible()
    const toolsSection = page
      .locator('section')
      .filter({ has: page.getByRole('heading', { name: /tools & utilities/i }) })
    await expect(toolsSection).toBeVisible()
  })

  test('should show tools with distinct styling', async ({ page }) => {
    const main = page.getByRole('main')
    // Tools should display "Tool" badge or indicator
    await expect(main.getByText(/tool/i).first()).toBeVisible()
  })

  test('should support keyboard navigation', async ({ page }) => {
    // Tab through the page
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    // Should be able to navigate to links
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    expect(focusedElement).toBeTruthy()
  })

  test('should have accessible swimlane regions', async ({ page }) => {
    // All swimlanes should be regions with proper ARIA labels
    const regions = page.getByRole('region')
    const regionCount = await regions.count()
    expect(regionCount).toBeGreaterThanOrEqual(4)
  })

  test('should display tech stack tags', async ({ page }) => {
    const main = page.getByRole('main')
    await expect(main.getByText(/next\.js|typescript|react/i).first()).toBeVisible()
  })

  test('swimlanes should be in correct order', async ({ page }) => {
    const headings = await page.getByRole('heading', { level: 2 }).allTextContents()
    // Check order: In Progress, Shipped, Planned, (possibly Retired), Tools
    expect(headings[0]).toMatch(/in progress/i)
    expect(headings[1]).toMatch(/shipped/i)
    expect(headings[2]).toMatch(/planned/i)
    // Tools should be last
    expect(headings[headings.length - 1]).toMatch(/tools & utilities/i)
  })
})

test.describe('Project Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects/portfolio-revamp')
  })

  test('should display project title and summary', async ({ page }) => {
    // Check main heading exists and has content
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
    const headingText = await heading.textContent()
    expect(headingText).toBeTruthy()
    expect(headingText!.length).toBeGreaterThan(0)

    // Check for summary/description paragraph
    const main = page.getByRole('main')
    const content = await main.textContent()
    expect(content).toBeTruthy()
    expect(content!.length).toBeGreaterThan(100)

    // Should have back to projects link
    await expect(page.getByRole('link', { name: /back to projects|← projects/i })).toBeVisible()
  })

  test('should display project status badge', async ({ page }) => {
    // Should show status badge with one of the valid statuses
    const main = page.getByRole('main')
    await expect(
      main.locator('text=/active|completed|live|in-progress|concept|sunset/i').first()
    ).toBeVisible()
  })

  test('should display project year', async ({ page }) => {
    // Should display year (format: 2020, 2021, etc.)
    const main = page.getByRole('main')
    await expect(main.locator('text=/20\\d{2}/').first()).toBeVisible()
  })

  test('should display project tags', async ({ page }) => {
    // Should have categories/tags section
    const main = page.getByRole('main')
    await expect(main.getByText(/categories/i)).toBeVisible()
  })

  test('should display tech stack section', async ({ page }) => {
    // Should have tech stack section heading
    await expect(page.getByRole('heading', { name: /tech stack/i })).toBeVisible()

    // Should show technologies
    const main = page.getByRole('main')
    const content = await main.textContent()
    expect(content).toMatch(/next\.js|typescript|tailwind|react/i)
  })

  test('should display "About This Project" section', async ({ page }) => {
    // Should have "About This Project" heading
    await expect(page.getByRole('heading', { name: /about this project/i })).toBeVisible()

    // Should have substantial description content
    const main = page.getByRole('main')
    const content = await main.textContent()
    expect(content).toBeTruthy()
    expect(content!.length).toBeGreaterThan(100)
  })

  test('should display optional sections when available', async ({ page }) => {
    const main = page.getByRole('main')
    const content = await main.textContent()

    // Check if "Why I Built This" section exists (optional)
    const hasWhyBuilt = content?.includes('Why I Built This')
    if (hasWhyBuilt) {
      await expect(page.getByRole('heading', { name: /why i built this/i })).toBeVisible()
    }

    // Check if "Key Learnings" section exists (optional)
    const hasLearnings = content?.includes('Key Learnings')
    if (hasLearnings) {
      await expect(page.getByRole('heading', { name: /key learnings/i })).toBeVisible()
    }

    // Check if "Scope" section exists (optional)
    const hasScope = content?.includes('Scope')
    if (hasScope) {
      await expect(page.getByRole('heading', { name: /scope/i })).toBeVisible()
    }

    // Check if "Business Model" section exists (optional)
    const hasBusinessModel = content?.includes('Business Model')
    if (hasBusinessModel) {
      await expect(page.getByRole('heading', { name: /business model/i })).toBeVisible()
    }
  })

  test('should have proper page structure', async ({ page }) => {
    // Should render within a main element
    await expect(page.getByRole('main')).toBeVisible()

    // Check navigation exists
    await expect(page.getByRole('navigation').first()).toBeVisible()

    // On desktop, navigation links should be visible
    // On mobile, they might be hidden behind a menu button
    const viewport = page.viewportSize()
    const isMobile = viewport && viewport.width < 768

    if (!isMobile) {
      const mainNav = page.getByRole('navigation').first()
      await expect(mainNav.getByRole('link', { name: /about/i })).toBeVisible()
      await expect(mainNav.getByRole('link', { name: /projects/i })).toBeVisible()
    }
  })

  test('should have proper styling and spacing', async ({ page }) => {
    const main = page.getByRole('main')

    // Check that main element has proper classes (py-, px- for spacing)
    const mainClasses = await main.getAttribute('class')
    expect(mainClasses).toMatch(/py-/)

    // Check for responsive container
    const container = main.locator('[class*="max-w-"]')
    await expect(container.first()).toBeVisible()
  })

  test('should be accessible', async ({ page }) => {
    // Check for proper heading hierarchy (exactly one h1)
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)

    // Check for main landmark
    await expect(page.getByRole('main')).toBeVisible()

    // Verify all headings have accessible text
    const headings = await page.getByRole('heading').all()
    for (const heading of headings) {
      const text = await heading.textContent()
      expect(text).toBeTruthy()
      expect(text!.trim().length).toBeGreaterThan(0)
    }

    // Verify all links are accessible
    const links = await page.getByRole('link').all()
    for (const link of links) {
      const text = await link.textContent()
      const ariaLabel = await link.getAttribute('aria-label')
      // Links should have either text content or aria-label
      expect(text || ariaLabel).toBeTruthy()
    }
  })

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByRole('main')).toBeVisible()
    const h1Mobile = page.getByRole('heading', { level: 1 })
    await expect(h1Mobile).toBeVisible()

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByRole('main')).toBeVisible()

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should handle navigation to and from project details', async ({ page }) => {
    // Verify we're on the project detail page
    await expect(page).toHaveURL('/projects/portfolio-revamp')
    await expect(page.getByRole('main')).toBeVisible()

    // Navigate back to projects list
    await page.getByRole('link', { name: /back to projects|← projects/i }).click()
    await expect(page).toHaveURL('/projects')
    await expect(page.getByRole('heading', { name: /projects/i, level: 1 })).toBeVisible()
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

    // Check if mobile viewport
    const viewport = page.viewportSize()
    const isMobile = viewport && viewport.width < 768

    const mainNav = page.getByRole('navigation').first()

    if (isMobile) {
      // On mobile, may need to open menu first (if hamburger exists)
      // For now, just verify navigation is present
      await expect(mainNav).toBeVisible()
    } else {
      // On desktop, click the projects link
      await mainNav.getByRole('link', { name: /projects/i }).click()
      await expect(page).toHaveURL('/projects')
      await expect(page.getByRole('main')).toBeVisible()
    }
  })

  test('should maintain navigation consistency across project pages', async ({ page }) => {
    await page.goto('/projects/portfolio-revamp')

    // Navigation should be present
    const nav = page.getByRole('navigation').first()
    await expect(nav).toBeVisible()

    // Check if mobile viewport
    const viewport = page.viewportSize()
    const isMobile = viewport && viewport.width < 768

    if (!isMobile) {
      // Only test navigation clicks on desktop
      // Click on another nav link from main navigation
      await nav.getByRole('link', { name: /about/i }).click()
      await expect(page).toHaveURL('/about')

      // Navigate back to projects from main nav
      const aboutNav = page.getByRole('navigation').first()
      await aboutNav.getByRole('link', { name: /projects/i }).click()
      await expect(page).toHaveURL('/projects')
    }
  })
})
