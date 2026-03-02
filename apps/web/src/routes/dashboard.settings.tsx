"use client";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings")({
  component: DashboardSettingsPage,
});

function DashboardSettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-bold text-3xl text-gray-900">Settings</h1>
      <p className="text-gray-600">
        Configure organization profile, notifications, and care workflow
        preferences.
      </p>
    </div>
  );
}
