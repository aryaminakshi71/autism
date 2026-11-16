import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { GlobalErrorFallback } from "./global-error-fallback";

interface RootErrorBoundaryProps {
  children: ReactNode;
}

/**
 * Root Error Boundary
 * Wraps the entire application to catch unhandled errors
 */
export function RootErrorBoundary({ children }: RootErrorBoundaryProps) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      FallbackComponent={GlobalErrorFallback}
      onReset={reset}
      onError={(error, errorInfo) => {
        // Log to error tracking service
        console.error("Root Error Boundary caught an error:", error);
        console.error("Component stack:", errorInfo.componentStack);

        // Send to Sentry if available
        if (window.Sentry && error instanceof Error) {
          window.Sentry.captureException(error, {
            extra: {
              componentStack: errorInfo.componentStack,
              errorBoundary: "RootErrorBoundary",
            },
          });
        }

        // Send to analytics
        if (window.gtag && error instanceof Error) {
          window.gtag("event", "exception", {
            description: error.message,
            fatal: true,
          });
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// Add Sentry to window type
declare global {
  interface Window {
    Sentry?: {
      captureException: (error: Error, context?: unknown) => void;
    };
    gtag?: (...args: unknown[]) => void;
  }
}
