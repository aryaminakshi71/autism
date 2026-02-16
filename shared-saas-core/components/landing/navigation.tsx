"use client";

// Unified Navigation Component - Used across all apps
// Uses Tailwind design tokens for consistent dark/light mode support

import { Link } from "@tanstack/react-router";
import * as React from "react";
import { useAuth as useAuthHook } from "../../hooks/use-auth";
import { cn } from "../../lib/index";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dropdown, DropdownItem } from "../ui/dropdown";
import { ThemeToggle } from "../ui/theme-toggle";

interface NavItem {
  label: string;
  href: string;
}

interface NavigationProps {
  logo?: React.ReactNode;
  logoText?: string;
  navItems?: NavItem[];
  ctaText?: string;
  ctaHref?: string;
  signInHref?: string;
  themeColor?: string;
  className?: string;
}

// Safe hook wrapper that returns default values if context is not available
function useAuth() {
  try {
    const auth = useAuthHook();
    return auth;
  } catch {
    return {
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      isDemo: false,
      login: async () => {},
      register: async () => {},
      logout: async () => {},
      refreshSession: async () => {},
      updateUser: () => {},
      startDemo: () => {},
      endDemo: () => {},
    };
  }
}

export function Navigation({
  logo,
  logoText = "App",
  navItems = [],
  ctaText,
  ctaHref,
  signInHref = "/login",
  themeColor,
  className,
}: NavigationProps) {
  const { user, loading, logout, isDemo, startDemo } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderNavLink = (item: NavItem, className: string) => {
    if (item.href.startsWith("#")) {
      return (
        <a
          href={item.href}
          className={className}
          role="menuitem"
          aria-label={item.label}
        >
          {item.label}
        </a>
      );
    }

    return (
      <Link
        to={item.href}
        className={className}
        role="menuitem"
        aria-label={item.label}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only rounded bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
      >
        Skip to main content
      </a>
      <nav
        className={cn(
          "sticky top-0 z-50 border-border border-b bg-background/80 backdrop-blur-md",
          className,
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              {logo || (
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"
                  aria-hidden="true"
                >
                  <span className="font-bold text-lg">
                    {logoText.charAt(0)}
                  </span>
                </div>
              )}
              <Link
                to="/"
                className="font-bold text-foreground text-xl transition-opacity hover:opacity-80"
                aria-label={`${logoText} Home`}
              >
                {logoText}
              </Link>
            </div>

            {navItems.length > 0 && (
              <div
                className="hidden items-center space-x-8 md:flex"
                role="menubar"
              >
                {navItems.map((item, index) => (
                  <React.Fragment key={index}>
                    {renderNavLink(
                      item,
                      "text-muted-foreground font-medium hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring rounded",
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="rounded px-2 py-1 font-medium text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    aria-label="Go to Dashboard"
                  >
                    Dashboard
                  </Link>
                  <Dropdown
                    trigger={
                      <button
                        className="flex cursor-pointer items-center space-x-2 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        aria-label="User menu"
                        aria-expanded={false}
                        aria-haspopup="true"
                      >
                        <Avatar className="h-8 w-8" aria-hidden="true">
                          {(user as any).avatarUrl ? (
                            <AvatarImage
                              src={(user as any).avatarUrl}
                              alt={`${(user as any).firstName || "User"} avatar`}
                            />
                          ) : (
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                              {(user as any).firstName
                                ? getInitials(
                                    `${(user as any).firstName} ${(user as any).lastName || ""}`,
                                  )
                                : "U"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span
                          className="hidden font-medium text-foreground sm:block"
                          aria-hidden="true"
                        >
                          {(user as any).firstName ||
                            (user as any).email?.split("@")[0] ||
                            "User"}
                        </span>
                      </button>
                    }
                  >
                    <DropdownItem
                      onClick={() => {
                        if (typeof window !== "undefined")
                          window.location.href = "/settings";
                      }}
                      role="menuitem"
                    >
                      Settings
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        if (typeof window !== "undefined")
                          window.location.href = "/billing";
                      }}
                      role="menuitem"
                    >
                      Billing
                    </DropdownItem>
                    {isDemo && (
                      <DropdownItem onClick={startDemo} role="menuitem">
                        Try Full Version
                      </DropdownItem>
                    )}
                    <DropdownItem
                      onClick={handleLogout}
                      className="text-destructive"
                      role="menuitem"
                    >
                      Sign Out
                    </DropdownItem>
                  </Dropdown>
                </>
              ) : !loading ? (
                <>
                  <Link
                    to="/demo"
                    className="rounded px-2 py-1 font-medium text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    aria-label="Try demo version"
                  >
                    Try Demo
                  </Link>
                  <Link
                    to={signInHref}
                    className="rounded px-2 py-1 font-medium text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    aria-label="Sign in to your account"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <div
                  className="h-8 w-20 animate-pulse rounded bg-muted"
                  aria-label="Loading"
                />
              )}
            </div>
          </div>
        </div>
      </nav>
      <main id="main-content" tabIndex={-1} />
    </>
  );
}

// Default nav items for reference
export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Industries", href: "/apps" },
];
