import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar,
  ClipboardCheck,
  Clock,
  Download,
  FileText,
  Plus,
  Search,
  User,
} from "lucide-react";
import { useState } from "react";
import { DashboardLayout } from "~/components/dashboard/dashboard-layout";

export const Route = createFileRoute("/dashboard/assessments/")({
  component: AssessmentsPage,
});

function AssessmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const assessments = [
    {
      id: "1",
      patient: "Emma Johnson",
      type: "ADOS-2",
      name: "Autism Diagnostic Observation Schedule",
      provider: "Dr. Sarah Smith",
      version: "Module 1",
      scheduledDate: "2024-02-01T09:00:00",
      status: "scheduled",
      results: null,
    },
    {
      id: "2",
      patient: "Liam Williams",
      type: "VB-MAPP",
      name: "Verbal Behavior Milestones Assessment",
      provider: "Dr. Michael Brown",
      version: "2.0",
      completedDate: "2024-01-10T14:00:00",
      status: "completed",
      results: {
        overallScore: 78,
        percentile: 65,
        verbal: 82,
        social: 68,
        play: 75,
      },
    },
    {
      id: "3",
      patient: "Olivia Davis",
      type: "PEP-R",
      name: "Psychoeducational Profile - Revised",
      provider: "Dr. Sarah Smith",
      version: "3rd Edition",
      scheduledDate: "2024-01-20T10:00:00",
      status: "scheduled",
      results: null,
    },
    {
      id: "4",
      patient: "Noah Martinez",
      type: "M-CHAT",
      name: "Modified Checklist for Autism in Toddlers",
      provider: "Screening Tool",
      version: "R/F",
      completedDate: "2024-01-05T11:00:00",
      status: "completed",
      results: {
        score: 8,
        riskLevel: "High Risk",
        recommendation: "Full diagnostic evaluation recommended",
      },
    },
    {
      id: "5",
      patient: "Emma Johnson",
      type: "CARS-2",
      name: "Childhood Autism Rating Scale",
      provider: "Dr. Michael Brown",
      version: "Standard",
      completedDate: "2023-12-15T15:00:00",
      status: "completed",
      results: {
        overallScore: 28,
        rating: "Mild to Moderate Autism",
      },
    },
    {
      id: "6",
      patient: "Liam Williams",
      type: "SRS-2",
      name: "Social Responsiveness Scale",
      provider: "Parent Report",
      version: "2nd Edition",
      status: "in-progress",
      results: null,
    },
  ];

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch =
      assessment.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || assessment.status === statusFilter;
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

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "ADOS-2": "bg-purple-100 text-purple-700",
      "VB-MAPP": "bg-indigo-100 text-indigo-700",
      "PEP-R": "bg-pink-100 text-pink-700",
      "M-CHAT": "bg-orange-100 text-orange-700",
      "CARS-2": "bg-teal-100 text-teal-700",
      "SRS-2": "bg-cyan-100 text-cyan-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not scheduled";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderResults = (assessment: (typeof assessments)[0]) => {
    if (!assessment.results) return null;

    if (
      assessment.type === "VB-MAPP" &&
      typeof assessment.results === "object" &&
      "overallScore" in assessment.results
    ) {
      const results = assessment.results as {
        overallScore: number;
        percentile: number;
        verbal: number;
        social: number;
        play: number;
      };
      return (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-4 gap-2 text-sm">
            <div className="text-center">
              <p className="text-gray-500">Overall</p>
              <p className="font-semibold text-gray-900">
                {results.overallScore}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Percentile</p>
              <p className="font-semibold text-gray-900">
                {results.percentile}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Verbal</p>
              <p className="font-semibold text-gray-900">{results.verbal}%</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Social</p>
              <p className="font-semibold text-gray-900">{results.social}%</p>
            </div>
          </div>
        </div>
      );
    }

    if (
      assessment.type === "CARS-2" &&
      typeof assessment.results === "object" &&
      "overallScore" in assessment.results
    ) {
      const results = assessment.results as {
        overallScore: number;
        rating: string;
      };
      return (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Score: {results.overallScore}/60
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              {results.rating}
            </span>
          </div>
        </div>
      );
    }

    if (
      assessment.type === "M-CHAT" &&
      typeof assessment.results === "object" &&
      "score" in assessment.results
    ) {
      const results = assessment.results as {
        score: number;
        riskLevel: string;
        recommendation: string;
      };
      return (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Score: {results.score}/20</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${results.riskLevel === "High Risk" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
            >
              {results.riskLevel}
            </span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <DashboardLayout title="Assessments & Screeners">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search assessments..."
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
          <span>Schedule Assessment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssessments.map((assessment) => (
          <div
            key={assessment.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                  <ClipboardCheck className="w-6 h-6" />
                </div>
                <div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(assessment.type)}`}
                  >
                    {assessment.type}
                  </span>
                  <h3 className="font-semibold text-gray-900 mt-1">
                    {assessment.name}
                  </h3>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assessment.status)}`}
              >
                {assessment.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4 text-gray-400" />
                <span>
                  Patient: <strong>{assessment.patient}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4 text-gray-400" />
                <span>
                  Provider: <strong>{assessment.provider}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FileText className="w-4 h-4 text-gray-400" />
                <span>Version: {assessment.version}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
              {assessment.status === "scheduled" ? (
                <>
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>
                    Scheduled:{" "}
                    <strong>{formatDate(assessment.scheduledDate)}</strong>
                  </span>
                </>
              ) : assessment.status === "completed" ? (
                <>
                  <Calendar className="w-4 h-4 text-green-500" />
                  <span>
                    Completed:{" "}
                    <strong>{formatDate(assessment.completedDate)}</strong>
                  </span>
                </>
              ) : (
                <span className="text-yellow-600">In Progress</span>
              )}
            </div>

            {renderResults(assessment)}

            {assessment.status === "completed" && assessment.results && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                <button className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  <Download className="w-4 h-4" />
                  <span>Download Report</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
