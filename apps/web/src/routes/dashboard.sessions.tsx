"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/dashboard/sessions")({
  component: DashboardSessionsPage,
});

type SessionStatus = "scheduled" | "completed";

const sessions: Array<{
  patient: string;
  therapy: string;
  status: SessionStatus;
}> = [
  { patient: "Emma Johnson", therapy: "ABA Therapy", status: "scheduled" },
  { patient: "Liam Williams", therapy: "Speech Therapy", status: "completed" },
  {
    patient: "Noah Martinez",
    therapy: "Occupational Therapy",
    status: "scheduled",
  },
];

function DashboardSessionsPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | SessionStatus>(
    "all",
  );

  const filteredSessions = useMemo(() => {
    if (statusFilter === "all") return sessions;
    return sessions.filter((session) => session.status === statusFilter);
  }, [statusFilter]);

  return (
    <div className="space-y-5">
      <h1 className="font-bold text-3xl text-gray-900">Sessions</h1>

      <div className="max-w-xs">
        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as "all" | SessionStatus)
          }
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="all">All statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full">
          <thead className="bg-gray-50 text-left text-gray-600 text-sm">
            <tr>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Session Type</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.map((session) => (
              <tr
                key={`${session.patient}-${session.status}`}
                className="border-gray-100 border-t"
              >
                <td className="px-4 py-3 text-gray-900">{session.patient}</td>
                <td className="px-4 py-3 text-gray-700">{session.therapy}</td>
                <td className="px-4 py-3 text-gray-700">{session.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
