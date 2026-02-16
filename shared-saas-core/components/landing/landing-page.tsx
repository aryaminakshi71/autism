// Unified Landing Page Component - Used across all apps

import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/index";
import { FeatureGrid } from "./feature-grid";
import { Hero } from "./hero";
import { DEFAULT_NAV_ITEMS, Navigation } from "./navigation";
import { NewsletterSignup } from "./newsletter-signup";

interface Feature {
  icon?: React.ComponentType<{ className?: string }>;
  iconNode?: React.ReactNode;
  title: string;
  description: string;
  href?: string;
}

interface PricingTier {
  name: string;
  price: string;
  period?: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  popular?: boolean;
  themeColor?: string;
}

interface Industry {
  name: string;
  icon: string;
  href?: string;
}

interface LandingPageProps {
  // Navigation
  logoText?: string;
  logo?: React.ReactNode;
  navItems?: Array<{ label: string; href: string }>;
  ctaText?: string;
  ctaHref?: string;
  signInHref?: string;

  // Hero
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText?: string;
  heroCtaHref?: string;
  heroSecondaryCtaText?: string;
  heroSecondaryCtaHref?: string;
  heroTrustText?: string;
  heroIcon?: React.ReactNode;
  themeColor?: string;

  // Features
  featuresTitle?: string;
  features?: Feature[];
  featuresColumns?: 2 | 3 | 4;

  // Industries
  industriesTitle?: string;
  industries?: Industry[];
  industriesHref?: string;

  // Pricing
  pricingTitle?: string;
  pricingSubtitle?: string;
  pricingTiers?: PricingTier[];

  // Footer
  showNewsletter?: boolean;
  footerText?: string;

  className?: string;
}

export function LandingPage({
  // Navigation
  logoText = "App",
  logo,
  navItems = DEFAULT_NAV_ITEMS,
  ctaText = "Start Free Trial",
  ctaHref = "/register",
  signInHref = "/login",

  // Hero
  heroTitle,
  heroSubtitle,
  heroCtaText,
  heroCtaHref,
  heroSecondaryCtaText = "Try Demo",
  heroSecondaryCtaHref = "/demo",
  heroTrustText = "Trusted by 500+ organizations",
  heroIcon,
  themeColor = "#3b82f6",

  // Features
  featuresTitle = "Key Features",
  features = [],
  featuresColumns = 3,

  // Industries
  industriesTitle = "Industry-Specific Apps",
  industries = [],
  industriesHref = "/apps",

  // Pricing
  pricingTitle = "Simple Pricing",
  pricingSubtitle = "Choose the plan that fits your business",
  pricingTiers = [],

  // Footer
  showNewsletter = true,
  footerText,

  className,
}: LandingPageProps) {
  return (
    <div className={cn("min-h-screen bg-white", className)}>
      {/* Navigation */}
      <Navigation
        logo={logo}
        logoText={logoText}
        navItems={navItems}
        ctaText={ctaText}
        ctaHref={ctaHref}
        signInHref={signInHref}
        themeColor={themeColor}
      />

      {/* Hero */}
      <Hero
        title={heroTitle}
        subtitle={heroSubtitle}
        ctaText={heroCtaText}
        ctaHref={heroCtaHref}
        secondaryCtaText={heroSecondaryCtaText}
        secondaryCtaHref={heroSecondaryCtaHref}
        trustText={heroTrustText}
        icon={heroIcon}
        themeColor={themeColor}
      />

      {/* Features */}
      {features.length > 0 && (
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-bold text-4xl text-gray-900">
                {featuresTitle}
              </h2>
            </div>
            <FeatureGrid
              features={features}
              columns={featuresColumns}
              themeColor={themeColor}
            />
          </div>
        </section>
      )}

      {/* Industries */}
      {industries.length > 0 && (
        <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-bold text-4xl text-gray-900">
                {industriesTitle}
              </h2>
              <Link
                to={industriesHref}
                className="mt-4 inline-flex items-center font-medium transition-opacity hover:opacity-80"
                style={{ color: themeColor }}
              >
                View all industry apps <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {industries.map((industry, index) => (
                <Link
                  key={index}
                  to={industry.href || industriesHref}
                  className="rounded-xl border border-gray-100 bg-white p-6 text-center no-underline transition hover:shadow-lg"
                >
                  <div className="mb-3 text-4xl">{industry.icon}</div>
                  <h3 className="font-semibold text-gray-900">
                    {industry.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing */}
      {pricingTiers.length > 0 && (
        <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-bold text-4xl text-gray-900">
                {pricingTitle}
              </h2>
              <p className="text-gray-600 text-xl">{pricingSubtitle}</p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
              {pricingTiers.map((tier, index) => (
                <div
                  key={index}
                  className={cn(
                    "rounded-xl border bg-white p-8",
                    tier.popular ? "border-2 shadow-lg" : "border-gray-200",
                  )}
                  style={tier.popular ? { borderColor: themeColor } : {}}
                >
                  {tier.popular && (
                    <div
                      className="-top-3 -translate-x-1/2 absolute left-1/2 rounded-full px-3 py-1 font-semibold text-white text-xs"
                      style={{ backgroundColor: themeColor }}
                    >
                      Popular
                    </div>
                  )}
                  <h3 className="mb-2 font-bold text-gray-900 text-xl">
                    {tier.name}
                  </h3>
                  <div className="mb-6">
                    <span className="font-bold text-4xl text-gray-900">
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span className="text-gray-500">/{tier.period}</span>
                    )}
                  </div>
                  <ul className="mb-8 space-y-3">
                    {tier.features.map((feature, fIndex) => (
                      <li
                        key={fIndex}
                        className="flex items-center text-gray-600"
                      >
                        <svg
                          className="mr-2 h-5 w-5 text-green-500"
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
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={tier.ctaHref}
                    className={cn(
                      "block w-full rounded-lg py-3 text-center font-medium transition-colors",
                      tier.popular
                        ? "text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50",
                    )}
                    style={tier.popular ? { backgroundColor: themeColor } : {}}
                  >
                    {tier.ctaText}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      {showNewsletter && (
        <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
          <NewsletterSignup />
        </section>
      )}

      {/* Footer */}
      <footer className="border-gray-100 border-t px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-gray-500 text-sm">
            {footerText || `© ${new Date().getFullYear()} All rights reserved.`}
          </p>
        </div>
      </footer>
    </div>
  );
}

// Default feature icons
export const DEFAULT_FEATURES: Feature[] = [
  {
    icon: undefined,
    title: "Easy to Use",
    description: "Intuitive interface that your team will love from day one.",
  },
  {
    icon: undefined,
    title: "Secure & Compliant",
    description: "Enterprise-grade security with SOC 2 compliance.",
  },
  {
    icon: undefined,
    title: "24/7 Support",
    description: "Round-the-clock customer support whenever you need it.",
  },
];

// Default pricing tiers
export const DEFAULT_PRICING_TIERS: PricingTier[] = [
  {
    name: "Starter",
    price: "$29",
    period: "month",
    features: ["Up to 100 users", "Basic features", "Email support"],
    ctaText: "Get Started",
    ctaHref: "/register?plan=starter",
  },
  {
    name: "Professional",
    price: "$79",
    period: "month",
    features: ["Unlimited users", "Advanced features", "Priority support"],
    ctaText: "Get Started",
    ctaHref: "/register?plan=professional",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Unlimited everything",
      "Custom integrations",
      "Dedicated support",
    ],
    ctaText: "Contact Sales",
    ctaHref: "/contact",
  },
];
