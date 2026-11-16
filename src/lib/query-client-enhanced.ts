import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { focusManager, onlineManager } from "@tanstack/react-query";

/**
 * Custom retry function with exponential backoff
 * Retries on network errors and 5xx responses
 */
export function retryWithBackoff(failureCount: number, error: Error): boolean {
  // Don't retry on 4xx errors (client errors)
  if (error.message.includes("4")) {
    return false;
  }

  // Retry up to 3 times
  if (failureCount > 3) {
    return false;
  }

  // Exponential backoff: 1s, 2s, 4s
  const delay = Math.min(1000 * 2 ** failureCount, 30000);

  return true;
}

/**
 * Calculate retry delay with exponential backoff and jitter
 */
export function getRetryDelay(attemptIndex: number): number {
  const baseDelay = 1000; // 1 second
  const maxDelay = 30000; // 30 seconds
  const exponentialDelay = baseDelay * 2 ** attemptIndex;
  const jitter = Math.random() * 1000; // Add randomness to prevent thundering herd

  return Math.min(exponentialDelay + jitter, maxDelay);
}

/**
 * Enhanced Query Client with retry logic and monitoring
 */
export function createQueryClient(): QueryClient {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: retryWithBackoff,
        retryDelay: getRetryDelay,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        networkMode: "offlineFirst",
      },
      mutations: {
        retry: (failureCount, error) => {
          // Only retry mutations on network errors, not on validation errors
          return failureCount < 2 && !error.message.includes("validation");
        },
        retryDelay: getRetryDelay,
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        console.error(`Query error for ${query.queryKey}:`, error);

        // Log to error tracking
        if (window.Sentry) {
          window.Sentry.captureException(error, {
            extra: {
              queryKey: query.queryKey,
              queryHash: query.queryHash,
            },
            tags: {
              type: "query_error",
            },
          });
        }
      },
      onSuccess: (data, query) => {
        // Log successful queries in development
        if (process.env.NODE_ENV === "development") {
          console.log(`Query success for ${query.queryKey}:`, data);
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, variables, context, mutation) => {
        console.error(`Mutation error:`, error);
        console.error(`Variables:`, variables);

        // Log to error tracking
        if (window.Sentry) {
          window.Sentry.captureException(error, {
            extra: {
              mutationId: mutation.mutationId,
              variables,
              context,
            },
            tags: {
              type: "mutation_error",
            },
          });
        }
      },
    }),
  });

  return queryClient;
}

/**
 * Setup online/offline state management
 */
export function setupNetworkListeners(): () => void {
  // Update React Query when browser goes online/offline
  const handleOnline = () => {
    onlineManager.setOnline(true);
    console.log("Application is online");
  };

  const handleOffline = () => {
    onlineManager.setOnline(false);
    console.log("Application is offline");
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  // Update focus management
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      focusManager.setFocused(true);
    } else {
      focusManager.setFocused(false);
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  // Return cleanup function
  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}

// Type augmentation for window
declare global {
  interface Window {
    Sentry?: {
      captureException: (error: Error, context?: unknown) => void;
    };
  }
}
