import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import type { ComponentType, ReactNode } from "react";
import { Suspense, lazy } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Spinner } from "./ui";

/**
 * Route-level Error Fallback
 */
function RouteErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  // Type guard to safely access error properties
  const errorMessage =
    error instanceof Error ? error.message : "Failed to load page";

  return (
    <div className="flex min-h-[400px] items-center justify-center p-4">
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <h2 className="mb-2 text-lg font-semibold text-red-700">
          Failed to load page
        </h2>
        <p className="mb-4 text-sm text-red-600">{errorMessage}</p>
        <button
          onClick={resetErrorBoundary}
          className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

interface LazyRouteWrapperProps {
  children: ReactNode;
}

/**
 * Lazy Route Wrapper
 * Wraps lazy-loaded routes with Suspense and ErrorBoundary
 */
export function LazyRouteWrapper({ children }: LazyRouteWrapperProps) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary FallbackComponent={RouteErrorFallback} onReset={reset}>
      <Suspense fallback={<RouteLoadingFallback />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

/**
 * Loading fallback for routes
 */
function RouteLoadingFallback() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

/**
 * Helper to create lazy route components
 */
export function createLazyRoute<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
) {
  const LazyComponent = lazy(importFn);

  return function LazyRouteWrapperComponent(props: any) {
    return (
      <LazyRouteWrapper>
        <LazyComponent {...props} />
      </LazyRouteWrapper>
    );
  };
}
