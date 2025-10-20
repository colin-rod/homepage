# 🚀 Ready to Build - Implementation Guide

## ✅ Planning Complete

All documentation is in place and we're ready to start development!

---

## 🎨 Design System Finalized

**Selected Palette:** Terracotta Midnight v2

- **Primary:** `#20465B` (Navy-teal) - Structure and professionalism
- **Accent:** `#D3643E` (Terracotta) - Action and warmth
- **Highlight:** `#C38A27` (Gold) - Emphasis and personality
- **Background:** `#FAF8F5` (Warm off-white)
- **Text:** `#222426` (Charcoal)

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for complete color tokens, gradients, and usage guidelines.

---

## 📚 Documentation Created

| File | Status | Purpose |
|------|--------|---------|
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | ✅ Complete | Color palette, typography, spacing, design tokens |
| [CLAUDE.md](./CLAUDE.md) | ✅ Complete | Project overview, TDD workflow, git strategy, tech stack |
| [LINEAR_ISSUES.md](./LINEAR_ISSUES.md) | ✅ Complete | All Linear epics and issues to create |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | ✅ Complete | Quick reference and overview |

---

## 🎯 Next Immediate Steps

### Step 1: Create Linear Issues (You)

Open [LINEAR_ISSUES.md](./LINEAR_ISSUES.md) and create in Linear:

**New Epics (5):**
1. EPIC 10: Contact & Utilities
2. EPIC 11: Content Creation
3. EPIC 12: Testing & Quality
4. EPIC 13: DevOps & CI/CD
5. EPIC 14: Future Enhancements

**New Issues (26):**
- Copy each issue's title, description, labels, priority, and parent epic
- Apply P0-P4 priority labels as documented
- Add dependencies between issues

**Update Existing Issues (2):**
- CRO-578: Remove dark mode toggle from description
- CRO-621: Update to print CSS approach (or replace with new CRO-634)

---

### Step 2: Start Development (P0 Critical Path)

Once Linear is updated, we'll tackle issues in this order:

#### Phase 1: Infrastructure Setup (Week 1)

**1. GitHub & Vercel Setup**
```
CRO-649: Set up GitHub repository and branch structure
  ├─ Create development branch
  ├─ Configure branch protection
  └─ Document branch strategy

CRO-651: Configure Vercel deployment
  ├─ Connect GitHub to Vercel
  ├─ Configure domains (colinrodrigues.com, dev.colinrodrigues.com)
  ├─ Add environment variables
  └─ Test deployments
```

**2. Next.js Project Initialization**
```
CRO-576: Initialize Next.js + Tailwind project
  ├─ Create Next.js 14+ app with App Router
  ├─ Install and configure Tailwind CSS
  ├─ Set up TypeScript
  ├─ Configure ESLint & Prettier
  └─ Create basic folder structure
```

**3. Testing Infrastructure**
```
CRO-646: Set up Jest and React Testing Library
  ├─ Install Jest dependencies
  ├─ Configure jest.config.js
  ├─ Create example test
  └─ Add test scripts

CRO-647: Set up Playwright for E2E testing
  ├─ Install Playwright
  ├─ Configure playwright.config.ts
  ├─ Create example E2E test
  └─ Add test scripts

CRO-648: Create testing utilities and helpers
  ├─ Build custom render function
  ├─ Create mock data factories
  └─ Document testing patterns
```

**4. CI/CD Pipeline**
```
CRO-650: Create GitHub Actions CI workflow
  ├─ Create .github/workflows/ci.yml
  ├─ Configure lint, type check, tests
  └─ Test workflow
```

---

#### Phase 2: Foundation (Week 1-2)

**5. Data Architecture**
```
CRO-634: Define data architecture and shared types
  ├─ Create /data folder structure
  ├─ Define TypeScript interfaces (Timeline, Project, CV, BlogPost)
  ├─ Document data relationships
  └─ Create example JSON files
```

**6. Design System Implementation**
```
CRO-577: Implement global theme & design system
  ├─ Configure Tailwind with Terracotta Midnight v2 colors
  ├─ Set up CSS custom properties
  ├─ Create typography classes
  ├─ Implement spacing scale
  └─ Test design tokens
```

**7. Navigation & Layout**
```
CRO-578: Add navigation & layout structure
  ├─ Create responsive navigation component
  ├─ Build mobile hamburger menu
  ├─ Add active link highlighting
  ├─ Write component tests (TDD!)
  └─ Write E2E tests
```

**8. SEO Foundation**
```
CRO-579: Add SEO & analytics configuration
  ├─ Configure Next.js metadata API
  ├─ Add Open Graph tags
  ├─ Create sitemap structure
  └─ Set up Vercel Analytics
```

