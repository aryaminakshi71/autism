import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/demo")({
  component: DemoPage,
});

function DemoPage() {
  const handleStartDemo = () => {
    if (typeof window === "undefined") return;
    const demoUserData = {
      id: "demo-user-" + Date.now(),
      email: "demo@autism.app",
      name: "Demo Clinician",
      firstName: "Demo",
      lastName: "Clinician",
      role: "admin",
      companyId: "demo-company",
      isDemo: true,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("user", JSON.stringify(demoUserData));
    localStorage.setItem("isDemo", "true");
    localStorage.setItem("demo_mode", "true");
    localStorage.setItem("accessToken", "demo-token");
    localStorage.setItem("companyId", "demo-company");
  };

  const features = [
    "Full access to key care modules",
    "Sample data pre-loaded",
    "No credit card required",
    "Explore schedules, AAC, and care plans",
    "Review Analytics and outcomes tracking",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Try Autism Platform Demo
            </h1>
            <p className="text-xl text-gray-600">
              Experience the full power of our platform with sample data
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              What You'll Get
            </h2>
            <ul className="space-y-3">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-2">Demo Account Includes:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Sample learners, care teams, and families</li>
              <li>• Pre-configured schedules and goal plans</li>
              <li>• Example AAC boards and resources</li>
              <li>• Analytics dashboard with sample outcomes</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/app"
              onClick={handleStartDemo}
              className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 font-semibold text-lg flex items-center justify-center gap-2 transition-colors"
            >
              Start Demo
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/register"
              className="flex-1 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-gray-400 font-semibold text-lg text-center transition-colors"
            >
              Create Account
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
