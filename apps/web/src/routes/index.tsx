import { createFileRoute, Link } from "@tanstack/react-router";
import { Target, Zap, Users, BarChart3, Mail, Handshake, ArrowRight, Check } from "lucide-react";
import { Header } from "@/components/header";

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
    features: ["1 clinic", "Basic schedules", "Limited AAC boards", "Community support"],
    popular: false,
  },
  {
    name: "Starter",
    price: 19,
    features: ["3 clinics", "Care team collaboration", "Family portal", "Email support"],
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
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Coordinate Autism Care
            <br />
            <span className="text-blue-600">With Clarity and Confidence</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A unified platform for clinics, therapists, schools, families, and insurers
            to streamline schedules, communication, and outcomes.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Support Every Learner
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <Icon className="w-8 h-8 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Simple Pricing
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Choose the plan that fits your organization
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`bg-white p-6 rounded-lg border-2 ${
                  plan.popular ? "border-blue-600 shadow-lg" : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-gray-600">
                      <Check className="w-5 h-5 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block w-full text-center py-2 rounded-lg font-semibold ${
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Build Better Outcomes?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join care teams using Autism Platform to coordinate services and progress
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 font-semibold flex items-center gap-2 mx-auto"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
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
              <h3 className="text-white font-semibold mb-4">Company</h3>
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
              <h3 className="text-white font-semibold mb-4">Resources</h3>
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
              <h3 className="text-white font-semibold mb-4">Legal</h3>
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
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Autism Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
