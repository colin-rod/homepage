# Colin's Personal Homepage - Project Documentation

## 📋 Project Overview

This is a **modern, interactive portfolio website** showcasing Colin's professional journey, projects, and expertise. The site combines visual storytelling with functional tools to create a comprehensive professional hub.

**Key Features:**

- Interactive timeline of career and personal milestones
- Dynamic, filterable CV system with PDF export
- Project showcase with detailed case studies
- Blog/writing section
- Professional contact and tools pages

---

## 🎯 Goals

1. Present Colin's professional profile in a modern, immersive way
2. Enable visitors to explore different dimensions of experience (product, strategy, tech)
3. Centralize professional materials in one cohesive hub
4. Showcase technical competence through polished, interactive frontend
5. Improve SEO visibility for Colin's name and projects

---

## 🏗️ Tech Stack

### Core Framework

- **Next.js 14+** (App Router) - SSR, routing, and performance
- **TypeScript** - Type safety throughout
- **React 18+** - UI components

### Styling & Design

- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **Radix UI** - Accessible primitives
- **Design System** - See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for colors and tokens

### Animations

- **Framer Motion** - UI transitions and page animations (Future Enhancement)
- **GSAP + ScrollTrigger** - Timeline scroll animations (Future Enhancement)
- **Lenis** - Smooth scroll library (Future Enhancement)

### Data & Content

- **Local JSON files** (`/data` folder) - Primary data source
- **MDX** - Blog posts and project pages
- **TypeScript interfaces** - Shared type definitions

### Testing

- **Jest** - Unit testing
- **React Testing Library** - Component testing
- **Playwright** - E2E testing

### DevOps & Deployment

- **GitHub** - Version control
- **GitHub Actions** - CI/CD pipeline
- **Vercel** - Hosting and deployment
- **Sentry** - Error monitoring
- **PostHog** - Analytics and session replay

---

## 🧪 Test-Driven Development (TDD) Principles

### Philosophy

This project follows **strict TDD methodology**:

> "Write the test first, then write the code to make it pass."

### TDD Workflow

For every feature, follow this cycle:

1. **Red** - Write a failing test
2. **Green** - Write minimal code to pass the test
3. **Refactor** - Clean up code while keeping tests green

### Testing Requirements

#### Every Feature Must Include:

1. **Unit Tests** - Test individual functions and utilities
   - Pure functions (data transformations, calculations)
   - Helper utilities
   - Custom hooks

2. **Component Tests** - Test React components in isolation
   - Rendering with different props
   - User interactions (clicks, form inputs)
   - Conditional rendering
   - Accessibility attributes

3. **E2E Tests** - Test complete user flows
   - Page navigation
   - Form submissions
   - Data filtering and interactions
   - CV download flows
   - Timeline interactions

### Test Structure

```typescript
// Example: Component test structure

import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectCard } from './ProjectCard'

describe('ProjectCard', () => {
  const mockProject = {
    title: 'BabyPool',
    description: 'Baby guessing pool app',
    tags: ['product', 'tech'],
    status: 'live'
  }

  it('renders project title and description', () => {
    render(<ProjectCard project={mockProject} />)
    expect(screen.getByText('BabyPool')).toBeInTheDocument()
    expect(screen.getByText('Baby guessing pool app')).toBeInTheDocument()
  })

  it('displays all project tags', () => {
    render(<ProjectCard project={mockProject} />)
    expect(screen.getByText('product')).toBeInTheDocument()
    expect(screen.getByText('tech')).toBeInTheDocument()
  })

  it('shows status badge', () => {
    render(<ProjectCard project={mockProject} />)
    expect(screen.getByText('live')).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn()
    render(<ProjectCard project={mockProject} onClick={handleClick} />)
    fireEvent.click(screen.getByRole('article'))
    expect(handleClick).toHaveBeenCalledWith(mockProject)
  })
})
```

### Test Coverage Requirements

- **Test every component** - No component should ship without tests
- **Test critical paths** - Prioritize user-facing functionality
- **Test edge cases** - Empty states, error states, loading states
- **Test accessibility** - ARIA labels, keyboard navigation, screen readers

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

**IMPORTANT: E2E Testing Guidelines**

- **DO NOT run E2E tests locally** - They are flaky in local development environments
- E2E tests are run automatically in CI/CD pipeline (GitHub Actions)
- E2E tests run on every push and pull request
- Focus on unit and component tests for local development
- If you need to verify E2E behavior, push to a branch and let CI run the tests

