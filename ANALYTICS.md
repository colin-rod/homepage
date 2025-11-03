# Analytics & Monitoring Setup

This project uses three analytics and monitoring tools:

## 1. Vercel Analytics

**Purpose:** Web analytics and performance monitoring

**Features:**

- Real-time visitor tracking
- Page view metrics
- Performance insights
- No configuration required (automatically enabled on Vercel)

**Setup:**

- Automatically enabled when deployed to Vercel
- Client component integrated in [app/layout.tsx](app/layout.tsx:30)

**Documentation:** https://vercel.com/docs/analytics

---

## 2. PostHog

**Purpose:** Product analytics and session replay

**Features:**

- User behavior tracking
- Session recordings
- Feature flags
- Custom event tracking
- Funnel analysis

**Setup:**

1. Create account at https://posthog.com
2. Get your project key from: https://app.posthog.com/project/settings
3. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```
4. Deploy to enable tracking

**Configuration Files:**

- Provider: [components/providers/PostHogProvider.tsx](components/providers/PostHogProvider.tsx)
- Pageview tracker: [components/providers/PostHogPageView.tsx](components/providers/PostHogPageView.tsx)
- Integration: [app/layout.tsx](app/layout.tsx:26-28)

**Tracking Custom Events:**

```typescript
import { usePostHog } from 'posthog-js/react'

function MyComponent() {
  const posthog = usePostHog()

  const handleClick = () => {
    posthog?.capture('button_clicked', {
      button_name: 'Download CV',
      location: 'hero_section',
    })
  }
}
```

**Documentation:** https://posthog.com/docs

---

## 3. Sentry

**Purpose:** Error monitoring and performance tracking

**Features:**

- Error tracking
- Performance monitoring
- Session replay
- Source maps for better stack traces
- Release tracking

**Setup:**

1. Create account at https://sentry.io
2. Create a new Next.js project
3. Get your DSN and auth token
4. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_SENTRY_DSN=https://your_key@sentry.io/your_project_id
   SENTRY_ORG=your-org-name
   SENTRY_PROJECT=your-project-name
   SENTRY_AUTH_TOKEN=your_auth_token_here
   ```
5. Deploy to enable error tracking

**Configuration Files:**

- Client config: [sentry.client.config.ts](sentry.client.config.ts)
- Server config: [sentry.server.config.ts](sentry.server.config.ts)
- Edge config: [sentry.edge.config.ts](sentry.edge.config.ts)
- Instrumentation: [instrumentation.ts](instrumentation.ts)
- Next.js integration: [next.config.ts](next.config.ts)

**Capturing Custom Errors:**

```typescript
import * as Sentry from '@sentry/nextjs'

try {
  // Your code
} catch (error) {
  Sentry.captureException(error, {
    extra: {
      context: 'additional info',
    },
  })
}
```

**Documentation:** https://docs.sentry.io/platforms/javascript/guides/nextjs/

---

## Environment Variables

All required environment variables are documented in [.env.local.example](.env.local.example).

**Required for production:**

- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog project key
- `NEXT_PUBLIC_POSTHOG_HOST` - PostHog host (usually https://app.posthog.com)
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN
- `SENTRY_ORG` - Sentry organization name
- `SENTRY_PROJECT` - Sentry project name
- `SENTRY_AUTH_TOKEN` - Sentry auth token (for uploading source maps)

**Add to Vercel:**

1. Go to Project Settings > Environment Variables
2. Add all `NEXT_PUBLIC_*` variables to Production, Preview, and Development
3. Add `SENTRY_*` variables to Production only

---

## Privacy Considerations

**PostHog:**

- Disabled in development mode (see [PostHogProvider.tsx](components/providers/PostHogProvider.tsx:26))
- Captures pageviews and custom events only
- Session recordings can be disabled by removing the replay integration

**Sentry:**

- Masks all text in session replays by default
- Blocks all media in session replays
- Only captures errors and performance data
- Source maps are hidden from client bundles

**Vercel Analytics:**

- Anonymous by default
- No personal data collected
- GDPR compliant

---

## Testing Analytics

**Local Development:**

- PostHog is disabled in development mode
- Sentry debug mode can be enabled in config files
- Vercel Analytics only works in production

**Testing in Production:**

1. Deploy to preview environment
2. Open browser console
3. Trigger events (pageviews, clicks, errors)
4. Check respective dashboards:
   - Vercel: https://vercel.com/analytics
   - PostHog: https://app.posthog.com/events
   - Sentry: https://sentry.io/issues/

---

## Troubleshooting

**PostHog not tracking:**

- Check environment variables are set
- Verify PostHog project key is correct
- Check browser console for errors
- Ensure cookies are enabled

**Sentry not capturing errors:**

- Verify DSN is correct
- Check environment variables in Vercel
- Ensure instrumentation hook is enabled in next.config.ts
- Check Sentry dashboard for processed events

**Vercel Analytics not showing data:**

- Analytics only work in production deployments
- May take a few minutes for data to appear
- Ensure deployment is on Vercel platform

---

## Cost Estimates

**Vercel Analytics:**

- Free tier: 2,500 events/month
- Pro: $10/month for 100k events

**PostHog:**

- Free tier: 1M events/month
- Session replay: 5k recordings/month free

**Sentry:**

- Free tier: 5k errors/month
- Team: $26/month for 50k errors

For a portfolio site, free tiers should be sufficient.
