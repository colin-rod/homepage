# Data Schema Documentation

This document describes the data structure used throughout the Colin Rodrigues Personal Homepage project. All data is stored in JSON files in the `/data` directory and validated against TypeScript interfaces defined in `/lib/types.ts`.

## 📂 Data Files

- **[/data/timeline.json](./data/timeline.json)** - Career and personal milestones
- **[/data/projects.json](./data/projects.json)** - Portfolio projects and tools
- **[/data/cv.json](./data/cv.json)** - Resume/CV data
- **[/data/uses.json](./data/uses.json)** - Tools and setup information

---

## 🗓️ Timeline Schema

**File:** `/data/timeline.json`
**Type:** `TimelineEvent[]`

Timeline events represent career milestones, projects, education, and learning experiences displayed on the interactive timeline page.

### TimelineEvent Interface

```typescript
interface TimelineEvent {
  id: string // Unique identifier (e.g., "event-1")
  title: string // Event title (e.g., "Product Manager at Acme Corp")
  organization: string // Company, school, or project name
  type: TimelineEventType // 'job' | 'project' | 'education' | 'milestone' | 'learning'
  startDate: string // ISO 8601 format: "YYYY-MM-DD"
  endDate?: string | null // ISO 8601 or null for current/ongoing
  summary: string // Brief description (1-2 sentences)
  description?: string // Optional detailed description
  tags: string[] // Filter tags: ['product', 'strategy', 'tech']
  link?: string // Optional URL to project, company, etc.
  location?: string // Optional location (e.g., "San Francisco, CA")
}
```

### Example

```json
{
  "id": "job-acme-2023",
  "title": "Senior Product Manager",
  "organization": "Acme Corp",
  "type": "job",
  "startDate": "2023-01-15",
  "endDate": null,
  "summary": "Leading product strategy for B2B SaaS platform serving 10K+ users",
  "description": "Spearheaded feature prioritization, roadmap planning, and cross-functional collaboration",
  "tags": ["product", "strategy"],
  "link": "https://acme.com",
  "location": "San Francisco, CA"
}
```

### Field Guidelines

- **id:** Use format `{type}-{organization}-{year}` (lowercase, hyphenated)
- **type:** Choose the most representative type for filtering
- **startDate/endDate:** Always use ISO 8601 format (`YYYY-MM-DD`). Set `endDate: null` for current positions
- **tags:** Use consistent vocabulary: `product`, `strategy`, `tech`, `design`, `leadership`
- **summary:** Keep concise (1-2 sentences). This appears in timeline cards
- **description:** Optional longer explanation for expanded views

---

## 🚀 Projects Schema

**File:** `/data/projects.json`
**Type:** `Project[]`

Projects represent portfolio work including web apps, tools, prototypes, and side projects.

### Project Interface

```typescript
interface Project {
  id: string // Unique identifier
  title: string // Project name
  slug: string // URL-friendly slug for /projects/{slug}
  description: string // Short description for cards (1-2 lines)
  detailedDescription: string | string[] // Full explanation (paragraphs or array)
  type: ProjectType // 'project' | 'tool'
  scope?: string // Optional project scope
  prd?: string // Optional PRD link/description
  businessModel?: string // Optional business model description
  status: ProjectStatus // 'concept' | 'in-progress' | 'active' | 'live' | 'sunset'
  techStack: string[] // Technologies used (e.g., ["Next.js", "TypeScript"])
  tags: string[] // Categorization tags
  whyBuilt?: string | string[] // Motivation/goals (string or paragraphs)
  learnings?: ProjectLearning[] // Key takeaways with sentiment
  favicon?: string // Path to project icon (e.g., "/images/projects/icon.png")
  links?: {
    live?: string // Production URL
    github?: string // GitHub repo
    blog?: string // Related blog post
    prd?: string // PRD link
  }
  images?: string[] // Screenshots/visuals
  featured: boolean // Show on homepage
  year: number // Year created/launched
  quarter?: ProjectQuarter // 'Q1' | 'Q2' | 'Q3' | 'Q4'
}

interface ProjectLearning {
  content: string // Learning description
  sentiment: LearningSentiment // 'positive' | 'negative' | 'neutral'
}
```

### Example

