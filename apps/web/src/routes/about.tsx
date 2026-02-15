import { createFileRoute, Link } from "@tanstack/react-router";
import { Target, Users, Zap, Heart, Award, Globe } from "lucide-react";
import { Header } from "@/components/header";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About Autism Platform</h1>
          <p className="text-xl text-gray-600 mb-8">
            We're on a mission to help clinics, therapists, schools, and families
            deliver coordinated autism care with better outcomes and less friction.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Founded in 2024, Autism Platform was born from a simple observation: autism services are
              often fragmented across providers, settings, and tools. We set out to build a unified
              platform that keeps teams aligned while honoring each learner's unique plan of care.
            </p>
            <p>
              Today, Autism Platform supports interdisciplinary teams with schedules, AAC communication,
              therapy data collection, and family collaboration. Our platform combines modern technology
              with a deep understanding of clinical workflows and educational settings.
            </p>
            <p>
              We believe that consistent, person-centered care is the foundation of meaningful progress.
              That's why we've built tools that help teams share context, track goals, and celebrate growth
              while keeping families at the center.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Person-Centered</h3>
              <p className="text-gray-600">
                Every decision starts with one question: How does this help the learner and family thrive?
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Evidence-Informed</h3>
              <p className="text-gray-600">
                We build features that align with evidence-based practices and real-world care delivery.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Accessibility</h3>
              <p className="text-gray-600">
                We design for diverse needs, ensuring tools are usable across settings and skill levels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">200+</div>
              <div className="text-gray-600">Clinics</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">8K+</div>
              <div className="text-gray-600">Care Team Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">1.2M+</div>
              <div className="text-gray-600">Sessions Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Team</h2>
          <p className="text-center text-gray-600 mb-8">
            We're a diverse team of engineers, designers, and clinical advisors who are
            passionate about building tools that improve outcomes and reduce admin burden.
          </p>
          <div className="text-center">
            <Link
              to="/contact"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Join Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Autism Care?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of teams using our platform to build better customer relationships.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 font-medium"
          >
            Start Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
}
