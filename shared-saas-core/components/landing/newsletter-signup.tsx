// Newsletter Signup Component - Unified across all apps

"use client";

import { AlertCircle, ArrowRight, Check, Loader2 } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/index";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  themeColor?: string;
  showSocialProof?: boolean;
  socialProofText?: string;
  className?: string;
  onSubmit?: (email: string) => Promise<void>;
}

export function NewsletterSignup({
  title = "Stay Updated",
  description = "Get the latest updates, tips, and insights delivered to your inbox.",
  placeholder = "Enter your email",
  buttonText = "Subscribe",
  themeColor = "#3b82f6",
  showSocialProof = true,
  socialProofText = "Join 10,000+ subscribers",
  className,
  onSubmit,
}: NewsletterSignupProps) {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      if (onSubmit) {
        await onSubmit(email);
      } else {
        // Default behavior - call API
        const response = await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error?.message || "Failed to subscribe");
        }
      }

      setStatus("success");
      setEmail("");

      // Reset after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong",
      );
    }
  };

  if (status === "success") {
    return (
      <div className={cn("py-8 text-center", className)}>
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: `${themeColor}15` }}
        >
          <Check className="h-8 w-8" style={{ color: themeColor }} />
        </div>
        <h3 className="mb-2 font-semibold text-gray-900 text-xl">
          Thanks for subscribing!
        </h3>
        <p className="text-gray-600">
          Check your inbox for a confirmation email.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("mx-auto w-full max-w-lg", className)}>
      {/* Title & Description */}
      <div className="mb-6 text-center">
        <h3 className="mb-2 font-bold text-2xl text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          disabled={status === "loading"}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={status === "loading"}
          style={{ backgroundColor: themeColor }}
        >
          {status === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Subscribing...
            </>
          ) : (
            <>
              {buttonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Error */}
      {status === "error" && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p>{errorMessage}</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Social Proof */}
      {showSocialProof && (
        <p className="mt-4 text-center text-gray-500 text-sm">
          {socialProofText}
        </p>
      )}

      {/* Privacy note */}
      <p className="mt-3 text-center text-gray-400 text-xs">
        No spam, unsubscribe anytime. Read our{" "}
        <a href="/privacy" className="underline hover:text-gray-600">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
