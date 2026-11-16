/**
 * Visual Schedules API Endpoints
 */

import { apiClient } from "../api-client";

export interface ScheduleItem {
  time: string;
  activity: string;
  icon?: string;
  completed?: boolean;
}

export interface VisualSchedule {
  id: string;
  organizationId: string;
  patientId: string;
  name: string;
  description?: string;
  type: "daily" | "therapy" | "bedtime" | "school" | "custom";
  schedule: ScheduleItem[];
  isTemplate: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleInput {
  patientId: string;
  name: string;
  description?: string;
  type: "daily" | "therapy" | "bedtime" | "school" | "custom";
  schedule: ScheduleItem[];
  isTemplate?: boolean;
  isDefault?: boolean;
}

export interface UpdateScheduleInput extends Partial<CreateScheduleInput> {}

export interface SchedulesListResponse {
  data: VisualSchedule[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const schedulesApi = {
  /**
   * Get all schedules with pagination
   */
  list: async (
    page = 1,
    limit = 20,
    filters?: {
      patientId?: string;
      type?: string;
      isTemplate?: boolean;
    },
  ): Promise<SchedulesListResponse> => {
    const params: Record<string, string> = {
      page: String(page),
      limit: String(limit),
    };
    if (filters?.patientId) params.patientId = filters.patientId;
    if (filters?.type) params.type = filters.type;
    if (filters?.isTemplate !== undefined)
      params.isTemplate = String(filters.isTemplate);

    const response = await apiClient.get<SchedulesListResponse>(
      "/schedules",
      params,
    );
    return response.data;
  },

  /**
   * Get single schedule by ID
   */
  get: async (id: string): Promise<VisualSchedule> => {
    const response = await apiClient.get<VisualSchedule>(`/schedules/${id}`);
    return response.data;
  },

  /**
   * Create new schedule
   */
  create: async (input: CreateScheduleInput): Promise<VisualSchedule> => {
    const response = await apiClient.post<VisualSchedule>("/schedules", input);
    return response.data;
  },

  /**
   * Update existing schedule
   */
  update: async (
    id: string,
    input: UpdateScheduleInput,
  ): Promise<VisualSchedule> => {
    const response = await apiClient.patch<VisualSchedule>(
      `/schedules/${id}`,
      input,
    );
    return response.data;
  },

  /**
   * Mark schedule item as completed
   */
  toggleItemComplete: async (
    scheduleId: string,
    itemIndex: number,
  ): Promise<VisualSchedule> => {
    const response = await apiClient.patch<VisualSchedule>(
      `/schedules/${scheduleId}/item/${itemIndex}/toggle`,
      {},
    );
    return response.data;
  },

  /**
   * Delete schedule
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/schedules/${id}`);
  },

  /**
   * Get templates
   */
  templates: async (): Promise<VisualSchedule[]> => {
    const response = await apiClient.get<VisualSchedule[]>(
      "/schedules/templates",
    );
    return response.data;
  },

  /**
   * Get schedules for a patient
   */
  byPatient: async (patientId: string): Promise<VisualSchedule[]> => {
    const response = await apiClient.get<VisualSchedule[]>("/schedules", {
      patientId,
    });
    return response.data;
  },
};
