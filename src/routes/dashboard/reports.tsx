import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Download, FileText, Loader2, Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { DashboardLayout } from "~/components/dashboard/dashboard-layout";

interface Report {
  id: string;
  name: string;
  type: string;
  date: string;
  status: "Generated" | "Processing" | "Failed";
}

export const Route = createFileRoute("/dashboard/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([
    {
      id: "RPT001",
      name: "Monthly Performance Summary",
      type: "Summary",
      date: "2026-01-01",
      status: "Generated",
    },
    {
      id: "RPT002",
      name: "Q4 Analysis",
      type: "Analytics",
      date: "2025-12-15",
      status: "Generated",
    },
    {
      id: "RPT003",
      name: "User Engagement Metrics",
      type: "Analytics",
      date: "2025-12-01",
      status: "Processing",
    },
    {
      id: "RPT004",
      name: "Weekly Activity Log",
      type: "Activity",
      date: "2026-01-20",
      status: "Generated",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async (type: string) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const newReport: Report = {
        id: `RPT${(reports.length + 1).toString().padStart(3, "0")}`,
        name: `${type} Report - ${new Date().toLocaleDateString()}`,
        type,
        date: new Date().toISOString().split("T")[0],
        status: "Generated",
      };
      setReports((prev) => [newReport, ...prev]);
      toast.success(
        `Report generated successfully! Report ID: ${newReport.id}`,
      );
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = (reportId: string) => {
    const report = reports.find((r) => r.id === reportId);
    if (report && report.status === "Generated") {
      toast.success(`Downloading report: ${report.name}`);
    } else {
      toast.error("Report is not ready for download yet.");
    }
  };

  const handleDeleteReport = (reportId: string) => {
    if (confirm("Are you sure you want to delete this report?")) {
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      toast.success("Report deleted successfully");
    }
  };

  return (
    <DashboardLayout title="Reports">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900 text-lg">
            Generate reports
          </h2>
          <p className="mt-1 text-gray-600">
            Create and track operational reports in seconds.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleGenerateReport("Summary")}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            Generate Summary
          </button>
          <button
            onClick={() => handleGenerateReport("Analytics")}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <BarChart3 className="h-4 w-4" />
            )}
            Generate Analytics
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase">
                Report Name
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-center font-medium text-gray-500 text-xs uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {report.name}
                </td>
                <td className="px-6 py-4 text-gray-600">{report.type}</td>
                <td className="px-6 py-4 text-gray-600">{report.date}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2 py-1 font-medium text-xs ${
                      report.status === "Generated"
                        ? "bg-green-100 text-green-800"
                        : report.status === "Processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    {report.status === "Generated" ? (
                      <button
                        onClick={() => handleDownloadReport(report.id)}
                        className="flex items-center justify-center gap-1 text-blue-600 text-sm hover:text-blue-800"
                      >
                        <Download className="h-4 w-4" /> Download
                      </button>
                    ) : report.status === "Processing" ? (
                      <span className="flex items-center justify-center gap-1 text-sm text-yellow-600">
                        <Loader2 className="h-4 w-4 animate-spin" /> Processing
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1 text-red-600 text-sm">
                        Failed
                      </span>
                    )}
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="rounded p-1 text-red-500 hover:bg-red-50 hover:text-red-700"
                      title="Delete"
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
