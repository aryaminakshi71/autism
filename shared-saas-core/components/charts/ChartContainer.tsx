"use client";

import { ReactNode } from "react";
import { cn } from "../../utils";

interface ChartContainerProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  loading?: boolean;
  error?: string | null;
  height?: number;
}

export function ChartContainer({
  title,
  description,
  children,
  className,
  loading = false,
  error = null,
  height = 300,
}: ChartContainerProps) {
  if (error) {
    return (
      <div
        className={cn(
          "rounded-lg border border-gray-200 bg-white p-6",
          className,
        )}
      >
        <div className="flex h-[300px] items-center justify-center text-red-600">
          <p>Error loading chart: {error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={cn(
          "rounded-lg border border-gray-200 bg-white p-6",
          className,
        )}
      >
        {title && <h3 className="mb-2 font-semibold text-lg">{title}</h3>}
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-3/4 rounded bg-gray-200"></div>
          <div className="h-[300px] rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-6",
        className,
      )}
    >
      {title && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
          {description && (
            <p className="mt-1 text-gray-500 text-sm">{description}</p>
          )}
        </div>
      )}
      <div style={{ height: `${height}px` }} className="w-full">
        {children}
      </div>
    </div>
  );
}
