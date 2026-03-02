"use client";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/analytics")({
  component: DashboardAnalyticsPage,
});

function DashboardAnalyticsPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-bold text-3xl text-gray-900">Analytics</h1>
      <p className="text-gray-600">
        Analyze outcome trends, engagement metrics, and care delivery quality.
      </p>
    </div>
  );
}
