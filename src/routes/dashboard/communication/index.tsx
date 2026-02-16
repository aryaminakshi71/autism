import { createFileRoute } from "@tanstack/react-router";
import { Copy, Edit, MessageSquare, Plus, Search, Trash } from "lucide-react";
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
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search communication boards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 rounded-xl border border-gray-200 py-2 pr-4 pl-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <button className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700">
          <Plus className="h-5 w-5" />
          <span>Create Board</span>
        </button>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 font-semibold text-gray-600 text-sm">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              className="flex items-center space-x-2 rounded-xl border border-gray-200 bg-white px-4 py-2 transition-colors hover:bg-gray-50"
            >
              <span>{category.icon}</span>
              <span className="font-medium text-gray-700 text-sm">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSets.map((set) => (
          <div
            key={set.id}
            className="group cursor-pointer rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`h-12 w-12 ${getCategoryColor(set.category)} flex items-center justify-center rounded-xl text-white text-xl`}
                >
                  {getCategoryIcon(set.category)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{set.name}</h3>
                  <p className="text-gray-500 text-sm">{set.patient}</p>
                </div>
              </div>
              {set.isTemplate && (
                <span className="rounded-full bg-indigo-100 px-2 py-1 font-medium text-indigo-700 text-xs">
                  Template
                </span>
              )}
            </div>

            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between text-gray-600 text-sm">
                <span>{set.category}</span>
                <span>{set.gridSize}</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: Math.min(16, set.cardsCount) }).map(
                  (_, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-lg ${i < 8 ? getCategoryColor(set.category) : "bg-gray-200"} flex items-center justify-center font-medium text-white text-xs`}
                    >
                      {i < 8 ? "★" : ""}
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-gray-100 border-t pt-4 opacity-0 transition-opacity group-hover:opacity-100">
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

      <div className="mt-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 flex items-center space-x-2 font-semibold text-gray-900">
          <MessageSquare className="h-5 w-5 text-indigo-600" />
          <span>Quick Access Symbols</span>
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
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
              className="flex flex-col items-center justify-center rounded-xl border border-gray-200 p-4 transition-colors hover:border-indigo-300 hover:bg-indigo-50"
            >
              <div
                className={`h-12 w-12 ${symbol.color} mb-2 flex items-center justify-center rounded-xl text-2xl`}
              >
                {symbol.icon}
              </div>
              <span className="font-medium text-gray-700 text-sm">
                {symbol.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
