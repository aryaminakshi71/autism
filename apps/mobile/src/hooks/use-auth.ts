/**
 * useAuth Hook
 * React hook for authentication state
 */

import { useState, useEffect, useCallback } from 'react';
import { authStore, type User, type AuthState } from '../stores/auth-store';

export interface UseAuthReturn extends AuthState {
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  enableDemoMode: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>(authStore.getState());

  useEffect(() => {
    const unsubscribe = authStore.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    return authStore.signIn(email, password);
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    return authStore.signUp(email, password, name);
  }, []);

  const signOut = useCallback(async () => {
    return authStore.signOut();
  }, []);

  const enableDemoMode = useCallback(async () => {
    return authStore.enableDemoMode();
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    return authStore.updateProfile(updates);
  }, []);

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    enableDemoMode,
    updateProfile,
  };
}
