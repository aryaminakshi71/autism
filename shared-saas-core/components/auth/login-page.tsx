"use client";

// Standardized Login Page Component - Used across all apps
// Uses Tailwind design tokens for consistent dark/light mode support

import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Lock, LogIn, Mail } from "lucide-react";
import * as React from "react";

interface LoginPageProps {
  appName?: string;
  themeColor?: string;
  themeColorSecondary?: string;
  logoIcon?: React.ReactNode;
  dashboardHref?: string;
  registerHref?: string;
  demoHref?: string;
  onLogin?: (email: string, password: string) => Promise<boolean>;
}

export function LoginPage({
  appName = "App",
  themeColor,
  themeColorSecondary,
  logoIcon,
  dashboardHref = "/dashboard",
  registerHref = "/register",
  demoHref = "/demo",
  onLogin,
}: LoginPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (onLogin) {
        const success = await onLogin(email, password);
        if (success) {
          navigate({ to: dashboardHref });
        } else {
          setError("Invalid credentials");
        }
      } else {
        // Default demo login - accept any credentials
        const user = {
          id: "user-" + Date.now(),
          email: email,
          firstName: email.split("@")[0],
          lastName: "",
          role: "user",
          createdAt: new Date().toISOString(),
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(user));
        }
        navigate({ to: dashboardHref });
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
              <LogIn className="h-8 w-8 text-primary" />
            </div>

            <h1 className="mb-2 text-center font-bold text-2xl text-foreground">
              Welcome Back
            </h1>
            <p className="mb-8 text-center text-muted-foreground">
              Sign in to your {appName} account
            </p>

            {error && (
              <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block font-medium text-foreground text-sm">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="-translate-y-1/2 absolute top-1/2 left-4 h-5 w-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-input bg-background py-3 pr-4 pl-12 text-foreground transition-colors focus:border-transparent focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block font-medium text-foreground text-sm">
                  Password
                </label>
                <div className="relative">
                  <Lock className="-translate-y-1/2 absolute top-1/2 left-4 h-5 w-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-input bg-background py-3 pr-4 pl-12 text-foreground transition-colors focus:border-transparent focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="font-medium text-primary text-sm no-underline hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-border border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-4 text-muted-foreground">Or</span>
              </div>
            </div>

            <Link
              to={demoHref}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-border py-4 font-semibold text-foreground no-underline transition-all hover:border-accent hover:bg-accent"
            >
              Try Demo Instead
            </Link>

            <p className="mt-6 text-center text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                to={registerHref}
                className="font-medium text-primary no-underline hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
