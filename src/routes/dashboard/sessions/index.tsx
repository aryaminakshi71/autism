import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar,
  Clock,
  Copy,
  Edit,
  MapPin,
  Plus,
  Search,
  Trash,
  User,
  Video,
} from "lucide-react";
import { useState } from "react";
import { DashboardLayout } from "~/components/dashboard/dashboard-layout";
import { isDemoModeEnabled } from "~/lib/demo-mode";

export const Route = createFileRoute("/dashboard/sessions/")({
  component: SessionsPage,
});

const DEFAULT_SESSIONS = [
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

function SessionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sessions, setSessions] = useState(DEFAULT_SESSIONS);
  const isDemoMode = isDemoModeEnabled();

  const handleAddSession = () => {
    const nextId = String(sessions.length + 1);
    const now = new Date();
    const startTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour duration

    setSessions((prev) => [
      {
        id: nextId,
        patient: "New Patient",
        therapist: "Unassigned",
        type: "ABA Therapy",
        scheduledStart: startTime.toISOString(),
        scheduledEnd: endTime.toISOString(),
        duration: 60,
        status: "scheduled",
        location: "Clinic - Room TBD",
        telehealth: false,
      },
      ...prev,
    ]);
  };

  const handleDeleteSession = (id: string) => {
    if (confirm("Are you sure you want to delete this session?")) {
      setSessions((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleDuplicateSession = (session: (typeof DEFAULT_SESSIONS)[0]) => {
    const nextId = String(sessions.length + 1);
    const newSession = {
      ...session,
      id: nextId,
      scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      scheduledEnd: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
      status: "scheduled" as const,
    };
    setSessions((prev) => [newSession, ...prev]);
  };

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
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
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
          </select>
        </div>
        <button
          onClick={handleAddSession}
          title={isDemoMode ? "Demo: session will be added locally." : ""}
          className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          <span>Add Session</span>
        </button>
      </div>
      {isDemoMode ? (
        <p className="mb-4 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-indigo-800 text-sm">
          Demo mode: new sessions are saved locally for this session.
        </p>
      ) : null}

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
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleDuplicateSession(session)}
                      className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
