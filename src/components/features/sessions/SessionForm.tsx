import { Button, Input } from "@/components/ui";
import { useCreateSession, useUpdateSession } from "@/lib/sessions";
import type {
  Session,
  SessionActivity,
  SessionStatus,
  SessionType,
} from "@/types/models";
import { useState } from "react";

interface SessionFormProps {
  session?: Session;
  patientId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const SESSION_TYPES: SessionType[] = [
  "individual",
  "group",
  "family",
  "assessment",
  "consultation",
  "telehealth",
];

export function SessionForm({
  session,
  patientId,
  onSuccess,
  onCancel,
}: SessionFormProps) {
  const [formData, setFormData] = useState<Partial<Session>>({
    patientId,
    type: session?.type || "individual",
    scheduledDate:
      session?.scheduledDate || new Date().toISOString().split("T")[0],
    duration: session?.duration || 60,
    therapistId: session?.therapistId || "",
    status: session?.status || "scheduled",
    activities: session?.activities || [],
  });

  const createSession = useCreateSession();
  const updateSession = useUpdateSession();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (session) {
      updateSession.mutate(
        { id: session.id, data: formData },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        },
      );
    } else {
      createSession.mutate(formData as Partial<Session>, {
        onSuccess: () => {
          onSuccess?.();
        },
      });
    }
  };

  const addActivity = () => {
    const newActivity: SessionActivity = {
      id: crypto.randomUUID(),
      name: "",
    };
    setFormData((prev) => ({
      ...prev,
      activities: [...(prev.activities || []), newActivity],
    }));
  };

  const updateActivity = (
    index: number,
    field: keyof SessionActivity,
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
      activities: prev.activities?.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Session Type</label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                type: e.target.value as SessionType,
              }))
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            <option value="">Select type...</option>
            {SESSION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <Input
              type="date"
              value={formData.scheduledDate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  scheduledDate: e.target.value,
                }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Duration (minutes)
            </label>
            <Input
              type="number"
              min="15"
              step="15"
              value={formData.duration}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  duration: parseInt(e.target.value),
                }))
              }
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Therapist ID</label>
          <Input
            value={formData.therapistId}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, therapistId: e.target.value }))
            }
            placeholder="Enter therapist ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                status: e.target.value as SessionStatus,
              }))
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            {[
              "scheduled",
              "in_progress",
              "completed",
              "cancelled",
              "no_show",
              "rescheduled",
            ].map((status) => (
              <option key={status} value={status}>
                {status
                  .replace("_", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            value={formData.notes?.subjective || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                notes: { ...prev.notes, subjective: e.target.value },
              }))
            }
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Session notes..."
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
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
          <div className="space-y-2">
            {formData.activities?.map((activity, index) => (
              <div key={activity.id} className="flex items-center gap-2">
                <Input
                  value={activity.name}
                  onChange={(e) =>
                    updateActivity(index, "name", e.target.value)
                  }
                  placeholder="Activity name"
                  className="flex-1"
                />
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
                  placeholder="Min"
                  className="w-20"
                />
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
          disabled={createSession.isPending || updateSession.isPending}
        >
          {createSession.isPending || updateSession.isPending
            ? "Saving..."
            : session
              ? "Update Session"
              : "Create Session"}
        </Button>
      </div>
    </form>
  );
}
