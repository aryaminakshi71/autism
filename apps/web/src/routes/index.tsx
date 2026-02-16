import { Header } from "@/components/header";
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
    title: "Visual Schedules",
    description:
      "Build personalized routines with drag-and-drop schedules for home, school, or clinic.",
  },
  {
    icon: Users,
    title: "AAC Communication",
    description:
      "Support expressive and receptive communication with customizable AAC boards.",
  },
  {
    icon: BarChart3,
    title: "Therapy Analytics",
    description:
      "Track progress with data collection, graphs, and outcomes-focused Analytics.",
  },
  {
    icon: Mail,
    title: "Multi-Language Family Portal",
    description:
      "Keep caregivers in the loop with a Multi-Language portal for updates and resources.",
  },
  {
    icon: Handshake,
    title: "Goal Tracking",
    description:
      "Create measurable goals and align interventions across settings and teams.",
  },
  {
    icon: Zap,
    title: "Security & Compliance",
    description:
      "HIPAA-ready workflows, role-based access, and strong Security controls.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: 0,
    features: [
      "1 clinic",
      "Basic schedules",
      "Limited AAC boards",
      "Community support",
    ],
    popular: false,
  },
  {
    name: "Starter",
    price: 19,
    features: [
      "3 clinics",
      "Care team collaboration",
      "Family portal",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: 59,
    features: [
      "Unlimited clinics",
      "Therapy Analytics",
      "Advanced goal tracking",
      "Priority support",
      "API access",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: 149,
    features: [
      "Custom integrations",
      "Dedicated success manager",
      "Security reviews",
      "SLA",
    ],
    popular: false,
  },
];

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-white" style={{ minHeight: "100vh" }}>
      <Header />

      {/* Hero */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="mb-6 font-bold text-5xl text-gray-900">
            Coordinate Autism Care
            <br />
            <span className="text-blue-600">With Clarity and Confidence</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-gray-600 text-xl">
            A unified platform for clinics, therapists, schools, families, and
            insurers to streamline schedules, communication, and outcomes.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center font-bold text-4xl text-gray-900">
            Everything You Need to Support Every Learner
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const featureRoutes: Record<string, string> = {
                "Visual Schedules": "/demo",
                "AAC Communication": "/demo",
                "Therapy Analytics": "/demo",
                "Multi-Language Family Portal": "/demo",
                "Goal Tracking": "/demo",
                "Security & Compliance": "/demo",
              };
              const route = featureRoutes[feature.title] || "/demo";

              return (
                <Link
                  key={idx}
                  to={route}
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

      {/* Pricing */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-4 text-center font-bold text-4xl text-gray-900">
            Simple Pricing
          </h2>
          <p className="mb-12 text-center text-gray-600">
            Choose the plan that fits your organization
          </p>
          <div className="grid gap-6 md:grid-cols-4">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-lg border-2 bg-white p-6 ${
                  plan.popular ? "border-blue-600 shadow-lg" : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="mb-4 inline-block rounded-full bg-blue-600 px-3 py-1 font-semibold text-white text-xs">
                    Most Popular
                  </div>
                )}
                <h3 className="mb-2 font-bold text-2xl text-gray-900">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="font-bold text-4xl text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature, fIdx) => (
                    <li
                      key={fIdx}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <Check className="h-5 w-5 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block w-full rounded-lg py-2 text-center font-semibold ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Start Free Trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 font-bold text-4xl text-white">
            Ready to Build Better Outcomes?
          </h2>
          <p className="mb-8 text-blue-100 text-xl">
            Join care teams using Autism Platform to coordinate services and
            progress
          </p>
          <Link
            to="/register"
            className="mx-auto inline-block flex items-center gap-2 rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 hover:bg-gray-100"
          >
            Start Free Trial
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 px-4 py-12 text-gray-400 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-semibold text-white">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/app/marketing" className="hover:text-white">
                    Family Outreach
                  </Link>
                </li>
                <li>
                  <Link to="/docs" className="hover:text-white">
                    Resources
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
              &copy; {new Date().getFullYear()} Autism Platform. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
