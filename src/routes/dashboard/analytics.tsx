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
    { label: "Active Learners", value: "124", change: "+6.4%" },
    { label: "Sessions This Week", value: "86", change: "+9.1%" },
    { label: "Goals Mastered", value: "42", change: "+11.8%" },
    { label: "Family Check-ins", value: "57", change: "+4.2%" },
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
