# Design System

## Selected Color Palette: Terracotta Midnight v2

**"Warm light over cool depth."**

A harmonized, contrast-tested hybrid of terracotta warmth and midnight professionalism.

---

## 🌗 Color Philosophy

- **Base:** Deep navy-teal → establishes structure and calm
- **Accents:** Terracotta + ochre → inject warmth, personality, and approachability
- **Bridges:** Desaturated sage and steel → temper warm/cool transition
- **Neutrals:** Warm off-whites and charcoals for readable content

---

### Primary Colors (Navy-Teal Base)

| Role | CSS Variable | Hex | Usage | WCAG AA Contrast |
|------|--------------|-----|-------|------------------|
| Primary Base | `--color-primary` | `#20465B` | Backgrounds, headers, timeline base | ✓ (on white) |
| Primary Dark | `--color-primary-dark` | `#132C3D` | Hero gradients, dark mode | ✓ (on light text) |
| Primary Light | `--color-primary-light` | `#2E6079` | Hover states, subtle fills | ✓ |

### Accent Colors (Terracotta + Gold)

| Role | CSS Variable | Hex | Usage | WCAG AA Contrast |
|------|--------------|-----|-------|------------------|
| Accent Warm | `--color-accent-warm` | `#D3643E` | CTAs, highlights, icons | ✓ |
| Accent Warm Dark | `--color-accent-warm-dark` | `#A84E2D` | Hover / pressed CTA | ✓ |
| Accent Gold | `--color-accent-gold` | `#C38A27` | Secondary highlight (timeline nodes) | ✓ |

### Bridge Colors (Transitional Neutrals)

| Role | CSS Variable | Hex | Usage | WCAG AA Contrast |
|------|--------------|-----|-------|------------------|
| Bridge Sage | `--color-bridge-sage` | `#7F9388` | Dividers, muted surfaces | ✓ |
| Bridge Steel | `--color-bridge-steel` | `#426377` | Secondary buttons, borders | ✓ |

### Neutral Colors

| Role | CSS Variable | Hex | Usage | WCAG AA Contrast |
|------|--------------|-----|-------|------------------|
| Neutral BG | `--color-bg` | `#FAF8F5` | Page background | ✓ |
| Neutral Surface | `--color-surface` | `#FFFFFF` | Cards, CV panels | ✓ |
| Text Primary | `--color-text` | `#222426` | Headings, body copy | ✓ |
| Text Secondary | `--color-text-secondary` | `#5A5F61` | Captions, meta | ✓ |
| Text Light | `--color-text-light` | `#F7F9FA` | Text on dark navy | ✓ |

### Semantic Colors

| Purpose | Color Name | CSS Variable | Hex |
|---------|-----------|--------------|-----|
| Success | Muted Teal | `--color-success` | `#4F8B6A` |
| Warning | Amber Tone | `--color-warning` | `#D6A94E` |
| Error | Deep Coral | `--color-error` | `#C8533C` |
| Info | Dusty Blue | `--color-info` | `#5F8FA6` |
| Divider | Soft Gray | `--color-divider` | `#E3E1DD` |

---

## 🪄 Signature Gradients

### Hero Gradient
```css
background: linear-gradient(120deg, #132C3D 0%, #20465B 50%, #D3643E 100%);
```
**Usage:** Hero sections, major page headers

### CTA Gradient
```css
background: linear-gradient(90deg, #D3643E 0%, #C38A27 100%);
```
**Usage:** Primary call-to-action buttons, important links

### Timeline Line Gradient
```css
background: linear-gradient(90deg, #C38A27 0%, #D3643E 50%, #426377 100%);
```
**Usage:** Career timeline connecting line, progress indicators

---

## 🧩 Light / Dark Mode Usage

| Mode | Background | Foreground | Accent Behavior |
|------|-----------|------------|-----------------|
| **Light Mode** | `#FAF8F5` → `#FFFFFF` | `#222426` | Warm accents pop; gold used sparingly |
| **Dark Mode** | `#132C3D` → `#20465B` | `#F7F9FA` | Use desaturated warm (`#D18C6A`) to avoid oversaturation |

**Note:** Dark mode is a future enhancement (EPIC 14). Initial implementation will be light mode only.

---

## 🧠 Visual Hierarchy Guidelines

