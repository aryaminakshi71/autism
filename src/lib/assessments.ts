import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Assessment } from "~/types/models";

const API_BASE = "/api/assessments";

async function fetchAssessments(patientId?: string): Promise<Assessment[]> {
  const url = patientId ? `${API_BASE}?patientId=${patientId}` : API_BASE;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch assessments");
  return response.json();
}

async function fetchAssessment(id: string): Promise<Assessment> {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch assessment");
  return response.json();
}

async function createAssessment(
  data: Partial<Assessment>,
): Promise<Assessment> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create assessment");
  return response.json();
}

async function updateAssessment(
  id: string,
  data: Partial<Assessment>,
): Promise<Assessment> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update assessment");
  return response.json();
}

async function deleteAssessment(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete assessment");
}

// React Query Hooks
export function useAssessments(patientId?: string) {
  return useQuery({
    queryKey: ["assessments", patientId],
    queryFn: () => fetchAssessments(patientId),
  });
}

export function useAssessment(id: string) {
  return useQuery({
    queryKey: ["assessments", id],
    queryFn: () => fetchAssessment(id),
    enabled: !!id,
  });
}

export function useCreateAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAssessment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      queryClient.invalidateQueries({
        queryKey: ["assessments", data.patientId],
      });
    },
  });
}

export function useUpdateAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Assessment> }) =>
      updateAssessment(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      queryClient.invalidateQueries({ queryKey: ["assessments", data.id] });
      queryClient.invalidateQueries({
        queryKey: ["assessments", data.patientId],
      });
    },
  });
}

export function useDeleteAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
  });
}
