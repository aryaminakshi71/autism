import { createFileRoute } from "@tanstack/react-router";
import {
  Copy,
  Edit,
  MessageSquare,
  Plus,
  Search,
  Trash,
  Volume2,
} from "lucide-react";
import { useState } from "react";
import { DashboardLayout } from "~/components/dashboard/dashboard-layout";

export const Route = createFileRoute("/dashboard/communication/")({
  component: CommunicationPage,
});

function CommunicationPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "core", name: "Core Words", color: "bg-red-500", icon: "🔴" },
    { id: "feelings", name: "Feelings", color: "bg-orange-500", icon: "🟠" },
    { id: "actions", name: "Actions", color: "bg-green-500", icon: "🟢" },
    { id: "objects", name: "Objects", color: "bg-blue-500", icon: "🔵" },
    { id: "places", name: "Places", color: "bg-purple-500", icon: "🟣" },
    { id: "social", name: "Social", color: "bg-pink-500", icon: "🌸" },
  ];

  const cardSets = [
    {
      id: "1",
      name: "Basic Communication",
      category: "core",
      patient: "Emma Johnson",
      gridSize: "4x4",
      cardsCount: 16,
      isTemplate: true,
    },
    {
      id: "2",
      name: "Feelings & Emotions",
      category: "feelings",
      patient: "Liam Williams",
      gridSize: "3x3",
      cardsCount: 9,
      isTemplate: false,
    },
    {
      id: "3",
      name: "Daily Activities",
      category: "actions",
      patient: "Olivia Davis",
      gridSize: "4x4",
      cardsCount: 16,
      isTemplate: true,
    },
    {
      id: "4",
      name: "School Words",
      category: "objects",
      patient: "Noah Martinez",
      gridSize: "4x4",
      cardsCount: 16,
      isTemplate: false,
    },
  ];

  const filteredSets = cardSets.filter(
    (set) =>
      set.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      set.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categories
        .find((c) => c.id === set.category)
        ?.name.toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const getCategoryColor = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.color || "bg-gray-500";
  };

  const getCategoryIcon = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.icon || "📁";
  };

  return (
    <DashboardLayout title="Communication Boards">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search communication boards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-80"
            />
          </div>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Create Board</span>
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-600 mb-3">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <span>{category.icon}</span>
              <span className="text-sm font-medium text-gray-700">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSets.map((set) => (
          <div
            key={set.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 ${getCategoryColor(set.category)} rounded-xl flex items-center justify-center text-white text-xl`}
                >
                  {getCategoryIcon(set.category)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{set.name}</h3>
                  <p className="text-sm text-gray-500">{set.patient}</p>
                </div>
              </div>
              {set.isTemplate && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                  Template
                </span>
              )}
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>{set.category}</span>
                <span>{set.gridSize}</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: Math.min(16, set.cardsCount) }).map(
                  (_, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-lg ${i < 8 ? getCategoryColor(set.category) : "bg-gray-200"} flex items-center justify-center text-white text-xs font-medium`}
                    >
                      {i < 8 ? "★" : ""}
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
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

      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          <span>Quick Access Symbols</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: "Yes", icon: "👍", color: "bg-green-100" },
            { label: "No", icon: "👎", color: "bg-red-100" },
            { label: "Help", icon: "🙋", color: "bg-blue-100" },
            { label: "More", icon: "➕", color: "bg-yellow-100" },
            { label: "Stop", icon: "✋", color: "bg-orange-100" },
            { label: "All done", icon: "✅", color: "bg-purple-100" },
            { label: "Break", icon: "☕", color: "bg-pink-100" },
            { label: "Want", icon: "💭", color: "bg-indigo-100" },
            { label: "Feel", icon: "😊", color: "bg-teal-100" },
            { label: "Tired", icon: "😴", color: "bg-gray-100" },
            { label: "Hungry", icon: "🍽️", color: "bg-amber-100" },
            { label: "Thirsty", icon: "🥤", color: "bg-cyan-100" },
          ].map((symbol) => (
            <button
              key={symbol.label}
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
            >
              <div
                className={`w-12 h-12 ${symbol.color} rounded-xl flex items-center justify-center text-2xl mb-2`}
              >
                {symbol.icon}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {symbol.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
