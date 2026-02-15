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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search schedules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-white shadow-sm" : "text-gray-500"}`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white shadow-sm" : "text-gray-500"}`}
            >
              <Grid className="w-5 h-5" />
            </button>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Create Schedule</span>
          </button>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="space-y-4">
          {filteredSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {schedule.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Patient: {schedule.patient}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(schedule.type)}`}
                  >
                    {schedule.type}
                  </span>
                  {schedule.isDefault && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                      Default
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {schedule.items.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${
                        item.completed ? "bg-green-50" : "bg-gray-50"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex-1">
                        {item.time && (
                          <span className="text-xs text-gray-500 flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{item.time}</span>
                          </span>
                        )}
                        <p
                          className={`text-sm font-medium ${item.completed ? "text-green-700 line-through" : "text-gray-700"}`}
                        >
                          {item.activity}
                        </p>
                        {item.isFirstThen && (
                          <span className="text-xs text-purple-600 font-medium">
                            First Then
                          </span>
                        )}
                        {item.isChoice && (
                          <span className="text-xs text-orange-600 font-medium">
                            Choice Board
                          </span>
                        )}
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
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

              <div className="flex items-center justify-end space-x-3 mt-4 pt-4 border-t border-gray-100">
                <button className="flex items-center space-x-1 px-3 py-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">Duplicate</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                  <Edit className="w-4 h-4" />
                  <span className="text-sm">Edit</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                  <Trash className="w-4 h-4" />
                  <span className="text-sm">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(schedule.type)}`}
                >
                  {schedule.type}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {schedule.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{schedule.patient}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
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
