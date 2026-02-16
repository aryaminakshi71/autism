import { NewsletterSignup } from "@shared/saas-core/components/landing";
import { CommandPalette } from "@shared/saas-core/components/ui";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Car,
  ChevronDown,
  FileText,
  Globe,
  Shield,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

const features = [
  {
    icon: Car,
    title: "Simple Operations",
    description: "Launch workflows in minutes with guided setup.",
    badge: "Simple",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Real-time insights with KPI dashboards and trends.",
    badge: "Analytics",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Role-based access with audit trails and alerts.",
    badge: "Security",
  },
  {
    icon: Globe,
    title: "API & Integrations",
    description: "Connect your tools via a type-safe API.",
    badge: "API",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: 0,
    features: ["10 spots", "Basic features", "Community support", "Mobile app"],
    popular: false,
  },
  {
    name: "Starter",
    price: 29,
    features: [
      "50 spots",
      "Basic reports",
      "Email support",
      "Real-time tracking",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: 79,
    features: [
      "200 spots",
      "All features",
      "Priority support",
      "API access",
      "Advanced analytics",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Unlimited spots",
      "All features",
      "24/7 support",
      "Custom integrations",
      "SLA",
    ],
    popular: false,
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-gray-200 border-b pb-4">
      <button
        className="flex w-full items-center justify-between py-2 text-left font-semibold text-gray-800 text-lg transition-colors hover:text-gray-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <ChevronDown
          className={`ml-4 h-5 w-5 flex-shrink-0 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen ? (
        <p className="mt-2 text-gray-600 leading-relaxed">{answer}</p>
      ) : null}
    </div>
  );
}

function LandingPage() {
  const [commandOpen, setCommandOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const appName = useMemo(
    () => import.meta.env.VITE_PUBLIC_APP_NAME ?? "ParkingPro",
    [],
  );

  useEffect(() => {
    setMounted(true);
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        setIsLoggedIn(true);
        navigate({ to: "/dashboard", replace: true });
      }
    } catch (error) {
      console.error("Error checking auth", error);
    }
  }, [navigate]);

  const handleStripeCheckout = async (planKey: string) => {
    const pricingRedirect = `/?plan=${encodeURIComponent(planKey)}#pricing`;
    if (checkoutLoading) return;
    if (!isLoggedIn) {
      navigate({
        to: "/register",
        search: { redirect: pricingRedirect },
      });
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate({
        to: "/login",
        search: { redirect: pricingRedirect },
      });
      return;
    }

    try {
      setCheckoutLoading(planKey);
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: planKey }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setCheckoutLoading(null);
    }
  };

  if (mounted && isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 border-gray-100/50 border-b bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 no-underline">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-xl">{appName}</span>
            </Link>
            <div className="flex items-center space-x-8">
              <a
                href="#features"
                className="hidden font-medium text-gray-600 no-underline hover:text-gray-900 md:block"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="hidden font-medium text-gray-600 no-underline hover:text-gray-900 md:block"
              >
                Pricing
              </a>
              <Link
                to="/reserve"
                className="font-medium text-gray-600 no-underline hover:text-gray-900"
              >
                Find Parking
              </Link>
              <Link
                to="/demo"
                className="font-medium text-gray-600 no-underline hover:text-gray-900"
              >
                Try Demo
              </Link>
              <Link
                to="/login"
                className="font-medium text-gray-600 no-underline hover:text-gray-900"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-b from-indigo-50 to-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-8 inline-flex items-center space-x-2 rounded-full border border-indigo-100/50 bg-indigo-50 px-5 py-2.5 font-medium text-indigo-700 text-sm shadow-sm">
            <Zap className="h-4 w-4" />
            <span>Smart Parking Management</span>
          </div>
          <h1 className="mb-6 font-bold text-5xl text-gray-900 tracking-tight md:text-6xl">
            {appName} <span className="text-indigo-600">Made Simple</span>
          </h1>
          <p className="mx-auto mb-10 max-w-3xl text-gray-600 text-xl leading-relaxed md:text-2xl">
            Streamline parking operations with token management, real-time
            tracking, and automated payments.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/reserve"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-indigo-700"
            >
              Reserve a spot
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              View dashboard
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-bold text-4xl text-gray-900 tracking-tight md:text-5xl">
              Everything You Need
            </h2>
            <p className="text-gray-600 text-xl leading-relaxed md:text-2xl">
              Powerful features for parking management
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <div
                key={i}
                className="hover:-translate-y-1 cursor-pointer rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 ease-out hover:shadow-xl"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 shadow-sm">
                  <feature.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <span className="rounded-full bg-indigo-50 px-3 py-1 font-medium text-indigo-600 text-xs">
                  {feature.badge}
                </span>
                <h3 className="mt-3 mb-2 font-semibold text-gray-900 text-xl">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-100 shadow-sm">
                <FileText className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">Simple APIs</h3>
              <p className="text-gray-600 text-sm">
                RESTful APIs with comprehensive documentation
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 shadow-sm">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">
                Multi-Language
              </h3>
              <p className="text-gray-600 text-sm">
                Support for 10+ languages and regional compliance
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-purple-100 shadow-sm">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">
                Usage Analytics
              </h3>
              <p className="text-gray-600 text-sm">
                Real-time dashboards and detailed reports
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-red-100 shadow-sm">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">
                Enterprise Security
              </h3>
              <p className="text-gray-600 text-sm">
                SOC 2 aligned with audit trails
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-bold text-4xl text-gray-900 tracking-tight md:text-5xl">
              Simple Pricing
            </h2>
            <p className="mb-2 text-gray-600 text-xl leading-relaxed md:text-2xl">
              Choose the plan that fits your lot
            </p>
            <div className="mt-4 inline-flex items-center space-x-2 rounded-full bg-indigo-50 px-4 py-2 font-medium text-indigo-600 text-sm">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"
                  fill="#6366f1"
                />
              </svg>
              <span>Secure payments powered by Stripe</span>
            </div>
          </div>
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-4">
            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                className={`rounded-xl bg-white p-8 ${
                  plan.popular
                    ? "relative border-2 shadow-lg"
                    : "border border-gray-200 shadow-md transition-all duration-300 hover:shadow-xl"
                }`}
                style={plan.popular ? { borderColor: "#6366f1" } : undefined}
              >
                {plan.popular ? (
                  <div className="-top-3 -translate-x-1/2 absolute left-1/2 rounded-full bg-indigo-600 px-3 py-1 font-semibold text-white text-xs">
                    Popular
                  </div>
                ) : null}
                <h3 className="mb-2 font-bold text-gray-900 text-xl">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="font-bold text-4xl text-gray-900 tracking-tight md:text-5xl">
                    {plan.price === "Custom"
                      ? "Custom"
                      : plan.price === 0
                        ? "Free"
                        : `$${plan.price}`}
                  </span>
                  {typeof plan.price === "number" && plan.price > 0 ? (
                    <span className="text-gray-500">/month</span>
                  ) : null}
                </div>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-center text-gray-600">
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
                      {feat}
                    </li>
                  ))}
                </ul>
                {plan.price === 0 ? (
                  <Link
                    to="/register"
                    className="block w-full rounded-lg border border-gray-300 py-3.5 text-center font-semibold text-gray-700 no-underline shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md"
                  >
                    Get Started Free
                  </Link>
                ) : plan.price === "Custom" ? (
                  <button
                    onClick={() => handleStripeCheckout("enterprise")}
                    disabled={checkoutLoading === "enterprise"}
                    className="block w-full rounded-lg border border-gray-300 py-3.5 text-center font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {checkoutLoading === "enterprise"
                      ? "Processing..."
                      : "Contact Sales"}
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleStripeCheckout(plan.name.toLowerCase())
                    }
                    disabled={checkoutLoading === plan.name.toLowerCase()}
                    className={`block w-full rounded-lg py-3.5 text-center font-semibold shadow-sm transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 ${
                      plan.popular
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {checkoutLoading === plan.name.toLowerCase()
                      ? "Processing..."
                      : "Subscribe with Stripe"}
                  </button>
                )}
                <p className="mt-3 text-center text-gray-500 text-xs">
                  Secure payment via Stripe
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-indigo-600 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 font-bold text-4xl text-white tracking-tight md:text-5xl">
            Stay Updated
          </h2>
          <p className="mb-8 text-indigo-100 text-xl">
            Get parking management tips and product updates.
          </p>
          <NewsletterSignup />
          <p className="mt-4 text-indigo-200 text-sm">
            No spam, unsubscribe anytime.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-4xl text-gray-900 tracking-tight md:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-xl leading-relaxed md:text-2xl">
              Everything you need to know
            </p>
          </div>
          <div className="space-y-4">
            {[
              {
                question: "What is the free trial duration?",
                answer:
                  "Our free trial lasts for 14 days, no credit card required. You get full access to all features during the trial period.",
              },
              {
                question: "Is my data secure?",
                answer:
                  "Yes, we are SOC 2 aligned and use encryption. Your data is stored securely and we never share it with third parties.",
              },
              {
                question: "Can I cancel anytime?",
                answer:
                  "Yes, you can cancel your subscription at any time. There are no cancellation fees or long-term contracts.",
              },
              {
                question: "Do you offer refunds?",
                answer:
                  "We offer a 30-day money-back guarantee. If you're not satisfied, contact us within 30 days for a full refund.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit cards and PayPal. All payments are processed securely through Stripe.",
              },
              {
                question: "Do you offer discounts for annual plans?",
                answer:
                  "Yes. Annual plans include 2 months free, which is a 17% discount compared to monthly billing.",
              },
            ].map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </section>

      <footer className="border-gray-800 border-t bg-gray-900 px-4 py-16 text-gray-400 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm">
            © 2026 {appName}. All rights reserved. Payments secured by Stripe.
          </p>
          <p className="mt-2 text-gray-500 text-xs">
            Powered by Stripe for secure payments
          </p>
        </div>
      </footer>
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}
