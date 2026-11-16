import { Badge, Button } from "@/components/ui";
import { useDeleteSchedule, useSchedules } from "@/lib/schedules";
import type {
  ScheduleType,
  ScheduledActivity,
  VisualSchedule,
} from "@/types/models";
import { useState } from "react";

interface SchedulesListProps {
  patientId?: string;
}

export function SchedulesList({ patientId }: SchedulesListProps) {
  const { data: schedules, isLoading } = useSchedules(patientId || "");
  const deleteSchedule = useDeleteSchedule();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Visual Schedules</h2>
        <Button>Create New Schedule</Button>
      </div>

      <div className="grid gap-4">
        {schedules?.map((schedule: VisualSchedule) => (
          <ScheduleCard
            key={schedule.id}
            schedule={schedule}
            onDelete={() => deleteSchedule.mutate(schedule.id)}
          />
        ))}
        {schedules?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No visual schedules created yet.</p>
            <p className="text-sm mt-1">
              Create schedules to help with daily routines and transitions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface ScheduleCardProps {
  schedule: VisualSchedule;
  onDelete: () => void;
}

function ScheduleCard({ schedule, onDelete }: ScheduleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const typeLabels: Record<ScheduleType, string> = {
    daily: "Daily",
    weekly: "Weekly",
    first_then: "First/Then",
    transition: "Transition",
    reward: "Reward",
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium text-lg">{schedule.name}</h3>
            {schedule.isActive && (
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            )}
            <Badge variant="outline">{typeLabels[schedule.type]}</Badge>
          </div>
          <p className="text-sm text-gray-600">{schedule.description}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>{schedule.activities.length} activities</span>
            <span>Layout: {schedule.settings ? "Custom" : "Default"}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Collapse" : "View"}
          </Button>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-600 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t">
          <div className="space-y-2">
            {schedule.activities.map(
              (activity: ScheduledActivity, index: number) => (
                <ScheduleItemRow
                  key={activity.id}
                  activity={activity}
                  index={index}
                  isLast={index === schedule.activities.length - 1}
                />
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface ScheduleItemRowProps {
  activity: ScheduledActivity;
  index: number;
  isLast: boolean;
}

function ScheduleItemRow({ activity, index, isLast }: ScheduleItemRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-medium">
          {index + 1}
        </div>
        {!isLast && <div className="w-0.5 h-8 bg-gray-300 my-1" />}
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-center gap-2">
          {activity.imageUrl && (
            <img
              src={activity.imageUrl}
              alt={activity.name}
              className="w-10 h-10 rounded object-cover"
            />
          )}
          <div>
            <p className="font-medium">{activity.name}</p>
            <p className="text-sm text-gray-600">
              {activity.duration} minutes
              {!activity.isRequired && (
                <span className="ml-2 text-amber-600">(Optional)</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
