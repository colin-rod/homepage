# Colin's Personal Homepage

A modern, interactive portfolio showcasing professional journey, projects, and expertise.

## 🎨 Design

**Terracotta Midnight v2** - "Warm light over cool depth"

A harmonized color palette combining deep navy-teal structure with warm terracotta accents.

## 🚀 Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Language:** TypeScript
- **Testing:** Jest, React Testing Library, Playwright
- **Deployment:** Vercel
- **Analytics:** PostHog
- **Monitoring:** Sentry

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Complete project documentation, TDD workflow, git strategy
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines and workflow
- **[DATA_SCHEMA.md](./DATA_SCHEMA.md)** - Data structure and schema reference
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Color palette, typography, design tokens
- **[LINEAR_ISSUES.md](./LINEAR_ISSUES.md)** - All Linear epics and issues
- **[READY_TO_BUILD.md](./READY_TO_BUILD.md)** - Implementation guide

## 🏗️ Development

### Prerequisites

- Node.js 20+ (LTS)
- npm, yarn, or pnpm
- Git

### Setup

```bash
# Clone repository
git clone https://github.com/colin-rod/homepage.git
cd homepage

# Install dependencies
npm install

# Copy environment variables (optional for local dev)
cp .env.local.example .env.local

# Run development server
npm run dev

# Open http://localhost:3000
```

### Environment Variables

All environment variables are **optional** for local development:

```bash
# Linear API (optional - for AI assistants)
LINEAR_API_KEY=your_key

# PostHog Analytics (optional)
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Sentry Error Monitoring (optional)
SENTRY_DSN=https://xxx@sentry.io/xxx

# Domain (for SEO metadata)
URL=https://colinrodrigues.com
```

See [.env.local.example](./.env.local.example) for the complete template.

### Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
npm test             # Run all tests
npm run test:e2e     # Run E2E tests
```

## 🌿 Git Workflow

```
main (production) → colinrodrigues.com
└── development (staging) → dev.colinrodrigues.com
    └── feature/* (feature branches)
```

### Branch Strategy

- **`main`** - Production, requires PR approval
- **`development`** - Default branch for PRs and integration
- **`feature/*`** - Feature branches (e.g., `feature/epic-1-navigation`)

## 🧪 Testing (TDD)

This project follows strict Test-Driven Development:

1. **Write test first** (Red)
2. **Write minimal code to pass** (Green)
3. **Refactor** while keeping tests green

Every component requires:

- Unit tests for logic
- Component tests for rendering/interactions
- E2E tests for user flows

## 📝 Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat(nav): add responsive navigation component
fix(timeline): correct scroll animation timing
test(cv): add E2E tests for CV filtering
docs(readme): update setup instructions
chore(deps): upgrade Next.js to 14.2
```

## 🤝 Contributing

This is a personal portfolio project, but contributions are documented for collaboration with AI pair programmers and potential future contributors.

See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for:

- Complete development workflow
- TDD guidelines and examples
- Code style and best practices
- Pull request process
- Testing requirements

Quick checklist:

- Follow TDD (write tests first)
- Use TypeScript for all new code
- Ensure accessibility (ARIA labels, keyboard nav)
- Follow conventional commit format
- Target PRs to `development` branch

## 🗄️ Data Management

All content (projects, timeline, CV, uses) is stored in JSON files in `/data/`.

See **[DATA_SCHEMA.md](./DATA_SCHEMA.md)** for:

- Complete schema documentation
- Field requirements and examples
- Data relationships
- Validation guidelines
- Best practices

## 🎯 Project Status

- **Phase:** Foundation & Setup
- **Current Sprint:** Infrastructure (Week 1)
- **Next Milestone:** Core Pages

See [Linear](https://linear.app/crod) for detailed progress.

## 📊 Success Metrics

| Metric                   | Target      |
| ------------------------ | ----------- |
| Lighthouse Performance   | >90         |
| Lighthouse Accessibility | >90         |
| Average Visit Duration   | >60 seconds |
| PDF Generation Success   | 100%        |

## 📄 License

Personal project - All rights reserved

---

**Built with ❤️ by Colin**
