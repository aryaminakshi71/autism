/**
 * Goals API Endpoints
 */

import { apiClient } from '../api-client';

export interface Goal {
  id: string;
  organizationId: string;
  patientId: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  targetBehavior?: string;
  baselineValue: number;
  targetValue: number;
  currentValue: number;
  unit: string;
  masteryCriteria?: string;
  status: 'active' | 'mastered' | 'inactive';
  priority: 'high' | 'medium' | 'low';
  startDate: string;
  targetDate?: string;
  domain?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalInput {
  patientId: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  targetBehavior?: string;
  baselineValue: number;
  targetValue: number;
  unit: string;
  masteryCriteria?: string;
  priority?: 'high' | 'medium' | 'low';
  startDate: string;
  targetDate?: string;
  domain?: string;
}

export interface UpdateGoalInput extends Partial<CreateGoalInput> {
  currentValue?: number;
  status?: 'active' | 'mastered' | 'inactive';
}

export interface GoalsListResponse {
  data: Goal[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GoalProgress {
  goalId: string;
  currentValue: number;
  targetValue: number;
  progress: number; // percentage
  trend: 'improving' | 'stable' | 'declining';
}

export const goalsApi = {
  /**
   * Get all goals with pagination
   */
  list: async (page = 1, limit = 20, filters?: {
    patientId?: string;
    status?: string;
    priority?: string;
  }): Promise<GoalsListResponse> => {
    const params: Record<string, string> = {
      page: String(page),
      limit: String(limit),
    };
    if (filters?.patientId) params.patientId = filters.patientId;
    if (filters?.status) params.status = filters.status;
    if (filters?.priority) params.priority = filters.priority;

    const response = await apiClient.get<GoalsListResponse>('/goals', params);
    return response.data;
  },

  /**
   * Get single goal by ID
   */
  get: async (id: string): Promise<Goal> => {
    const response = await apiClient.get<Goal>(`/goals/${id}`);
    return response.data;
  },

  /**
   * Create new goal
   */
  create: async (input: CreateGoalInput): Promise<Goal> => {
    const response = await apiClient.post<Goal>('/goals', input);
    return response.data;
  },

  /**
   * Update existing goal
   */
  update: async (id: string, input: UpdateGoalInput): Promise<Goal> => {
    const response = await apiClient.patch<Goal>(`/goals/${id}`, input);
    return response.data;
  },

  /**
   * Update goal progress (current value)
   */
  updateProgress: async (id: string, currentValue: number): Promise<Goal> => {
    const response = await apiClient.patch<Goal>(`/goals/${id}/progress`, { currentValue });
    return response.data;
  },

  /**
   * Delete goal
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/goals/${id}`);
  },

  /**
   * Get goals for a specific patient
   */
  byPatient: async (patientId: string): Promise<Goal[]> => {
    const response = await apiClient.get<Goal[]>('/goals', { patientId });
    return response.data;
  },
};
