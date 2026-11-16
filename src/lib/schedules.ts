import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { VisualSchedule } from "~/types/models";

const API_BASE = "/api/schedules";

async function fetchSchedules(patientId: string): Promise<VisualSchedule[]> {
  const response = await fetch(`${API_BASE}?patientId=${patientId}`);
  if (!response.ok) throw new Error("Failed to fetch schedules");
  return response.json();
}

async function fetchSchedule(id: string): Promise<VisualSchedule> {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch schedule");
  return response.json();
}

async function createSchedule(
  data: Partial<VisualSchedule>,
): Promise<VisualSchedule> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create schedule");
  return response.json();
}

async function updateSchedule(
  id: string,
  data: Partial<VisualSchedule>,
): Promise<VisualSchedule> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update schedule");
  return response.json();
}

async function deleteSchedule(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete schedule");
}

// React Query Hooks
export function useSchedules(patientId: string) {
  return useQuery({
    queryKey: ["schedules", patientId],
    queryFn: () => fetchSchedules(patientId),
    enabled: !!patientId,
  });
}

export function useSchedule(id: string) {
  return useQuery({
    queryKey: ["schedules", id],
    queryFn: () => fetchSchedule(id),
    enabled: !!id,
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<VisualSchedule> }) =>
      updateSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
}
