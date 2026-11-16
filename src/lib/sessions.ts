import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "~/types/models";

const API_BASE = "/api/sessions";

async function fetchSessions(patientId?: string): Promise<Session[]> {
  const url = patientId ? `${API_BASE}?patientId=${patientId}` : API_BASE;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch sessions");
  return response.json();
}

async function fetchSession(id: string): Promise<Session> {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch session");
  return response.json();
}

async function createSession(data: Partial<Session>): Promise<Session> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create session");
  return response.json();
}

async function updateSession(
  id: string,
  data: Partial<Session>,
): Promise<Session> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update session");
  return response.json();
}

async function deleteSession(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete session");
}

// React Query Hooks
export function useSessions(patientId?: string) {
  return useQuery({
    queryKey: ["sessions", patientId],
    queryFn: () => fetchSessions(patientId),
  });
}

export function useSession(id: string) {
  return useQuery({
    queryKey: ["sessions", id],
    queryFn: () => fetchSession(id),
    enabled: !!id,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSession,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["sessions", data.patientId] });
    },
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Session> }) =>
      updateSession(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["sessions", data.id] });
      queryClient.invalidateQueries({ queryKey: ["sessions", data.patientId] });
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}
