import * as Sentry from '@sentry/nextjs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}

export async function onRequestError(
  err: unknown,
  request: {
    path: string
    method: string
    headers: { get(key: string): string | null }
  },
  context: {
    routerKind: 'Pages Router' | 'App Router'
    routePath: string
    routeType: 'render' | 'route' | 'action' | 'middleware'
  }
) {
  // Transform the request object to match Sentry's expected format
  const sentryRequest = {
    url: request.path,
    method: request.method,
    headers: {} as Record<string, string>,
  }

  // Convert headers.get() to a plain object
  // Note: We can't enumerate all headers, so we'll capture the most common ones
  const commonHeaders = [
    'user-agent',
    'referer',
    'content-type',
    'accept',
    'host',
    'x-forwarded-for',
  ]
  commonHeaders.forEach((headerName) => {
    const value = request.headers.get(headerName)
    if (value) {
      sentryRequest.headers[headerName] = value
    }
  })

  Sentry.captureException(err, {
    contexts: {
      request: sentryRequest,
      nextjs: {
        routerKind: context.routerKind,
        routePath: context.routePath,
        routeType: context.routeType,
      },
    },
  })
}
