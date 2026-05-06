import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setStoredToken } from '@core/network/apiClient';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: 'consumer' | 'merchant' | 'admin' | 'compliance' | 'operator';
  avatarUrl?: string;
  entryCount?: number;
  isNew?: boolean;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isHydrated: boolean;
  setSession: (user: AuthUser, token: string) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isHydrated: false,
      setSession: (user, token) => {
        setStoredToken(token);
        set({ user, token });
      },
      setUser: (user) => set({ user }),
      logout: () => {
        setStoredToken(null);
        set({ user: null, token: null });
      },
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'fawz.auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) setStoredToken(state.token);
        state?.setHydrated();
      },
    },
  ),
);
