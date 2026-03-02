"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/schedules")({
  component: DashboardSchedulesPage,
});

function DashboardSchedulesPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  return (
    <div className="space-y-5">
      <h1 className="font-bold text-3xl text-gray-900">Visual Schedules</h1>

      <div className="inline-flex gap-1 rounded-xl bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => setViewMode("list")}
          className={`rounded-lg px-3 py-1.5 font-medium ${
            viewMode === "list" ? "bg-white shadow-sm" : "text-gray-600"
          }`}
        >
          List
        </button>
        <button
          type="button"
          onClick={() => setViewMode("grid")}
          className={`rounded-lg px-3 py-1.5 font-medium ${
            viewMode === "grid" ? "bg-white shadow-sm" : "text-gray-600"
          }`}
        >
          Grid
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {["Morning Routine", "Bedtime Routine", "School Transition"].map(
          (item) => (
            <article
              key={item}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <h2 className="font-semibold text-gray-900">{item}</h2>
              <p className="mt-1 text-gray-600 text-sm">
                Structured, visual sequence with caregiver prompts.
              </p>
            </article>
          ),
        )}
      </div>
    </div>
  );
}
