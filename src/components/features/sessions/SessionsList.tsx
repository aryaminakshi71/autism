import { Button } from "@/components/ui";
import { useDeleteSession, useSessions } from "@/lib/sessions";
import type { Session, SessionStatus } from "@/types/models";
import { useState } from "react";

interface SessionsListProps {
  patientId?: string;
}

const STATUS_FILTERS: (SessionStatus | "all")[] = [
  "all",
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
];

const statusColors: Record<SessionStatus, string> = {
  scheduled: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
  no_show: "bg-red-100 text-red-800",
  rescheduled: "bg-purple-100 text-purple-800",
};

export function SessionsList({ patientId }: SessionsListProps) {
  const [filter, setFilter] = useState<SessionStatus | "all">("all");
  const { data: sessions, isLoading } = useSessions(patientId || "");
  const deleteSession = useDeleteSession();

  const filteredSessions = sessions?.filter(
    (session) => filter === "all" || session.status === filter,
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
        <h2 className="text-xl font-semibold">Sessions</h2>
        <div className="flex gap-2">
          {STATUS_FILTERS.map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status.replace("_", " ")}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredSessions?.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            onDelete={() => deleteSession.mutate(session.id)}
          />
        ))}
        {filteredSessions?.length === 0 && (
          <p className="text-center text-gray-500 py-8">No sessions found</p>
        )}
      </div>
    </div>
  );
}

interface SessionCardProps {
  session: Session;
  onDelete: () => void;
}

function SessionCard({ session, onDelete }: SessionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${statusColors[session.status]}`}
            >
              {session.status.replace("_", " ")}
            </span>
            <span className="text-sm text-gray-600">
              {session.scheduledDate
                ? new Date(session.scheduledDate).toLocaleDateString()
                : "No date"}
            </span>
          </div>
          <h3 className="font-medium">{session.type}</h3>
          <p className="text-sm text-gray-600">
            Therapist ID: {session.therapistId}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Collapse" : "Expand"}
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
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Duration:</span>{" "}
              {session.duration || "N/A"} minutes
            </div>
            <div>
              <span className="font-medium">Date:</span>{" "}
              {session.scheduledDate
                ? new Date(session.scheduledDate).toLocaleString()
                : "N/A"}
            </div>
            {session.location && (
              <div>
                <span className="font-medium">Location:</span>{" "}
                {typeof session.location === "string"
                  ? session.location
                  : session.location.type}
              </div>
            )}
          </div>
          {session.notes && (
            <div className="mt-3">
              <span className="font-medium">Notes:</span>
              <p className="text-gray-600 mt-1">
                {session.notes.subjective ||
                  session.notes.objective ||
                  session.notes.assessment ||
                  session.notes.plan ||
                  "No notes"}
              </p>
            </div>
          )}
          {session.activities && session.activities.length > 0 && (
            <div className="mt-3">
              <span className="font-medium">Activities:</span>
              <ul className="mt-1 space-y-1">
                {session.activities.map((activity, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-gray-600 flex items-center gap-2"
                  >
                    <span>{activity.name}</span>
                    {activity.outcome && (
                      <span className="text-green-600 text-xs">
                        {activity.outcome}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
