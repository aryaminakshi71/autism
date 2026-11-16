import { AlertTriangle, RefreshCw } from "lucide-react";
import type { FallbackProps } from "react-error-boundary";
import { Button } from "./ui";

/**
 * Global Error Fallback Component
 * Displayed when an error boundary catches an error
 */
export function GlobalErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const isDev = process.env.NODE_ENV === "development";

  // Type guard to safely access error properties
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  const errorStack = error instanceof Error ? error.stack : undefined;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-6 w-6" />
          <h1 className="text-xl font-bold">Something went wrong</h1>
        </div>

        <p className="mb-4 text-gray-600">
          We apologize for the inconvenience. An unexpected error occurred.
        </p>

        {isDev && error instanceof Error && (
          <div className="mb-4 overflow-auto rounded bg-red-50 p-3 text-sm">
            <pre className="whitespace-pre-wrap break-words text-red-700">
              {errorMessage}
              {errorStack && (
                <>
                  {"\n\n"}
                  {errorStack}
                </>
              )}
            </pre>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={resetErrorBoundary}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
          >
            Go Home
          </Button>
        </div>

        <div className="mt-4 border-t pt-4 text-sm text-gray-500">
          <p>
            Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
          <p>Timestamp: {new Date().toISOString()}</p>
        </div>
      </div>
    </div>
  );
}
