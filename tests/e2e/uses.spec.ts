import { test, expect } from '@playwright/test'

test.describe('Uses Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/uses')
  })

  test('displays page title and description', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Uses' })).toBeVisible()
    await expect(page.getByText(/Inspired by the community at uses.tech/i)).toBeVisible()
  })

  test('has correct page metadata', async ({ page }) => {
    await expect(page).toHaveTitle(/Uses/)

    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', /hardware, software, and rituals/i)
  })

  test('displays navigation and footer', async ({ page }) => {
    // Check for navigation
    const nav = page.getByRole('navigation').first()
    await expect(nav).toBeVisible()

    // Check for footer
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  test('displays at least one category section', async ({ page }) => {
    const categoryHeading = page.getByRole('heading', { level: 2 }).first()
    await expect(categoryHeading).toBeVisible()
  })

  test('displays tool items with names', async ({ page }) => {
    const toolHeading = page.getByRole('heading', { level: 3 }).first()
    await expect(toolHeading).toBeVisible()
  })

  test('renders external links with correct attributes', async ({ page }) => {
    const externalLinks = page.locator('a[target="_blank"][rel="noopener noreferrer"]')
    const linkCount = await externalLinks.count()

    if (linkCount > 0) {
      const firstLink = externalLinks.first()
      await expect(firstLink).toHaveAttribute('target', '_blank')
      await expect(firstLink).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  test('displays tool context panels', async ({ page }) => {
    // Context panels should be visible within tool items
    const contextPanels = page.locator('.rounded-xl.border.border-divider\\/70')
    await expect(contextPanels.first()).toBeVisible()
  })

  test('displays tool tags when present', async ({ page }) => {
    // Tags are displayed as badges with uppercase text
    const tags = page.locator('.uppercase.tracking-wide')
    const tagCount = await tags.count()

    // Should have at least some tags across all tools
    expect(tagCount).toBeGreaterThan(0)
  })

  test('displays favicons for tools that have them', async ({ page }) => {
    const favicons = page.locator('img[alt*="icon"]')
    const faviconCount = await favicons.count()

    if (faviconCount > 0) {
      const firstFavicon = favicons.first()
      await expect(firstFavicon).toBeVisible()
      await expect(firstFavicon).toHaveAttribute('loading', 'lazy')
    }
  })

  test('has proper semantic HTML structure', async ({ page }) => {
    // Should have main content area
    const main = page.locator('main#main-content')
    await expect(main).toBeVisible()

    // Should have article elements for each tool
    const articles = page.locator('article')
    const articleCount = await articles.count()
    expect(articleCount).toBeGreaterThan(0)
  })

  test('has accessible ARIA labels', async ({ page }) => {
    // Category sections should have ARIA labels
    const sections = page.locator('section[aria-labelledby]')
    const sectionCount = await sections.count()
    expect(sectionCount).toBeGreaterThan(0)
  })

  test('is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    const heading = page.getByRole('heading', { level: 1, name: 'Uses' })
    await expect(heading).toBeVisible()

    const toolCards = page.locator('article')
    await expect(toolCards.first()).toBeVisible()
  })

  test('is responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })

    const heading = page.getByRole('heading', { level: 1, name: 'Uses' })
    await expect(heading).toBeVisible()
  })

  test('displays category descriptions when present', async ({ page }) => {
    // Look for category descriptions (text below category titles)
    const categorySection = page.locator('section').first()
    const categoryTitle = categorySection.getByRole('heading', { level: 2 })
    await expect(categoryTitle).toBeVisible()
  })

  test('tool cards have proper grid layout', async ({ page }) => {
    // Check that tool cards use grid layout on larger screens
    const toolCard = page.locator('article').first()
    await expect(toolCard).toBeVisible()

    // Grid should be within the card
    const grid = toolCard.locator('.grid.gap-4')
    await expect(grid).toBeVisible()
  })

  test('external link icons are present for linked tools', async ({ page }) => {
    const externalLinkIcons = page.locator('a[target="_blank"] svg')
    const iconCount = await externalLinkIcons.count()

    if (iconCount > 0) {
      await expect(externalLinkIcons.first()).toBeVisible()
    }
  })

  test('page scrolls to show all categories', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Page should still show content after scroll
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  test('has correct spacing and padding', async ({ page }) => {
    const main = page.locator('main')
    await expect(main).toHaveClass(/pt-12/)
    await expect(main).toHaveClass(/pb-24/)
  })

  test('sr-only text for accessibility on external links', async ({ page }) => {
    const srOnlyText = page.locator('.sr-only')
    const srCount = await srOnlyText.count()

    if (srCount > 0) {
      const firstSrText = srOnlyText.first()
      await expect(firstSrText).toHaveText(/Open/i)
    }
  })
})
