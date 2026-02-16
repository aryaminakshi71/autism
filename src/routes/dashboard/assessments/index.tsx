import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar,
  ClipboardCheck,
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
        <div className="mt-3 border-gray-100 border-t pt-3">
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
        <div className="mt-3 border-gray-100 border-t pt-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Score: {results.overallScore}/60
            </span>
            <span className="rounded-full bg-purple-100 px-2 py-1 font-medium text-purple-700 text-xs">
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
        <div className="mt-3 border-gray-100 border-t pt-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Score: {results.score}/20</span>
            <span
              className={`rounded-full px-2 py-1 font-medium text-xs ${results.riskLevel === "High Risk" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
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
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search assessments..."
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
          <span>Schedule Assessment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAssessments.map((assessment) => (
          <div
            key={assessment.id}
            className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <ClipboardCheck className="h-6 w-6" />
                </div>
                <div>
                  <span
                    className={`rounded-full px-2 py-1 font-medium text-xs ${getTypeColor(assessment.type)}`}
                  >
                    {assessment.type}
                  </span>
                  <h3 className="mt-1 font-semibold text-gray-900">
                    {assessment.name}
                  </h3>
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 font-medium text-xs ${getStatusColor(assessment.status)}`}
              >
                {assessment.status}
              </span>
            </div>

            <div className="mb-4 space-y-2">
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <User className="h-4 w-4 text-gray-400" />
                <span>
                  Patient: <strong>{assessment.patient}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <User className="h-4 w-4 text-gray-400" />
                <span>
                  Provider: <strong>{assessment.provider}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <FileText className="h-4 w-4 text-gray-400" />
                <span>Version: {assessment.version}</span>
              </div>
            </div>

            <div className="mb-3 flex items-center space-x-2 text-gray-600 text-sm">
              {assessment.status === "scheduled" ? (
                <>
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span>
                    Scheduled:{" "}
                    <strong>{formatDate(assessment.scheduledDate)}</strong>
                  </span>
                </>
              ) : assessment.status === "completed" ? (
                <>
                  <Calendar className="h-4 w-4 text-green-500" />
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
              <div className="mt-4 flex justify-end border-gray-100 border-t pt-4">
                <button className="flex items-center space-x-1 font-medium text-indigo-600 text-sm hover:text-indigo-800">
                  <Download className="h-4 w-4" />
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
