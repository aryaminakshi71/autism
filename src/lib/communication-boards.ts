import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CommunicationBoard } from "~/types/models";

const API_BASE = "/api/communication-boards";

async function fetchCommunicationBoards(
  patientId: string,
): Promise<CommunicationBoard[]> {
  const response = await fetch(`${API_BASE}?patientId=${patientId}`);
  if (!response.ok) throw new Error("Failed to fetch communication boards");
  return response.json();
}

async function fetchCommunicationBoard(
  id: string,
): Promise<CommunicationBoard> {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch communication board");
  return response.json();
}

async function createCommunicationBoard(
  data: Partial<CommunicationBoard>,
): Promise<CommunicationBoard> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create communication board");
  return response.json();
}

async function updateCommunicationBoard(
  id: string,
  data: Partial<CommunicationBoard>,
): Promise<CommunicationBoard> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update communication board");
  return response.json();
}

async function deleteCommunicationBoard(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete communication board");
}

// React Query Hooks
export function useCommunicationBoards(patientId: string) {
  return useQuery({
    queryKey: ["communication-boards", patientId],
    queryFn: () => fetchCommunicationBoards(patientId),
    enabled: !!patientId,
  });
}

export function useCommunicationBoard(id: string) {
  return useQuery({
    queryKey: ["communication-boards", id],
    queryFn: () => fetchCommunicationBoard(id),
    enabled: !!id,
  });
}

export function useCreateCommunicationBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCommunicationBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communication-boards"] });
    },
  });
}

export function useUpdateCommunicationBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: { id: string; data: Partial<CommunicationBoard> }) =>
      updateCommunicationBoard(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communication-boards"] });
    },
  });
}

export function useDeleteCommunicationBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCommunicationBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communication-boards"] });
    },
  });
}
