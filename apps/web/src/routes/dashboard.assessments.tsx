"use client";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/assessments")({
  component: DashboardAssessmentsPage,
});

function DashboardAssessmentsPage() {
  const assessments = [
    { title: "ADOS-2", patient: "Emma Johnson", status: "scheduled" },
    { title: "VB-MAPP", patient: "Liam Williams", status: "completed" },
    {
      title: "Sensory Profile",
      patient: "Noah Martinez",
      status: "scheduled",
    },
  ] as const;

  return (
    <div className="space-y-5">
      <h1 className="font-bold text-3xl text-gray-900">
        Assessments &amp; Screeners
      </h1>

      <div className="grid gap-4 md:grid-cols-2">
        {assessments.map((assessment) => (
          <article
            key={`${assessment.title}-${assessment.patient}`}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <p className="font-semibold text-gray-900">{assessment.title}</p>
            <p className="mt-1 text-gray-600 text-sm">{assessment.patient}</p>
            <span className="mt-3 inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-gray-700 text-xs">
              {assessment.status}
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}
