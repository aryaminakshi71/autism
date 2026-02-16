import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { DashboardLayout } from "~/components/dashboard/dashboard-layout";

const AnalyticsChart = lazy(
  () => import("~/components/dashboard/analytics-chart"),
);

export const Route = createFileRoute("/dashboard/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const stats = [
    { label: "Total Users", value: "1,234", change: "+12.5%" },
    { label: "Active Sessions", value: "856", change: "+8.2%" },
    { label: "Revenue", value: "$45,678", change: "+15.3%" },
    { label: "Conversion Rate", value: "3.2%", change: "+0.5%" },
  ];

  const chartData = [
    { name: "Mon", value: 45 },
    { name: "Tue", value: 52 },
    { name: "Wed", value: 48 },
    { name: "Thu", value: 61 },
    { name: "Fri", value: 55 },
    { name: "Sat", value: 38 },
    { name: "Sun", value: 42 },
  ];

  return (
    <DashboardLayout title="Analytics">
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-white p-6 shadow">
            <div className="mb-1 text-gray-600 text-sm">{stat.label}</div>
            <div className="mb-1 font-bold text-2xl text-gray-900">
              {stat.value}
            </div>
            <div className="text-green-600 text-sm">{stat.change}</div>
          </div>
        ))}
      </div>

      <Suspense
        fallback={
          <div className="rounded-lg bg-white p-6 shadow">Loading chart…</div>
        }
      >
        <AnalyticsChart data={chartData} />
      </Suspense>
    </DashboardLayout>
  );
}
