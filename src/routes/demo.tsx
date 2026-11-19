import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Brain, Play, Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/demo")({
  component: DemoPage,
});

const features = [
  "Full access to all features",
  "Sample patient and therapy data pre-loaded",
  "No credit card required",
  "Demo resets after 24 hours",
];

function DemoPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartDemo = async () => {
    setIsLoading(true);

    const demoUser = {
      id: `demo-user-${Date.now()}`,
      email: "demo@autismcare.app",
      firstName: "Demo",
      lastName: "User",
      name: "Demo User",
      role: "admin",
      isDemo: true,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("user", JSON.stringify(demoUser));
    localStorage.setItem("isDemo", "true");
    localStorage.setItem("demo_mode", "true");

    setTimeout(() => {
      navigate({ to: "/dashboard" });
    }, 500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white">
      <nav className="border-gray-100 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 no-underline">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-xl">
                AutismCare
              </span>
            </Link>
            <Link
              to="/"
              className="flex items-center text-gray-600 no-underline hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">
              <Sparkles className="h-8 w-8 text-indigo-600" />
            </div>

            <h1 className="mb-2 text-center font-bold text-2xl text-gray-900">
              Try AutismCare Demo
            </h1>
            <p className="mb-8 text-center text-gray-600">
              Experience autism support workflows in a guided demo
            </p>

            <div className="mb-8 space-y-3">
              {features.map((feature) => (
                <div key={feature} className="flex items-center">
                  <svg
                    className="mr-3 h-5 w-5 flex-shrink-0 text-indigo-600"
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
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleStartDemo}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Starting Demo...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  Start Demo
                </>
              )}
            </button>

            <p className="mt-6 text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 no-underline hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
