import { QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { ErrorBoundaryWrapper } from "../components/error-boundary-wrapper";
import { PostHogProvider } from "../components/providers/posthog-provider";
import { addSkipLink } from "../lib/accessibility";
import { queryClient } from "../lib/query";
import { registerServiceWorker } from "../lib/service-worker";
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  getAutismOrganizationSchema,
} from "../lib/structured-data";

import appCss from "../app.css?url";

export const Route = createRootRoute({
  head: () => {
    const organizationSchema = generateOrganizationSchema(
      getAutismOrganizationSchema(),
    );
    const websiteSchema = generateWebSiteSchema({
      name: "Autism Platform",
      url: import.meta.env.VITE_PUBLIC_SITE_URL || "https://autism.app",
      description:
        "Autism care and ecosystem platform for clinics, therapists, schools, families, and insurers.",
    });

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
        {
          property: "og:title",
          content: "Autism Platform - Care Coordination & Outcomes",
        },
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
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        { rel: "dns-prefetch", href: "https://api.your-domain.com" },
        { rel: "stylesheet", href: appCss },
        { rel: "icon", href: "/favicon.ico" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(organizationSchema),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(websiteSchema),
        },
      ],
    };
  },
  component: RootDocument,
  errorComponent: ({ error }) => {
    return (
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
              <h1 className="mb-4 font-bold text-2xl text-red-600">
                Something went wrong
              </h1>
              <p className="mb-4 text-gray-700">
                {error instanceof Error
                  ? error.message
                  : "An unexpected error occurred"}
              </p>
              <button
                onClick={() => (window.location.href = "/")}
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
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
          <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
              <h1 className="mb-2 font-bold text-4xl text-gray-900">404</h1>
              <h2 className="mb-4 font-semibold text-gray-700 text-xl">
                Page Not Found
              </h2>
              <p className="mb-6 text-gray-600">
                The page you are looking for does not exist or has been moved.
              </p>
              <button
                onClick={() => (window.location.href = "/")}
                className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
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
              <a
                href="/app"
                className="fixed right-4 bottom-4 z-50 rounded-md border border-border bg-card px-3 py-2 font-medium text-foreground text-sm shadow hover:bg-muted"
              >
                Dashboard
              </a>
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
