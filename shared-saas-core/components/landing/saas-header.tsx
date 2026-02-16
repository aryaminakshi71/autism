"use client";

// Standardized SaaS Header Component - Used across all apps
// Includes: Logo, Nav Links, Try Demo, Sign In

import { Link } from "@tanstack/react-router";
import * as React from "react";
import { cn } from "../../lib/index";

interface NavItem {
  label: string;
  href: string;
}

interface SaaSHeaderProps {
  logo?: React.ReactNode;
  logoText?: string;
  logoIcon?: React.ReactNode;
  navItems?: NavItem[];
  themeColor?: string;
  themeColorSecondary?: string;
  className?: string;
  demoHref?: string;
  signInHref?: string;
  showDemo?: boolean;
  showSignIn?: boolean;
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
];

export function SaaSHeader({
  logo,
  logoText = "App",
  logoIcon,
  navItems = DEFAULT_NAV_ITEMS,
  themeColor = "#3b82f6",
  themeColorSecondary,
  className,
  demoHref = "/demo",
  signInHref = "/login",
  showDemo = true,
  showSignIn = true,
}: SaaSHeaderProps) {
  const gradientTo = themeColorSecondary || `${themeColor}dd`;

  const renderNavLink = (item: NavItem) => {
    if (item.href.startsWith("#")) {
      return (
        <a
          key={item.href}
          href={item.href}
          className="hidden font-medium text-gray-600 no-underline hover:text-gray-900 md:block"
        >
          {item.label}
        </a>
      );
    }

    return (
      <Link
        key={item.href}
        to={item.href}
        className="hidden font-medium text-gray-600 no-underline hover:text-gray-900 md:block"
      >
        {item.label}
      </Link>
    );
  };

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 border-gray-100 border-b bg-white/80 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 no-underline">
            {logo || (
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${themeColor}, ${gradientTo})`,
                }}
              >
                {logoIcon || (
                  <span className="font-bold text-lg text-white">
                    {logoText.charAt(0)}
                  </span>
                )}
              </div>
            )}
            <span className="font-bold text-gray-900 text-xl">{logoText}</span>
          </Link>

          {/* Nav Items + Auth */}
          <div className="flex items-center space-x-8">
            {/* Navigation Links */}
            {navItems.map((item) => renderNavLink(item))}

            {/* Try Demo */}
            {showDemo && (
              <Link
                to={demoHref}
                className="font-medium text-gray-600 no-underline hover:text-gray-900"
              >
                Try Demo
              </Link>
            )}

            {/* Sign In */}
            {showSignIn && (
              <Link
                to={signInHref}
                className="font-medium text-gray-600 no-underline hover:text-gray-900"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export { DEFAULT_NAV_ITEMS as HEADER_DEFAULT_NAV_ITEMS };
