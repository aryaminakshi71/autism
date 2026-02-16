"use client";
import { ArrowDownRight, ArrowUpRight, LucideIcon } from "lucide-react";
import { cn } from "../../utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label?: string;
    positive?: boolean;
  };
  icon?: LucideIcon;
  iconColor?: string;
  className?: string;
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "bg-blue-100 text-blue-600",
  className,
  loading = false,
}: StatCardProps) {
  if (loading) {
    return (
      <div
        className={cn(
          "rounded-xl border border-gray-100 bg-white p-5 shadow-sm",
          className,
        )}
      >
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-1/2 rounded bg-gray-200"></div>
          <div className="h-8 w-3/4 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        {Icon && (
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              iconColor,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
        {change && (
          <span
            className={cn(
              "flex items-center gap-1 font-medium text-xs",
              change.positive !== false ? "text-green-600" : "text-red-600",
            )}
          >
            {change.positive !== false ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {change.value > 0 ? "+" : ""}
            {change.value}%{change.label && ` ${change.label}`}
          </span>
        )}
      </div>
      <p className="font-bold text-2xl text-gray-900">{value}</p>
      <p className="mt-1 text-gray-500 text-sm">{title}</p>
    </div>
  );
}
