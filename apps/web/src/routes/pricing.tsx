import { Header } from "@/components/header";
import { pricingPlans } from "@/lib/marketing-content";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing | SpectrumOS" },
      {
        name: "description",
        content:
          "Compare SpectrumOS plans for clinics, schools, and care teams. Start with a free trial and scale with confidence.",
      },
      {
        property: "og:title",
        content: "Pricing | SpectrumOS",
      },
      {
        property: "og:description",
        content:
          "Compare plan tiers and choose the right setup for your autism care organization.",
      },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-b from-blue-50 to-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 font-bold text-5xl text-gray-900">Pricing</h1>
          <p className="text-gray-600 text-xl">
            Transparent plans for every stage, from single-site providers to
            multi-site organizations.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article
              key={plan.id}
              className={`rounded-2xl border-2 bg-white p-6 shadow-sm ${
                plan.featured ? "border-blue-600 shadow-lg" : "border-gray-200"
              }`}
            >
              {plan.featured && (
                <div className="mb-4 inline-flex rounded-full bg-blue-600 px-3 py-1 font-semibold text-white text-xs">
                  Most Popular
                </div>
              )}

              <h2 className="font-bold text-2xl text-gray-900">{plan.name}</h2>
              <p className="mt-2 min-h-[48px] text-gray-600 text-sm">
                {plan.description}
              </p>

              <div className="mt-5 flex items-end gap-2">
                <span className="font-bold text-4xl text-gray-900">
                  ${plan.monthlyPrice}
                </span>
                <span className="pb-1 text-gray-500 text-sm">/month</span>
              </div>
              <p className="mt-1 text-gray-500 text-sm">
                ${plan.annualPrice}/month billed annually
              </p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-gray-700"
                  >
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  to={plan.id === "enterprise" ? "/contact" : "/register"}
                  className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 font-semibold text-sm transition-colors ${
                    plan.featured
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {plan.ctaLabel}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-bold text-3xl text-gray-900">
            Need custom procurement or compliance review?
          </h2>
          <p className="mb-8 text-gray-600">
            Our team supports enterprise onboarding, security review packets,
            and implementation planning.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Talk to Sales
          </Link>
        </div>
      </section>
    </div>
  );
}
