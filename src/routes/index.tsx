import { NewsletterSignup } from "@shared/saas-core/components/landing";
import { CommandPalette } from "@shared/saas-core/components/ui";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Brain,
  ChevronDown,
  ClipboardList,
  Heart,
  LineChart,
  Shield,
  Star,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => {
    const baseUrl =
      import.meta.env.VITE_PUBLIC_SITE_URL || "http://localhost:3000";
    const canonical = baseUrl.replace(/\/$/, "") + "/";
    return {
      meta: [
        {
          title: "AutismCare - Special Education & Behavioral Support Platform",
        },
        {
          name: "description",
          content:
            "Comprehensive special education platform with IEP management, behavioral intervention plans, progress monitoring, and parent communication tools. Trusted by 1,500+ schools.",
        },
        { name: "robots", content: "index, follow" },
        {
          name: "keywords",
          content:
            "special education software, IEP management, autism support, behavioral intervention, progress monitoring, SPED",
        },
        {
          property: "og:title",
          content:
            "AutismCare - Special Education & Behavioral Support Platform",
        },
        {
          property: "og:description",
          content:
            "Comprehensive special education platform with IEP management, behavioral support, and progress tracking.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: "AutismCare - SPED & Behavioral Support Platform",
        },
        {
          name: "twitter:description",
          content:
            "IEP management, behavioral intervention plans, and progress monitoring — all in one platform.",
        },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },

  component: LandingPage,
});

