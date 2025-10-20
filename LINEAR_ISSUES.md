# Linear Issues - Complete Update

This document contains all new epics, new issues, issue updates, priority labels, and dependencies for the Personal Homepage project.

---

## 📊 New Epics to Create

### EPIC 10: Contact & Utilities

**Title:** EPIC 10: Contact & Utilities

**Description:**
Contact page, Uses page, and Colophon page implementation.

**Phase:** Phase 4 – Polish & Deployment

**Labels:** frontend, content

**Priority:** P2

---

### EPIC 11: Content Creation

**Title:** EPIC 11: Content Creation

**Description:**
Content population and creation tasks. This epic tracks the writing and curation of all site content including bio, project descriptions, blog posts, and CV data.

**Note:** Content creation can happen in parallel with development. Placeholder content will be used during development.

**Labels:** content

**Priority:** P2

**Assignee:** Colin

---

### EPIC 12: Testing & Quality

**Title:** EPIC 12: Testing & Quality

**Description:**
Testing infrastructure setup and quality assurance processes.

This epic covers the setup of Jest, React Testing Library, Playwright, and testing utilities. Individual test implementation happens within each feature epic following TDD principles.

**Phase:** Phase 1 – Foundation

**Labels:** infra, testing

**Priority:** P0

---

### EPIC 13: DevOps & CI/CD

**Title:** EPIC 13: DevOps & CI/CD

**Description:**
DevOps infrastructure, CI/CD pipeline, GitHub Actions, branch strategy, and deployment configuration.

**Phase:** Phase 1 – Foundation

**Labels:** infra, devops

**Priority:** P0

---

### EPIC 14: Future Enhancements

**Title:** EPIC 14: Future Enhancements

**Description:**
Post-MVP enhancements and advanced features to be implemented in v2.

This includes:
- Advanced animation libraries (GSAP, Framer Motion)
- 3D Timeline features
- Email integration for contact form
- Programmatic PDF generation
- Advanced data visualizations
- Theme engine
- Other v2 features

**Labels:** enhancement

**Priority:** P4

---

## 🆕 New Issues to Create

### EPIC 1: Foundation & Setup

#### CRO-634: Define data architecture and shared types

**Parent:** CRO-575 (EPIC 1: Foundation & Setup)

**Estimate:** 5 story points

**Description:**
Create unified data architecture with shared TypeScript interfaces for all data models.

**Acceptance Criteria:**
- [ ] Create `/data` folder structure
- [ ] Define TypeScript interfaces in `/lib/types.ts`:
  - `TimelineEvent` - Timeline entries (jobs, projects, milestones)
  - `Project` - Project data model
  - `CVData` - CV/resume structure
  - `BlogPost` - Writing/blog posts
- [ ] Document data relationships (Timeline ↔ CV, Projects ↔ CV)
- [ ] Create example JSON files with schema comments
- [ ] Add data validation utilities
- [ ] Document in CLAUDE.md

**Technical Notes:**
- Ensure tags are consistent across data sources
- Timeline events marked as `type: 'job'` should align with CV experience
- CV can reference projects by ID
- Use ISO 8601 dates for all date fields

**Labels:** backend, infra

**Priority:** P0

**Blocked by:** CRO-576 (Initialize Next.js + Tailwind project)

---

### EPIC 6: Dynamic CV System

#### CRO-634: Update CRO-621 - Create print-optimized CV pages

**Note:** This is an update to existing issue CRO-621

**New Title:** Create print-optimized CV pages for download

**Estimate:** 8 story points

**New Description:**
Create print-optimized pages for CV downloads using browser print CSS.

**Approach:**
- Create dedicated routes: `/cv/download?filter={product|strategy|tech|full}`
- Style pages with `@media print` CSS for clean, ATS-friendly PDFs
- Users can print-to-PDF directly from browser (Cmd/Ctrl+P)
- Pre-generate common filter variations

**Acceptance Criteria:**
- [ ] Create `/app/cv/download/page.tsx` route
- [ ] Accept `filter` query parameter (product, strategy, tech, full)
- [ ] Render CV content filtered by tag
- [ ] Apply print-friendly styles:
  - Single column layout
  - Black text on white background
  - No animations or interactions
  - Clickable URLs included
  - Page breaks at logical sections
- [ ] Hide navigation and footer in print view
- [ ] Test print output in Chrome, Firefox, Safari
- [ ] Ensure ATS-friendly formatting (simple, scannable)
- [ ] Add meta tags to prevent indexing of download routes

**Technical Notes:**
```css
@media print {
  /* Hide UI elements */
  nav, footer, button { display: none; }

  /* Optimize typography */
  body { font-size: 12pt; }

  /* Page breaks */
  .section { page-break-inside: avoid; }

  /* Link visibility */
  a { text-decoration: underline; }
  a[href]:after { content: " (" attr(href) ")"; }
}
```

