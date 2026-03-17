/**
 * Patients API Endpoints
 */

import { apiClient } from '../api-client';

export interface Patient {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  diagnosis?: string;
  severityLevel?: string;
  primaryLanguage?: string;
  preferredCommunication?: string;
  status: string;
  assignedTherapistId?: string;
  guardianUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientInput {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  diagnosis?: string;
  severityLevel?: string;
  primaryLanguage?: string;
  preferredCommunication?: string;
}

export interface UpdatePatientInput extends Partial<CreatePatientInput> {
  status?: string;
  assignedTherapistId?: string;
}

export interface PatientsListResponse {
  data: Patient[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PatientStats {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
}

export const patientsApi = {
  /**
   * Get all patients with pagination
   */
  list: async (page = 1, limit = 20): Promise<PatientsListResponse> => {
    const response = await apiClient.get<PatientsListResponse>('/patients', {
      page: String(page),
      limit: String(limit),
    });
    return response.data;
  },

  /**
   * Get single patient by ID
   */
  get: async (id: string): Promise<Patient> => {
    const response = await apiClient.get<Patient>(`/patients/${id}`);
    return response.data;
  },

  /**
   * Create new patient
   */
  create: async (input: CreatePatientInput): Promise<Patient> => {
    const response = await apiClient.post<Patient>('/patients', input);
    return response.data;
  },

  /**
   * Update existing patient
   */
  update: async (id: string, input: UpdatePatientInput): Promise<Patient> => {
    const response = await apiClient.patch<Patient>(`/patients/${id}`, input);
    return response.data;
  },

  /**
   * Delete patient
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/patients/${id}`);
  },

  /**
   * Get patient statistics
   */
  stats: async (): Promise<PatientStats> => {
    const response = await apiClient.get<PatientStats>('/patients/stats');
    return response.data;
  },

  /**
   * Search patients
   */
  search: async (query: string): Promise<Patient[]> => {
    const response = await apiClient.get<Patient[]>('/patients', { search: query });
    return response.data;
  },
};
