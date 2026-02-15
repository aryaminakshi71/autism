import {
  DarkModeProvider,
  ToastProvider,
} from "@shared/saas-core/components/ui";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { AnalyticsProvider } from "~/components/analytics/analytics-provider";
import appCss from "~/styles/app.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        { title: "Autism Care Platform - Comprehensive Care Management" },
        {
          name: "description",
          content:
            "Complete autism care management platform for clinics, therapists, and families. Manage patients, sessions, goals, and more.",
        },
        { property: "og:title", content: "Autism Care Platform" },
        {
          property: "og:description",
          content: "Comprehensive autism care management solution",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "theme-color", content: "#6366f1" },
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "manifest", href: "/manifest.json" },
        { rel: "icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", href: "/icons/icon-192.png" },
      ],
    }),
    component: RootComponent,
  },
);

function RootComponent() {
  return (
    <RootDocument>
      <DarkModeProvider>
        <AnalyticsProvider>
          <ToastProvider>
            <Outlet />
          </ToastProvider>
        </AnalyticsProvider>
      </DarkModeProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === "production" ? null : (
          <>
            <TanStackRouterDevtools position="bottom-right" />
            <ReactQueryDevtools buttonPosition="bottom-left" />
          </>
        )}
        <Scripts />
      </body>
    </html>
  );
}
