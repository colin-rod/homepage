# E2E Testing with Playwright

This directory contains end-to-end tests for the Colin Rodrigues homepage application.

## Test Structure

### Smoke Tests ([smoke.spec.ts](./smoke.spec.ts))

**Purpose:** Quick validation of critical user flows
**Runtime:** ~2-3 minutes
**Browser Coverage:** Chromium only (for speed)
**When to Run:** On every PR to `development`

**Critical Paths Tested:**

- Homepage loads correctly
- Projects page displays project cards
- CV page loads with all filters
- CV filtering functionality works
- CV download links are present
- Timeline page displays events
- Navigation between pages works
- About and Contact pages load
- Responsive design on mobile

### Full Test Suite

**Purpose:** Comprehensive testing across all browsers and devices
**Runtime:** ~10-15 minutes
**Browser Coverage:** Chromium, WebKit, Mobile Chrome
**When to Run:** On every PR to `main` (production)

**Test Files:**

- [home.spec.ts](./home.spec.ts) - Homepage tests
- [projects.spec.ts](./projects.spec.ts) - Projects page tests (69 tests)
- [cv.spec.ts](./cv.spec.ts) - CV page and filtering tests (123 tests)
- [timeline.spec.ts](./timeline.spec.ts) - Timeline page tests (48 tests)
- [static-pages.spec.ts](./static-pages.spec.ts) - About/Now/Contact tests (135 tests)
- [writing.spec.ts](./writing.spec.ts) - Reflections section tests

**Total:** 375+ comprehensive E2E tests

## Running Tests

### Locally

```bash
# Run all E2E tests (full suite)
npm run test:e2e

# Run smoke tests only (fast)
npm run test:e2e:smoke

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug specific test
npm run test:e2e:debug

# View last test report
npm run test:e2e:report
```

### In CI/CD

The GitHub Actions workflow automatically runs tests based on the target branch:

#### PRs to `development`:

```yaml
- Lint & Type Check ✓
- Unit & Component Tests ✓
- E2E Smoke Tests ✓ (Chromium only, ~2-3 min)
- Build ✓
```

#### PRs to `main`:

```yaml
- Lint & Type Check ✓
- Unit & Component Tests ✓
- E2E Full Suite ✓ (All browsers, ~10-15 min)
- Build ✓
```

## Configuration

### Playwright Config ([../../playwright.config.ts](../../playwright.config.ts))

The configuration dynamically adjusts based on environment:

**Local Development:**

- Reuses existing dev server on port 3000
- Runs tests on all configured browsers
- No retries (faster feedback)
- HTML reporter

**CI Environment:**

- Starts production server (`npm run start`)
- Runs tests on configured browsers per job
- 2 retries on failure (handles flakiness)
- HTML + GitHub + List reporters
- Screenshots on failure
- Videos on failure (retained)

**Smoke Tests Mode (`SMOKE_TESTS=1`):**

- Chromium only (faster)
- 10-minute global timeout
- Same retry and reporting logic as full suite

## Best Practices

### Writing E2E Tests

1. **Use semantic selectors** - Prefer `getByRole`, `getByText`, `getByLabel` over CSS selectors
2. **Test user behavior** - Focus on user journeys, not implementation details
3. **Keep tests independent** - Each test should work in isolation
4. **Use page object pattern** - For complex flows, create reusable page objects
5. **Assert meaningful states** - Verify the user can see what they need

### Example Test

```typescript
test('user can filter CV by role type', async ({ page }) => {
  // Navigate to page
  await page.goto('/cv')

  // Verify initial state
  await expect(page.getByRole('heading', { name: /curriculum vitae/i })).toBeVisible()

  // Perform action
  await page.getByRole('button', { name: /product/i }).click()

  // Verify result
  await expect(page.getByText(/showing product experience/i)).toBeVisible()
})
```

## Debugging Failed Tests

### View Test Report

```bash
npm run test:e2e:report
```

This opens an HTML report with:

- Test results by browser
- Screenshots of failures
- Videos of test runs (if enabled)
- Detailed test traces

### Run Single Test

```bash
# Run specific test file
npx playwright test tests/e2e/cv.spec.ts

# Run specific test by name
npx playwright test -g "CV filtering"

# Run in headed mode to see browser
npx playwright test --headed

# Run with debug mode (step through test)
npx playwright test --debug
```

### Common Issues

**Issue:** Tests timeout waiting for server
**Solution:** Ensure no other process is using port 3000, or set `reuseExistingServer: true`

**Issue:** Tests fail on specific browser
**Solution:** Run tests for that browser only: `npx playwright test --project=webkit`

**Issue:** Flaky test (passes sometimes, fails sometimes)
**Solution:** Add explicit waits: `await expect(element).toBeVisible({ timeout: 10000 })`

## CI/CD Integration

### GitHub Actions Workflow

The workflow is defined in [.github/workflows/ci.yml](../../.github/workflows/ci.yml):

```yaml
# Smoke tests on PRs to development
test-e2e-smoke:
  if: github.base_ref == 'development'
  steps:
    - Install Playwright (Chromium only)
    - Build Next.js app
    - Run smoke tests
    - Upload test report

# Full suite on PRs to main
test-e2e-full:
  if: github.base_ref == 'main'
  steps:
    - Install Playwright (all browsers)
    - Build Next.js app
    - Run full test suite
    - Upload test report
```

### Viewing Test Results in GitHub

1. Go to the **Actions** tab in GitHub
2. Click on the workflow run
3. Click on the **E2E Smoke Tests** or **E2E Full Suite** job
4. View the test summary in the job output
5. Download the **playwright-report** artifact to view detailed HTML report

## Coverage

Current E2E test coverage:

| Page/Feature   | Tests    | Status |
| -------------- | -------- | ------ |
| Homepage       | 3        | ✓      |
| Projects       | 69       | ✓      |
| CV & Filtering | 123      | ✓      |
| Timeline       | 48       | ✓      |
| Static Pages   | 135      | ✓      |
| Writing/Blog   | TBD      | ⏳     |
| **Total**      | **375+** | **✓**  |

## Maintenance

### Adding New Tests

1. **Determine test type:**
   - Is it a critical path? → Add to [smoke.spec.ts](./smoke.spec.ts)
   - Is it feature-specific? → Add to appropriate spec file
   - Is it a new feature? → Create new spec file

2. **Write test following TDD:**

   ```bash
   # 1. Write failing test
   # 2. Implement feature
   # 3. Run tests until green
   npm run test:e2e:watch
   ```

3. **Verify locally:**

   ```bash
   npm run test:e2e:smoke  # If critical path
   npm run test:e2e        # If full feature test
   ```

4. **Commit and push:**
   - Tests run automatically in CI
   - Review test results before merging PR

### Updating Dependencies

```bash
# Update Playwright
npm install -D @playwright/test@latest

# Update browser binaries
npx playwright install --with-deps
```

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices Guide](https://playwright.dev/docs/best-practices)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Project CLAUDE.md](../../CLAUDE.md) - Project overview and TDD principles
