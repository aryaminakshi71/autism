import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  FamilyCommunication,
  FamilyPortalAccess,
  HomeActivity,
} from "~/types/models";

// API Functions for Family Portal
const API_BASE = "/api/family-portal";

async function fetchFamilyAccess(
  patientId: string,
): Promise<FamilyPortalAccess[]> {
  const response = await fetch(`${API_BASE}/access?patientId=${patientId}`);
  if (!response.ok) throw new Error("Failed to fetch family access");
  return response.json();
}

async function fetchHomeActivities(patientId: string): Promise<HomeActivity[]> {
  const response = await fetch(`${API_BASE}/activities?patientId=${patientId}`);
  if (!response.ok) throw new Error("Failed to fetch activities");
  return response.json();
}

async function fetchCommunications(
  patientId: string,
): Promise<FamilyCommunication[]> {
  const response = await fetch(
    `${API_BASE}/communications?patientId=${patientId}`,
  );
  if (!response.ok) throw new Error("Failed to fetch communications");
  return response.json();
}

async function createCommunication(
  data: Partial<FamilyCommunication>,
): Promise<FamilyCommunication> {
  const response = await fetch(`${API_BASE}/communications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to send message");
  return response.json();
}

async function markCommunicationRead(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/communications/${id}/read`, {
    method: "PATCH",
  });
  if (!response.ok) throw new Error("Failed to mark as read");
}

// React Query Hooks
export function useFamilyAccess(patientId: string) {
  return useQuery({
    queryKey: ["family-access", patientId],
    queryFn: () => fetchFamilyAccess(patientId),
    enabled: !!patientId,
  });
}

export function useHomeActivities(patientId: string) {
  return useQuery({
    queryKey: ["home-activities", patientId],
    queryFn: () => fetchHomeActivities(patientId),
    enabled: !!patientId,
  });
}

export function useFamilyCommunications(patientId: string) {
  return useQuery({
    queryKey: ["family-communications", patientId],
    queryFn: () => fetchCommunications(patientId),
    enabled: !!patientId,
  });
}

export function useCreateCommunication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCommunication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["family-communications"] });
    },
  });
}

export function useMarkCommunicationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markCommunicationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["family-communications"] });
    },
  });
}
