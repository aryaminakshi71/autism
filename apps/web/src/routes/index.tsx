import { Header } from "@/components/header";
import { pricingPlans } from "@/lib/marketing-content";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Check,
  Handshake,
  Mail,
  Target,
  Users,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Simple Operations",
    description:
      "Build personalized routines with drag-and-drop schedules for home, school, or clinic.",
  },
  {
    icon: Users,
    title: "Analytics",
    description:
      "Track progress with data collection, graphs, and outcomes-focused dashboards.",
  },
  {
    icon: BarChart3,
    title: "Security",
    description:
      "HIPAA-ready workflows, role-based access, and audit-friendly controls.",
  },
  {
    icon: Mail,
    title: "API & Integrations",
    description:
      "Connect your care stack with API endpoints and partner integrations.",
  },
  {
    icon: Handshake,
    title: "Goal Tracking",
    description:
      "Create measurable goals and align interventions across settings and care teams.",
  },
  {
    icon: Zap,
    title: "Security & Compliance",
    description:
      "HIPAA-ready workflows, role-based access, and audit-friendly controls.",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SpectrumAI | Care Coordination and Outcomes" },
      {
        name: "description",
        content:
          "Coordinate autism care across clinics, schools, and families with care plans, schedules, communication tools, and outcomes dashboards.",
      },
      {
        property: "og:title",
        content: "SpectrumAI | Care Coordination and Outcomes",
      },
      {
        property: "og:description",
        content:
          "A unified autism care platform for clinicians, therapists, and family collaboration.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="mb-6 font-bold text-5xl text-gray-900">
            Coordinate Autism Care
            <br />
            <span className="text-blue-600">With Clarity and Confidence</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-gray-600 text-xl">
            A unified platform for clinics, therapists, schools, and families to
            streamline sessions, communication, and measurable progress.
          </p>
          <p className="sr-only">Autism Care Coordination Platform</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Start Free Trial
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center font-bold text-4xl text-gray-900">
            Features for Every Learner
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.title}
                  to="/demo"
                  className="cursor-pointer rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <Icon className="mb-4 h-8 w-8 text-blue-600" />
                  <h3 className="mb-2 font-semibold text-gray-900 text-xl">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-4 text-center font-bold text-4xl text-gray-900">
            Simple Pricing
          </h2>
          <p className="mb-12 text-center text-gray-600">
            Choose a plan that fits your organization today and scales tomorrow.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-lg border-2 bg-white p-6 ${
                  plan.featured
                    ? "border-blue-600 shadow-lg"
                    : "border-gray-200"
                }`}
              >
                {plan.featured && (
                  <div className="mb-4 inline-block rounded-full bg-blue-600 px-3 py-1 font-semibold text-white text-xs">
                    Most Popular
                  </div>
                )}
                <h3 className="mb-2 font-bold text-2xl text-gray-900">
                  {plan.name}
                </h3>
                <p className="mb-3 text-gray-600 text-sm">{plan.description}</p>
                <div className="mb-4">
                  <span className="font-bold text-4xl text-gray-900">
                    ${plan.monthlyPrice}
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="mb-6 space-y-2">
                  {plan.features.slice(0, 4).map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <Check className="h-5 w-5 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.id === "enterprise" ? "/contact" : "/register"}
                  className={`block w-full rounded-lg py-2 text-center font-semibold ${
                    plan.featured
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {plan.ctaLabel}
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/pricing"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Compare all plan details
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 font-bold text-4xl text-white">
            Ready to Build Better Outcomes?
          </h2>
          <p className="mb-8 text-blue-100 text-xl">
            Join care teams using SpectrumAI to coordinate services and
            progress.
          </p>
          <Link
            to="/register"
            className="mx-auto inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 hover:bg-gray-100"
          >
            Start Free Trial
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center font-bold text-4xl text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h3 className="font-semibold text-gray-900">
                Is this platform suitable for clinics and schools?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes. SpectrumAI supports multidisciplinary workflows across
                clinics, schools, and family teams.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h3 className="font-semibold text-gray-900">
                Can we start without a credit card?
              </h3>
              <p className="mt-2 text-gray-600">
                Absolutely. You can explore the demo and free plan before
                committing to a paid tier.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 px-4 py-12 text-gray-400 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-semibold text-white">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/demo" className="hover:text-white">
                    Explore Demo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-white">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-white">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/docs" className="hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="hover:text-white">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-white">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-gray-800 border-t pt-8 text-center">
            <p>
              &copy; {new Date().getFullYear()} SpectrumAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
