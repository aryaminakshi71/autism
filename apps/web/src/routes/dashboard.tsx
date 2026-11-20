"use client";

import { SessionNoteWorkspace } from "@/components/notes/SessionNoteWorkspace";
import { SchedulingPanel } from "@/components/scheduling/SchedulingPanel";
import { CenterOperationsCommand } from "@/components/operations/CenterOperationsCommand";
import { Link, createFileRoute, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/dashboard/patients", label: "Patients" },
  { to: "/dashboard/goals", label: "Goals" },
  { to: "/dashboard/sessions", label: "Sessions" },
  { to: "/dashboard/schedules", label: "Visual Schedules" },
  { to: "/dashboard/communication", label: "Communication" },
  { to: "/dashboard/assessments", label: "Assessments" },
  { to: "/dashboard/operations", label: "Operations" },
  { to: "/dashboard/analytics", label: "Analytics" },
  { to: "/dashboard/settings", label: "Settings" },
] as const;

function DashboardLayout() {
  const [patientQuery, setPatientQuery] = useState("");
  const [goalFilter, setGoalFilter] = useState<
    "all" | "in-progress" | "mastered"
  >("all");
  const [sessionFilter, setSessionFilter] = useState<
    "all" | "scheduled" | "completed"
  >("all");
  const [scheduleView, setScheduleView] = useState<"list" | "grid">("list");
  const [stats, setStats] = useState({
    activePatients: 0,
    goalsInProgress: 0,
    sessionsThisWeek: 0,
    assessmentsDue: 0,
  });

  useEffect(() => {
    fetch("/api/v1/autism/stats", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: any) => {
        if (d) setStats(d);
      })
      .catch(() => {});
  }, []);

  const pathname = useRouterState({
    select: (state) => state.location.pathname.replace(/\/$/, ""),
  });

  const currentPath = pathname || "/dashboard";

  const patients = [
    { name: "Emma Johnson", age: 8, program: "ABA Therapy" },
    { name: "Liam Williams", age: 9, program: "Speech Therapy" },
    { name: "Noah Martinez", age: 7, program: "Occupational Therapy" },
  ];

  const goals = [
    {
      title: "Increase eye contact",
      patient: "Emma Johnson",
      status: "in-progress" as const,
    },
    {
      title: "Turn-taking in games",
      patient: "Liam Williams",
      status: "in-progress" as const,
    },
    {
      title: "Picture exchange communication",
      patient: "Noah Martinez",
      status: "mastered" as const,
    },
  ];

  const sessions = [
    {
      patient: "Emma Johnson",
      therapy: "ABA Therapy",
      status: "scheduled" as const,
    },
    {
      patient: "Liam Williams",
      therapy: "Speech Therapy",
      status: "completed" as const,
    },
    {
      patient: "Noah Martinez",
      therapy: "Occupational Therapy",
      status: "scheduled" as const,
    },
  ];

  const filteredPatients = useMemo(() => {
    const lowerQuery = patientQuery.trim().toLowerCase();
    if (!lowerQuery) return patients;
    return patients.filter((patient) =>
      patient.name.toLowerCase().includes(lowerQuery),
    );
  }, [patientQuery]);

  const filteredGoals = useMemo(() => {
    if (goalFilter === "all") return goals;
    return goals.filter((goal) => goal.status === goalFilter);
  }, [goalFilter]);

  const filteredSessions = useMemo(() => {
    if (sessionFilter === "all") return sessions;
    return sessions.filter((session) => session.status === sessionFilter);
  }, [sessionFilter]);

  const renderCurrentPage = () => {
    if (currentPath === "/dashboard") {
      return (
        <div className="space-y-6">
          <h1 className="font-bold text-3xl text-gray-900">Dashboard</h1>
          <h2 className="text-gray-600 text-xl">Welcome Back</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Active Patients", value: String(stats.activePatients) },
              {
                label: "Goals in Progress",
                value: String(stats.goalsInProgress),
              },
              {
                label: "Sessions This Week",
                value: String(stats.sessionsThisWeek),
              },
              { label: "Assessments Due", value: String(stats.assessmentsDue) },
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
                  <span className="text-gray-500 text-sm">
                    Eye contact: 65%
                  </span>
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

    if (currentPath === "/dashboard/patients") {
      return (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-3xl text-gray-900">Patients</h1>
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Add Patient
            </button>
          </div>

          <input
            value={patientQuery}
            onChange={(event) => setPatientQuery(event.target.value)}
            placeholder="Search patients..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full">
              <thead className="bg-gray-50 text-left text-gray-600 text-sm">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Age</th>
                  <th className="px-4 py-3">Program</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.name} className="border-gray-100 border-t">
                    <td className="px-4 py-3 text-gray-900">{patient.name}</td>
                    <td className="px-4 py-3 text-gray-700">{patient.age}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {patient.program}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (currentPath === "/dashboard/goals") {
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
              value={goalFilter}
              onChange={(event) =>
                setGoalFilter(
                  event.target.value as "all" | "in-progress" | "mastered",
                )
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

    if (currentPath === "/dashboard/sessions") {
      return <SessionNoteWorkspace />;
    }

    if (currentPath === "/dashboard/schedules") {
      return <SchedulingPanel />;
    }

    if (currentPath === "/dashboard/communication") {
      return (
        <div className="space-y-5">
          <h1 className="font-bold text-3xl text-gray-900">
            Communication Boards
          </h1>

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

    if (currentPath === "/dashboard/assessments") {
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
                <p className="font-semibold text-gray-900">
                  {assessment.title}
                </p>
                <p className="mt-1 text-gray-600 text-sm">
                  {assessment.patient}
                </p>
                <span className="mt-3 inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-gray-700 text-xs">
                  {assessment.status}
                </span>
              </article>
            ))}
          </div>
        </div>
      );
    }

    if (currentPath === "/dashboard/analytics") {
      return (
        <div className="space-y-4">
          <h1 className="font-bold text-3xl text-gray-900">Analytics</h1>
          <p className="text-gray-600">
            Analyze outcome trends, engagement metrics, and care delivery
            quality.
          </p>
        </div>
      );
    }

    if (currentPath === "/dashboard/operations") {
      return <CenterOperationsCommand />;
    }

    if (currentPath === "/dashboard/settings") {
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

    return null;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 border-gray-200 border-r bg-white p-4">
        <p className="mb-4 font-bold text-blue-600 text-lg">SpectrumAI</p>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{
                className:
                  "block rounded-md bg-blue-50 px-3 py-2 font-medium text-blue-700",
              }}
              activeOptions={{ exact: item.to === "/dashboard" }}
              className="block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">{renderCurrentPage()}</main>
    </div>
  );
}
