import { Button, Input } from "@/components/ui";
import { useCreateAssessment, useUpdateAssessment } from "@/lib/assessments";
import type {
  Assessment,
  AssessmentScore,
  AssessmentStatus,
  AssessmentType,
} from "@/types/models";
import { useState } from "react";

interface AssessmentFormProps {
  assessment?: Assessment;
  patientId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ASSESSMENT_TYPES: { value: AssessmentType; label: string }[] = [
  { value: "ados2", label: "ADOS-2" },
  { value: "cars2", label: "CARS-2" },
  { value: "vbmapp", label: "VB-MAPP" },
  { value: "abllsr", label: "ABLLS-R" },
  { value: "vineland3", label: "Vineland-3" },
  { value: "ssis", label: "SSIS" },
  { value: "custom", label: "Custom" },
];

const ASSESSMENT_STATUSES: AssessmentStatus[] = [
  "draft",
  "in_progress",
  "completed",
  "scored",
  "archived",
];

export function AssessmentForm({
  assessment,
  patientId,
  onSuccess,
  onCancel,
}: AssessmentFormProps) {
  const [formData, setFormData] = useState<Partial<Assessment>>({
    patientId,
    type: assessment?.type || "custom",
    title: assessment?.title || "",
    notes: assessment?.notes || "",
    administeredBy: assessment?.administeredBy || "",
    dateAdministered:
      assessment?.dateAdministered || new Date().toISOString().split("T")[0],
    status: assessment?.status || "draft",
    results: assessment?.results || [],
    domains: assessment?.domains || [],
    scores: assessment?.scores || [],
  });

  const createAssessment = useCreateAssessment();
  const updateAssessment = useUpdateAssessment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (assessment) {
      updateAssessment.mutate(
        { id: assessment.id, data: formData },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        },
      );
    } else {
      createAssessment.mutate(
        formData as Omit<Assessment, "id" | "createdAt" | "updatedAt">,
        {
          onSuccess: () => {
            onSuccess?.();
          },
        },
      );
    }
  };

  const addScore = () => {
    const newScore: AssessmentScore = {
      domainId: crypto.randomUUID(),
      rawScore: 0,
    };
    setFormData((prev) => ({
      ...prev,
      scores: [...(prev.scores || []), newScore],
    }));
  };

  const updateScore = (
    index: number,
    field: keyof AssessmentScore,
    value: unknown,
  ) => {
    setFormData((prev) => ({
      ...prev,
      scores: prev.scores?.map((score, i) =>
        i === index ? { ...score, [field]: value } : score,
      ),
    }));
  };

  const removeScore = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      scores: prev.scores?.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Assessment Title
          </label>
          <Input
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="e.g., Initial Assessment"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                type: e.target.value as AssessmentType,
              }))
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            {ASSESSMENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                status: e.target.value as AssessmentStatus,
              }))
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            {ASSESSMENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status
                  .replace("_", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Administrator
          </label>
          <Input
            value={formData.administeredBy}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                administeredBy: e.target.value,
              }))
            }
            placeholder="Name of assessor"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <Input
            type="date"
            value={formData.dateAdministered}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                dateAdministered: e.target.value,
              }))
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Assessment notes..."
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium">Scores</label>
            <Button type="button" variant="ghost" size="sm" onClick={addScore}>
              + Add Score
            </Button>
          </div>
          <div className="space-y-3">
            {formData.scores?.map((score, index) => (
              <div key={index} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={score.domainId}
                      onChange={(e) =>
                        updateScore(index, "domainId", e.target.value)
                      }
                      placeholder="Domain ID"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        value={score.rawScore}
                        onChange={(e) =>
                          updateScore(
                            index,
                            "rawScore",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        placeholder="Raw Score"
                      />
                      <Input
                        type="number"
                        value={score.percentile || ""}
                        onChange={(e) =>
                          updateScore(
                            index,
                            "percentile",
                            parseInt(e.target.value) || undefined,
                          )
                        }
                        placeholder="Percentile"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeScore(index)}
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
          disabled={createAssessment.isPending || updateAssessment.isPending}
        >
          {createAssessment.isPending || updateAssessment.isPending
            ? "Saving..."
            : assessment
              ? "Update Assessment"
              : "Create Assessment"}
        </Button>
      </div>
    </form>
  );
}
