/**
 * API Hooks for Mobile App
 * Provides React hooks for data fetching with caching and offline support
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";

// Types
export interface Patient {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  diagnosis?: string;
  severityLevel?: string;
  primaryLanguage?: string;
  preferredCommunication?: string;
  status: string;
  createdAt: string;
}

export interface PatientStats {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
}

export interface Goal {
  id: string;
  organizationId: string;
  patientId: string;
  patientName?: string;
  name: string;
  category: string;
  baselineValue: number;
  targetValue: number;
  currentValue: number;
  status: "active" | "mastered" | "inactive";
  priority: "high" | "medium" | "low";
}

export interface Session {
  id: string;
  organizationId: string;
  patientId: string;
  patientName?: string;
  type: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  scheduledStart: string;
  scheduledEnd: string;
  location?: string;
  telehealth: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Headers for demo mode
const getHeaders = () => ({
  "Content-Type": "application/json",
  "x-demo-mode": "true",
});

// API Functions
const fetchPatients = async (page = 1, limit = 20) => {
  const response = await apiClient.get<PaginatedResponse<Patient>>(
    `/api/v1/patients?page=${page}&limit=${limit}`,
    getHeaders(),
  );
  return response.data;
};

const fetchPatientStats = async () => {
  const response = await apiClient.get<PatientStats>(
    "/api/v1/patients/stats",
    getHeaders(),
  );
  return response.data;
};

const fetchGoals = async (patientId?: string) => {
  const url = patientId
    ? `/api/v1/goals?patientId=${patientId}`
    : "/api/v1/goals";
  const response = await apiClient.get<PaginatedResponse<Goal>>(
    url,
    getHeaders(),
  );
  return response.data;
};

const fetchSessions = async (patientId?: string) => {
  const url = patientId
    ? `/api/v1/sessions?patientId=${patientId}`
    : "/api/v1/sessions";
  const response = await apiClient.get<PaginatedResponse<Session>>(
    url,
    getHeaders(),
  );
  return response.data;
};

const createPatient = async (input: Partial<Patient>) => {
  const response = await apiClient.post<Patient>(
    "/api/v1/patients",
    {
      ...input,
    },
    getHeaders(),
  );
  return response.data;
};

const createGoal = async (input: Partial<Goal>) => {
  const response = await apiClient.post<Goal>(
    "/api/v1/goals",
    input,
    getHeaders(),
  );
  return response.data;
};

const createSession = async (input: Partial<Session>) => {
  const response = await apiClient.post<Session>(
    "/api/v1/sessions",
    input,
    getHeaders(),
  );
  return response.data;
};

// React Query Hooks

export function usePatients(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["patients", page, limit],
    queryFn: () => fetchPatients(page, limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function usePatientStats() {
  return useQuery({
    queryKey: ["patients", "stats"],
    queryFn: fetchPatientStats,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGoals(patientId?: string) {
  return useQuery({
    queryKey: ["goals", patientId],
    queryFn: () => fetchGoals(patientId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSessions(patientId?: string) {
  return useQuery({
    queryKey: ["sessions", patientId],
    queryFn: () => fetchSessions(patientId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patients", "stats"] });
    },
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}