**Future Enhancement:** Programmatic PDF generation with Puppeteer (moved to EPIC 14)

**Labels:** frontend, infra

**Priority:** P2

**Blocked by:**
- CRO-597 (Add tag-based filtering to CV)
- CRO-596 (Implement base /cv page)

---

### EPIC 9: Deployment & Docs

#### CRO-635: Set up Sentry error monitoring

**Parent:** CRO-630 (EPIC 9: Deployment & Docs)

**Estimate:** 3 story points

**Description:**
Configure Sentry for error tracking and performance monitoring in production.

**Acceptance Criteria:**
- [ ] Create Sentry project
- [ ] Install `@sentry/nextjs` package
- [ ] Configure `sentry.client.config.ts`
- [ ] Configure `sentry.server.config.ts`
- [ ] Configure `sentry.edge.config.ts`
- [ ] Add `SENTRY_DSN` to environment variables
- [ ] Set up source maps for production builds
- [ ] Configure release tracking
- [ ] Test error capture in development
- [ ] Add error boundaries to critical pages
- [ ] Configure sampling rate for performance monitoring
- [ ] Document in CLAUDE.md

**Technical Notes:**
```javascript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% of transactions
  beforeSend(event) {
    // Filter out sensitive data
    return event;
  },
});
```

**Labels:** infra, monitoring

**Priority:** P3

**Blocked by:** CRO-633 (Deploy to Vercel)

---

#### CRO-636: Set up PostHog analytics and session replay

**Parent:** CRO-630 (EPIC 9: Deployment & Docs)

**Estimate:** 5 story points

**Description:**
Configure PostHog for analytics, event tracking, and session recordings.

**Acceptance Criteria:**
- [ ] Install `posthog-js` package
- [ ] Create PostHog provider component
- [ ] Add `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` to env
- [ ] Initialize PostHog in app layout
- [ ] Configure session recording (privacy-conscious settings)
- [ ] Set up custom events:
  - Page views (automatic)
  - CTA clicks (Download CV, Contact, Projects)
  - CV filter changes
  - Project card clicks
  - Timeline interactions
- [ ] Test events in PostHog dashboard
- [ ] Configure user privacy settings (anonymize IPs)
- [ ] Document tracked events in CLAUDE.md

**Technical Notes:**
```javascript
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  loaded: (posthog) => {
    if (process.env.NODE_ENV === 'development') posthog.opt_out_capturing()
  },
  capture_pageview: true,
  capture_pageleave: true,
  session_recording: {
    maskAllInputs: true, // Privacy
    maskTextSelector: '[data-private]',
  }
})
```

**Labels:** infra, monitoring

**Priority:** P3

**Blocked by:** CRO-633 (Deploy to Vercel)

---

### EPIC 10: Contact & Utilities

#### CRO-637: Build Contact page with mailto link

**Parent:** EPIC 10 (Contact & Utilities)

**Estimate:** 3 story points

**Description:**
Create a simple, elegant contact page with mailto link and professional context.

