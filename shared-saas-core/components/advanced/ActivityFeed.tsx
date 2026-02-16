"use client";

import { Activity, Clock, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { cn, getRelativeTime } from "../../utils";

interface ActivityItem {
  id: string;
  type: "create" | "update" | "delete" | "system" | "user";
  user: string;
  action: string;
  target?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface ActivityFeedProps {
  activities?: ActivityItem[];
  onLoadMore?: () => Promise<ActivityItem[]>;
  filters?: {
    type?: ActivityItem["type"][];
    user?: string[];
    dateRange?: { start: Date; end: Date };
  };
  className?: string;
  realTime?: boolean;
}

const typeIcons = {
  create: "➕",
  update: "✏️",
  delete: "🗑️",
  system: "⚙️",
  user: "👤",
};

const typeColors = {
  create: "bg-green-100 text-green-700",
  update: "bg-blue-100 text-blue-700",
  delete: "bg-red-100 text-red-700",
  system: "bg-gray-100 text-gray-700",
  user: "bg-purple-100 text-purple-700",
};

export function ActivityFeed({
  activities = [],
  onLoadMore,
  filters,
  className,
  realTime = false,
}: ActivityFeedProps) {
  const [displayedActivities, setDisplayedActivities] =
    useState<ActivityItem[]>(activities);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setDisplayedActivities(activities);
  }, [activities]);

  // Real-time updates simulation
  useEffect(() => {
    if (!realTime) return;

    const interval = setInterval(() => {
      // In real implementation, this would come from WebSocket
      // For now, we'll just refresh the activities
      if (onLoadMore) {
        onLoadMore().then((newActivities) => {
          setDisplayedActivities((prev) =>
            [...newActivities, ...prev].slice(0, 50),
          );
        });
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [realTime, onLoadMore]);

  const handleLoadMore = async () => {
    if (!onLoadMore) return;

    setLoading(true);
    try {
      const newActivities = await onLoadMore();
      setDisplayedActivities((prev) => [...prev, ...newActivities]);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = displayedActivities.filter((activity) => {
    if (filters?.type && !filters.type.includes(activity.type)) return false;
    if (filters?.user && !filters.user.includes(activity.user)) return false;
    if (filters?.dateRange) {
      const date = new Date(activity.timestamp);
      if (date < filters.dateRange.start || date > filters.dateRange.end)
        return false;
    }
    return true;
  });

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900 text-lg">Activity Feed</h3>
          {realTime && (
            <span className="rounded-full bg-green-100 px-2 py-1 font-medium text-green-700 text-xs">
              Live
            </span>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <Filter className="h-4 w-4" />
        </button>
      </div>

      {showFilters && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-gray-600 text-sm">Filter options coming soon...</p>
        </div>
      )}

      <div className="max-h-96 space-y-3 overflow-y-auto">
        {filteredActivities.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <Activity className="mx-auto mb-3 h-12 w-12 text-gray-300" />
            <p>No activities yet</p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-shadow hover:shadow-sm"
            >
              <div
                className={cn(
                  "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm",
                  typeColors[activity.type],
                )}
              >
                {typeIcons[activity.type]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {activity.user}
                  </span>
                  <span className="text-gray-600">{activity.action}</span>
                  {activity.target && (
                    <span className="text-gray-500 text-sm">
                      {activity.target}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-2 text-gray-500 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>{getRelativeTime(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {onLoadMore && (
        <button
          onClick={handleLoadMore}
          disabled={loading}
          className="w-full py-2 font-medium text-blue-600 text-sm hover:text-blue-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
