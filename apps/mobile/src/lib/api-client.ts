/**
 * API Client for Mobile App
 * Handles all API requests with proper authentication
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

// Base API URL - should be configured via environment
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8787";

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
      // First try secure store
      const token = await SecureStore.getItemAsync("auth_token");
      if (token) return token;

      // Fallback to AsyncStorage
      const stored = await AsyncStorage.getItem("auth_state");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.token || null;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Make an authenticated API request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = await this.getToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "x-demo-mode": "true", // Enable demo mode for testing
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
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
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    return this.request<T>(url, { method: "GET" });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  /**
   * Set authentication token
   */
  async setToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync("auth_token", token);
    } catch {
      // Fallback - also store in AsyncStorage
      try {
        const stored = await AsyncStorage.getItem("auth_state");
        const parsed = stored ? JSON.parse(stored) : {};
        parsed.token = token;
        await AsyncStorage.setItem("auth_state", JSON.stringify(parsed));
      } catch {
        // Ignore errors
      }
    }
  }

  /**
   * Clear authentication token
   */
  async clearToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync("auth_token");
    } catch {
      // Ignore errors
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export for creating custom instances
export { ApiClient };