```json
{
  "id": "babypool",
  "title": "BabyPool",
  "slug": "babypool",
  "description": "Social betting pool for baby arrival predictions",
  "detailedDescription": [
    "A web app that lets friends and family guess baby arrival details (date, weight, time) in a friendly competition.",
    "Built to learn Next.js and explore monetization through Stripe subscriptions."
  ],
  "type": "project",
  "status": "live",
  "techStack": ["Next.js", "TypeScript", "Supabase", "Stripe"],
  "tags": ["web", "fullstack", "product"],
  "whyBuilt": "Wanted a fun project to explore subscription models and social features",
  "learnings": [
    {
      "content": "Stripe Checkout is incredibly developer-friendly for MVPs",
      "sentiment": "positive"
    },
    {
      "content": "User authentication adds significant complexity early on",
      "sentiment": "neutral"
    }
  ],
  "favicon": "/images/projects/babypool-favicon.png",
  "links": {
    "live": "https://babypool.app",
    "github": "https://github.com/colin-rod/babypool"
  },
  "images": ["/images/projects/babypool-screenshot-1.png"],
  "featured": true,
  "year": 2024,
  "quarter": "Q2"
}
```

### Field Guidelines

- **id:** Lowercase, hyphenated, unique
- **slug:** Match the project URL (must be URL-safe)
- **description:** Short (1-2 sentences) for project cards
- **detailedDescription:** Can be a single string or array of paragraphs
- **type:** `project` for substantial work, `tool` for smaller utilities
- **status:** Use `live` for production, `active` for ongoing work, `sunset` for discontinued
- **techStack:** Use official capitalization (e.g., "Next.js", "PostgreSQL")
- **tags:** Common tags: `web`, `mobile`, `api`, `automation`, `product`, `design`
- **learnings:** Capture what you learned with sentiment for authentic storytelling
- **featured:** Only feature 3-5 projects on homepage

---

## 📄 CV Schema

**File:** `/data/cv.json`
**Type:** `CV`

CV data powers the dynamic, filterable resume page with multiple download options.

### CV Interface

```typescript
interface CV {
  summary: string // Professional summary/bio
  skills: CVSkillCategory[] // Grouped skills
  experience: CVExperience[] // Work history
  education: CVEducation[] // Educational background
  projects: string[] // Project IDs to include in CV
}

interface CVSkillCategory {
  category: string // Skill group name (e.g., "Product Management")
  items: string[] // Skills in this category
}

interface CVExperience {
  id: string // Unique identifier
  title: string // Job title
  company: string // Company name
  location: string // Office location
  startDate: string // ISO 8601
  endDate?: string | null // ISO 8601 or null for current
  description: string // Role summary
  highlights: string[] // Key achievements (bullet points)
  tags: string[] // For filtering: ['product', 'strategy', 'tech']
}

interface CVEducation {
  degree: string // Degree name
  institution: string // School name
  year: number // Graduation year
  description?: string // Optional details
}
```

### Example

```json
{
  "summary": "Product leader with 5+ years building user-centric digital experiences...",
  "skills": [
    {
      "category": "Product Management",
      "items": ["Roadmap Planning", "User Research", "A/B Testing", "Analytics"]
    }
  ],
  "experience": [
    {
      "id": "exp-acme-pm",
      "title": "Senior Product Manager",
      "company": "Acme Corp",
      "location": "San Francisco, CA",
      "startDate": "2023-01-01",
      "endDate": null,
      "description": "Leading product strategy for enterprise SaaS platform",
      "highlights": [
        "Increased user retention by 30% through data-driven feature improvements",
        "Led cross-functional team of 12 engineers and designers"
      ],
      "tags": ["product", "strategy"]
    }
  ],
  "education": [
    {
      "degree": "Bachelor of Science in Computer Science",
      "institution": "University of California",
      "year": 2018,
      "description": "Focus on Human-Computer Interaction"
    }
  ],
  "projects": ["babypool", "homepage"]
}
```

### Field Guidelines

- **summary:** Keep to 2-3 sentences for CV header
- **skills:** Group by theme (Product, Technical, Design, Leadership)
- **experience.tags:** Use for filtering (`product`, `strategy`, `tech`)
- **experience.highlights:** Start with action verbs, quantify impact when possible
- **projects:** Reference project IDs from `/data/projects.json`

---

## 🛠️ Uses Schema

**File:** `/data/uses.json`
**Type:** `{ categories: UsesCategory[] }`

