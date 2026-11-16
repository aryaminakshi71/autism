import { Button, Input } from "@/components/ui";
import { useUploadDocument } from "@/lib/documents";
import type { Document, DocumentCategory } from "@/types/models";
import { useState } from "react";

interface DocumentFormProps {
  document?: Document;
  patientId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CATEGORIES: { value: DocumentCategory; label: string }[] = [
  { value: "assessment", label: "Assessment" },
  { value: "report", label: "Report" },
  { value: "iep", label: "IEP" },
  { value: "medical", label: "Medical" },
  { value: "insurance", label: "Insurance" },
  { value: "consent", label: "Consent" },
  { value: "photo", label: "Photo" },
  { value: "video", label: "Video" },
  { value: "other", label: "Other" },
];

export function DocumentForm({
  document,
  patientId,
  onSuccess,
  onCancel,
}: DocumentFormProps) {
  const [formData, setFormData] = useState<Partial<Document>>({
    patientId,
    name: document?.name || "",
    description: document?.description || "",
    category: document?.category || "other",
    fileUrl: document?.fileUrl || "",
    type: document?.type || "pdf",
    fileSize: document?.fileSize || 0,
    mimeType: document?.mimeType || "application/pdf",
    uploadedBy: document?.uploadedBy || "",
    isConfidential: document?.isConfidential || false,
    tags: document?.tags || [],
    version: document?.version || 1,
    accessLog: document?.accessLog || [],
  });

  const [tagInput, setTagInput] = useState("");
  const uploadDocument = useUploadDocument();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const uploadFormData = new FormData();
    uploadFormData.append("file", new File([], "dummy"));
    uploadFormData.append("metadata", JSON.stringify(formData));
    uploadDocument.mutate(uploadFormData, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Document Name
          </label>
          <Input
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Document name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                category: e.target.value as DocumentCategory,
              }))
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Document description..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">File URL</label>
          <Input
            value={formData.fileUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fileUrl: e.target.value }))
            }
            placeholder="https://..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">File Type</label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  type: e.target.value as Document["type"],
                }))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="pdf">PDF</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="spreadsheet">Spreadsheet</option>
              <option value="document">Document</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              File Size (bytes)
            </label>
            <Input
              type="number"
              value={formData.fileSize}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  fileSize: parseInt(e.target.value) || 0,
                }))
              }
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Uploaded By</label>
          <Input
            value={formData.uploadedBy}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, uploadedBy: e.target.value }))
            }
            placeholder="User ID or name"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="confidential"
            checked={formData.isConfidential}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                isConfidential: e.target.checked,
              }))
            }
            className="rounded border-gray-300"
          />
          <label htmlFor="confidential" className="text-sm">
            Mark as confidential
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button type="button" variant="ghost" onClick={addTag}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags?.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
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
        <Button type="submit" disabled={uploadDocument.isPending}>
          {uploadDocument.isPending ? "Uploading..." : "Upload Document"}
        </Button>
      </div>
    </form>
  );
}
