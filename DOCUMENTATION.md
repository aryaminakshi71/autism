# Autism Care Platform - Technical Documentation

## Table of Contents
1. [API Protocol](#api-protocol)
2. [Version Mismatches](#version-mismatches)
3. [API Integration](#api-integration)
4. [Lazy Loading & Code Splitting](#lazy-loading--code-splitting)
5. [Rate Limiting](#rate-limiting)
6. [Error Tracking & Sentry](#error-tracking--sentry)
7. [Analytics & PostHog](#analytics--posthog)
8. [Service Workers](#service-workers)
9. [API Caching](#api-caching)
10. [Frontend Surface](#frontend-surface)

---

## Frontend Surface

- Canonical web frontend: `apps/web/src/*`
- E2E test target: `bun run dev:web` (see `playwright.config.ts`)
- Route generation source of truth: `apps/web/src/routeTree.gen.ts`
- Canonical authenticated surface: `/dashboard/*`
- Legacy `/app/*` surface is redirected to `/dashboard`

When updating user-facing routes or copy, prefer `apps/web/src/routes/*` so
changes stay in the active deployed surface.

---

## API Protocol

### Overview
The platform uses a type-safe RPC protocol built with **oRPC** (Object RPC) on top of **Hono** framework for Cloudflare Workers.

### Configuration
- **Base URL**: `http://localhost:3000` (development) or `https://your-domain.com` (production)
- **API Endpoint**: `/api/rpc`
- **Version Header**: `x-api-version` (default: `1`)

### Client Setup
Located at: `src/lib/orpc/client.ts`

```typescript
const baseURL = import.meta.env.VITE_PUBLIC_API_URL?.replace(/\/api$/, '') ?? 
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
const apiVersion = import.meta.env.VITE_PUBLIC_API_VERSION ?? '1'

const link = new RPCLink({
  url: `${baseURL}/api/rpc`,
  headers: {
    'x-api-version': apiVersion,
  },
  plugins: [
    new BatchLinkPlugin({
      exclude: ({ path }) => path[0] === 'sse',
      groups: [
        {
          condition: () => true,
          context: {},
        },
      ],
    }),
  ],
})
```

### API Features
- **Batch Requests**: Multiple RPC calls bundled into single requests
- **Type Safety**: Full TypeScript inference from router definitions
- **TanStack Query Integration**: Built-in caching and invalidation
- **Error Handling**: Consistent error response format

---

## Version Mismatches

### Current Package Versions

| Package | Version | Status |
|---------|---------|--------|
| React | ^19.2.0 | ✅ Latest |
| TanStack Router | ^1.157.16 | ✅ Latest |
| TanStack Start | ^1.157.16 | ✅ Latest |
| Hono | ^4.7.10 | ✅ Latest |
| Better Auth | ^1.3.5 | ✅ Latest |
| Drizzle ORM | ^0.36.0 | ✅ Latest |
| PostHog | ^1.170.0 | ✅ Latest |
| Sentry React | ^7.0.0 | ⚠️ Outdated |
| Sentry Node | ^7.0.0 | ⚠️ Outdated |

### Known Version Issues

1. **Sentry SDK Version Mismatch**
   - Current: ^7.0.0
   - Latest: ^9.0.0
   - Impact: Missing latest error tracking features
   - Action: Update to latest version

2. **oRPC Package Versions**
   - Using "next" tag for @orpc/*
   - Risk: Potential breaking changes
   - Action: Pin to specific version for production

---

## API Integration

### Authentication Integration
Located at: `src/lib/auth/client.ts`

```typescript
export const authClient = createAuthClient({
  baseURL: `${baseURL}/api/auth`,
  plugins: [organizationClient()],
})

export const { signIn, signOut, signUp, useSession, useActiveOrganization } = authClient
```

### oRPC Client Integration
Located at: `src/lib/orpc/client.ts`

```typescript
import { createORPCClient } from '@orpc/client'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import type { RouterClient } from '@orpc/server'
import type { router } from '~/server/orpc/router'

export const orpcClient: RouterClient<typeof router> = createORPCClient(link)
export const orpc = createTanstackQueryUtils(orpcClient)
```

### API Routes
- **RPC API**: `/api/rpc/*` - Handled by `src/routes/api/rpc.$.ts`
- **Auth API**: `/api/auth/*` - Handled by `src/routes/api/auth.$.ts`
- **OpenAPI**: `/api/openapi` - Handled by `src/routes/api/openapi.$.ts`

---

## Lazy Loading & Code Splitting

### Implementation

The application uses **TanStack Router** with file-based routing for automatic code splitting:

```
src/routes/
├── __root.tsx           # Root route
├── index.tsx            # Landing page
├── login.tsx            # Login page
├── register.tsx         # Registration page
├── demo.tsx             # Demo page
├── care-finder.tsx      # Care resources page
└── dashboard/
    ├── index.tsx        # Dashboard home
    ├── analytics.tsx
    ├── assessments/
    ├── communication/
    ├── schedules/
    ├── sessions/
    ├── goals/
    ├── patients/
    ├── vehicles.tsx
    ├── spots.tsx
    ├── users.tsx
    ├── settings.tsx
    └── reports.tsx
```

### Code Splitting Benefits
- Each route is split into separate chunks
- Dashboard routes lazy-loaded
- Reduced initial bundle size
- Faster page loads

### TanStack Router Configuration
Located at: `src/routes/__root.tsx`

```typescript
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
})
```

---

## Rate Limiting

### Implementation
Located at: `src/lib/rate-limit.ts` (or configured via Upstash)

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
  prefix: 'autism-platform',
})
```

### Rate Limit Configuration
- **Window**: 10 seconds
- **Max Requests**: 10 per window
- **Storage**: Upstash Redis
- **Prefix**: `autism-platform`

### Headers
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1700000000
```

### Usage in API
```typescript
const { success } = await ratelimit.limit(ip)
if (!success) {
  return new Response('Too many requests', { status: 429 })
}
```

---

## Error Tracking & Sentry

### Setup
Located at: `src/lib/sentry.ts`

```typescript
import * as Sentry from '@sentry/react'

export function initSentry() {
  Sentry.init({
    dsn: import.meta.env.VITE_PUBLIC_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 1.0,
  })
}

export const SentryErrorBoundary = Sentry.ErrorBoundary
```

### Client Integration
Located at: `src/client.tsx`

```typescript
import { initSentry } from './lib/sentry'

initSentry()
```

### Error Boundary Usage
Wrap components with error boundaries:

```typescript
import { SentryErrorBoundary } from './lib/sentry'

<SentryErrorBoundary fallback={ErrorPage}>
  <YourComponent />
</SentryErrorBoundary>
```

### Server-side Sentry
Located at: `src/server/sentry.ts`

```typescript
import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

### Features
- **Real-time Error Capture**: Automatic error tracking
- **Performance Monitoring**: Distributed tracing
- **Release Tracking**: Error correlation with deployments
- **User Context**: Authenticated user tracking

---

## Analytics & PostHog

### Setup
Located at: `src/lib/analytics.ts`

```typescript
import posthog from 'posthog-js'

export function initAnalytics() {
  const key = import.meta.env.VITE_PUBLIC_POSTHOG_KEY
  const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST
  if (key) {
    posthog.init(key, {
      api_host: host || 'https://us.i.posthog.com',
      capture_pageview: false,
    })
  }
}

export function trackPageView(url: string) {
  posthog.capture('$pageview', { $current_url: url })
}
```

### Client Initialization
Located at: `src/client.tsx`

```typescript
import { initAnalytics } from './lib/analytics'

initAnalytics()
```

### Usage
```typescript
import { trackPageView } from './lib/analytics'

// Track custom events
posthog.capture('Button Clicked', { button: 'submit' })

// Track page views
trackPageView('/dashboard')

// Identify users
posthog.identify('user_id', { email: 'user@example.com' })
```

### Configuration
- **API Key**: `VITE_PUBLIC_POSTHOG_KEY`
- **Host**: `VITE_PUBLIC_POSTHOG_HOST` (default: `https://us.i.posthog.com`)

---

## Service Workers

### Setup
Located at: `src/lib/service-worker.ts`

```typescript
export function registerServiceWorker() {
  if (typeof window === 'undefined') return
  if (!('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch((error) => console.error('Service worker registration failed', error))
  })
}
```

### Client Initialization
Located at: `src/client.tsx`

```typescript
import { registerServiceWorker } from './lib/service-worker'

registerServiceWorker()
```

### Service Worker File
Located at: `public/sw.js`

```javascript
const API_CACHE = 'api-cache-v1'
const STATIC_CACHE = 'static-cache-v1'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(['/']))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== API_CACHE && key !== STATIC_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method === 'GET' && url.pathname.startsWith('/api/')) {
    event.respondWith(staleWhileRevalidate(request))
    return
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  )
})
```

### Features
- **API Caching**: Stale-while-revalidate strategy for API calls
- **Static Asset Caching**: Pre-cached static resources
- **Offline Support**: Fallback for network requests
- **Cache Management**: Automatic cache cleanup on activation

---

## API Caching

### Cache Strategy

1. **Service Worker Caching** (`public/sw.js`)
   - API Cache: `api-cache-v1`
   - Static Cache: `static-cache-v1`
   - Strategy: Stale-while-revalidate for API

2. **TanStack Query Caching**
   ```typescript
   import { orpc } from './lib/orpc/client'

   // Automatic caching with TanStack Query
   const { data } = orpc.patients.list.useQuery()
   ```

### Cache Invalidation
```typescript
const queryClient = useQueryClient()

// Invalidate specific queries
queryClient.invalidateQueries({ queryKey: ['patients'] })

// Invalidate all queries
queryClient.invalidateQueries()
```

### Environment Variables

```env
# API Configuration
VITE_PUBLIC_API_URL=http://localhost:3000/api
VITE_PUBLIC_API_VERSION=1

# Authentication
VITE_PUBLIC_SITE_URL=http://localhost:3000

# Sentry
VITE_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx

# PostHog
VITE_PUBLIC_POSTHOG_KEY=phc_xxx
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Database (Cloudflare)
DATABASE_URL=postgresql://...
HYPERDRIVE_CONNECTION_STRING=...

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx
```

---

## Database Safety

- Create backup before destructive migrations:
  - `bun run db:backup:pre-migrate`
- Restore a specific backup file:
  - `bun run db:restore:backup -- drizzle/backups/<file>.sql`
- Roll back autism schema transition using latest pre-migration backup:
  - `bun run db:rollback:autism-transition`

---

## Quality Gates

- Legacy content and surface checks:
  - `bun run qa:all`
- Lighthouse desktop + mobile thresholds:
  - `bun run qa:lighthouse`
- API contract checks (included in smoke E2E):
  - `e2e/api-contracts.spec.ts`

---

## Testing Checklist

### API Protocol
- [ ] RPC endpoints respond correctly
- [ ] Batch requests work
- [ ] Version header is respected
- [ ] Type safety is maintained

### Version Mismatches
- [ ] All packages are compatible
- [ ] No peer dependency conflicts
- [ ] TypeScript compilation succeeds

### API Integration
- [ ] Auth endpoints work
- [ ] oRPC client connects successfully
- [ ] Error responses are consistent
- [ ] Request/response logging works

### Lazy Loading
- [ ] Routes are code-split
- [ ] Dashboard routes load on demand
- [ ] No excessive bundle sizes
- [ ] Fast page transitions

### Rate Limiting
- [ ] Limits are enforced
- [ ] Headers are returned correctly
- [ ] 429 status on limit exceeded
- [ ] Different limits per endpoint

### Error Tracking
- [ ] Errors are captured
- [ ] Stack traces are available
- [ ] User context is tracked
- [ ] Performance data is sent

### Analytics
- [ ] Page views are tracked
- [ ] Custom events work
- [ ] User identification works
- [ ] Feature flags work

### Service Workers
- [ ] Registration succeeds
- [ ] Caching works correctly
- [ ] Offline support functions
- [ ] Cache invalidation works

### API Caching
- [ ] Responses are cached
- [ ] Stale-while-revalidate works
- [ ] Cache invalidation works
- [ ] Memory usage is optimized