**Acceptance Criteria:**
- [ ] Create `/app/contact/page.tsx` route
- [ ] Design clean, welcoming layout
- [ ] Add mailto link (opens user's email client)
- [ ] Include:
  - Short message about when/why to reach out
  - Email address with mailto link
  - LinkedIn profile link
  - GitHub profile link
  - Optional: Twitter/X link
- [ ] Add ARIA labels for accessibility
- [ ] Style with hover effects on links
- [ ] Write component tests
- [ ] Write E2E test for page rendering and link functionality
- [ ] Responsive design (mobile, tablet, desktop)

**Content Suggestions:**
- "Let's connect" or "Get in touch"
- "I'm always open to interesting conversations..."
- Clear CTA: "Send me an email" or "Reach out"

**Technical Notes:**
```jsx
<a href="mailto:colin@example.com?subject=Hello from your website">
  colin@example.com
</a>
```

**Future Enhancement:** Resend email form integration (moved to EPIC 14)

**Labels:** frontend, content

**Priority:** P2

**Blocked by:** CRO-578 (Add navigation & layout structure)

---

#### CRO-638: Create Uses page

**Parent:** EPIC 10 (Contact & Utilities)

**Estimate:** 2 story points

**Description:**
Build a "Uses" page showcasing Colin's development tools, software, and hardware setup.

**Acceptance Criteria:**
- [ ] Create `/app/uses/page.tsx` route
- [ ] Organize tools by category:
  - Development (IDE, terminal, etc.)
  - Design (Figma, etc.)
  - Product (Notion, Linear, etc.)
  - Hardware (laptop, monitor, keyboard, etc.)
  - Other tools
- [ ] Each item includes:
  - Tool name
  - Short description or why you use it
  - Optional: Link to product
- [ ] Clean, scannable layout
- [ ] Write component tests
- [ ] Write E2E test
- [ ] Responsive design

**Inspiration:**
- https://uses.tech/
- Wes Bos's uses page

**Labels:** frontend, content

**Priority:** P3

**Blocked by:** CRO-578 (Add navigation & layout structure)

---

#### CRO-639: Create Colophon page

**Parent:** EPIC 10 (Contact & Utilities)

**Estimate:** 2 story points

**Description:**
Build a colophon page documenting how the site was built, tech stack, and credits.

**Acceptance Criteria:**
- [ ] Create `/app/colophon/page.tsx` route
- [ ] Document:
  - Tech stack (Next.js, Tailwind, etc.)
  - Hosting (Vercel)
  - Design approach
  - Type faces used
  - Color palette chosen
  - Animation libraries
  - Any credits (icons, images, inspiration)
- [ ] Link to GitHub repository
- [ ] Link to design system documentation
- [ ] Write component tests
- [ ] Write E2E test
- [ ] Responsive design

**Purpose:** Transparency, showcasing technical skills, helping other developers

**Labels:** frontend, content

**Priority:** P3

**Blocked by:** CRO-578 (Add navigation & layout structure)

---

### EPIC 11: Content Creation

#### CRO-640: Write About page content

**Parent:** EPIC 11 (Content Creation)

**Estimate:** 5 story points

**Description:**
Write personal bio, professional story, and compelling narrative for the About page.

**Acceptance Criteria:**
- [ ] Write personal bio (2-3 paragraphs)
- [ ] Tell professional journey story
- [ ] Highlight key experiences and motivations
- [ ] Add personal photo (headshot)
- [ ] Keep tone warm, professional, authentic
- [ ] Review and edit for clarity
- [ ] Add to content file or directly in component

**Assignee:** Colin

**Labels:** content

**Priority:** P1

**Blocked by:** CRO-585 (Build About page)

---

#### CRO-641: Write Now page content

**Parent:** EPIC 11 (Content Creation)

**Estimate:** 2 story points

**Description:**
Write current focus areas, learning goals, and interests for the Now page.

**Acceptance Criteria:**
- [ ] List current professional focus
- [ ] List current learning goals
- [ ] List current interests or side projects
- [ ] Add "last updated" timestamp
- [ ] Keep concise and scannable
- [ ] Update regularly (monthly/quarterly)

**Assignee:** Colin

**Labels:** content

**Priority:** P1

**Blocked by:** CRO-586 (Add Now page)

---

#### CRO-642: Populate project data

**Parent:** EPIC 11 (Content Creation)

**Estimate:** 13 story points

**Description:**
Document project case studies with scope, learnings, tech stack, and links.

**Acceptance Criteria:**
- [ ] Identify 5-10 projects to showcase
- [ ] For each project, document:
  - Title and summary
  - Scope and PRD (if applicable)
  - Business model
  - Status (concept, live, sunset)
  - Tech stack
  - Why you built it
  - Key learnings
  - Links (live site, GitHub, blog post)
- [ ] Add project images/screenshots
- [ ] Populate `/data/projects.json`
- [ ] Mark 2-3 projects as featured
- [ ] Write detailed MDX pages for top projects

**Assignee:** Colin

**Labels:** content

**Priority:** P1

**Blocked by:** CRO-588 (Create data model for projects)

---

#### CRO-643: Populate timeline data

**Parent:** EPIC 11 (Content Creation)

**Estimate:** 8 story points

**Description:**
Curate and document timeline events (jobs, projects, education, milestones).

**Acceptance Criteria:**
- [ ] List all career milestones chronologically
- [ ] Include:
  - Jobs and roles
  - Major projects
  - Education
  - Personal milestones (if relevant)
  - Skills learned
  - Publications or talks
- [ ] For each event, document:
  - Title, organization, dates
  - Summary (1-2 sentences)
  - Type and tags
  - Link (if applicable)
- [ ] Populate `/data/timeline.json`
- [ ] Ensure consistency with CV data

**Assignee:** Colin

**Labels:** content

**Priority:** P2

**Blocked by:** CRO-623 (Define shared timeline data model)

---

#### CRO-644: Populate CV data

**Parent:** EPIC 11 (Content Creation)

**Estimate:** 8 story points

**Description:**
Migrate existing CV content into structured data format.

**Acceptance Criteria:**
- [ ] Write professional summary (2-3 sentences)
- [ ] List skills by category (Product, Strategy, Technical, Tools)
- [ ] Document experience:
  - Title, company, location, dates
  - Description and highlights
  - Tags for filtering
- [ ] Document education
- [ ] Reference relevant projects by ID
- [ ] Populate `/data/cv.json`
- [ ] Ensure data aligns with timeline

**Assignee:** Colin

**Labels:** content

**Priority:** P2

**Blocked by:** CRO-634 (Define data architecture and shared types)

---

#### CRO-645: Write initial blog posts (optional)

**Parent:** EPIC 11 (Content Creation)

**Estimate:** 13 story points

**Description:**
Write 3-5 initial blog posts for the Writing section (optional for MVP).

**Acceptance Criteria:**
- [ ] Choose 3-5 topics (product, tech, learnings, etc.)
- [ ] Write posts (500-1500 words each)
- [ ] Add metadata (title, date, summary, tags)
- [ ] Create MDX files in `/content/writing/`
- [ ] Add hero images or diagrams
- [ ] Proofread and edit

**Assignee:** Colin

**Labels:** content

**Priority:** P3

**Blocked by:** CRO-593 (Set up MDX blog structure)

---

### EPIC 12: Testing & Quality

#### CRO-646: Set up Jest and React Testing Library

**Parent:** EPIC 12 (Testing & Quality)

**Estimate:** 5 story points

**Description:**
Configure Jest and React Testing Library for unit and component testing.

**Acceptance Criteria:**
- [ ] Install dependencies:
  - `jest`
  - `@testing-library/react`
  - `@testing-library/jest-dom`
  - `@testing-library/user-event`
  - `jest-environment-jsdom`
- [ ] Create `jest.config.js`
- [ ] Create `jest.setup.js`
- [ ] Configure TypeScript support
- [ ] Add test scripts to `package.json`:
  - `test` - run all tests
  - `test:watch` - watch mode
  - `test:coverage` - coverage report
- [ ] Create example test to verify setup
- [ ] Document testing patterns in CLAUDE.md
- [ ] Create `/tests` directory structure

**Technical Notes:**
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
  ],
}
```

**Labels:** infra, testing

**Priority:** P0

**Blocked by:** CRO-576 (Initialize Next.js + Tailwind project)

---

#### CRO-647: Set up Playwright for E2E testing

**Parent:** EPIC 12 (Testing & Quality)

**Estimate:** 5 story points

**Description:**
Configure Playwright for end-to-end testing of user flows.

**Acceptance Criteria:**
- [ ] Install `@playwright/test`
- [ ] Run `npx playwright install` (browser binaries)
- [ ] Create `playwright.config.ts`
- [ ] Add test scripts to `package.json`:
  - `test:e2e` - run E2E tests headless
  - `test:e2e:ui` - run with Playwright UI
  - `test:e2e:debug` - debug mode
- [ ] Create example E2E test to verify setup
- [ ] Configure base URL for different environments
- [ ] Set up CI configuration
- [ ] Document E2E testing patterns in CLAUDE.md
- [ ] Create `/tests/e2e` directory

**Technical Notes:**
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
})
```

