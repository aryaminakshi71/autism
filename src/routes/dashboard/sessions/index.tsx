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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Schedule Session</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                Date & Time
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                Patient
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                Therapist
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                Type
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                Duration
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                Location
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                Status
              </th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSessions.map((session) => (
              <tr
                key={session.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {formatDate(session.scheduledStart)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {formatTime(session.scheduledStart)} -{" "}
                      {formatTime(session.scheduledEnd)}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-sm font-medium">
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
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{session.therapist}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-600">{session.type}</td>
                <td className="py-4 px-6 text-gray-600">
                  {session.duration} min
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    {session.telehealth ? (
                      <Video className="w-4 h-4 text-indigo-500" />
                    ) : (
                      <MapPin className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-gray-600">{session.location}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}
                  >
                    {session.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
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
