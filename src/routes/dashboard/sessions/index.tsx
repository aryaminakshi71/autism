import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Search,
  User,
  Video,
} from "lucide-react";
import { useState } from "react";
import { DashboardLayout } from "~/components/dashboard/dashboard-layout";

export const Route = createFileRoute("/dashboard/sessions/")({
  component: SessionsPage,
});

function SessionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const sessions = [
    {
      id: "1",
      patient: "Emma Johnson",
      therapist: "Sarah Smith",
      type: "ABA Therapy",
      scheduledStart: "2024-01-16T09:00:00",
      scheduledEnd: "2024-01-16T10:00:00",
      duration: 60,
      status: "scheduled",
      location: "Clinic - Room 101",
      telehealth: false,
    },
    {
      id: "2",
      patient: "Liam Williams",
      therapist: "Michael Brown",
      type: "Speech Therapy",
      scheduledStart: "2024-01-16T10:30:00",
      scheduledEnd: "2024-01-16T11:00:00",
      duration: 30,
      status: "scheduled",
      location: "Clinic - Room 102",
      telehealth: false,
    },
    {
      id: "3",
      patient: "Olivia Davis",
      therapist: "Sarah Smith",
      type: "OT Therapy",
      scheduledStart: "2024-01-16T11:00:00",
      scheduledEnd: "2024-01-16T12:00:00",
      duration: 60,
      status: "in-progress",
      location: "Clinic - Room 103",
      telehealth: false,
    },
    {
      id: "4",
      patient: "Noah Martinez",
      therapist: "Michael Brown",
      type: "ABA Therapy",
      scheduledStart: "2024-01-16T14:00:00",
      scheduledEnd: "2024-01-16T15:00:00",
      duration: 60,
      status: "scheduled",
      location: "Virtual",
      telehealth: true,
    },
    {
      id: "5",
      patient: "Emma Johnson",
      therapist: "Sarah Smith",
      type: "ABA Therapy",
      scheduledStart: "2024-01-15T09:00:00",
      scheduledEnd: "2024-01-15T10:00:00",
      duration: 60,
      status: "completed",
      location: "Clinic - Room 101",
      telehealth: false,
      notes: "Great progress on eye contact goal",
    },
  ];

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || session.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout title="Sessions">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 rounded-xl border border-gray-200 py-2 pr-4 pl-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700">
          <Plus className="h-5 w-5" />
          <span>Schedule Session</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-gray-100 border-b bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-600 text-sm">
                Date & Time
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-600 text-sm">
                Patient
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-600 text-sm">
                Therapist
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-600 text-sm">
                Type
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-600 text-sm">
                Duration
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-600 text-sm">
                Location
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-600 text-sm">
                Status
              </th>
              <th className="px-6 py-4 text-right font-semibold text-gray-600 text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSessions.map((session) => (
              <tr
                key={session.id}
                className="transition-colors hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {formatDate(session.scheduledStart)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 text-sm">
                      {formatTime(session.scheduledStart)} -{" "}
                      {formatTime(session.scheduledEnd)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 font-medium text-indigo-600 text-sm">
                      {session.patient
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="font-medium text-gray-900">
                      {session.patient}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{session.therapist}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{session.type}</td>
                <td className="px-6 py-4 text-gray-600">
                  {session.duration} min
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {session.telehealth ? (
                      <Video className="h-4 w-4 text-indigo-500" />
                    ) : (
                      <MapPin className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-gray-600">{session.location}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 font-medium text-xs ${getStatusColor(session.status)}`}
                  >
                    {session.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="font-medium text-indigo-600 text-sm hover:text-indigo-800">
                    {session.status === "scheduled" ? "Start" : "View"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
