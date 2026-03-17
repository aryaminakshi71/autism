/**
 * Authentication Store
 * Manages auth state with AsyncStorage for persistence
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../lib/api-client';

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  organizationId?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AUTH_STORAGE_KEY = 'auth_state';

// API base URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8787';

class AuthStore {
  private state: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  };

  private listeners: Array<(state: AuthState) => void> = [];

  constructor() {
    this.loadState();
  }

  /**
   * Load auth state from storage
   */
  private async loadState() {
    try {
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.state = {
          ...parsed,
          isLoading: false,
          isAuthenticated: !!parsed.token,
        };
        // Set token in API client
        if (parsed.token) {
          await apiClient.setToken(parsed.token);
        }
      } else {
        this.state.isLoading = false;
      }
    } catch (error) {
      console.error('Failed to load auth state:', error);
      this.state.isLoading = false;
    }
    this.notifyListeners();
  }

  /**
   * Save auth state to storage
   */
  private async saveState() {
    try {
      const toStore = {
        user: this.state.user,
        token: this.state.token,
        isAuthenticated: this.state.isAuthenticated,
      };
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(toStore));
    } catch (error) {
      console.error('Failed to save auth state:', error);
    }
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  /**
   * Get current state
   */
  getState(): AuthState {
    return this.state;
  }

  /**
   * Sign in with credentials - calls real API
   */
  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    this.state.isLoading = true;
    this.notifyListeners();

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        this.state = {
          user: data.user,
          token: data.token,
          isAuthenticated: true,
          isLoading: false,
        };
        await apiClient.setToken(data.token);
        await this.saveState();
        this.notifyListeners();
        return { success: true };
      } else {
        // If API fails, try demo mode fallback
        const error = await response.json().catch(() => ({ message: 'Login failed' }));
        return { success: false, error: error.message };
      }
    } catch (error) {
      this.state.isLoading = false;
      this.notifyListeners();
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error - make sure the API server is running',
      };
    }
  }

  /**
   * Register new user - calls real API
   */
  async signUp(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
    this.state.isLoading = true;
    this.notifyListeners();

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (response.ok) {
        const data = await response.json();

        this.state = {
          user: data.user,
          token: data.token,
          isAuthenticated: true,
          isLoading: false,
        };
        await apiClient.setToken(data.token);
        await this.saveState();
        this.notifyListeners();
        return { success: true };
      } else {
        const error = await response.json().catch(() => ({ message: 'Registration failed' }));
        this.state.isLoading = false;
        this.notifyListeners();
        return { success: false, error: error.message };
      }
    } catch (error) {
      this.state.isLoading = false;
      this.notifyListeners();
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    this.state = {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    };
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    await apiClient.clearToken();
    this.notifyListeners();
  }

  /**
   * Enable demo mode (offline fallback)
   */
  async enableDemoMode(): Promise<void> {
    const demoUser: User = {
      id: 'demo-user',
      email: 'demo@autism.app',
      name: 'Demo User',
      role: 'therapist',
      organizationId: 'demo-org',
    };

    this.state = {
      user: demoUser,
      token: 'demo-token',
      isAuthenticated: true,
      isLoading: false,
    };
    await apiClient.setToken('demo-token');
    await this.saveState();
    this.notifyListeners();
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<void> {
    if (!this.state.user) return;

    this.state.user = {
      ...this.state.user,
      ...updates,
    };
    await this.saveState();
    this.notifyListeners();
  }
}

// Export singleton instance
export const authStore = new AuthStore();