---

## 📂 Project Structure

```
homepage/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD
├── app/
│   ├── (routes)/
│   │   ├── page.tsx            # Homepage
│   │   ├── about/
│   │   ├── now/
│   │   ├── projects/
│   │   ├── writing/
│   │   ├── timeline/
│   │   ├── cv/
│   │   └── contact/
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── layouts/                # Layout components
│   └── features/               # Feature-specific components
├── lib/
│   ├── data.ts                 # Data fetching utilities
│   ├── utils.ts                # Helper functions
│   └── types.ts                # TypeScript types
├── data/
│   ├── projects.json           # Project data
│   ├── timeline.json           # Timeline events
│   └── cv.json                 # CV/resume data
├── content/
│   ├── writing/                # MDX blog posts
│   └── projects/               # MDX project pages
├── public/
│   ├── images/
│   └── files/
├── tests/
│   ├── unit/                   # Unit tests
│   ├── components/             # Component tests
│   └── e2e/                    # Playwright E2E tests
├── CLAUDE.md                   # This file
├── DESIGN_SYSTEM.md            # Design tokens and color palettes
├── .env.local                  # Environment variables
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 🗄️ Data Architecture

### Shared Data Model

All data lives in `/data` folder as JSON files, with shared TypeScript interfaces.

#### Timeline Data (`/data/timeline.json`)

```typescript
interface TimelineEvent {
  id: string
  title: string
  organization: string
  type: 'job' | 'project' | 'education' | 'milestone' | 'learning'
  startDate: string // ISO 8601
  endDate?: string | null // null for current
  summary: string
  description?: string
  tags: string[] // e.g., ['product', 'strategy', 'tech']
  link?: string
  location?: string
}
```

#### Project Data (`/data/projects.json`)

```typescript
interface Project {
  id: string
  title: string
  slug: string
  description: string
  summary: string
  scope: string
  prd?: string
  businessModel?: string
  status: 'concept' | 'in-progress' | 'live' | 'sunset'
  techStack: string[]
  tags: string[] // e.g., ['web', 'api', 'automation', 'product']
  whyBuilt: string
  learnings: string[]
  links: {
    live?: string
    github?: string
    blog?: string
  }
  images: string[]
  featured: boolean
  year: number
}
```

#### CV Data (`/data/cv.json`)

```typescript
interface CV {
  summary: string
  skills: {
    category: string
    items: string[]
  }[]
  experience: {
    id: string
    title: string
    company: string
    location: string
    startDate: string
    endDate?: string | null
    description: string
    highlights: string[]
    tags: string[] // For filtering by role type
  }[]
  education: {
    degree: string
    institution: string
    year: number
    description?: string
  }[]
  projects: string[] // References to project IDs
}
```

### Data Relationships

- **Timeline ↔ CV:** Timeline events marked as `type: 'job'` should match CV experience entries
- **Projects ↔ CV:** CV can reference projects by ID
- **Projects ↔ Timeline:** Major projects can appear as timeline milestones
- **Shared Tags:** Use consistent tag vocabulary across all data sources

### Data Validation

All data models have corresponding TypeScript interfaces. Validate data on build:

```bash
npm run validate-data
```

---

## 🌿 Git Workflow

### Branch Strategy

```
main (production)
└── development (staging)
    └── feature/* (feature branches)
```

### Branch Purposes

- **`main`** - Production branch
  - Deploys to: `colinrodrigues.com`
  - Protected, requires PR approval
  - Only merge from `development`

- **`development`** - Staging branch
  - Deploys to: `dev.colinrodrigues.com`
  - Integration branch for all features
  - Default branch for PRs

- **`feature/*`** - Feature branches
  - Deploys to: `dev.colinrodrigues.com` (preview)
  - Naming: `feature/epic-{number}-{short-description}`
  - Examples: `feature/epic-1-next-setup`, `feature/epic-2-homepage`

### Development Workflow

1. **Create feature branch** from `development`:

   ```bash
   git checkout development
   git pull origin development
   git checkout -b feature/epic-2-homepage
   ```

2. **Write tests first (TDD)**:

   ```bash
   # Create test file
   touch components/Hero.test.tsx
   # Write failing tests
   npm test -- --watch
   ```

3. **Implement feature** to pass tests:

   ```bash
   # Write code
   # Tests should pass
   ```

4. **Commit with conventional commits**:

   ```bash
   git add .
   git commit -m "feat(homepage): add hero section with CTA buttons"
   ```

   **Note:** Pre-commit hooks automatically run:
   - ESLint with auto-fix on staged `.js`/`.jsx`/`.ts`/`.tsx` files
   - Prettier formatting on staged files
   - If checks fail, fix the issues and commit again

5. **Push and create PR**:

   ```bash
   git push origin feature/epic-2-homepage
   # Create PR on GitHub: feature/epic-2-homepage → development
   ```

6. **PR Review Process**:
   - GitHub Actions runs: lint, type check, unit tests, component tests
   - 1 approval required before merge
   - Tests are informational (don't block merge, but should be fixed)

7. **Merge to development**:
   - Squash and merge
   - Delete feature branch

8. **Deploy to production**:
   - Create PR: `development` → `main`
   - Review and merge when ready for production

### Commit Message Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process, tooling, dependencies

**Examples:**

```
feat(cv): add tag-based filtering
fix(timeline): correct scroll animation timing
test(projects): add E2E tests for project filtering
docs(readme): update setup instructions
chore(deps): upgrade Next.js to 14.2
```

---

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow

On every push to any branch:

1. **Lint** - ESLint checks
2. **Type Check** - TypeScript compilation
3. **Unit Tests** - Jest tests
4. **Component Tests** - React Testing Library tests
5. **Build** - Next.js production build

On PR to `main`:

- All above checks
- Manual deployment approval

### Vercel Deployment

- **Auto-deploys** from GitHub
- **`main` branch** → Production (`colinrodrigues.com`)
- **`development` branch** → Staging (`dev.colinrodrigues.com`)
- **Feature branches** → Preview deployments (`dev.colinrodrigues.com`)

### Environment Variables

Required in Vercel:

```bash
# .env.local (local development)
LINEAR_API_KEY=lin_api_xxx
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

## 📊 Monitoring & Analytics

### PostHog (Analytics & Session Replay)

- **Page views** - Track navigation patterns
- **Custom events** - CTA clicks, CV downloads, project views
- **Session recordings** - Understand user behavior
- **Feature flags** - Progressive rollout of features

### Sentry (Error Monitoring)

- **Error tracking** - Catch and report runtime errors
- **Performance monitoring** - Track page load times
- **Source maps** - Debug production errors
- **Release tracking** - Link errors to deployments

---

## 🎨 Design System

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for complete details.

### Selected Color Palette: Terracotta Midnight v2

**"Warm light over cool depth."**

A harmonized, contrast-tested hybrid combining:

- **Deep navy-teal** base for structure and professionalism
- **Terracotta + gold** accents for warmth and personality
- **Sage + steel** bridges for smooth transitions
- **Warm off-whites** for readable content

**Key Colors:**

- Primary: `#20465B` (Navy-teal)
- Accent: `#D3643E` (Terracotta)
- Highlight: `#C38A27` (Gold)
- Background: `#FAF8F5` (Warm off-white)
- Text: `#222426` (Charcoal)

The design system also includes:

- Typography scale (fluid, responsive)
- Spacing system (4px base)
- Border radius tokens
- Shadow tokens
- Animation timing
- Breakpoints
- Signature gradients (Hero, CTA, Timeline)

---

## 📖 Reference Documents

### PRD (Product Requirements Document)

The complete PRD is available in Linear:

- **Project:** Personal Homepage
- **URL:** https://linear.app/crod/project/personal-homepage-cb1f8417097b

Key sections:

1. Overview
2. Goals & Objectives
3. Product Summary
4. Target Audience
5. Key Features & Requirements
6. Technical Stack
7. Design & UX Principles
8. Milestones & Deliverables
9. Dependencies
10. Success Metrics
11. Future Enhancements
12. Risks & Mitigation
13. MVP Scope

### Linear Project

All tasks tracked in Linear with 14 Epics:

1. **EPIC 1:** Foundation & Setup
2. **EPIC 2:** Homepage
3. **EPIC 3:** About & Now Pages
4. **EPIC 4:** Projects & Tools
5. **EPIC 5:** Writing / Blog
6. **EPIC 6:** Dynamic CV System
7. **EPIC 7:** Timeline of Highlights
8. **EPIC 8:** Design Polish & UX
9. **EPIC 9:** Deployment & Docs
10. **EPIC 10:** Contact & Utilities
11. **EPIC 11:** Content Creation
12. **EPIC 12:** Testing & Quality
13. **EPIC 13:** DevOps & CI/CD
14. **EPIC 14:** Future Enhancements

---

## 🏁 Getting Started

### Prerequisites

- Node.js 20+ (LTS)
- npm, yarn, or pnpm
- Git

### Initial Setup

```bash
# Clone repository
git clone https://github.com/colin-rod/homepage.git
cd homepage

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your keys

# Run development server
npm run dev

# Open http://localhost:3000
```

### Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler

# Testing
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run E2E tests
npm run test:e2e:ui      # Run E2E tests in UI mode

# Data
npm run validate-data    # Validate JSON data against schemas
```

### Pre-commit Hooks

This project uses **Husky** and **lint-staged** to automatically run quality checks before commits.

**Configured hooks:**

- **ESLint** - Auto-fixes linting issues on staged `.js`/`.jsx`/`.ts`/`.tsx` files
- **Prettier** - Formats staged files (code, JSON, Markdown, CSS)

**How it works:**

1. When you run `git commit`, Husky triggers the pre-commit hook
2. lint-staged runs only on staged files (fast!)
3. ESLint fixes any auto-fixable issues
4. Prettier formats all staged files
5. If any errors remain, the commit is blocked until you fix them

**Setup files:**

- `.husky/pre-commit` - Hook script
- `package.json` - lint-staged configuration
- `.prettierrc` - Prettier formatting rules

**Bypassing hooks (not recommended):**

```bash
git commit --no-verify -m "message"
```

---

## 📝 Issue Tracking

All work is tracked in Linear with:

- **Priority labels** (P0-P4)
- **Dependencies** between issues
- **Acceptance criteria** in descriptions
- **Labels** for categorization (frontend, backend, design, content, etc.)

### Priority System

- **P0 (Critical)** - Blockers, must complete first
- **P1 (High)** - Core MVP features
- **P2 (Medium)** - Important but not blocking
- **P3 (Low)** - Nice-to-have for v1
- **P4 (Future)** - Post-v1 enhancements

---

## 🤝 Contributing

This is a personal project, but the workflow is documented for:

- Collaboration with Claude (AI pair programming)
- Potential future contributors
- Portfolio demonstration of best practices

### Code Review Checklist

Before merging a PR:

- [ ] All tests pass (unit, component, E2E)
- [ ] TypeScript compiles without errors
- [ ] ESLint passes with no warnings
- [ ] Components are accessible (ARIA labels, keyboard nav)
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Data models use TypeScript interfaces
- [ ] No console.log or debug code
- [ ] Code follows project conventions

---

## 📚 Resources

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Playwright](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/react)

### Tools

- [Linear (Project Management)](https://linear.app/crod)
- [GitHub (Code)](https://github.com/colin-rod/homepage)
- [Vercel (Hosting)](https://vercel.com)
- [PostHog (Analytics)](https://posthog.com)
- [Sentry (Monitoring)](https://sentry.io)

---

## 🎯 Success Metrics

From the PRD, success is measured by:

| Metric                   | Target                        |
| ------------------------ | ----------------------------- |
| Lighthouse Performance   | >90                           |
| Lighthouse Accessibility | >90                           |
| Average Visit Duration   | >60 seconds                   |
| PDF Generation Success   | 100% (all filters work)       |
| SEO Ranking              | Top 3 for "Colin [Lastname]"  |
| CTA Conversion Rate      | ≥20% (Contact or Download CV) |

---

## 🔮 Future Enhancements (Post-MVP)

See **EPIC 14** in Linear for:

- GSAP + ScrollTrigger timeline animations
- Framer Motion page transitions
- 3D Timeline zoom view (React Three Fiber)
- Resend email integration for contact form
- Programmatic PDF generation (Puppeteer)
- Compare CV view (side-by-side product vs strategy)
- Interactive data visualizations
- Notion integration for dynamic content
- Theme engine (user-switchable palettes)
- AI summary generation

---

## 📞 Support

For issues or questions:

- Linear: Track bugs and features
- GitHub Issues: Technical problems
- GitHub Discussions: Questions and ideas

---

**Last Updated:** October 2025
**Version:** 1.0
**Status:** Pre-Development