**Labels:** infra, testing

**Priority:** P0

**Blocked by:** CRO-576 (Initialize Next.js + Tailwind project)

---

#### CRO-648: Create testing utilities and helpers

**Parent:** EPIC 12 (Testing & Quality)

**Estimate:** 3 story points

**Description:**
Build reusable testing utilities, custom matchers, and test helpers.

**Acceptance Criteria:**
- [ ] Create `/tests/utils` directory
- [ ] Build custom render function with providers
- [ ] Create mock data factories:
  - `createMockProject()`
  - `createMockTimelineEvent()`
  - `createMockCVData()`
- [ ] Create test fixtures for common scenarios
- [ ] Add custom Jest matchers (if needed)
- [ ] Create E2E test helpers (login, navigation, etc.)
- [ ] Document utilities in CLAUDE.md
- [ ] Write tests for test utilities

**Example:**
```typescript
// tests/utils/render.tsx
export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <PostHogProvider>
        {ui}
      </PostHogProvider>
    </ThemeProvider>
  )
}
```

**Labels:** testing, infra

**Priority:** P1

**Blocked by:**
- CRO-646 (Set up Jest)
- CRO-647 (Set up Playwright)

---

### EPIC 13: DevOps & CI/CD

#### CRO-649: Set up GitHub repository and branch structure

**Parent:** EPIC 13 (DevOps & CI/CD)

**Estimate:** 2 story points

**Description:**
Configure GitHub repository with proper branch structure and protection rules.

**Acceptance Criteria:**
- [ ] Verify GitHub repo exists: https://github.com/colin-rod/homepage
- [ ] Create `development` branch from `main`
- [ ] Set `development` as default branch for PRs
- [ ] Configure branch protection for `main`:
  - Require pull request before merging
  - Require 1 approval
  - Allow administrators to bypass (optional)
  - Do NOT require status checks to pass (tests are informational)
  - Do NOT disable force push (allow if needed)
- [ ] Update repo settings:
  - Add description
  - Add topics/tags
  - Add website URL (after deployment)
- [ ] Create `.github/CODEOWNERS` file
- [ ] Document branch strategy in CLAUDE.md

**Labels:** devops, infra

**Priority:** P0

