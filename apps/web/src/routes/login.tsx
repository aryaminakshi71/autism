import { authClient } from "@/lib/auth-client";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Lock, LogIn, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const searchParams =
    typeof window === "undefined"
      ? new URLSearchParams()
      : new URLSearchParams(window.location.search);
  const redirect = searchParams.get("redirect") || undefined;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });
      // const result = { error: { message: "Auth disabled" } };

      if (result.error) {
        setError(result.error.message || "Invalid email or password");
        setIsLoading(false);
        return;
      }

      // Clear demo mode flags on successful login
      localStorage.removeItem("demo_mode");
      localStorage.removeItem("isDemo");
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("companyId");

      // Successful login - redirect
      const redirectPath = redirect || "/dashboard";
      navigate({ to: redirectPath });
    } catch (err) {
      console.error("Login error:", err);
      if (err instanceof Error) {
        if (
          err.message.includes("fetch") ||
          err.message.includes("Failed to fetch")
        ) {
          setError(
            "Cannot connect to server. Please make sure the API server is running on port 3001.",
          );
        } else {
          setError(err.message);
        }
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}/dashboard`,
      });
    } catch {
      if (typeof window !== "undefined") {
        localStorage.setItem("demo_mode", "true");
        localStorage.setItem("isDemo", "true");
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: `autism-${provider}-demo`,
            name: "Demo User",
            email: "demo@autism.local",
          }),
        );
      }
      toast.success(
        `${provider === "github" ? "GitHub" : "Google"} login unavailable. Continuing in demo mode.`,
      );
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Link to="/" className="flex justify-center">
            <h1 className="font-bold text-3xl text-blue-600">
              SpectrumOS
            </h1>
          </Link>
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-medium text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
          <h2 className="mt-6 text-center font-extrabold text-3xl text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-1 text-center text-gray-600 text-sm">
            Sign in to your account
          </p>
          <p className="mt-1 text-center text-gray-600 text-sm">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign Up
            </Link>
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white/50 p-4 shadow-sm backdrop-blur-sm">
          <p className="mb-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">
            Demo Credentials
          </p>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center justify-between rounded border border-gray-200 bg-gray-50 p-2">
              <span className="text-gray-600">Email</span>
              <code className="font-mono text-blue-600">demo@autism.app</code>
            </div>
            <div className="flex items-center justify-between rounded border border-gray-200 bg-gray-50 p-2">
              <span className="text-gray-600">Password</span>
              <code className="font-mono text-blue-600">password</code>
            </div>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block font-medium text-gray-700 text-sm"
              >
                Email address
              </label>
              <div className="relative mt-1">
                <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-lg border border-gray-300 py-2 pr-3 pl-10 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block font-medium text-gray-700 text-sm"
              >
                Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-lg border border-gray-300 py-2 pr-3 pl-10 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-blue-600 px-4 py-3 font-medium text-sm text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Sign In
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-gray-300 border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-50 px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-500 text-sm shadow-sm hover:bg-gray-50"
              onClick={() => void handleSocialLogin("google")}
            >
              <span className="sr-only">Sign in with Google</span>
              <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.1-1.133 7.973-3.007 1.92-1.92 2.507-4.8 2.507-7.147 0-.64-.067-1.253-.187-1.84h-10.293z"
                  fill="currentColor"
                />
              </svg>
            </button>

            <button
              type="button"
              className="inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-500 text-sm shadow-sm hover:bg-gray-50"
              onClick={() => void handleSocialLogin("github")}
            >
              <span className="sr-only">Sign in with GitHub</span>
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div>
            <Link
              to="/demo"
              className="flex w-full justify-center rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 text-sm shadow-sm hover:bg-gray-50"
            >
              Try Demo Instead
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