const features = [
  {
    icon: ClipboardList,
    title: "IEP Management",
    description:
      "Create, track, and manage Individualized Education Programs with guided workflows, goal banks, and compliance alerts.",
    badge: "IEP",
  },
  {
    icon: Brain,
    title: "Behavioral Intervention",
    description:
      "Design and implement Behavior Intervention Plans (BIPs) with data-driven strategies and real-time behavior tracking.",
    badge: "BIP",
  },
  {
    icon: LineChart,
    title: "Progress Monitoring",
    description:
      "Track student progress against IEP goals with visual dashboards, trend analysis, and automated report generation.",
    badge: "Progress",
  },
  {
    icon: Users,
    title: "Parent Communication",
    description:
      "Secure parent portal for sharing updates, scheduling meetings, and collaborating on student support plans.",
    badge: "Family",
  },
  {
    icon: BookOpen,
    title: "Resource Library",
    description:
      "Evidence-based intervention strategies, social stories, visual supports, and curriculum modifications at your fingertips.",
    badge: "Resources",
  },
  {
    icon: Shield,
    title: "FERPA Compliant",
    description:
      "Enterprise-grade security with FERPA compliance, role-based access, audit trails, and encrypted data storage.",
    badge: "Compliant",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: 0,
    features: [
      "Up to 5 students",
      "Basic IEP templates",
      "Parent portal",
      "Community support",
    ],
    popular: false,
  },
  {
    name: "Starter",
    price: 19,
    features: [
      "Up to 50 students",
      "IEP & BIP management",
      "Progress reports",
      "Email support",
      "Data collection tools",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: 49,
    features: [
      "Unlimited students",
      "AI-powered goal suggestions",
      "Advanced analytics",
      "Priority support",
      "API access",
      "Custom reports",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "District-wide deployment",
      "SSO integration",
      "24/7 support",
      "Custom training",
      "SLA guarantee",
    ],
    popular: false,
  },
];

const testimonials = [
  {
    name: "Dr. Jennifer Walsh",
    role: "Special Ed Director, Lincoln USD",
    quote:
      "AutismCare reduced our IEP paperwork by 70% and gave us real-time visibility into student progress across the district.",
    rating: 5,
  },
  {
    name: "Marcus Thompson",
    role: "BCBA, Sunrise Therapy",
    quote:
      "The behavioral data collection tools are outstanding. We can track interventions in real time and adjust strategies immediately.",
    rating: 5,
  },
  {
    name: "Sarah Kim",
    role: "Parent",
    quote:
      "Finally, I can see my child's progress and communicate with the team easily. The parent portal is a game-changer.",
    rating: 5,
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-border border-b pb-4">
      <button
        className="flex w-full items-center justify-between py-2 text-left font-semibold text-foreground text-lg transition-colors hover:text-foreground"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <ChevronDown
          className={`ml-4 h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen ? (
        <p className="mt-2 text-muted-foreground leading-relaxed">{answer}</p>
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
    () => import.meta.env.VITE_PUBLIC_APP_NAME ?? "AutismCare",
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
      navigate({ to: "/register", search: { redirect: pricingRedirect } });
      return;
    }
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate({ to: "/login", search: { redirect: pricingRedirect } });
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
        const data = (await res.json()) as { url?: string };
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
    <div className="min-h-screen bg-card">
      <nav className="sticky top-0 z-50 border-border/50 border-b bg-card/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 no-underline">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/90">
                <Heart className="h-6 w-6 text-background" />
              </div>
              <span className="font-bold text-foreground text-xl">
                {appName}
              </span>
            </Link>
            <div className="flex items-center space-x-8">
              <a
                href="#features"
                className="hidden font-medium text-muted-foreground no-underline hover:text-foreground md:block"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="hidden font-medium text-muted-foreground no-underline hover:text-foreground md:block"
              >
                Pricing
              </a>
              <Link
                to="/demo"
                className="font-medium text-muted-foreground no-underline hover:text-foreground"
              >
                Try Demo
              </Link>
              <Link
                to="/login"
                className="font-medium text-muted-foreground no-underline hover:text-foreground"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-8 inline-flex items-center space-x-2 rounded-full border border-primary/50 bg-primary/5 px-5 py-2.5 font-medium text-primary text-sm shadow-sm">
            <Brain className="h-4 w-4" />
            <span>Special Education Management</span>
          </div>
          <h1 className="mb-6 font-bold text-5xl text-foreground tracking-tight md:text-6xl">
            Every Learner <span className="text-primary">Deserves</span> the
            Best Support
          </h1>
          <p className="mx-auto mb-10 max-w-3xl text-muted-foreground text-xl leading-relaxed md:text-2xl">
            Streamline IEP management, behavioral interventions, and progress
            monitoring — empowering educators and families to help every student
            thrive.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
            >
              Start Free Trial <span aria-hidden="true">→</span>
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 font-semibold text-foreground transition-colors hover:bg-muted"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="border-border border-y bg-muted/50 px-4 py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-8 text-center md:gap-16">
          {[
            { value: "1,500+", label: "Schools & Districts" },
            { value: "85K+", label: "Students Supported" },
            { value: "70%", label: "Less Paperwork" },
            { value: "4.9/5", label: "Educator Rating" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-bold text-2xl text-primary">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-bold text-4xl text-foreground tracking-tight md:text-5xl">
              Purpose-Built for SPED Teams
            </h2>
            <p className="text-muted-foreground text-xl">
              Everything you need to support students with diverse learning
              needs
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={i}
                className="hover:-translate-y-1 rounded-2xl border border-border bg-card p-6 transition-all duration-300 ease-out hover:shadow-xl"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shadow-sm">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="rounded-full bg-primary/5 px-3 py-1 font-medium text-primary text-xs">
                  {feature.badge}
                </span>
                <h3 className="mt-3 mb-2 font-semibold text-foreground text-xl">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center font-bold text-4xl text-foreground">
            Loved by Educators & Families
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="mb-4 text-muted-foreground italic">"{t.quote}"</p>
                <div>
                  <div className="font-semibold text-foreground">{t.name}</div>
                  <div className="text-muted-foreground text-sm">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-bold text-4xl text-foreground tracking-tight md:text-5xl">
              Simple Pricing
            </h2>
            <p className="text-muted-foreground text-xl">
              Start free. Scale as your program grows.
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-4">
            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                className={`rounded-xl bg-card p-8 ${plan.popular ? "relative border-2 border-primary shadow-lg" : "border border-border shadow-md transition-all duration-300 hover:shadow-xl"}`}
              >
                {plan.popular ? (
                  <div className="-top-3 -translate-x-1/2 absolute left-1/2 rounded-full bg-primary px-3 py-1 font-semibold text-primary-foreground text-xs">
                    Popular
                  </div>
                ) : null}
                <h3 className="mb-2 font-bold text-foreground text-xl">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="font-bold text-4xl text-foreground tracking-tight">
                    {plan.price === "Custom"
                      ? "Custom"
                      : plan.price === 0
                        ? "Free"
                        : `$${plan.price}`}
                  </span>
                  {typeof plan.price === "number" && plan.price > 0 ? (
                    <span className="text-muted-foreground">/month</span>
                  ) : null}
                </div>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feat, j) => (
                    <li
                      key={j}
                      className="flex items-center text-muted-foreground"
                    >
                      <svg
                        className="mr-2 h-5 w-5 text-success"
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
                    className="block w-full rounded-lg border border-border py-3.5 text-center font-semibold text-foreground no-underline shadow-sm hover:bg-muted"
                  >
                    Get Started Free
                  </Link>
                ) : plan.price === "Custom" ? (
                  <button
                    onClick={() => handleStripeCheckout("enterprise")}
                    disabled={checkoutLoading === "enterprise"}
                    className="block w-full rounded-lg border border-border py-3.5 text-center font-semibold text-foreground shadow-sm hover:bg-muted disabled:opacity-50"
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
                    className={`block w-full rounded-lg py-3.5 text-center font-semibold shadow-sm hover:shadow-md disabled:opacity-50 ${plan.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-border text-foreground hover:bg-muted"}`}
                  >
                    {checkoutLoading === plan.name.toLowerCase()
                      ? "Processing..."
                      : "Subscribe with Stripe"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 font-bold text-4xl text-background tracking-tight md:text-5xl">
            Support Every Student's Journey
          </h2>
          <p className="mb-8 text-background/80 text-xl">
            Join 1,500+ schools using AutismCare to empower learners and
            educators.
          </p>
          <NewsletterSignup />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-4xl text-foreground tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {[
              {
                question: "Is AutismCare FERPA compliant?",
                answer:
                  "Absolutely. AutismCare is fully FERPA compliant with enterprise-grade encryption, role-based access controls, and comprehensive audit trails.",
              },
              {
                question: "Can parents access their child's progress?",
                answer:
                  "Yes! Our secure parent portal allows families to view progress updates, communicate with the team, and participate in IEP meetings.",
              },
              {
                question: "Does it integrate with existing SIS?",
                answer:
                  "Yes, AutismCare integrates with most Student Information Systems including PowerSchool, Infinite Campus, and Skyward.",
              },
              {
                question: "How long does setup take?",
                answer:
                  "Most schools are up and running within a day. We provide onboarding support and can import existing IEP data.",
              },
              {
                question: "Is there training available?",
                answer:
                  "We offer free webinar training for all plans. Enterprise customers receive customized on-site or virtual training sessions.",
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

      <footer className="border-border border-t bg-foreground px-4 py-16 text-muted-foreground sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm">
            © 2026 {appName}. All rights reserved. Payments secured by Stripe.
          </p>
        </div>
      </footer>
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}
