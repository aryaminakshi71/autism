// Hero Component - Unified across all apps
// Uses Tailwind design tokens for consistent dark/light mode support

import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Play } from "lucide-react";
import * as React from "react";
import type { Locale } from "../../i18n/config";
import { cn } from "../../lib/index";
import { Button } from "../ui/button";

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  demoVideoUrl?: string;
  showTrustBadges?: boolean;
  trustText?: string;
  icon?: React.ReactNode;
  themeColor?: string;
  locale?: Locale;
  className?: string;
}

export function Hero({
  title,
  subtitle,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  demoVideoUrl,
  showTrustBadges = true,
  trustText = "Trusted by 500+ organizations",
  icon,
  themeColor,
  locale,
  className,
}: HeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-background px-4 py-20 sm:px-6 lg:px-8 lg:py-32",
        className,
      )}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-transparent opacity-30" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          {showTrustBadges && (
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 font-medium text-primary text-sm">
              {icon || <CheckCircle2 className="h-4 w-4" />}
              <span>{trustText}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="mb-6 font-bold text-4xl text-foreground leading-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-3xl text-lg text-muted-foreground leading-relaxed sm:text-xl">
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {ctaText && ctaHref && (
              <Button
                asChild
                size="lg"
                className="w-full min-w-[180px] sm:w-auto"
              >
                <Link to={ctaHref}>
                  {ctaText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}

            {secondaryCtaText && secondaryCtaHref && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link to={secondaryCtaHref}>
                  {demoVideoUrl ? (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      {secondaryCtaText}
                    </>
                  ) : (
                    secondaryCtaText
                  )}
                </Link>
              </Button>
            )}
          </div>

          {/* Trust text */}
          <p className="text-muted-foreground text-sm">
            14-day free trial · No credit card required · Cancel anytime
          </p>
        </div>

        {/* Demo Video / Screenshot */}
        {demoVideoUrl && (
          <div className="relative mt-16">
            <div
              className="relative mx-auto aspect-video max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
              style={{ aspectRatio: "16/9" }}
            >
              <iframe
                src={demoVideoUrl}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
