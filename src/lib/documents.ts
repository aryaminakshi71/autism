import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Document, DocumentFolder } from "~/types/models";

const API_BASE = "/api/documents";

async function fetchDocuments(
  patientId: string,
  folderId?: string,
): Promise<Document[]> {
  let url = `${API_BASE}?patientId=${patientId}`;
  if (folderId) url += `&folderId=${folderId}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch documents");
  return response.json();
}

async function fetchDocument(id: string): Promise<Document> {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch document");
  return response.json();
}

async function uploadDocument(formData: FormData): Promise<Document> {
  const response = await fetch(API_BASE, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to upload document");
  return response.json();
}

async function deleteDocument(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete document");
}

async function fetchFolders(patientId: string): Promise<DocumentFolder[]> {
  const response = await fetch(`${API_BASE}/folders?patientId=${patientId}`);
  if (!response.ok) throw new Error("Failed to fetch folders");
  return response.json();
}

// React Query Hooks
export function useDocuments(patientId: string, folderId?: string) {
  return useQuery({
    queryKey: ["documents", patientId, folderId],
    queryFn: () => fetchDocuments(patientId, folderId),
    enabled: !!patientId,
  });
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: ["documents", id],
    queryFn: () => fetchDocument(id),
    enabled: !!id,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

export function useDocumentFolders(patientId: string) {
  return useQuery({
    queryKey: ["document-folders", patientId],
    queryFn: () => fetchFolders(patientId),
    enabled: !!patientId,
  });
}