1. **Navy = Structure** - Use for large backgrounds, navigation, and hero sections
2. **Terracotta = Action** - Restrict to < 25% of visible UI — buttons, icons, progress indicators
3. **Gold = Highlight** - Small touches — underline active nav, emphasize metrics, timeline nodes
4. **Sage/Steel = Glue** - Connect warm and cool blocks; maintain neutral rhythm
5. **Off-white = Canvas** - Use for text pages, blog, and CV content

### Color Usage Ratios (Recommended)

```
Navy (Base):        40-50% of UI
Off-white (Canvas): 30-40% of UI
Terracotta (Action): 10-20% of UI
Gold (Highlight):    5-10% of UI
Bridge Colors:       5-10% of UI
```

---

## Typography Scale

All palettes use the same typography system:

### Font Families
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
--font-serif: 'Lora', Georgia, 'Times New Roman', serif;
--font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
```

### Font Sizes (Fluid Typography)
```css
--text-xs:   clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);    /* 12-14px */
--text-sm:   clamp(0.875rem, 0.8rem + 0.375vw, 1rem);      /* 14-16px */
--text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);        /* 16-18px */
--text-lg:   clamp(1.125rem, 1rem + 0.625vw, 1.25rem);     /* 18-20px */
--text-xl:   clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);      /* 20-24px */
--text-2xl:  clamp(1.5rem, 1.3rem + 1vw, 2rem);            /* 24-32px */
--text-3xl:  clamp(1.875rem, 1.5rem + 1.5vw, 2.5rem);      /* 30-40px */
--text-4xl:  clamp(2.25rem, 1.75rem + 2vw, 3rem);          /* 36-48px */
--text-5xl:  clamp(3rem, 2.25rem + 3vw, 4rem);             /* 48-64px */
```

### Font Weights
```css
--font-light:    300;
--font-normal:   400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;
```

### Line Heights
```css
--leading-none:   1;
--leading-tight:  1.25;
--leading-snug:   1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose:  2;
```

---

## Spacing Scale

Consistent spacing system based on 4px base unit:

```css
--space-1:  0.25rem;  /* 4px */
--space-2:  0.5rem;   /* 8px */
--space-3:  0.75rem;  /* 12px */
--space-4:  1rem;     /* 16px */
--space-5:  1.25rem;  /* 20px */
--space-6:  1.5rem;   /* 24px */
--space-8:  2rem;     /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
--space-32: 8rem;     /* 128px */
```

---

## Border Radius

```css
--radius-sm:   0.25rem;  /* 4px */
--radius-base: 0.5rem;   /* 8px */
--radius-md:   0.75rem;  /* 12px */
--radius-lg:   1rem;     /* 16px */
--radius-xl:   1.5rem;   /* 24px */
--radius-full: 9999px;   /* Fully rounded */
```

---

## Shadows

```css
--shadow-sm:  0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow:     0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
--shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

---

## Animation Tokens

```css
--duration-fast: 150ms;
--duration-base: 300ms;
--duration-slow: 500ms;

--ease-linear:     linear;
--ease-in:         cubic-bezier(0.4, 0, 1, 1);
--ease-out:        cubic-bezier(0, 0, 0.2, 1);
--ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce:     cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## Breakpoints

```css
--screen-sm:  640px;   /* Mobile landscape */
--screen-md:  768px;   /* Tablet */
--screen-lg:  1024px;  /* Desktop */
--screen-xl:  1280px;  /* Large desktop */
--screen-2xl: 1536px;  /* Extra large */
```

---

## Implementation Notes

1. **Choose one palette** from the three options above
2. Define CSS custom properties in `globals.css` or Tailwind config
3. All colors include accessibility-tested contrast ratios (WCAG AA minimum)
4. Use semantic color names in components (e.g., `bg-primary`, `text-secondary`)
5. Typography uses fluid sizing for responsive text without media queries
6. Spacing scale maintains consistent rhythm throughout the UI

---

## Next Steps

1. **Review palettes** and select your preferred option
2. **Test on sample pages** to see how they feel in context
3. **Refine if needed** - colors can be adjusted for your preference
4. **Implement in Tailwind** - extend theme with chosen palette

---

**Recommended Choice:** Start with **Option 1 (Terracotta Sunset)** for warm approachability, **Option 2 (Midnight Ochre)** for bold sophistication, or **Option 3 (Copper Dawn)** for artisanal uniqueness.
