import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Medication } from "~/types/models";

const API_BASE = "/api/medications";

async function fetchMedications(patientId: string): Promise<Medication[]> {
  const response = await fetch(`${API_BASE}?patientId=${patientId}`);
  if (!response.ok) throw new Error("Failed to fetch medications");
  return response.json();
}

async function fetchMedication(id: string): Promise<Medication> {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch medication");
  return response.json();
}

async function createMedication(
  data: Partial<Medication>,
): Promise<Medication> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create medication");
  return response.json();
}

async function updateMedication(
  id: string,
  data: Partial<Medication>,
): Promise<Medication> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update medication");
  return response.json();
}

async function deleteMedication(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete medication");
}

async function logMedication(
  medicationId: string,
  data: { status: string; takenTime?: string; notes?: string },
): Promise<void> {
  const response = await fetch(`${API_BASE}/${medicationId}/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to log medication");
}

// React Query Hooks
export function useMedications(patientId: string) {
  return useQuery({
    queryKey: ["medications", patientId],
    queryFn: () => fetchMedications(patientId),
    enabled: !!patientId,
  });
}

export function useMedication(id: string) {
  return useQuery({
    queryKey: ["medications", id],
    queryFn: () => fetchMedication(id),
    enabled: !!id,
  });
}

export function useCreateMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMedication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
    },
  });
}

export function useUpdateMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Medication> }) =>
      updateMedication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
    },
  });
}

export function useDeleteMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMedication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
    },
  });
}

export function useLogMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      medicationId,
      data,
    }: {
      medicationId: string;
      data: { status: string; takenTime?: string; notes?: string };
    }) => logMedication(medicationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
    },
  });
}
