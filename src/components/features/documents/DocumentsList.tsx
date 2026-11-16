import { Badge, Button } from "@/components/ui";
import { useDeleteDocument, useDocuments } from "@/lib/documents";
import type { Document, DocumentCategory } from "@/types/models";
import { useState } from "react";

interface DocumentsListProps {
  patientId?: string;
}

const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  assessment: "Assessment",
  report: "Report",
  iep: "IEP",
  medical: "Medical",
  insurance: "Insurance",
  consent: "Consent",
  photo: "Photo",
  video: "Video",
  other: "Other",
};

const CATEGORY_COLORS: Record<DocumentCategory, string> = {
  assessment: "bg-purple-100 text-purple-800",
  report: "bg-blue-100 text-blue-800",
  iep: "bg-indigo-100 text-indigo-800",
  medical: "bg-red-100 text-red-800",
  insurance: "bg-green-100 text-green-800",
  consent: "bg-yellow-100 text-yellow-800",
  photo: "bg-pink-100 text-pink-800",
  video: "bg-orange-100 text-orange-800",
  other: "bg-gray-100 text-gray-800",
};

export function DocumentsList({ patientId }: DocumentsListProps) {
  const [filter, setFilter] = useState<DocumentCategory | "all">("all");
  const { data: documents, isLoading } = useDocuments(patientId || "");
  const deleteDocument = useDeleteDocument();

  const filteredDocuments = documents?.filter(
    (doc) => filter === "all" || doc.category === filter,
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Documents</h2>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          {(Object.keys(CATEGORY_LABELS) as DocumentCategory[]).map(
            (category) => (
              <Button
                key={category}
                variant={filter === category ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(category)}
              >
                {CATEGORY_LABELS[category]}
              </Button>
            ),
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredDocuments?.map((document) => (
          <DocumentCard
            key={document.id}
            document={document}
            onDelete={() => deleteDocument.mutate(document.id)}
          />
        ))}
        {filteredDocuments?.length === 0 && (
          <p className="text-center text-gray-500 py-8">No documents found</p>
        )}
      </div>
    </div>
  );
}

interface DocumentCardProps {
  document: Document;
  onDelete: () => void;
}

function DocumentCard({ document, onDelete }: DocumentCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={CATEGORY_COLORS[document.category]}>
              {CATEGORY_LABELS[document.category]}
            </Badge>
            {document.isConfidential && (
              <Badge
                variant="outline"
                className="text-amber-600 border-amber-600"
              >
                Confidential
              </Badge>
            )}
          </div>
          <h3 className="font-medium text-lg">{document.name}</h3>
          {document.description && (
            <p className="text-sm text-gray-600 mt-1">{document.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>By: {document.uploadedBy}</span>
            <span>{new Date(document.createdAt).toLocaleDateString()}</span>
            <span>{(document.fileSize / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href={document.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
          >
            View
          </a>
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

      {document.tags && document.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {document.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
