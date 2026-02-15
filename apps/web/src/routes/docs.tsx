import { createFileRoute, Link } from "@tanstack/react-router";
import { Book, PlayCircle, FileText, Code, Settings, Users, Target, Mail, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@autism-legacy-20260205/ui";
import { Header } from "@/components/header";

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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <Book className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Documentation</h1>
          <p className="text-xl text-gray-600 mb-8">
            Everything you need to know about using Autism Platform effectively.
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="search"
              placeholder="Search documentation..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-1">Quick Start Guide</h3>
              <p className="text-sm text-gray-600">Get up and running in 5 minutes</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-1">Importing Your Data</h3>
              <p className="text-sm text-gray-600">Migrate from your current system</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-1">API Reference</h3>
              <p className="text-sm text-gray-600">Complete API documentation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docCategories.map((category) => (
              <Card key={category.title} className="hover:shadow-lg transition">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <category.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <CardTitle>{category.title}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.articles.map((article) => (
                      <li key={article}>
                        <button
                          className="text-sm text-blue-600 hover:text-blue-700 hover:underline text-left"
                        >
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Still Need Help?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/support">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 font-medium">
                Contact Support
              </button>
            </Link>
            <Link to="/contact">
              <button className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 font-medium">
                Send us a Message
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
