import { Badge, Button } from "@/components/ui";
import { useFamilyAccess } from "@/lib/family-portal";
import type { FamilyPortalAccess } from "@/types/models";
import { useState } from "react";

interface FamilyPortalListProps {
  patientId?: string;
}

const RELATIONSHIP_LABELS: Record<FamilyPortalAccess["relationship"], string> =
  {
    parent: "Parent",
    guardian: "Guardian",
    sibling: "Sibling",
    grandparent: "Grandparent",
    other: "Other",
  };

const PERMISSION_LABELS: Record<string, string> = {
  view_goals: "View Goals",
  view_sessions: "View Sessions",
  view_schedule: "View Schedule",
  view_documents: "View Documents",
  view_assessments: "View Assessments",
  view_behavior: "View Behavior",
  view_medication: "View Medication",
  communicate: "Communicate",
  upload_documents: "Upload Documents",
  schedule_appointments: "Schedule Appointments",
  view_billing: "View Billing",
};

export function FamilyPortalList({ patientId }: FamilyPortalListProps) {
  const { data: accessList, isLoading } = useFamilyAccess(patientId || "");
  const [showInviteForm, setShowInviteForm] = useState(false);

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
        <h2 className="text-xl font-semibold">Family Portal Access</h2>
        <Button onClick={() => setShowInviteForm(!showInviteForm)}>
          {showInviteForm ? "Cancel" : "Invite Family Member"}
        </Button>
      </div>

      {showInviteForm && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="text-sm text-gray-600 mb-4">
            Family member invitation form coming soon.
          </p>
          <Button variant="ghost" onClick={() => setShowInviteForm(false)}>
            Close
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {accessList?.map((access: FamilyPortalAccess) => (
          <FamilyAccessCard key={access.id} access={access} />
        ))}
        {accessList?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No family members have portal access yet.</p>
            <p className="text-sm mt-1">
              Click "Invite Family Member" to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface FamilyAccessCardProps {
  access: FamilyPortalAccess;
}

function FamilyAccessCard({ access }: FamilyAccessCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium text-lg">User ID: {access.userId}</h3>
            <Badge variant="outline">
              {RELATIONSHIP_LABELS[access.relationship]}
            </Badge>
            {access.isActive ? (
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            ) : (
              <Badge variant="outline" className="text-gray-500">
                Inactive
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600">ID: {access.id}</p>
          <p className="text-sm text-gray-500 mt-1">
            Last accessed:{" "}
            {access.lastAccessedAt
              ? new Date(access.lastAccessedAt).toLocaleString()
              : "Never"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Collapse" : "Manage"}
        </Button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Permissions</h4>
          <div className="grid grid-cols-2 gap-2">
            {access.permissions.map((permission) => (
              <div key={permission} className="flex items-center gap-2 text-sm">
                <span className="text-green-600">✓</span>
                {PERMISSION_LABELS[permission] || permission}
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="ghost" size="sm">
              Edit Permissions
            </Button>
            <Button variant="ghost" size="sm" className="text-amber-600">
              {access.isActive ? "Deactivate" : "Activate"}
            </Button>
            <Button variant="ghost" size="sm" className="text-red-600">
              Revoke Access
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
