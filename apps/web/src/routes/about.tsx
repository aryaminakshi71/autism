import { Header } from "@/components/header";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Heart, Target, Zap } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 font-bold text-5xl text-gray-900">
            About SpectrumOS
          </h1>
          <p className="mb-8 text-gray-600 text-xl">
            We're on a mission to help clinics, therapists, schools, and
            families deliver coordinated autism care with better outcomes and
            less friction.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 font-bold text-3xl text-gray-900">Our Story</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Founded in 2024, SpectrumOS was born from a simple
              observation: autism services are often fragmented across
              providers, settings, and tools. We set out to build a unified
              platform that keeps teams aligned while honoring each learner's
              unique plan of care.
            </p>
            <p>
              Today, SpectrumOS supports interdisciplinary teams with
              schedules, AAC communication, therapy data collection, and family
              collaboration. Our platform combines modern technology with a deep
              understanding of clinical workflows and educational settings.
            </p>
            <p>
              We believe that consistent, person-centered care is the foundation
              of meaningful progress. That's why we've built tools that help
              teams share context, track goals, and celebrate growth while
              keeping families at the center.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center font-bold text-3xl text-gray-900">
            Our Values
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900 text-xl">
                Person-Centered
              </h3>
              <p className="text-gray-600">
                Every decision starts with one question: How does this help the
                learner and family thrive?
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900 text-xl">
                Evidence-Informed
              </h3>
              <p className="text-gray-600">
                We build features that align with evidence-based practices and
                real-world care delivery.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900 text-xl">
                Accessibility
              </h3>
              <p className="text-gray-600">
                We design for diverse needs, ensuring tools are usable across
                settings and skill levels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div>
              <div className="mb-2 font-bold text-4xl text-blue-600">200+</div>
              <div className="text-gray-600">Clinics</div>
            </div>
            <div>
              <div className="mb-2 font-bold text-4xl text-blue-600">8K+</div>
              <div className="text-gray-600">Care Team Members</div>
            </div>
            <div>
              <div className="mb-2 font-bold text-4xl text-blue-600">1.2M+</div>
              <div className="text-gray-600">Sessions Tracked</div>
            </div>
            <div>
              <div className="mb-2 font-bold text-4xl text-blue-600">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-center font-bold text-3xl text-gray-900">
            Our Team
          </h2>
          <p className="mb-8 text-center text-gray-600">
            We're a diverse team of engineers, designers, and clinical advisors
            who are passionate about building tools that improve outcomes and
            reduce admin burden.
          </p>
          <div className="text-center">
            <Link
              to="/contact"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Join Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 font-bold text-3xl text-white">
            Ready to Transform Autism Care?
          </h2>
          <p className="mb-8 text-blue-100 text-xl">
            Join thousands of teams using our platform to build better customer
            relationships.
          </p>
          <Link
            to="/register"
            className="inline-block rounded-lg bg-white px-8 py-3 font-medium text-blue-600 hover:bg-gray-100"
          >
            Start Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
}
