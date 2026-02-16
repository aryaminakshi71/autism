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
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (current >= target)
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (current >= target * 0.7)
      return <Minus className="h-4 w-4 text-yellow-500" />;
    return <TrendingDown className="h-4 w-4 text-red-500" />;
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
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search goals..."
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
            <option value="active">Active</option>
            <option value="mastered">Mastered</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700">
          <Plus className="h-5 w-5" />
          <span>Add Goal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredGoals.map((goal) => {
          const progressPercent = Math.min(
            (goal.currentValue / goal.targetValue) * 100,
            100,
          );
          return (
            <div
              key={goal.id}
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                    <p className="text-gray-500 text-sm">{goal.patient}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-1 font-medium text-xs ${
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
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-gray-600 text-sm">{goal.category}</span>
                  <span className="font-medium text-gray-900 text-sm">
                    {goal.currentValue}/{goal.targetValue}
                    {goal.unit}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full ${getProgressColor(goal.currentValue, goal.targetValue, goal.status)} transition-all duration-300`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-gray-100 border-t pt-4">
                <div className="flex items-center space-x-2">
                  {getTrendIcon(
                    goal.currentValue,
                    goal.targetValue,
                    goal.status,
                  )}
                  <span className="text-gray-600 text-sm">
                    {progressPercent.toFixed(0)}%
                  </span>
                </div>
                <span
                  className={`rounded-full px-3 py-1 font-medium text-xs ${
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
