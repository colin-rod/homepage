# Contributing Guide

Welcome! This guide explains how to contribute to the Colin Rodrigues Personal Homepage project. While this is a personal portfolio, the workflow is documented for collaboration with AI pair programmers and potential future contributors.

## 🎯 Philosophy

This project follows **Test-Driven Development (TDD)** and values:

1. **Quality over speed** - Write tests first, refactor confidently
2. **Clear documentation** - Code should be self-explanatory with helpful comments
3. **Accessibility first** - Every feature must be keyboard-navigable and screen-reader friendly
4. **User-focused design** - Prioritize user experience and performance

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 20+** (LTS recommended)
- **npm, yarn, or pnpm**
- **Git**
- Basic understanding of Next.js, React, TypeScript, and Tailwind CSS

### Initial Setup

```bash
# 1. Clone the repository
git clone https://github.com/colin-rod/homepage.git
cd homepage

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.local.example .env.local

# 4. (Optional) Add your API keys to .env.local
# LINEAR_API_KEY, NEXT_PUBLIC_POSTHOG_KEY, SENTRY_DSN

# 5. Start development server
npm run dev

# 6. Open http://localhost:3000
```

### Environment Variables

Create a `.env.local` file (see `.env.local.example`):

```bash
# Linear API (optional - for AI assistants to access issues)
LINEAR_API_KEY=your_key_here

# PostHog Analytics (optional - for tracking)
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Sentry Error Monitoring (optional - for error tracking)
SENTRY_DSN=https://xxx@sentry.io/xxx

# Domain (used for SEO metadata)
URL=https://colinrodrigues.com
```

**Note:** All environment variables are optional for local development. The app will run without them.

---

## 🌿 Git Workflow

### Branch Strategy

```
main (production)
└── development (staging)
    └── feature/* (feature branches)
```

- **`main`** - Production branch (colinrodrigues.com)
  - Protected, requires PR approval
  - Only merge from `development`

- **`development`** - Default integration branch (dev.colinrodrigues.com)
  - All PRs target this branch
  - Automatically deployed to staging

- **`feature/*`** - Feature branches
  - Format: `feature/epic-{number}-{short-description}`
  - Examples: `feature/epic-2-homepage`, `feature/epic-6-cv-filters`

### Creating a Feature Branch

```bash
# 1. Ensure you're on latest development
git checkout development
git pull origin development

# 2. Create feature branch
git checkout -b feature/epic-7-timeline-animations

# 3. Make your changes (following TDD workflow below)

# 4. Push to remote
git push origin feature/epic-7-timeline-animations

# 5. Create PR on GitHub: feature/epic-7-timeline-animations → development
```

---

## 🧪 Test-Driven Development (TDD)

**Every feature must follow this workflow:**

### Red → Green → Refactor

1. **Red** - Write a failing test
2. **Green** - Write minimal code to make it pass
3. **Refactor** - Clean up code while keeping tests green

### Example Workflow

```bash
# 1. Create test file
touch components/ProjectCard.test.tsx

# 2. Write failing test
npm test -- --watch

# 3. Implement component to pass test

# 4. Refactor and ensure tests still pass

# 5. Repeat for next feature
```

### Testing Requirements

Every feature must include:

#### Unit Tests

Test individual functions and utilities:

```typescript
// lib/utils.test.ts
describe('formatDate', () => {
  it('formats ISO date to readable format', () => {
    expect(formatDate('2024-01-15')).toBe('January 15, 2024')
  })
})
```

#### Component Tests

Test React components in isolation:

```typescript
// components/ProjectCard.test.tsx
import { render, screen } from '@testing-library/react'
import { ProjectCard } from './ProjectCard'

describe('ProjectCard', () => {
  it('renders project title and description', () => {
    const project = { title: 'BabyPool', description: 'Baby pool app' }
    render(<ProjectCard project={project} />)
    expect(screen.getByText('BabyPool')).toBeInTheDocument()
  })
})
```

#### E2E Tests

Test complete user flows (runs in CI only):

```typescript
// tests/e2e/projects.spec.ts
import { test, expect } from '@playwright/test'

test('user can filter projects by tag', async ({ page }) => {
  await page.goto('/projects')
  await page.click('button:has-text("Web")')
  await expect(page.locator('.project-card')).toContainText('BabyPool')
})
```

### Running Tests

```bash
# All tests
npm test

# Watch mode (for development)
npm test -- --watch

# Coverage report
npm test -- --coverage

# E2E tests (runs in CI, flaky locally)
npm run test:e2e
```

**Important:** E2E tests are run automatically in CI/CD. Don't run them locally as they can be flaky in development environments.

---

## 📝 Commit Message Convention

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process, tooling, dependencies

### Examples

```bash
feat(cv): add tag-based filtering for experience
fix(timeline): correct scroll animation timing
test(projects): add E2E tests for project filtering
docs(readme): update setup instructions
chore(deps): upgrade Next.js to 14.2
refactor(nav): simplify mobile menu logic
```

### Pre-commit Hooks

This project uses **Husky** and **lint-staged** to automatically:

- Run ESLint with auto-fix
- Format code with Prettier
- Ensure code quality before commits

If the pre-commit hook fails:

1. Fix the reported issues
2. Re-run `git commit`

