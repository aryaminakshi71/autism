import { Button, Input } from "@/components/ui";
import { useCreateSchedule, useUpdateSchedule } from "@/lib/schedules";
import type {
  ScheduleType,
  ScheduledActivity,
  VisualSchedule,
} from "@/types/models";
import { useState } from "react";

interface ScheduleFormProps {
  schedule?: VisualSchedule;
  patientId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const SCHEDULE_TYPES: ScheduleType[] = [
  "daily",
  "weekly",
  "first_then",
  "transition",
  "reward",
];

export function ScheduleForm({
  schedule,
  patientId,
  onSuccess,
  onCancel,
}: ScheduleFormProps) {
  const [formData, setFormData] = useState<Partial<VisualSchedule>>({
    patientId,
    name: schedule?.name || "",
    description: schedule?.description || "",
    type: schedule?.type || "daily",
    activities: schedule?.activities || [],
    isActive: schedule?.isActive ?? true,
  });

  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (schedule) {
      updateSchedule.mutate(
        { id: schedule.id, data: formData },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        },
      );
    } else {
      createSchedule.mutate(formData as Partial<VisualSchedule>, {
        onSuccess: () => {
          onSuccess?.();
        },
      });
    }
  };

  const addActivity = () => {
    const newActivity: ScheduledActivity = {
      id: crypto.randomUUID(),
      name: "",
      isRequired: true,
      transitionWarning: true,
      order: formData.activities?.length || 0,
    };
    setFormData((prev) => ({
      ...prev,
      activities: [...(prev.activities || []), newActivity],
    }));
  };

  const updateActivity = (
    index: number,
    field: keyof ScheduledActivity,
    value: unknown,
  ) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities?.map((activity, i) =>
        i === index ? { ...activity, [field]: value } : activity,
      ),
    }));
  };

  const removeActivity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities
        ?.filter((_, i) => i !== index)
        .map((activity, i) => ({ ...activity, order: i })),
    }));
  };

  const moveActivity = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (
      direction === "down" &&
      index === (formData.activities?.length || 0) - 1
    )
      return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const activities = [...(formData.activities || [])];
    const temp = activities[index];
    activities[index] = activities[newIndex];
    activities[newIndex] = temp;

    setFormData((prev) => ({
      ...prev,
      activities: activities.map((activity, i) => ({ ...activity, order: i })),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Schedule Name
          </label>
          <Input
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="e.g., Morning Routine"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={2}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Brief description of this schedule..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Schedule Type
          </label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                type: e.target.value as ScheduleType,
              }))
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            {SCHEDULE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type
                  .replace("_", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
              }
              className="rounded border-gray-300"
            />
            <span className="text-sm">Active</span>
          </label>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium">Activities</label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addActivity}
            >
              + Add Activity
            </Button>
          </div>
          <div className="space-y-3">
            {formData.activities?.map((activity, index) => (
              <div
                key={activity.id}
                className="border rounded-lg p-3 bg-gray-50"
              >
                <div className="flex items-start gap-2">
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => moveActivity(index, "up")}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <span className="text-sm font-medium text-center">
                      {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => moveActivity(index, "down")}
                      disabled={
                        index === (formData.activities?.length || 0) - 1
                      }
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      value={activity.name}
                      onChange={(e) =>
                        updateActivity(index, "name", e.target.value)
                      }
                      placeholder="Activity name"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        type="number"
                        value={activity.duration || ""}
                        onChange={(e) =>
                          updateActivity(
                            index,
                            "duration",
                            parseInt(e.target.value) || undefined,
                          )
                        }
                        placeholder="Duration (min)"
                      />
                      <Input
                        value={activity.imageUrl || ""}
                        onChange={(e) =>
                          updateActivity(index, "imageUrl", e.target.value)
                        }
                        placeholder="Image URL"
                      />
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={activity.isRequired}
                          onChange={(e) =>
                            updateActivity(
                              index,
                              "isRequired",
                              e.target.checked,
                            )
                          }
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">Required</span>
                      </label>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeActivity(index)}
                    className="text-red-600"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={createSchedule.isPending || updateSchedule.isPending}
        >
          {createSchedule.isPending || updateSchedule.isPending
            ? "Saving..."
            : schedule
              ? "Update Schedule"
              : "Create Schedule"}
        </Button>
      </div>
    </form>
  );
}
