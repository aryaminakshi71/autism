import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar,
  Clock,
  Copy,
  Edit,
  Grid,
  List,
  Plus,
  Search,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { DashboardLayout } from "~/components/dashboard/dashboard-layout";

export const Route = createFileRoute("/dashboard/schedules/")({
  component: SchedulesPage,
});

function SchedulesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const schedules = [
    {
      id: "1",
      name: "Morning Routine",
      patient: "Emma Johnson",
      type: "daily",
      items: [
        { time: "7:00 AM", activity: "Wake up", icon: "🌅", completed: true },
        {
          time: "7:15 AM",
          activity: "Brush teeth",
          icon: "🪥",
          completed: true,
        },
        {
          time: "7:30 AM",
          activity: "Get dressed",
          icon: "👕",
          completed: false,
        },
        {
          time: "7:45 AM",
          activity: "Breakfast",
          icon: "🍳",
          completed: false,
        },
        {
          time: "8:00 AM",
          activity: "School bus",
          icon: "🚌",
          completed: false,
        },
      ],
      isDefault: true,
    },
    {
      id: "2",
      name: "Therapy Session",
      patient: "Liam Williams",
      type: "therapy",
      items: [
        { activity: "Arrival & Greeting", icon: "👋", isFirstThen: true },
        {
          activity: "Sensory activity",
          icon: "🎨",
          isChoice: true,
          choices: ["Play-doh", "Sand table", "Fidget toys"],
        },
        { activity: "ABA work", icon: "📝", completed: false },
        { activity: "Break", icon: "☕", completed: false },
        { activity: "Social skills game", icon: "🎮", completed: false },
      ],
      isDefault: false,
    },
    {
      id: "3",
      name: "After School",
      patient: "Olivia Davis",
      type: "daily",
      items: [
        { time: "3:00 PM", activity: "Snack", icon: "🍎", completed: false },
        { time: "3:30 PM", activity: "Homework", icon: "📚", completed: false },
        {
          time: "4:00 PM",
          activity: "Outdoor play",
          icon: "⚽",
          completed: false,
        },
        {
          time: "5:00 PM",
          activity: "Screen time",
          icon: "📺",
          completed: false,
        },
      ],
      isDefault: false,
    },
    {
      id: "4",
      name: "Bedtime Routine",
      patient: "Noah Martinez",
      type: "bedtime",
      items: [
        { time: "7:30 PM", activity: "Bath", icon: "🛁", completed: false },
        { time: "7:45 PM", activity: "Pajamas", icon: "🌙", completed: false },
        {
          time: "8:00 PM",
          activity: "Story time",
          icon: "📖",
          completed: false,
        },
        {
          time: "8:15 PM",
          activity: "Lights out",
          icon: "💤",
          completed: false,
        },
      ],
      isDefault: true,
    },
  ];

  const filteredSchedules = schedules.filter(
    (schedule) =>
      schedule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "daily":
        return "bg-blue-100 text-blue-700";
      case "therapy":
        return "bg-purple-100 text-purple-700";
      case "bedtime":
        return "bg-indigo-100 text-indigo-700";
      case "school":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <DashboardLayout title="Visual Schedules">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search schedules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 rounded-xl border border-gray-200 py-2 pr-4 pl-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-lg p-2 transition-colors ${viewMode === "list" ? "bg-white shadow-sm" : "text-gray-500"}`}
            >
              <List className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-2 transition-colors ${viewMode === "grid" ? "bg-white shadow-sm" : "text-gray-500"}`}
            >
              <Grid className="h-5 w-5" />
            </button>
          </div>
          <button className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700">
            <Plus className="h-5 w-5" />
            <span>Create Schedule</span>
          </button>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="space-y-4">
          {filteredSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {schedule.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Patient: {schedule.patient}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`rounded-full px-3 py-1 font-medium text-xs ${getTypeColor(schedule.type)}`}
                  >
                    {schedule.type}
                  </span>
                  {schedule.isDefault && (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 font-medium text-xs text-yellow-700">
                      Default
                    </span>
                  )}
                </div>
              </div>

              <div className="border-gray-100 border-t pt-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {schedule.items.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 rounded-lg p-3 ${
                        item.completed ? "bg-green-50" : "bg-gray-50"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex-1">
                        {item.time && (
                          <span className="flex items-center space-x-1 text-gray-500 text-xs">
                            <Clock className="h-3 w-3" />
                            <span>{item.time}</span>
                          </span>
                        )}
                        <p
                          className={`font-medium text-sm ${item.completed ? "text-green-700 line-through" : "text-gray-700"}`}
                        >
                          {item.activity}
                        </p>
                        {item.isFirstThen && (
                          <span className="font-medium text-purple-600 text-xs">
                            First Then
                          </span>
                        )}
                        {item.isChoice && (
                          <span className="font-medium text-orange-600 text-xs">
                            Choice Board
                          </span>
                        )}
                      </div>
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          item.completed
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {item.completed && <span className="text-xs">✓</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end space-x-3 border-gray-100 border-t pt-4">
                <button className="flex items-center space-x-1 rounded-lg px-3 py-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
                  <Copy className="h-4 w-4" />
                  <span className="text-sm">Duplicate</span>
                </button>
                <button className="flex items-center space-x-1 rounded-lg px-3 py-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
                  <Edit className="h-4 w-4" />
                  <span className="text-sm">Edit</span>
                </button>
                <button className="flex items-center space-x-1 rounded-lg px-3 py-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700">
                  <Trash className="h-4 w-4" />
                  <span className="text-sm">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <span
                  className={`rounded-full px-2 py-1 font-medium text-xs ${getTypeColor(schedule.type)}`}
                >
                  {schedule.type}
                </span>
              </div>
              <h3 className="mb-1 font-semibold text-gray-900">
                {schedule.name}
              </h3>
              <p className="mb-4 text-gray-500 text-sm">{schedule.patient}</p>
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <span>{schedule.items.length} activities</span>
                <span>·</span>
                <span>
                  {schedule.items.filter((i) => i.completed).length} completed
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
