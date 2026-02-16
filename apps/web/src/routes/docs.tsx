import { Header } from "@/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@autism-legacy-20260205/ui";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Book,
  Code,
  Mail,
  PlayCircle,
  Search,
  Settings,
  Target,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/docs")({
  component: DocsPage,
});

const docCategories = [
  {
    icon: PlayCircle,
    title: "Getting Started",
    description: "Quick start guides and setup instructions",
    articles: [
      "Introduction to Autism Platform",
      "Creating Your First Account",
      "Setting Up Your Organization",
      "Inviting Team Members",
    ],
  },
  {
    icon: Users,
    title: "Learners & Referrals",
    description: "Manage learners, caregivers, and referrals",
    articles: [
      "Adding and Managing Learners",
      "Importing Learner Records",
      "Referral Intake Workflows",
      "Family and Caregiver Profiles",
    ],
  },
  {
    icon: Target,
    title: "Care Plans & Goals",
    description: "Track goals, interventions, and progress",
    articles: [
      "Creating Care Plans",
      "Goal Setting and Measurement",
      "Care Plan Reviews",
      "Outcomes Reports and Analytics",
    ],
  },
  {
    icon: Mail,
    title: "Family Communication",
    description: "Updates, resources, and collaboration",
    articles: [
      "Family Portal Overview",
      "Multi-Language Resources",
      "Communication Workflows",
      "Engagement Analytics",
    ],
  },
  {
    icon: Code,
    title: "API & Integrations",
    description: "Developer resources and integrations",
    articles: [
      "API Overview",
      "Authentication",
      "Webhooks",
      "Third-party Integrations",
    ],
  },
  {
    icon: Settings,
    title: "Settings & Admin",
    description: "Configure your account and organization",
    articles: [
      "Account Settings",
      "User Permissions",
      "Billing and Subscriptions",
      "Security Settings",
    ],
  },
];

function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Book className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="mb-6 font-bold text-5xl text-gray-900">
            Documentation
          </h1>
          <p className="mb-8 text-gray-600 text-xl">
            Everything you need to know about using Autism Platform effectively.
          </p>
          <div className="relative mx-auto max-w-xl">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-gray-400" />
            <input
              type="search"
              placeholder="Search documentation..."
              className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 font-bold text-2xl text-gray-900">
            Popular Articles
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition hover:border-blue-500 hover:shadow-md">
              <h3 className="mb-1 font-semibold text-gray-900">
                Quick Start Guide
              </h3>
              <p className="text-gray-600 text-sm">
                Get up and running in 5 minutes
              </p>
            </div>
            <div className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition hover:border-blue-500 hover:shadow-md">
              <h3 className="mb-1 font-semibold text-gray-900">
                Importing Your Data
              </h3>
              <p className="text-gray-600 text-sm">
                Migrate from your current system
              </p>
            </div>
            <div className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition hover:border-blue-500 hover:shadow-md">
              <h3 className="mb-1 font-semibold text-gray-900">
                API Reference
              </h3>
              <p className="text-gray-600 text-sm">
                Complete API documentation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Categories */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center font-bold text-3xl text-gray-900">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {docCategories.map((category) => (
              <Card key={category.title} className="transition hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <category.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle>{category.title}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.articles.map((article) => (
                      <li key={article}>
                        <button className="text-left text-blue-600 text-sm hover:text-blue-700 hover:underline">
                          {article}
                        </button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="bg-blue-600 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 font-bold text-3xl text-white">
            Still Need Help?
          </h2>
          <p className="mb-8 text-blue-100 text-xl">
            Can't find what you're looking for? Our support team is here to
            help.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/support">
              <button className="rounded-lg bg-white px-6 py-3 font-medium text-blue-600 hover:bg-gray-100">
                Contact Support
              </button>
            </Link>
            <Link to="/contact">
              <button className="rounded-lg bg-blue-700 px-6 py-3 font-medium text-white hover:bg-blue-800">
                Send us a Message
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
