import * as Sentry from '@sentry/react'

interface ErrorContext {
  userId?: string
  userEmail?: string
  route?: string
  action?: string
  metadata?: Record<string, unknown>
  timestamp?: string
}

export function initSentryEnhanced() {
  const dsn = import.meta.env.VITE_PUBLIC_SENTRY_DSN
  
  if (!dsn) {
    if (import.meta.env.DEV) {
      console.warn('Sentry DSN not configured - error tracking disabled')
    }
    return
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: false,
      }),
    ],
    initialScope: {
      tags: {
        app: 'autism-care-platform',
      },
    },
  })
}

export function captureError(error: Error, context?: ErrorContext) {
  if (import.meta.env.DEV) {
    console.error('Error captured:', error, context)
  }

  Sentry.withScope((scope) => {
    if (context) {
      scope.setTag('route', context.route ?? '')
      scope.setTag('action', context.action ?? '')
      
      if (context.userId) {
        scope.setUser({ id: context.userId, email: context.userEmail })
      }
      
      if (context.metadata) {
        Object.entries(context.metadata).forEach(([key, value]) => {
          scope.setExtra(key, value)
        })
      }
    }
    
    scope.setLevel(context?.action === 'navigation' ? 'warning' : 'error')
    Sentry.captureException(error)
  })
}

export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: Partial<ErrorContext>
) {
  Sentry.withScope((scope) => {
    scope.setLevel(level)
    
    if (context) {
      scope.setTag('route', context.route ?? '')
      scope.setTag('action', context.action ?? '')
      
      if (context.metadata) {
        Object.entries(context.metadata).forEach(([key, value]) => {
          scope.setExtra(key, value)
        })
      }
    }
    
    Sentry.captureMessage(message)
  })
}

export function addBreadcrumb(
  category: string,
  message: string,
  data?: Record<string, unknown>
) {
  Sentry.addBreadcrumb({
    category,
    message,
    data: data ?? {},
    level: 'info',
  })
}

export { Sentry }