---

#### Phase 3: Core Pages (Week 2-3)

After foundation is complete, we'll build:
- Homepage (EPIC 2) - Hero, featured projects, footer
- About & Now pages (EPIC 3)
- Projects section (EPIC 4)

---

## 🧪 TDD Workflow Reminder

For **every** feature, follow this strict cycle:

### Red → Green → Refactor

```bash
# 1. Create feature branch
git checkout development
git pull origin development
git checkout -b feature/epic-1-navigation

# 2. RED - Write failing test first
# Create components/Navigation.test.tsx
npm test -- --watch

# 3. GREEN - Write minimal code to pass
# Create components/Navigation.tsx

# 4. REFACTOR - Clean up while keeping tests green

# 5. Commit with conventional commit message
git add .
git commit -m "feat(nav): add responsive navigation component"

# 6. Push and create PR
git push origin feature/epic-1-navigation
# Create PR: feature/epic-1-navigation → development
```

### Test Requirements

Every component must have:
- ✅ **Unit tests** for logic/utilities
- ✅ **Component tests** for rendering and interactions
- ✅ **E2E tests** for user flows

---

## 🏗️ Project Structure (After Setup)

```
homepage/
├── .github/
│   └── workflows/
│       └── ci.yml                    # CI/CD pipeline
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Homepage
│   ├── globals.css                   # Global styles with design tokens
│   ├── about/page.tsx
│   ├── now/page.tsx
│   ├── projects/
│   │   ├── page.tsx                  # Projects index
│   │   └── [slug]/page.tsx           # Project detail
│   ├── writing/
│   │   ├── page.tsx                  # Blog index
│   │   └── [slug]/page.tsx           # Blog post
│   ├── timeline/page.tsx
│   ├── cv/
│   │   ├── page.tsx                  # Interactive CV
│   │   └── download/page.tsx         # Print-optimized CV
│   └── contact/page.tsx
├── components/
│   ├── ui/                           # shadcn/ui components
│   ├── layouts/
│   │   ├── Navigation.tsx
│   │   ├── Navigation.test.tsx       # Component tests
│   │   └── Footer.tsx
│   └── features/                     # Feature-specific components
├── lib/
│   ├── types.ts                      # TypeScript interfaces
│   ├── data.ts                       # Data fetching utilities
│   └── utils.ts                      # Helper functions
├── data/
│   ├── projects.json                 # Project data
│   ├── timeline.json                 # Timeline events
│   └── cv.json                       # CV/resume data
├── content/
│   ├── writing/                      # MDX blog posts
│   └── projects/                     # MDX project pages
├── public/
│   ├── images/
│   └── files/
├── tests/
│   ├── unit/                         # Unit tests
│   ├── components/                   # Component tests
│   ├── e2e/                          # E2E tests
│   └── utils/                        # Test helpers
├── CLAUDE.md                         # This project's guide
├── DESIGN_SYSTEM.md                  # Design tokens
├── LINEAR_ISSUES.md                  # Issue tracker
├── .env.local                        # Environment variables
├── package.json
├── tailwind.config.ts                # Tailwind configuration
├── jest.config.js                    # Jest configuration
├── playwright.config.ts              # Playwright configuration
└── tsconfig.json
```

---

## 🎨 Tailwind Configuration Preview

When we implement CRO-577, we'll extend Tailwind with our color palette:

```javascript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#20465B',
          dark: '#132C3D',
          light: '#2E6079',
        },
        accent: {
          warm: '#D3643E',
          'warm-dark': '#A84E2D',
          gold: '#C38A27',
        },
        bridge: {
          sage: '#7F9388',
          steel: '#426377',
        },
        neutral: {
          bg: '#FAF8F5',
          surface: '#FFFFFF',
        },
        text: {
          DEFAULT: '#222426',
          secondary: '#5A5F61',
          light: '#F7F9FA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Lora', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
}
```

---

## 📝 Conventional Commit Examples

```bash
# Features
feat(nav): add responsive navigation component
feat(cv): implement tag-based filtering
feat(timeline): add interactive timeline page

# Bug fixes
fix(nav): correct mobile menu z-index
fix(timeline): resolve scroll animation timing

# Tests
test(nav): add E2E tests for navigation
test(projects): add component tests for project cards

# Documentation
docs(readme): update setup instructions
docs(contributing): add contribution guidelines

# Chores
chore(deps): upgrade Next.js to 14.2
chore(config): update ESLint rules

# Refactoring
refactor(cv): extract filter logic into hook
refactor(timeline): simplify data mapping
```

---

## 🔐 Environment Variables Setup

Create `.env.local` with:

