"use client";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/communication")({
  component: DashboardCommunicationPage,
});

function DashboardCommunicationPage() {
  return (
    <div className="space-y-5">
      <h1 className="font-bold text-3xl text-gray-900">Communication Boards</h1>

      <div className="flex flex-wrap gap-2">
        {["Core Words", "Feelings", "Actions"].map((category) => (
          <button
            key={category}
            type="button"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 hover:bg-gray-50"
          >
            {category}
          </button>
        ))}
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-3 font-semibold text-gray-900 text-xl">
          Quick Access Symbols
        </h2>
        <div className="flex flex-wrap gap-2">
          {["Yes", "No", "More", "Help"].map((word) => (
            <button
              key={word}
              type="button"
              className="rounded-lg bg-blue-50 px-4 py-2 font-semibold text-blue-700"
            >
              {word}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
