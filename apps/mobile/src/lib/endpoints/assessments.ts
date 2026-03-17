/**
 * Assessments API Endpoints
 */

import { apiClient } from '../api-client';

export interface Assessment {
  id: string;
  organizationId: string;
  patientId: string;
  type: 'ADOS-2' | 'VB-MAPP' | 'PEP-R' | 'M-CHAT' | 'CARS-2' | 'SRS-2' | 'custom';
  name: string;
  provider?: string;
  version?: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  scheduledDate: string;
  completedDate?: string;
  administeredBy?: string;
  results?: Record<string, unknown>;
  recommendations?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssessmentInput {
  patientId: string;
  type: Assessment['type'];
  name: string;
  provider?: string;
  version?: string;
  scheduledDate: string;
  administeredBy?: string;
}

export interface UpdateAssessmentInput extends Partial<CreateAssessmentInput> {
  status?: 'scheduled' | 'in-progress' | 'completed';
  completedDate?: string;
  results?: Record<string, unknown>;
  recommendations?: string;
}

export interface AssessmentsListResponse {
  data: Assessment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const assessmentsApi = {
  /**
   * Get all assessments with pagination
   */
  list: async (page = 1, limit = 20, filters?: {
    patientId?: string;
    status?: string;
    type?: string;
  }): Promise<AssessmentsListResponse> => {
    const params: Record<string, string> = {
      page: String(page),
      limit: String(limit),
    };
    if (filters?.patientId) params.patientId = filters.patientId;
    if (filters?.status) params.status = filters.status;
    if (filters?.type) params.type = filters.type;

    const response = await apiClient.get<AssessmentsListResponse>('/assessments', params);
    return response.data;
  },

  /**
   * Get single assessment by ID
   */
  get: async (id: string): Promise<Assessment> => {
    const response = await apiClient.get<Assessment>(`/assessments/${id}`);
    return response.data;
  },

  /**
   * Create new assessment
   */
  create: async (input: CreateAssessmentInput): Promise<Assessment> => {
    const response = await apiClient.post<Assessment>('/assessments', input);
    return response.data;
  },

  /**
   * Update existing assessment
   */
  update: async (id: string, input: UpdateAssessmentInput): Promise<Assessment> => {
    const response = await apiClient.patch<Assessment>(`/assessments/${id}`, input);
    return response.data;
  },

  /**
   * Start assessment
   */
  start: async (id: string): Promise<Assessment> => {
    const response = await apiClient.patch<Assessment>(`/assessments/${id}/start`, {});
    return response.data;
  },

  /**
   * Complete assessment with results
   */
  complete: async (id: string, results: Record<string, unknown>, recommendations?: string): Promise<Assessment> => {
    const response = await apiClient.patch<Assessment>(`/assessments/${id}/complete`, {
      results,
      recommendations,
    });
    return response.data;
  },

  /**
   * Delete assessment
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/assessments/${id}`);
  },

  /**
   * Get assessments due soon
   */
  dueSoon: async (days = 7): Promise<Assessment[]> => {
    const response = await apiClient.get<Assessment[]>('/assessments/due-soon', { days: String(days) });
    return response.data;
  },

  /**
   * Get assessments for a patient
   */
  byPatient: async (patientId: string): Promise<Assessment[]> => {
    const response = await apiClient.get<Assessment[]>('/assessments', { patientId });
    return response.data;
  },
};