Documents the tools, hardware, and software in your daily workflow.

### Uses Interfaces

```typescript
interface UsesCategory {
  id: string // Category identifier
  title: string // Display name
  description?: string // Optional category description
  items: UsesItem[] // Tools in this category
}

interface UsesItem {
  name: string // Tool name
  details?: string // Optional subtitle/version
  link?: string // Official website or product page
  context: string // Why you use it, how it fits your workflow
  tags?: string[] // Categorization tags
  favicon?: string // Path to icon or external favicon URL
}
```

### Example

```json
{
  "categories": [
    {
      "id": "development",
      "title": "Development Toolkit",
      "description": "Core stack for building, testing, and shipping projects.",
      "items": [
        {
          "name": "Visual Studio Code",
          "details": "Primary code editor",
          "link": "https://code.visualstudio.com/",
          "context": "Main IDE for all development work. Extensions: Prettier, ESLint, GitHub Copilot.",
          "tags": ["editor", "ide"],
          "favicon": "https://code.visualstudio.com/favicon.ico"
        }
      ]
    }
  ]
}
```

### Field Guidelines

- **favicon:** Can be external URL (`https://...`) or local path (`/images/favicons/...`)
- **context:** Explain _why_ you use it, not just _what_ it is (makes the page personal)
- **tags:** Keep lowercase, use for potential filtering

---

## 🔗 Data Relationships

### Timeline ↔ CV

Timeline events with `type: 'job'` should align with CV experience entries. Use the same:

- Company names
- Job titles
- Start/end dates

### Projects ↔ CV

Reference projects in CV using their `id`:

```json
{
  "projects": ["babypool", "homepage"]
}
```

### Projects ↔ Timeline

Major projects can appear as timeline milestones:

```json
{
  "type": "milestone",
  "title": "Launched BabyPool MVP",
  "link": "/projects/babypool"
}
```

---

## ✅ Data Validation

### Required Fields

All entities must have:

- `id` (unique across their data file)
- Dates in ISO 8601 format (`YYYY-MM-DD`)
- Consistent tag vocabulary

### Tag Vocabulary

Use these standardized tags across all data files:

**Role Types:**

- `product` - Product management
- `strategy` - Strategic planning
- `tech` - Technical/engineering
- `design` - Design and UX
- `leadership` - Team leadership

**Project Categories:**

- `web` - Web applications
- `mobile` - Mobile apps
- `api` - API/backend services
- `automation` - Scripts and automations
- `prototype` - Early-stage concepts

### Type Checking

TypeScript interfaces in `/lib/types.ts` provide compile-time validation. Import and use them when working with data:

```typescript
import { Project, TimelineEvent, CV } from '@/lib/types'

const project: Project = {
  // TypeScript will enforce correct structure
}
```

---

## 🔄 Updating Data

### 1. Edit JSON Files

Make changes to `/data/*.json` files directly.

### 2. Validate Structure

```bash
npm run type-check
```

### 3. Test Changes Locally

```bash
npm run dev
```

### 4. Commit Changes

```bash
git add data/
git commit -m "feat(data): update projects with new entry"
```

---

## 📝 Best Practices

1. **Keep JSON valid** - Use a linter or VS Code's built-in JSON validation
2. **Use ISO 8601 dates** - Always `YYYY-MM-DD` format
3. **Consistent naming** - Follow established patterns (lowercase IDs, proper capitalization for titles)
4. **Meaningful descriptions** - Write for humans, not just data structures
5. **Tag thoughtfully** - Use consistent vocabulary for filtering
6. **Image paths** - Store images in `/public/images/{category}/` and reference with `/images/...`
7. **External favicons** - Use full URLs for external favicons, local paths for custom icons

---

## 🆘 Troubleshooting

**Problem:** TypeScript errors after updating data
**Solution:** Check that all required fields are present and types match interfaces in `/lib/types.ts`

**Problem:** Images not loading
**Solution:** Ensure image paths start with `/` (not `public/`) for Next.js static files

**Problem:** Dates not sorting correctly
**Solution:** Use ISO 8601 format (`YYYY-MM-DD`) for all date fields

**Problem:** Favicons not displaying
**Solution:** For local favicons, use `/images/favicons/...` (not `public/...`). External favicons should use full HTTPS URLs.

---

**Last Updated:** October 2024
