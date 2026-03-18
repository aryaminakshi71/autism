/**
 * API Hooks for Mobile App
 * Provides React hooks for data fetching with proper error handling
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/api-client';
import { authStore } from '../stores/auth-store';

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
  assignedTherapistId?: string;
  createdAt: string;
  updatedAt: string;
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
  description?: string;
  category: string;
  baselineValue: number;
  targetValue: number;
  currentValue: number;
  status: 'active' | 'mastered' | 'inactive';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  organizationId: string;
  patientId: string;
  patientName?: string;
  therapistId?: string;
  therapistName?: string;
  type: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  scheduledStart: string;
  scheduledEnd: string;
  location?: string;
  telehealth: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Hook for fetching patients list
 */
export function usePatients(page = 1, limit = 20) {
  const [data, setData] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<PaginatedResponse<Patient>>('/api/v1/patients', {
        page: String(page),
        limit: String(limit),
      });

      if (response.error) {
        setError(response.error);
      } else {
        setData(response.data.data || []);
        setTotal(response.data.total || 0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return { data, loading, error, total, refetch: fetchPatients };
}

/**
 * Hook for fetching a single patient
 */
export function usePatient(id: string) {
  const [data, setData] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPatient = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<Patient>(`/api/v1/patients/${id}`);

        if (response.error) {
          setError(response.error);
        } else {
          setData(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch patient');
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  return { data, loading, error };
}

/**
 * Hook for fetching patient statistics
 */
export function usePatientStats() {
  const [data, setData] = useState<PatientStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<PatientStats>('/api/v1/patients/stats');

      if (response.error) {
        setError(response.error);
      } else {
        setData(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { data, loading, error, refetch: fetchStats };
}

/**
 * Hook for fetching goals
 */
export function useGoals(patientId?: string) {
  const [data, setData] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: Record<string, string> = {
        page: '1',
        limit: '100',
      };
      if (patientId) {
        params.patientId = patientId;
      }

      const response = await apiClient.get<PaginatedResponse<Goal>>('/api/v1/goals', params);

      if (response.error) {
        setError(response.error);
      } else {
        setData(response.data.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return { data, loading, error, refetch: fetchGoals };
}

/**
 * Hook for fetching a single goal
 */
export function useGoal(id: string) {
  const [data, setData] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchGoal = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<Goal>(`/api/v1/goals/${id}`);

        if (response.error) {
          setError(response.error);
        } else {
          setData(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch goal');
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [id]);

  return { data, loading, error };
}

/**
 * Hook for fetching sessions
 */
export function useSessions(patientId?: string) {
  const [data, setData] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: Record<string, string> = {
        page: '1',
        limit: '50',
      };
      if (patientId) {
        params.patientId = patientId;
      }

      const response = await apiClient.get<PaginatedResponse<Session>>('/api/v1/sessions', params);

      if (response.error) {
        setError(response.error);
      } else {
        setData(response.data.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return { data, loading, error, refetch: fetchSessions };
}

/**
 * Hook for fetching a single session
 */
export function useSession(id: string) {
  const [data, setData] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchSession = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<Session>(`/api/v1/sessions/${id}`);

        if (response.error) {
          setError(response.error);
        } else {
          setData(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch session');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id]);

  return { data, loading, error };
}

/**
 * Hook for creating patients
 */
export function useCreatePatient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPatient = async (input: Partial<Patient>): Promise<Patient | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<Patient>('/api/v1/patients', input);

      if (response.error) {
        setError(response.error);
        return null;
      }

      return response.data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create patient';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createPatient, loading, error };
}

/**
 * Hook for creating goals
 */
export function useCreateGoal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGoal = async (input: Partial<Goal>): Promise<Goal | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<Goal>('/api/v1/goals', input);

      if (response.error) {
        setError(response.error);
        return null;
      }

      return response.data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create goal';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createGoal, loading, error };
}

/**
 * Hook for creating sessions
 */
export function useCreateSession() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = async (input: Partial<Session>): Promise<Session | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<Session>('/api/v1/sessions', input);

      if (response.error) {
        setError(response.error);
        return null;
      }

      return response.data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create session';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createSession, loading, error };
}

/**
 * Hook for updating patients
 */
export function useUpdatePatient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePatient = async (id: string, input: Partial<Patient>): Promise<Patient | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.patch<Patient>(`/api/v1/patients/${id}`, input);

      if (response.error) {
        setError(response.error);
        return null;
      }

      return response.data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update patient';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updatePatient, loading, error };
}

/**
 * Hook for updating goals
 */
export function useUpdateGoal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateGoal = async (id: string, input: Partial<Goal>): Promise<Goal | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.patch<Goal>(`/api/v1/goals/${id}`, input);

      if (response.error) {
        setError(response.error);
        return null;
      }

      return response.data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update goal';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateGoal, loading, error };
}

/**
 * Hook for deleting patients
 */
export function useDeletePatient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deletePatient = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.delete(`/api/v1/patients/${id}`);

      if (response.error) {
        setError(response.error);
        return false;
      }

      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete patient';
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deletePatient, loading, error };
}

/**
 * Hook for deleting goals
 */
export function useDeleteGoal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteGoal = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.delete(`/api/v1/goals/${id}`);

      if (response.error) {
        setError(response.error);
        return false;
      }

      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete goal';
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteGoal, loading, error };
}
