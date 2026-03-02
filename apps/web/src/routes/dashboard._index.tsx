"use client";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/_index")({
  component: DashboardIndexPage,
});

function DashboardIndexPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-bold text-3xl text-gray-900">Dashboard</h1>
      <h2 className="text-gray-600 text-xl">Welcome Back</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Patients", value: "24" },
          { label: "Goals in Progress", value: "63" },
          { label: "Sessions This Week", value: "41" },
          { label: "Assessments Due", value: "7" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className="mt-1 font-bold text-3xl text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900 text-xl">
            Recent Progress
          </h2>
          <ul className="space-y-3">
            <li className="flex items-center justify-between">
              <span>Emma Johnson</span>
              <span className="text-gray-500 text-sm">Eye contact: 65%</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Liam Williams</span>
              <span className="text-gray-500 text-sm">
                Following directions: 72%
              </span>
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900 text-xl">
            Upcoming Sessions
          </h2>
          <ul className="space-y-3">
            <li className="flex items-center justify-between">
              <span>Emma Johnson</span>
              <span className="text-gray-500 text-sm">9:00 AM</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Liam Williams</span>
              <span className="text-gray-500 text-sm">10:30 AM</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
