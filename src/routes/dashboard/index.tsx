import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar,
  ClipboardCheck,
  Clock,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                {stat.icon}
              </div>
              <span className="text-indigo-600 text-sm font-medium">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
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
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium text-sm">
                    {entry.patient
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{entry.patient}</p>
                    <p className="text-sm text-gray-500">{entry.goal}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${entry.trend === "complete" ? "bg-green-500" : entry.trend === "up" ? "bg-indigo-500" : "bg-red-500"}`}
                      style={{ width: `${entry.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-10">
                    {entry.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
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
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-medium text-sm">
                    {session.patient
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {session.patient}
                    </p>
                    <p className="text-sm text-gray-500">
                      {session.type} - {session.therapist}
                    </p>
                  </div>
                </div>
                <span className="text-indigo-600 font-medium">
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
