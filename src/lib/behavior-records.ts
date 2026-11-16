import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BehaviorRecord } from "~/types/models";

const API_BASE = "/api/behavior-records";

async function fetchBehaviorRecords(
  patientId: string,
  filters?: { startDate?: string; endDate?: string },
): Promise<BehaviorRecord[]> {
  let url = `${API_BASE}?patientId=${patientId}`;
  if (filters?.startDate) url += `&startDate=${filters.startDate}`;
  if (filters?.endDate) url += `&endDate=${filters.endDate}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch behavior records");
  return response.json();
}

async function fetchBehaviorRecord(id: string): Promise<BehaviorRecord> {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch behavior record");
  return response.json();
}

async function createBehaviorRecord(
  data: Partial<BehaviorRecord>,
): Promise<BehaviorRecord> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create behavior record");
  return response.json();
}

async function updateBehaviorRecord(
  id: string,
  data: Partial<BehaviorRecord>,
): Promise<BehaviorRecord> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update behavior record");
  return response.json();
}

async function deleteBehaviorRecord(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete behavior record");
}

// React Query Hooks
export function useBehaviorRecords(
  patientId: string,
  filters?: { startDate?: string; endDate?: string },
) {
  return useQuery({
    queryKey: ["behavior-records", patientId, filters],
    queryFn: () => fetchBehaviorRecords(patientId, filters),
    enabled: !!patientId,
  });
}

export function useBehaviorRecord(id: string) {
  return useQuery({
    queryKey: ["behavior-records", id],
    queryFn: () => fetchBehaviorRecord(id),
    enabled: !!id,
  });
}

export function useCreateBehaviorRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBehaviorRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["behavior-records"] });
    },
  });
}

export function useUpdateBehaviorRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BehaviorRecord> }) =>
      updateBehaviorRecord(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["behavior-records"] });
    },
  });
}

export function useDeleteBehaviorRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBehaviorRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["behavior-records"] });
    },
  });
}
