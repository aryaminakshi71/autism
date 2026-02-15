import {
  HeadContent,
  Scripts,
  createRootRoute,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { queryClient } from "../lib/query";
import { PostHogProvider } from "../components/providers/posthog-provider";
import { ErrorBoundaryWrapper } from "../components/error-boundary-wrapper";
import { generateOrganizationSchema, generateWebSiteSchema, getAutismOrganizationSchema } from "../lib/structured-data";
import { registerServiceWorker } from "../lib/service-worker";
import { addSkipLink } from "../lib/accessibility";
import { useEffect } from "react";

import appCss from "../app.css?url";

export const Route = createRootRoute({
  head: () => {
    const organizationSchema = generateOrganizationSchema(getAutismOrganizationSchema())
    const websiteSchema = generateWebSiteSchema({
      name: "Autism Platform",
      url: import.meta.env.VITE_PUBLIC_SITE_URL || "https://autism.app",
      description:
        "Autism care and ecosystem platform for clinics, therapists, schools, families, and insurers.",
    })

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "Autism Platform - Care Coordination & Outcomes" },
        {
          name: "description",
          content:
            "Autism care and ecosystem platform for schedules, AAC communication, therapy analytics, and secure collaboration.",
        },
        {
          name: "keywords",
          content:
            "autism, therapy coordination, AAC, visual schedules, care planning, analytics, security",
        },
        { property: "og:title", content: "Autism Platform - Care Coordination & Outcomes" },
        {
          property: "og:description",
          content:
            "Coordinate care across clinics, schools, and families with schedules, AAC, analytics, and secure workflows.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
        { name: "robots", content: "index, follow" },
      ],
      links: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        { rel: "dns-prefetch", href: "https://api.your-domain.com" },
        { rel: "stylesheet", href: appCss },
        { rel: "icon", href: "/favicon.ico" },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(organizationSchema),
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify(websiteSchema),
        },
      ],
    }
  },
  component: RootDocument,
  errorComponent: ({ error }) => {
    return (
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
              <p className="text-gray-700 mb-4">
                {error instanceof Error ? error.message : "An unexpected error occurred"}
              </p>
              <button
                onClick={() => window.location.href = "/"}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Go Home
              </button>
            </div>
          </div>
          <Scripts />
        </body>
      </html>
    );
  },
  notFoundComponent: () => {
    return (
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
              <p className="text-gray-600 mb-6">
                The page you are looking for does not exist or has been moved.
              </p>
              <button
                onClick={() => window.location.href = "/"}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
          <Scripts />
        </body>
      </html>
    );
  },
});

function RootDocument() {
  // Register service worker for offline support
  useEffect(() => {
    registerServiceWorker();
    // Add skip link for accessibility
    addSkipLink("main-content", "Skip to main content");
  }, []);

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ErrorBoundaryWrapper>
          <PostHogProvider>
            <QueryClientProvider client={queryClient}>
              <Outlet />
              <Toaster position="top-right" />
              {import.meta.env.PROD ? null : <TanStackRouterDevtools />}
              <Scripts />
            </QueryClientProvider>
          </PostHogProvider>
        </ErrorBoundaryWrapper>
      </body>
    </html>
  );
}
