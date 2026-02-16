import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-muted to-background">
      <nav className="border-border border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a href="/" className="flex items-center space-x-2 no-underline">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <span className="font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-foreground text-xl">
                Autism Care
              </span>
            </a>
            <a
              href="/"
              className="items flex text-muted-foreground no-underline hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </a>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h1 className="mb-4 font-bold text-4xl text-foreground tracking-tight md:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p className="text-muted-foreground text-xl">
              Choose the plan that works best for your needs
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-md">
              <h3 className="mb-2 font-bold text-xl">Starter</h3>
              <p className="mb-4 text-muted-foreground">For individuals</p>
              <div className="mb-6 font-bold text-4xl">
                $29<span className="font-normal text-lg">/month</span>
              </div>
              <ul className="mb-8 space-y-3">
                <li className="flex items-center text-muted-foreground">
                  ✓ Basic features
                </li>
                <li className="flex items-center text-muted-foreground">
                  ✓ Email support
                </li>
                <li className="flex items-center text-muted-foreground">
                  ✓ 1 user
                </li>
              </ul>
              <a
                href="/register"
                className="block w-full rounded-lg border border-border py-3 text-center font-semibold text-foreground no-underline hover:bg-muted"
              >
                Get Started
              </a>
            </div>

            <div className="relative rounded-2xl border-2 border-primary bg-card p-8 shadow-lg">
              <div className="-top-3 -translate-x-1/2 absolute left-1/2 rounded-full bg-primary px-3 py-1 font-semibold text-primary-foreground text-xs">
                Popular
              </div>
              <h3 className="mb-2 font-bold text-xl">Professional</h3>
              <p className="mb-4 text-muted-foreground">For small teams</p>
              <div className="mb-6 font-bold text-4xl">
                $79<span className="font-normal text-lg">/month</span>
              </div>
              <ul className="mb-8 space-y-3">
                <li className="flex items-center text-muted-foreground">
                  ✓ All features
                </li>
                <li className="flex items-center text-muted-foreground">
                  ✓ Priority support
                </li>
                <li className="flex items-center text-muted-foreground">
                  ✓ 10 users
                </li>
                <li className="flex items-center text-muted-foreground">
                  ✓ API access
                </li>
              </ul>
              <a
                href="/register"
                className="block w-full rounded-lg bg-primary py-3 text-center font-semibold text-primary-foreground no-underline hover:opacity-90"
              >
                Get Started
              </a>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 shadow-md">
              <h3 className="mb-2 font-bold text-xl">Enterprise</h3>
              <p className="mb-4 text-muted-foreground">
                For large organizations
              </p>
              <div className="mb-6 font-bold text-4xl">Custom</div>
              <ul className="mb-8 space-y-3">
                <li className="flex items-center text-muted-foreground">
                  ✓ Unlimited users
                </li>
                <li className="flex items-center text-muted-foreground">
                  ✓ 24/7 support
                </li>
                <li className="flex items-center text-muted-foreground">
                  ✓ Custom integrations
                </li>
                <li className="flex items-center text-muted-foreground">
                  ✓ SLA
                </li>
              </ul>
              <a
                href="/contact"
                className="block w-full rounded-lg border border-border py-3 text-center font-semibold text-foreground no-underline hover:bg-muted"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { ArrowLeft } from "lucide-react";
