import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/demo")({
  component: DemoPage,
});

function DemoPage() {
  const navigate = useNavigate();

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
    navigate({ to: "/dashboard" });
  };

  const features = [
    "Full access to all features",
    "Sample parking lot data pre-loaded",
    "No credit card required",
    "Demo resets after 24 hours",
    "Explore schedules, AAC, and care plans",
    "Review analytics and outcomes tracking",
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl bg-white p-8 shadow-xl md:p-12">
          <div className="mb-8 text-center">
            <h1 className="mb-4 font-bold text-4xl text-gray-900">
              Try ParkingPro Demo
            </h1>
            <p className="text-gray-600 text-xl">
              Experience smart parking management with sample data
            </p>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 font-semibold text-2xl text-gray-900">
              What You'll Get
            </h2>
            <ul className="space-y-3">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <Check className="h-6 w-6 flex-shrink-0 text-green-500" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
            <h3 className="mb-2 font-semibold text-gray-900">
              Demo Account Includes:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Sample learners, care teams, and families</li>
              <li>• Pre-configured schedules and goal plans</li>
              <li>• Example AAC boards and resources</li>
              <li>• Analytics dashboard with sample outcomes</li>
            </ul>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={handleStartDemo}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-4 font-semibold text-lg text-white transition-colors hover:bg-blue-700"
            >
              Start Demo
              <ArrowRight className="h-5 w-5" />
            </button>
            <Link
              to="/register"
              className="flex-1 rounded-lg border-2 border-gray-300 px-8 py-4 text-center font-semibold text-gray-700 text-lg transition-colors hover:border-gray-400"
            >
              Create Account
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
