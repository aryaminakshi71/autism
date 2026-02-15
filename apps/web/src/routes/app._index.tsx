/**
 * Dashboard Route
 *
 * Main dashboard showing key metrics and recent activity.
 */

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, Loading, LoadingSkeleton } from "@autism-legacy-20260205/ui";
import { Users, Target, TrendingUp, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { dashboardApi } from "../lib/api";

export const Route = createFileRoute("/app/_index")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: statsData, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => dashboardApi.getStats(),
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's a snapshot of care activity today.</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Failed to load dashboard data. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      name: "Total Learners",
      value: statsData?.totalContacts?.toLocaleString() || "0",
      change: `${(statsData?.contactsChange ?? 0) >= 0 ? "+" : ""}${statsData?.contactsChange ?? 0}%`,
      trend: (statsData?.contactsChange ?? 0) >= 0 ? "up" : "down",
      icon: Users,
    },
    {
      name: "Active Care Plans",
      value: statsData?.activeDeals?.toString() || "0",
      change: `${(statsData?.dealsChange ?? 0) >= 0 ? "+" : ""}${statsData?.dealsChange ?? 0}%`,
      trend: (statsData?.dealsChange ?? 0) >= 0 ? "up" : "down",
      icon: Target,
    },
    {
      name: "Goal Progress Rate",
      value: `${statsData?.conversionRate ?? 0}%`,
      change: `${(statsData?.conversionChange ?? 0) >= 0 ? "+" : ""}${statsData?.conversionChange ?? 0}%`,
      trend: (statsData?.conversionChange ?? 0) >= 0 ? "up" : "down",
      icon: TrendingUp,
    },
    {
      name: "Sessions Delivered",
      value: `${statsData?.revenue?.toLocaleString() || "0"}`,
      change: `${(statsData?.revenueChange ?? 0) >= 0 ? "+" : ""}${statsData?.revenueChange ?? 0}%`,
      trend: (statsData?.revenueChange ?? 0) >= 0 ? "up" : "down",
      icon: Clock,
    },
  ];

  const recentActivities = statsData?.recentActivities || [];
  const pipeline = statsData?.pipeline || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's a snapshot of care activity today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="text-gray-500 text-sm">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity: { id: string; message: string; time: string }) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Care Pathway Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Care Pathway Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipeline.length > 0 ? (
                pipeline.map((stage: { stage: string; value: number; count: number }) => {
                  const totalValue = pipeline.reduce((sum: number, s: { value: number }) => sum + s.value, 0);
                  const percentage = totalValue > 0 ? (stage.value / totalValue) * 100 : 0;
                  return (
                    <div key={stage.stage} className="flex items-center gap-4">
                      <div className="w-24 text-sm font-medium text-gray-600 capitalize">
                        {stage.stage}
                      </div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{stage.value.toLocaleString()} hours</p>
                        <p className="text-xs text-gray-500">{stage.count} plans</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm">No care plans in pathway</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's a snapshot of care activity today.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <LoadingSkeleton className="h-20" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <LoadingSkeleton key={i} className="h-12" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Care Pathway Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <LoadingSkeleton key={i} className="h-8" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