---

## 📂 Project Structure

```
homepage/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── about/             # About page
│   ├── projects/          # Projects pages
│   ├── cv/                # CV page
│   ├── timeline/          # Timeline page
│   ├── contact/           # Contact page
│   └── writing/           # Blog pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layouts/          # Layout components (Nav, Footer)
│   └── features/         # Feature-specific components
├── lib/                   # Utilities and helpers
│   ├── types.ts          # TypeScript type definitions
│   ├── data.ts           # Data fetching functions
│   └── utils.ts          # Helper functions
├── data/                  # JSON data files
│   ├── timeline.json     # Timeline events
│   ├── projects.json     # Projects
│   ├── cv.json           # CV/resume data
│   └── uses.json         # Tools/setup
├── public/                # Static files
│   └── images/           # Images and assets
├── tests/                 # Test files
│   └── e2e/              # Playwright E2E tests
├── CLAUDE.md             # Full project documentation
├── DATA_SCHEMA.md        # Data structure reference
└── DESIGN_SYSTEM.md      # Design tokens and colors
```

---

## 🎨 Code Style

### TypeScript

- Use TypeScript for all new files
- Define types in `/lib/types.ts` for shared interfaces
- Avoid `any` - use proper types or `unknown`

```typescript
// Good
interface Project {
  id: string
  title: string
}

// Avoid
const project: any = { id: 1 }
```

### React Components

- Use functional components with hooks
- Extract complex logic into custom hooks
- Keep components focused and small

```typescript
// Good - Focused component
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card">
      <h3>{project.title}</h3>
      <p>{project.description}</p>
    </article>
  )
}
```

### Tailwind CSS

- Use Tailwind utility classes
- Reference design tokens from `DESIGN_SYSTEM.md`
- Use semantic class names from `globals.css` where applicable

```tsx
// Good - Using Tailwind utilities
<div className="rounded-2xl border border-divider bg-neutral-surface p-6">

// Good - Using semantic classes
<button className="btn btn-primary">Click me</button>
```

### Accessibility

- Always include ARIA labels
- Ensure keyboard navigation works
- Test with screen readers

```tsx
// Good - Accessible button
<button aria-label="Close navigation menu" onClick={handleClose}>
  <XIcon aria-hidden="true" />
</button>
```

---

## 🗄️ Working with Data

All data lives in `/data/*.json` files. See [DATA_SCHEMA.md](./DATA_SCHEMA.md) for complete reference.

### Adding a New Project

1. Open `/data/projects.json`
2. Add new project object following the schema
3. Add images to `/public/images/projects/`
4. Test locally

```json
{
  "id": "my-project",
  "title": "My Awesome Project",
  "slug": "my-project",
  "description": "Short description for cards",
  "detailedDescription": "Full explanation...",
  "type": "project",
  "status": "live",
  "techStack": ["Next.js", "TypeScript"],
  "tags": ["web", "product"],
  "featured": false,
  "year": 2024
}
```

### Updating Timeline

1. Open `/data/timeline.json`
2. Add event with unique ID
3. Use ISO 8601 dates (`YYYY-MM-DD`)
4. Add consistent tags for filtering

---

## 🔍 Code Review Checklist

Before submitting a PR, ensure:

- [ ] All tests pass (`npm test`)
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)
- [ ] Components are accessible (ARIA labels, keyboard nav)
- [ ] Responsive design works (mobile, tablet, desktop)
- [ ] Following TDD (tests written first)
- [ ] No `console.log` or debug code
- [ ] Commit messages follow conventional commits
- [ ] PR description explains what and why

---

## 🚢 Deployment

### Automatic Deployments

- **`main` branch** → Production (colinrodrigues.com)
- **`development` branch** → Staging (dev.colinrodrigues.com)
- **Feature branches** → Preview deployments

### CI/CD Pipeline

On every push, GitHub Actions runs:

1. Linting (ESLint)
2. Type checking (TypeScript)
3. Unit tests (Jest)
4. Component tests (React Testing Library)
5. E2E tests (Playwright)
6. Build (Next.js production build)

PRs cannot be merged if CI fails (but tests are informational).

---

## 📚 Resources

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright](https://playwright.dev/)

### Project Docs

- [CLAUDE.md](./CLAUDE.md) - Complete project documentation
- [DATA_SCHEMA.md](./DATA_SCHEMA.md) - Data structure reference
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Design tokens and colors
- [README.md](./README.md) - Quick start guide

---

## 🤝 Getting Help

- **Issues:** Check [Linear](https://linear.app/crod) for tracked issues
- **Questions:** Open a GitHub Discussion
- **Bugs:** Create a GitHub Issue with reproduction steps

---

## ✅ Pull Request Process

1. **Create feature branch** from `development`
2. **Follow TDD workflow** (Red → Green → Refactor)
3. **Write tests** for all new code
4. **Commit with conventional commits**
5. **Push to GitHub** and create PR
6. **PR targets `development`** (not `main`)
7. **Wait for CI checks** to pass
8. **Request review** if needed
9. **Squash and merge** when approved

---

**Thank you for contributing!** 🎉

This project aims to demonstrate best practices in modern web development while building a genuine portfolio. Your contributions help maintain high standards.
