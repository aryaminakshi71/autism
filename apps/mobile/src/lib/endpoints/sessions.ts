/**
 * Sessions API Endpoints
 */

import { apiClient } from "../api-client";

export interface Session {
  id: string;
  organizationId: string;
  patientId: string;
  therapistId?: string;
  type: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
  durationMinutes?: number;
  location?: string;
  room?: string;
  telehealth: boolean;
  mood?: "great" | "good" | "okay" | "struggling";
  energyLevel?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionInput {
  patientId: string;
  therapistId?: string;
  type: string;
  scheduledStart: string;
  scheduledEnd: string;
  location?: string;
  room?: string;
  telehealth?: boolean;
}

export interface UpdateSessionInput extends Partial<CreateSessionInput> {
  status?: "scheduled" | "in-progress" | "completed" | "cancelled";
  actualStart?: string;
  actualEnd?: string;
  mood?: "great" | "good" | "okay" | "struggling";
  energyLevel?: number;
  notes?: string;
}

export interface SessionsListResponse {
  data: Session[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const sessionsApi = {
  /**
   * Get all sessions with pagination
   */
  list: async (
    page = 1,
    limit = 20,
    filters?: {
      patientId?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<SessionsListResponse> => {
    const params: Record<string, string> = {
      page: String(page),
      limit: String(limit),
    };
    if (filters?.patientId) params.patientId = filters.patientId;
    if (filters?.status) params.status = filters.status;
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;

    const response = await apiClient.get<SessionsListResponse>(
      "/sessions",
      params,
    );
    return response.data;
  },

  /**
   * Get single session by ID
   */
  get: async (id: string): Promise<Session> => {
    const response = await apiClient.get<Session>(`/sessions/${id}`);
    return response.data;
  },

  /**
   * Create new session
   */
  create: async (input: CreateSessionInput): Promise<Session> => {
    const response = await apiClient.post<Session>("/sessions", input);
    return response.data;
  },

  /**
   * Update existing session
   */
  update: async (id: string, input: UpdateSessionInput): Promise<Session> => {
    const response = await apiClient.patch<Session>(`/sessions/${id}`, input);
    return response.data;
  },

  /**
   * Start session
   */
  start: async (id: string): Promise<Session> => {
    const response = await apiClient.patch<Session>(
      `/sessions/${id}/start`,
      {},
    );
    return response.data;
  },

  /**
   * Complete session
   */
  complete: async (id: string, notes?: string): Promise<Session> => {
    const response = await apiClient.patch<Session>(
      `/sessions/${id}/complete`,
      { notes },
    );
    return response.data;
  },

  /**
   * Cancel session
   */
  cancel: async (id: string, reason?: string): Promise<Session> => {
    const response = await apiClient.patch<Session>(`/sessions/${id}/cancel`, {
      reason,
    });
    return response.data;
  },

  /**
   * Delete session
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/sessions/${id}`);
  },

  /**
   * Get sessions for today
   */
  today: async (): Promise<Session[]> => {
    const response = await apiClient.get<Session[]>("/sessions/today");
    return response.data;
  },

  /**
   * Get upcoming sessions
   */
  upcoming: async (limit = 5): Promise<Session[]> => {
    const response = await apiClient.get<Session[]>("/sessions/upcoming", {
      limit: String(limit),
    });
    return response.data;
  },
};
