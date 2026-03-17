/**
 * API Client for Mobile App
 * Handles all API requests with proper authentication
 */

import * as SecureStore from 'expo-secure-store';

// Base API URL - should be configured via environment
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8787';

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get authentication token from secure storage
   */
  private async getToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      return token;
    } catch {
      // Fallback to localStorage for demo mode
      return null;
    }
  }

  /**
   * Make an authenticated API request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = await this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          data: null as unknown as T,
          error: errorData.message || `HTTP error ${response.status}`,
        };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return {
        data: null as unknown as T,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    return this.request<T>(url, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Set authentication token
   */
  async setToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync('auth_token', token);
    } catch {
      // Fallback - token will be sent in Authorization header directly
    }
  }

  /**
   * Clear authentication token
   */
  async clearToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('auth_token');
    } catch {
      // Ignore errors
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export for creating custom instances
export { ApiClient };