**Blocked by:** None (can be done first)

---

#### CRO-650: Create GitHub Actions CI workflow

**Parent:** EPIC 13 (DevOps & CI/CD)

**Estimate:** 5 story points

**Description:**
Set up GitHub Actions workflow to run lint, type check, and tests on every push.

**Acceptance Criteria:**
- [ ] Create `.github/workflows/ci.yml`
- [ ] Configure workflow to run on:
  - Push to any branch
  - Pull requests to `development` and `main`
- [ ] Workflow steps:
  1. Checkout code
  2. Set up Node.js (v20)
  3. Install dependencies (with caching)
  4. Run ESLint
  5. Run TypeScript type check
  6. Run Jest tests
  7. Run Playwright tests (on PRs only)
  8. Upload test results
- [ ] Tests are informational (don't block merge)
- [ ] Add status badge to README
- [ ] Test workflow by pushing a commit

**Technical Notes:**
```yaml
name: CI

on:
  push:
    branches: ['**']
  pull_request:
    branches: [development, main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
      - run: npm run test:e2e
        if: github.event_name == 'pull_request'
```

**Labels:** devops, infra

**Priority:** P0

**Blocked by:**
- CRO-649 (Set up GitHub repository)
- CRO-646 (Set up Jest)
- CRO-647 (Set up Playwright)

---

#### CRO-651: Configure Vercel deployment

**Parent:** EPIC 13 (DevOps & CI/CD)

**Estimate:** 3 story points

**Description:**
Connect Vercel to GitHub and configure deployment settings.

**Acceptance Criteria:**
- [ ] Create Vercel account (if not exists)
- [ ] Import GitHub repository to Vercel
- [ ] Configure deployment settings:
  - `main` branch → Production (`colinrodrigues.com`)
  - `development` branch → Preview (`dev.colinrodrigues.com`)
  - Feature branches → Preview (`dev.colinrodrigues.com`)
- [ ] Configure custom domains:
  - Add `colinrodrigues.com` to Vercel
  - Add `dev.colinrodrigues.com` to Vercel
  - Update DNS records (CNAME/A records)
- [ ] Add environment variables in Vercel:
  - `LINEAR_API_KEY` (if needed)
  - `NEXT_PUBLIC_POSTHOG_KEY`
  - `NEXT_PUBLIC_POSTHOG_HOST`
  - `SENTRY_DSN`
- [ ] Enable auto-deploy from GitHub
- [ ] Test deployments for all branch types
- [ ] Document in CLAUDE.md

**Labels:** devops, infra

**Priority:** P0

**Blocked by:** CRO-649 (Set up GitHub repository)

---

#### CRO-652: Add pre-commit hooks with Husky

**Parent:** EPIC 13 (DevOps & CI/CD)

**Estimate:** 2 story points

**Description:**
Set up Husky and lint-staged for pre-commit quality checks.

**Acceptance Criteria:**
- [ ] Install `husky` and `lint-staged`
- [ ] Initialize Husky: `npx husky init`
- [ ] Configure pre-commit hook:
  - Run ESLint on staged files
  - Run Prettier on staged files
  - Run TypeScript on staged files
- [ ] Configure `lint-staged` in `package.json`
- [ ] Test pre-commit hook
- [ ] Document in CLAUDE.md

**Technical Notes:**
```javascript
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

**Labels:** devops, infra

**Priority:** P2

**Blocked by:** CRO-576 (Initialize Next.js + Tailwind project)

---

### EPIC 14: Future Enhancements

#### CRO-653: GSAP and ScrollTrigger setup

**Parent:** EPIC 14 (Future Enhancements)

**Estimate:** 8 story points

**Description:**
Install and configure GSAP with ScrollTrigger for advanced timeline animations.

**Acceptance Criteria:**
- [ ] Install GSAP and ScrollTrigger plugin
- [ ] Install Lenis for smooth scroll
- [ ] Create animation utility helpers
- [ ] Build proof-of-concept scroll animation
- [ ] Test performance on mobile devices
- [ ] Add lazy loading for GSAP (code splitting)
- [ ] Document usage patterns

**Labels:** frontend, enhancement

**Priority:** P4

---

#### CRO-654: Framer Motion setup

**Parent:** EPIC 14 (Future Enhancements)

**Estimate:** 5 story points

**Description:**
Install and configure Framer Motion for UI transitions and page animations.

**Acceptance Criteria:**
- [ ] Install `framer-motion`
- [ ] Create reusable animation variants
- [ ] Build page transition wrapper
- [ ] Add hover and tap animations to components
- [ ] Test performance
- [ ] Document animation patterns

**Labels:** frontend, enhancement

**Priority:** P4

---

#### CRO-655: 3D Timeline zoom feature

**Parent:** EPIC 14 (Future Enhancements)

**Estimate:** 21 story points

**Description:**
Build zoomable 3D timeline overview using React Three Fiber.

**Acceptance Criteria:**
- [ ] Install `@react-three/fiber` and `@react-three/drei`
- [ ] Design 3D timeline visualization
- [ ] Implement zoom and pan controls
- [ ] Connect to timeline data
- [ ] Optimize 3D performance
- [ ] Add fallback for devices without WebGL support

**Labels:** frontend, enhancement

**Priority:** P4

---

#### CRO-656: Resend email integration for contact form

**Parent:** EPIC 14 (Future Enhancements)

**Estimate:** 8 story points

**Description:**
Replace mailto link with functional contact form using Resend API.

**Acceptance Criteria:**
- [ ] Create Resend account
- [ ] Install Resend SDK
- [ ] Build contact form component
- [ ] Create API route: `/api/contact`
- [ ] Validate form inputs
- [ ] Send email via Resend
- [ ] Add success/error states
- [ ] Add rate limiting
- [ ] Add spam protection (honeypot or CAPTCHA)

**Labels:** backend, frontend, enhancement

**Priority:** P4

---

#### CRO-657: Programmatic PDF generation

**Parent:** EPIC 14 (Future Enhancements)

**Estimate:** 13 story points

**Description:**
Implement server-side PDF generation with Puppeteer for perfect formatting.

**Acceptance Criteria:**
- [ ] Install Puppeteer
- [ ] Create API route: `/api/cv/generate`
- [ ] Render CV page in headless Chrome
- [ ] Generate PDF buffer
- [ ] Return PDF as downloadable file
- [ ] Cache generated PDFs
- [ ] Add PDF generation to build process (optional)

**Labels:** backend, infra, enhancement

**Priority:** P4

---

#### CRO-658: Compare CV view (side-by-side)

**Parent:** EPIC 14 (Future Enhancements)

**Estimate:** 8 story points

**Description:**
Create side-by-side CV comparison view (e.g., Product vs Strategy).

**Acceptance Criteria:**
- [ ] Create `/cv/compare` route
- [ ] Accept two filter parameters
- [ ] Render CVs side-by-side
- [ ] Highlight differences
- [ ] Responsive design (stack on mobile)

**Labels:** frontend, enhancement

**Priority:** P4

---

#### CRO-659: Interactive data visualizations

**Parent:** EPIC 14 (Future Enhancements)

**Estimate:** 13 story points

**Description:**
Add charts showing experience distribution, skills breakdown, timeline heatmap.

**Acceptance Criteria:**
- [ ] Choose charting library (D3, Recharts, Chart.js)
- [ ] Design visualizations
- [ ] Implement charts based on data
- [ ] Add to relevant pages (About, CV, Timeline)

**Labels:** frontend, enhancement

**Priority:** P4

---

#### CRO-660: Theme engine (color scheme switcher)

**Parent:** EPIC 14 (Future Enhancements)

**Estimate:** 8 story points

**Description:**
Allow users to switch between the 3 color palettes from DESIGN_SYSTEM.md.

**Acceptance Criteria:**
- [ ] Implement theme context
- [ ] Store preference in localStorage
- [ ] Add theme switcher UI
- [ ] Support all 3 palettes from design system
- [ ] Animate theme transitions

**Labels:** frontend, enhancement

**Priority:** P4

---

## 🔄 Existing Issues to Update

### CRO-578: Add navigation & layout structure

**Update Description:**

Remove dark/light mode toggle from the requirements.

**New Description:**
Responsive top nav with links to core pages.

**Acceptance Criteria:**
- [ ] Create responsive navigation component
- [ ] Add links to: Home, About, Now, Projects, Writing, Timeline, CV, Contact
- [ ] Mobile hamburger menu
- [ ] Active link highlighting
- [ ] Smooth transitions
- [ ] Accessible (keyboard navigation, ARIA labels)
- [ ] Write component tests
- [ ] Write E2E tests

**Remove:** "dark/light mode toggle"

---

### CRO-621: Generate downloadable PDFs

**Replace with:** CRO-634 (new issue created above with print CSS approach)

---

## 📌 Priority Labels for All Issues

### P0 (Critical - Must Complete First)

**EPIC 1: Foundation & Setup**
- CRO-576: Initialize Next.js + Tailwind project
- CRO-577: Implement global theme & design system
- CRO-578: Add navigation & layout structure
- CRO-634: Define data architecture and shared types

**EPIC 12: Testing & Quality**
- CRO-646: Set up Jest and React Testing Library
- CRO-647: Set up Playwright for E2E testing

**EPIC 13: DevOps & CI/CD**
- CRO-649: Set up GitHub repository and branch structure
- CRO-650: Create GitHub Actions CI workflow
- CRO-651: Configure Vercel deployment

---

### P1 (High - Core MVP Features)

**EPIC 1: Foundation & Setup**
- CRO-579: Add SEO & analytics configuration

**EPIC 2: Homepage**
- CRO-580: EPIC 2: Homepage (parent)
- CRO-581: Create hero section
- CRO-582: Add featured projects preview
- CRO-583: Add quick links and footer

**EPIC 3: About & Now Pages**
- CRO-584: EPIC 3: About & Now Pages (parent)
- CRO-585: Build About page
- CRO-586: Add Now page

**EPIC 4: Projects & Tools**
- CRO-587: EPIC 4: Projects & Tools (parent)
- CRO-588: Create data model for projects
- CRO-589: Implement projects index page
- CRO-590: Build project detail page template
- CRO-591: Add tools section

**EPIC 6: Dynamic CV System**
- CRO-595: EPIC 6: Dynamic CV System (parent)
- CRO-596: Implement base /cv page
- CRO-597: Add tag-based filtering to CV

**EPIC 11: Content Creation**
- CRO-640: Write About page content
- CRO-641: Write Now page content
- CRO-642: Populate project data

**EPIC 12: Testing & Quality**
- CRO-648: Create testing utilities and helpers

---

### P2 (Medium - Important MVP Features)

**EPIC 5: Writing / Blog**
- CRO-592: EPIC 5: Writing / Blog (parent)
- CRO-593: Set up MDX blog structure
- CRO-594: Create blog index and post layout

**EPIC 6: Dynamic CV System**
- CRO-634: Create print-optimized CV pages (updated CRO-621)

**EPIC 7: Timeline of Highlights**
- CRO-622: EPIC 7: Timeline of Highlights (parent)
- CRO-623: Define shared timeline data model
- CRO-624: Build interactive timeline page
- CRO-625: Integrate timeline into CV

**EPIC 8: Design Polish & UX**
- CRO-626: EPIC 8: Design Polish & UX (parent)
- CRO-627: Add animations & transitions
- CRO-628: Responsive QA & accessibility audit
- CRO-629: Finalize color, typography, and spacing

**EPIC 10: Contact & Utilities**
- CRO-637: Build Contact page with mailto link

**EPIC 11: Content Creation**
- CRO-643: Populate timeline data
- CRO-644: Populate CV data

**EPIC 13: DevOps & CI/CD**
- CRO-652: Add pre-commit hooks with Husky

---

### P3 (Low - Nice-to-Have for V1)

**EPIC 9: Deployment & Docs**
- CRO-630: EPIC 9: Deployment & Docs (parent)
- CRO-631: Add README and documentation
- CRO-632: Add sitemap and SEO polish
- CRO-633: Deploy to Vercel and final verification
- CRO-635: Set up Sentry error monitoring
- CRO-636: Set up PostHog analytics and session replay

**EPIC 10: Contact & Utilities**
- CRO-638: Create Uses page
- CRO-639: Create Colophon page

**EPIC 11: Content Creation**
- CRO-645: Write initial blog posts (optional)

---

### P4 (Future - Post-V1 Enhancements)

**EPIC 14: Future Enhancements**
- All issues in EPIC 14 (CRO-653 through CRO-660)

---

## 🔗 Issue Dependencies

### EPIC 1 Dependencies

```
CRO-577 (Global theme)
  └─ Blocked by: CRO-576 (Next.js setup)

CRO-578 (Navigation)
  └─ Blocked by: CRO-576 (Next.js setup)

CRO-579 (SEO & analytics)
  └─ Blocked by: CRO-576 (Next.js setup)

CRO-634 (Data architecture)
  └─ Blocked by: CRO-576 (Next.js setup)
```

### EPIC 2 Dependencies

```
CRO-581 (Hero section)
  └─ Blocked by: CRO-578 (Navigation)

CRO-582 (Featured projects)
  └─ Blocked by: CRO-581 (Hero section)
  └─ Blocked by: CRO-588 (Project data model)

CRO-583 (Footer)
  └─ Blocked by: CRO-578 (Navigation)
```

### EPIC 3 Dependencies

```
CRO-585 (About page)
  └─ Blocked by: CRO-578 (Navigation)

CRO-586 (Now page)
  └─ Blocked by: CRO-578 (Navigation)
```

### EPIC 4 Dependencies

```
CRO-588 (Project data model)
  └─ Blocked by: CRO-634 (Data architecture)

CRO-589 (Projects index)
  └─ Blocked by: CRO-588 (Project data model)

CRO-590 (Project detail template)
  └─ Blocked by: CRO-588 (Project data model)

CRO-591 (Tools section)
  └─ Blocked by: CRO-588 (Project data model)
```

### EPIC 5 Dependencies

```
CRO-593 (MDX blog structure)
  └─ Blocked by: CRO-576 (Next.js setup)

CRO-594 (Blog index)
  └─ Blocked by: CRO-593 (MDX structure)
```

### EPIC 6 Dependencies

```
CRO-596 (Base CV page)
  └─ Blocked by: CRO-634 (Data architecture)

CRO-597 (Tag filtering)
  └─ Blocked by: CRO-596 (Base CV page)

CRO-634 (Print-optimized PDFs)
  └─ Blocked by: CRO-597 (Tag filtering)
  └─ Blocked by: CRO-596 (Base CV page)
```

### EPIC 7 Dependencies

```
CRO-623 (Timeline data model)
  └─ Blocked by: CRO-634 (Data architecture)

CRO-624 (Interactive timeline)
  └─ Blocked by: CRO-623 (Timeline data model)

CRO-625 (Integrate timeline into CV)
  └─ Blocked by: CRO-624 (Interactive timeline)
```

### EPIC 8 Dependencies

```
CRO-627 (Animations)
  └─ Blocked by: Most UI components completed

CRO-628 (Responsive QA)
  └─ Blocked by: Most UI components completed

CRO-629 (Design polish)
  └─ Blocked by: Most UI components completed
```

### EPIC 9 Dependencies

```
CRO-632 (Sitemap & SEO)
  └─ Blocked by: All routes implemented

CRO-633 (Deploy to Vercel)
  └─ Blocked by: CRO-632 (Sitemap)
  └─ Blocked by: CRO-651 (Vercel config)

CRO-635 (Sentry)
  └─ Blocked by: CRO-633 (Deployment)

CRO-636 (PostHog)
  └─ Blocked by: CRO-633 (Deployment)
```

### EPIC 10 Dependencies

```
CRO-637 (Contact page)
  └─ Blocked by: CRO-578 (Navigation)

CRO-638 (Uses page)
  └─ Blocked by: CRO-578 (Navigation)

CRO-639 (Colophon page)
  └─ Blocked by: CRO-578 (Navigation)
```

### EPIC 11 Dependencies

```
CRO-640 (About content)
  └─ Blocked by: CRO-585 (About page built)

CRO-641 (Now content)
  └─ Blocked by: CRO-586 (Now page built)

CRO-642 (Project data)
  └─ Blocked by: CRO-588 (Project data model)

CRO-643 (Timeline data)
  └─ Blocked by: CRO-623 (Timeline data model)

CRO-644 (CV data)
  └─ Blocked by: CRO-634 (Data architecture)

CRO-645 (Blog posts)
  └─ Blocked by: CRO-593 (MDX structure)
```

### EPIC 12 Dependencies

```
CRO-646 (Jest setup)
  └─ Blocked by: CRO-576 (Next.js setup)

CRO-647 (Playwright setup)
  └─ Blocked by: CRO-576 (Next.js setup)

CRO-648 (Testing utilities)
  └─ Blocked by: CRO-646 (Jest)
  └─ Blocked by: CRO-647 (Playwright)
```

### EPIC 13 Dependencies

```
CRO-649 (GitHub setup)
  └─ No blockers (can start immediately)

CRO-650 (GitHub Actions)
  └─ Blocked by: CRO-649 (GitHub setup)
  └─ Blocked by: CRO-646 (Jest)
  └─ Blocked by: CRO-647 (Playwright)

CRO-651 (Vercel config)
  └─ Blocked by: CRO-649 (GitHub setup)

CRO-652 (Husky hooks)
  └─ Blocked by: CRO-576 (Next.js setup)
```

---

## 📝 Summary of Changes

### New Epics: 5
- EPIC 10: Contact & Utilities
- EPIC 11: Content Creation
- EPIC 12: Testing & Quality
- EPIC 13: DevOps & CI/CD
- EPIC 14: Future Enhancements

### New Issues: 26
- CRO-634: Data architecture
- CRO-635: Sentry setup
- CRO-636: PostHog setup
- CRO-637: Contact page
- CRO-638: Uses page
- CRO-639: Colophon page
- CRO-640-645: Content creation (6 issues)
- CRO-646-648: Testing setup (3 issues)
- CRO-649-652: DevOps (4 issues)
- CRO-653-660: Future enhancements (8 issues)

### Updated Issues: 2
- CRO-578: Remove dark mode toggle
- CRO-621: Replace with print CSS approach (CRO-634)

### Priority Labels Added: All 59 issues now have P0-P4 labels

### Dependencies Documented: All blockers mapped

---

## 🚀 Next Steps

1. **Copy these issues into Linear** - Create epics first, then issues
2. **Set priorities** - Use the P0-P4 labels provided
3. **Add dependencies** - Use Linear's dependency feature
4. **Choose color palette** - Review DESIGN_SYSTEM.md and pick one
5. **Start with P0 issues** - Begin with EPIC 1, 12, and 13
6. **Follow TDD** - Write tests first for every feature

---

**Document Created:** October 2025
**Total Issues:** 59 existing + 26 new = 85 total
**Epics:** 14 total
