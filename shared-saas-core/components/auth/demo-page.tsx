"use client";

// Standardized Demo Page Component - Used across all apps
// Uses Tailwind design tokens for consistent dark/light mode support

import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Play, Sparkles } from "lucide-react";
import * as React from "react";

interface DemoPageProps {
  appName?: string;
  appDescription?: string;
  themeColor?: string;
  themeColorSecondary?: string;
  logoIcon?: React.ReactNode;
  dashboardHref?: string;
  features?: string[];
  onStartDemo?: () => void;
}

export function DemoPage({
  appName = "App",
  appDescription = "Experience the full power of our platform",
  themeColor,
  themeColorSecondary,
  logoIcon,
  dashboardHref = "/dashboard",
  features = [
    "Full access to all features",
    "Sample data pre-loaded",
    "No credit card required",
    "Demo resets after 24 hours",
  ],
  onStartDemo,
}: DemoPageProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleStartDemo = async () => {
    setIsLoading(true);

    if (typeof window === "undefined") return;
    const demoUser = {
      id: "demo-user-" + Date.now(),
      email: "demo@example.com",
      firstName: "Demo",
      lastName: "User",
      role: "admin",
      isDemo: true,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("user", JSON.stringify(demoUser));
    localStorage.setItem("isDemo", "true");
    localStorage.setItem("demo_mode", "true");

    if (onStartDemo) {
      await onStartDemo();
    }

    setTimeout(() => {
      navigate({ to: dashboardHref });
    }, 500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10">
      <nav className="border-border border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 no-underline">
              {logoIcon || (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <span className="font-bold text-lg">{appName.charAt(0)}</span>
                </div>
              )}
              <span className="font-bold text-foreground text-xl">
                {appName}
              </span>
            </Link>
            <Link
              to="/"
              className="flex items-center text-muted-foreground no-underline transition-colors hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 dark:bg-primary/20">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>

            <h1 className="mb-2 text-center font-bold text-2xl text-foreground">
              Try {appName} Demo
            </h1>
            <p className="mb-8 text-center text-muted-foreground">
              {appDescription}
            </p>

            <div className="mb-8 space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <svg
                    className="mr-3 h-5 w-5 flex-shrink-0 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleStartDemo}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Starting Demo...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  Start Demo
                </>
              )}
            </button>

            <p className="mt-6 text-center text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary no-underline hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
