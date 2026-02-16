// Feature Card Component - Unified across all apps

import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/index";

interface FeatureCardProps {
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  iconNode?: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  themeColor?: string;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  iconNode,
  title,
  description,
  href,
  themeColor = "#3b82f6",
  className,
}: FeatureCardProps) {
  const content = (
    <div
      className={cn(
        "group rounded-2xl border border-gray-100 bg-white p-6",
        "hover:shadow-gray-200/50 hover:shadow-lg",
        "transition-all duration-300",
        "hover:-translate-y-1",
        className,
      )}
    >
      {/* Icon */}
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${themeColor}15` }}
      >
        {Icon ? (
          <Icon className="h-6 w-6" style={{ color: themeColor }} />
        ) : (
          iconNode
        )}
      </div>

      {/* Title */}
      <h3 className="mb-2 font-semibold text-gray-900 text-xl group-hover:text-gray-700">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">{description}</p>

      {/* Arrow indicator for clickable cards */}
      {href && (
        <div
          className="mt-4 flex items-center font-medium text-sm opacity-0 transition-opacity group-hover:opacity-100"
          style={{ color: themeColor }}
        >
          Learn more
          <svg
            className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      )}
    </div>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return content;
}

// ============================================================================
// Feature Grid Component
// ============================================================================

interface FeatureGridProps {
  features: Array<{
    icon?: LucideIcon | React.ComponentType<{ className?: string }>;
    iconNode?: React.ReactNode;
    title: string;
    description: string;
    href?: string;
  }>;
  columns?: 2 | 3 | 4;
  themeColor?: string;
  className?: string;
}

export function FeatureGrid({
  features,
  columns = 3,
  themeColor = "#3b82f6",
  className,
}: FeatureGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-6", gridCols[columns], className)}>
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} themeColor={themeColor} />
      ))}
    </div>
  );
}
