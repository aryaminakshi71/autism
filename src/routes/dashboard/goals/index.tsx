import { createFileRoute } from "@tanstack/react-router";
import {
  Minus,
  Plus,
  Search,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { DashboardLayout } from "~/components/dashboard/dashboard-layout";

export const Route = createFileRoute("/dashboard/goals/")({
  component: GoalsPage,
});

function GoalsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const goals = [
    {
      id: "1",
      name: "Increase eye contact",
      category: "Social Skills",
      patient: "Emma Johnson",
      targetValue: 80,
      currentValue: 65,
      unit: "%",
      status: "active",
      masteryCriteria: 80,
      domain: "Social",
      priority: "high",
    },
    {
      id: "2",
      name: "Following 2-step directions",
      category: "Communication",
      patient: "Liam Williams",
      targetValue: 90,
      currentValue: 72,
      unit: "%",
      status: "active",
      masteryCriteria: 90,
      domain: "Communication",
      priority: "high",
    },
    {
      id: "3",
      name: "Reduce hand flapping",
      category: "Behavior",
      patient: "Olivia Davis",
      targetValue: 10,
      currentValue: 35,
      unit: "%",
      status: "active",
      masteryCriteria: 10,
      domain: "Behavior",
      priority: "medium",
    },
    {
      id: "4",
      name: "Picture exchange communication",
      category: "AAC",
      patient: "Noah Martinez",
      targetValue: 5,
      currentValue: 5,
      unit: " exchanges/min",
      status: "mastered",
      masteryCriteria: 5,
      domain: "Communication",
      priority: "low",
    },
    {
      id: "5",
      name: "Turn-taking in games",
      category: "Social Skills",
      patient: "Emma Johnson",
      targetValue: 4,
      currentValue: 2,
      unit: " turns",
      status: "active",
      masteryCriteria: 4,
      domain: "Social",
      priority: "medium",
    },
  ];

  const filteredGoals = goals.filter((goal) => {
    const matchesSearch =
      goal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.patient.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || goal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getTrendIcon = (current: number, target: number, status: string) => {
    if (status === "mastered")
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (current >= target)
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (current >= target * 0.7)
      return <Minus className="w-4 h-4 text-yellow-500" />;
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const getProgressColor = (
    current: number,
    target: number,
    status: string,
  ) => {
    if (status === "mastered") return "bg-green-500";
    if (current >= target) return "bg-green-500";
    if (current >= target * 0.7) return "bg-yellow-500";
    return "bg-indigo-500";
  };

  return (
    <DashboardLayout title="Goals & Progress">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search goals..."
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
            <option value="active">Active</option>
            <option value="mastered">Mastered</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Add Goal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGoals.map((goal) => {
          const progressPercent = Math.min(
            (goal.currentValue / goal.targetValue) * 100,
            100,
          );
          return (
            <div
              key={goal.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                    <p className="text-sm text-gray-500">{goal.patient}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    goal.priority === "high"
                      ? "bg-red-100 text-red-700"
                      : goal.priority === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {goal.priority}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{goal.category}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {goal.currentValue}/{goal.targetValue}
                    {goal.unit}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(goal.currentValue, goal.targetValue, goal.status)} transition-all duration-300`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  {getTrendIcon(
                    goal.currentValue,
                    goal.targetValue,
                    goal.status,
                  )}
                  <span className="text-sm text-gray-600">
                    {progressPercent.toFixed(0)}%
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    goal.status === "active"
                      ? "bg-blue-100 text-blue-700"
                      : goal.status === "mastered"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {goal.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
