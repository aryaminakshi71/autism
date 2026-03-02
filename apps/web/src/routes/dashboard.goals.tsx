"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/dashboard/goals")({
  component: DashboardGoalsPage,
});

type GoalStatus = "in-progress" | "mastered";

const goals: Array<{
  title: string;
  patient: string;
  status: GoalStatus;
}> = [
  {
    title: "Increase eye contact",
    patient: "Emma Johnson",
    status: "in-progress",
  },
  {
    title: "Turn-taking in games",
    patient: "Liam Williams",
    status: "in-progress",
  },
  {
    title: "Picture exchange communication",
    patient: "Noah Martinez",
    status: "mastered",
  },
];

function DashboardGoalsPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | GoalStatus>("all");

  const filteredGoals = useMemo(() => {
    if (statusFilter === "all") return goals;
    return goals.filter((goal) => goal.status === statusFilter);
  }, [statusFilter]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl text-gray-900">
          Goals &amp; Progress
        </h1>
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Add Goal
        </button>
      </div>

      <div className="max-w-xs">
        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as "all" | GoalStatus)
          }
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="all">All statuses</option>
          <option value="in-progress">In Progress</option>
          <option value="mastered">Mastered</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredGoals.map((goal) => (
          <article
            key={goal.title}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <p className="font-semibold text-gray-900">{goal.title}</p>
            <p className="mt-1 text-gray-600 text-sm">{goal.patient}</p>
            <span className="mt-3 inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-gray-700 text-xs">
              {goal.status}
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}
