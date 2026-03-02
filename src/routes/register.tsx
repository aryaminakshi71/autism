import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Heart, Lock, Mail, User, UserPlus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { signUp } from "~/lib/auth/client";

const registerSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/register")({
  validateSearch: registerSearchSchema,
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signUp.email({
        name: `${firstName} ${lastName}`.trim(),
        email,
        password,
        callbackURL: redirect ?? "/dashboard/",
      });

      if (result?.error) {
        setError(
          result.error.message || "Registration failed. Please try again.",
        );
        return;
      }

      navigate({ to: redirect ?? "/dashboard/", replace: true });
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white">
      <nav className="border-gray-100 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 no-underline">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                <Heart className="h-6 w-6 text-white" />
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
              <UserPlus className="h-8 w-8 text-indigo-600" />
            </div>

            <h1 className="mb-2 text-center font-bold text-2xl text-gray-900">
              Create Account
            </h1>
            <p className="mb-8 text-center text-gray-600">
              Start your free 14-day trial
            </p>

            {error ? (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 text-sm">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block font-medium text-gray-700 text-sm">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="-translate-y-1/2 absolute top-1/2 left-4 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      placeholder="John"
                      required
                      className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-12 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block font-medium text-gray-700 text-sm">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder="Doe"
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700 text-sm">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="-translate-y-1/2 absolute top-1/2 left-4 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-12 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700 text-sm">
                  Password
                </label>
                <div className="relative">
                  <Lock className="-translate-y-1/2 absolute top-1/2 left-4 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a password"
                    required
                    className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-12 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    Create Account
                  </>
                )}
              </button>
            </form>

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
