import { Badge, Button, Progress } from "@/components/ui";
import { useAssessments, useDeleteAssessment } from "@/lib/assessments";
import type { Assessment } from "@/types/models";
import { useState } from "react";

interface AssessmentsListProps {
  patientId?: string;
}

const TYPE_LABELS: Record<Assessment["type"], string> = {
  ados2: "ADOS-2",
  cars2: "CARS-2",
  vbmapp: "VB-MAPP",
  abllsr: "ABLLS-R",
  vineland3: "Vineland-3",
  ssis: "SSIS",
  custom: "Custom",
};

const STATUS_LABELS: Record<Assessment["status"], string> = {
  draft: "Draft",
  in_progress: "In Progress",
  completed: "Completed",
  scored: "Scored",
  archived: "Archived",
};

const STATUS_COLORS: Record<Assessment["status"], string> = {
  draft: "bg-gray-100 text-gray-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  scored: "bg-blue-100 text-blue-800",
  archived: "bg-gray-100 text-gray-600",
};

export function AssessmentsList({ patientId }: AssessmentsListProps) {
  const [filter, setFilter] = useState<Assessment["type"] | "all">("all");
  const { data: assessments, isLoading } = useAssessments(patientId);
  const deleteAssessment = useDeleteAssessment();

  const filteredAssessments = assessments?.filter(
    (assessment) => filter === "all" || assessment.type === filter,
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Assessments</h2>
        <Button>Create New Assessment</Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === "all" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        {Object.entries(TYPE_LABELS).map(([type, label]) => (
          <Button
            key={type}
            variant={filter === type ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter(type as Assessment["type"])}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredAssessments?.map((assessment) => (
          <AssessmentCard
            key={assessment.id}
            assessment={assessment}
            onDelete={() => deleteAssessment.mutate(assessment.id)}
          />
        ))}
        {filteredAssessments?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No assessments found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface AssessmentCardProps {
  assessment: Assessment;
  onDelete: () => void;
}

function AssessmentCard({ assessment, onDelete }: AssessmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate progress based on completed domains
  const totalDomains = assessment.domains?.length || 0;
  const completedDomains =
    assessment.domains?.filter((d: any) =>
      d.items?.every((item: any) => item.completed),
    ).length || 0;
  const progress =
    totalDomains > 0 ? (completedDomains / totalDomains) * 100 : 0;

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge>{TYPE_LABELS[assessment.type]}</Badge>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[assessment.status]}`}
            >
              {STATUS_LABELS[assessment.status]}
            </span>
          </div>
          <h3 className="font-medium text-lg">{assessment.title}</h3>
          {assessment.notes && (
            <p className="text-sm text-gray-600 mt-1">{assessment.notes}</p>
          )}

          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} max={100} />
          </div>

          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>By: {assessment.administeredBy}</span>
            <span>
              {assessment.dateAdministered
                ? new Date(assessment.dateAdministered).toLocaleDateString()
                : "Not scheduled"}
            </span>
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

      {isExpanded && assessment.scores && assessment.scores.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium mb-2">Scores</h4>
          <div className="grid grid-cols-2 gap-4">
            {assessment.scores.map((score: any, idx: number) => (
              <div key={idx} className="bg-gray-50 rounded p-3">
                <p className="text-sm font-medium">{score.domainId}</p>
                <p className="text-lg font-bold">{score.rawScore}</p>
                {score.percentile !== undefined && (
                  <p className="text-sm text-gray-600">
                    Percentile: {score.percentile}
                  </p>
                )}
              </div>
            ))}
          </div>

          {assessment.results && assessment.results.length > 0 && (
            <div className="mt-3">
              <h4 className="font-medium mb-1">Results</h4>
              {assessment.results.map(
                (result: any, idx: number) =>
                  result.notes && (
                    <p key={idx} className="text-sm text-gray-600">
                      {result.notes}
                    </p>
                  ),
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