```bash
# Linear (optional, for Claude to access issues)
LINEAR_API_KEY=your_linear_api_key_here

# PostHog (add later in EPIC 9)
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Sentry (add later in EPIC 9)
SENTRY_DSN=https://xxx@sentry.io/xxx

# Domain
URL=https://colinrodrigues.com
```

---

## 🎯 Definition of Done

For each issue to be considered complete:

### Code Requirements
- [ ] Feature implemented following TDD (tests written first)
- [ ] All tests pass (unit, component, E2E)
- [ ] TypeScript compiles without errors
- [ ] ESLint passes with no warnings
- [ ] Code follows project conventions
- [ ] No console.log or debug code

### Testing Requirements
- [ ] Unit tests for all logic/utilities (if applicable)
- [ ] Component tests for rendering and interactions
- [ ] E2E tests for user flows (if applicable)
- [ ] Test coverage is meaningful (not just 100% for the sake of it)

### Design Requirements
- [ ] Matches design system (colors, typography, spacing)
- [ ] Responsive on mobile, tablet, desktop
- [ ] Accessible (ARIA labels, keyboard navigation)
- [ ] Smooth animations (if applicable)

### Documentation Requirements
- [ ] Code is self-documenting with clear names
- [ ] Complex logic has comments
- [ ] README updated (if needed)
- [ ] CLAUDE.md updated (if architecture changes)

### Git Requirements
- [ ] Feature branch created from `development`
- [ ] Conventional commit messages
- [ ] PR created with description
- [ ] CI checks pass (informational)
- [ ] 1 approval received
- [ ] Merged to `development`

---

## 🚦 Status Dashboard

### Planning Phase: ✅ COMPLETE
- [x] PRD reviewed and clarified
- [x] Linear epics planned (14 total)
- [x] Linear issues created (85 total)
- [x] Color palette selected (Terracotta Midnight v2)
- [x] Design system documented
- [x] TDD workflow documented
- [x] Git workflow documented
- [x] CI/CD strategy planned

### Development Phase: 🟡 READY TO START
- [ ] GitHub repository configured
- [ ] Vercel deployment configured
- [ ] Next.js project initialized
- [ ] Testing infrastructure setup
- [ ] CI/CD pipeline active
- [ ] Data architecture defined
- [ ] Design system implemented
- [ ] Navigation built

### Content Phase: 🔴 BLOCKED (Waiting for Development)
- [ ] About page content written
- [ ] Now page content written
- [ ] Project data populated
- [ ] Timeline data populated
- [ ] CV data populated

---

## 💬 Communication Protocol

### When You're Ready for Me to Start:

Simply say:
- **"Start with CRO-649"** (GitHub setup)
- **"Let's begin Phase 1"** (Infrastructure)
- **"Ready to build"** (I'll start with P0 issues in order)

### During Development:

- I'll update you after completing each issue
- I'll ask clarifying questions if requirements are unclear
- I'll flag any blockers or dependencies
- I'll commit frequently with clear messages

### For Content Tasks:

- I'll create placeholder content during development
- You'll replace with real content when ready (EPIC 11)
- Let me know when content is ready for specific sections

---

## 🎉 What Makes This Project Special

1. **Strict TDD** - Every feature is test-driven from the start
2. **Professional DevOps** - Full CI/CD, branch strategy, monitoring
3. **Comprehensive Documentation** - Everything is documented for collaboration
4. **Unique Design** - Terracotta Midnight v2 stands out from typical portfolios
5. **Interactive Features** - Timeline, dynamic CV, filterable projects
6. **Performance Focused** - Lighthouse 90+ targets
7. **Accessible** - WCAG AA compliant
8. **SEO Optimized** - Structured data, metadata, sitemap

---

## ✅ Pre-Flight Checklist

Before we start building:

- [x] PRD reviewed and clarified
- [x] Color palette selected
- [x] Design system documented
- [x] All Linear issues defined
- [ ] **Linear issues created in Linear** (Do this now)
- [ ] **Priority labels applied** (Do this now)
- [ ] **Dependencies added** (Do this now)
- [ ] **GitHub repo verified** (https://github.com/colin-rod/homepage)

---

## 🚀 Ready When You Are!

Once you've created the Linear issues, just let me know and I'll start with:

**CRO-649: Set up GitHub repository and branch structure**

This will be the first commit, establishing our development workflow.

**Estimated Timeline:**
- Phase 1 (Infrastructure): 1 week
- Phase 2 (Foundation): 1-2 weeks
- Phase 3 (Core Pages): 2-3 weeks
- Phase 4 (Polish & Deploy): 2 weeks

**Total MVP Timeline: 6-8 weeks**

---

**Document Created:** October 2025
**Status:** 🟢 Ready to Build
**Next Step:** Create Linear issues → Start CRO-649
