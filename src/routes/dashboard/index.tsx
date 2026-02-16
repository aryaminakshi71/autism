import { createFileRoute } from "@tanstack/react-router";
import {
  DashboardLayout,
  dashboardStats,
} from "~/components/dashboard/dashboard-layout";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard">
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                {stat.icon}
              </div>
              <span className="font-medium text-indigo-600 text-sm">
                {stat.change}
              </span>
            </div>
            <p className="font-bold text-2xl text-gray-900">{stat.value}</p>
            <p className="mt-1 text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900 text-lg">
            Recent Progress
          </h2>
          <div className="space-y-4">
            {[
              {
                patient: "Emma Johnson",
                goal: "Eye contact",
                progress: 65,
                trend: "up",
              },
              {
                patient: "Liam Williams",
                goal: "Following directions",
                progress: 72,
                trend: "up",
              },
              {
                patient: "Olivia Davis",
                goal: "Reducing hand flapping",
                progress: 35,
                trend: "down",
              },
              {
                patient: "Noah Martinez",
                goal: "Picture exchange",
                progress: 100,
                trend: "complete",
              },
            ].map((entry) => (
              <div
                key={entry.patient}
                className="flex items-center justify-between border-gray-100 border-b py-3 last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-medium text-indigo-600 text-sm">
                    {entry.patient
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{entry.patient}</p>
                    <p className="text-gray-500 text-sm">{entry.goal}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full ${entry.trend === "complete" ? "bg-green-500" : entry.trend === "up" ? "bg-indigo-500" : "bg-red-500"}`}
                      style={{ width: `${entry.progress}%` }}
                    />
                  </div>
                  <span className="w-10 font-medium text-gray-700 text-sm">
                    {entry.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900 text-lg">
            Upcoming Sessions
          </h2>
          <div className="space-y-4">
            {[
              {
                patient: "Emma Johnson",
                time: "9:00 AM",
                type: "ABA Therapy",
                therapist: "Sarah Smith",
              },
              {
                patient: "Liam Williams",
                time: "10:30 AM",
                type: "Speech Therapy",
                therapist: "Michael Brown",
              },
              {
                patient: "Olivia Davis",
                time: "11:00 AM",
                type: "OT Therapy",
                therapist: "Sarah Smith",
              },
              {
                patient: "Noah Martinez",
                time: "2:00 PM",
                type: "ABA Therapy",
                therapist: "Michael Brown",
              },
            ].map((session) => (
              <div
                key={session.patient}
                className="flex items-center justify-between border-gray-100 border-b py-3 last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 font-medium text-purple-600 text-sm">
                    {session.patient
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {session.patient}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {session.type} - {session.therapist}
                    </p>
                  </div>
                </div>
                <span className="font-medium text-indigo-600">
                  {session.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
