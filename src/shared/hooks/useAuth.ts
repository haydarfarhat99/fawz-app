import { useAuthStore } from '@stores/auth.store';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const setSession = useAuthStore((s) => s.setSession);
  const logout = useAuthStore((s) => s.logout);
  return {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isHydrated,
    setSession,
    logout,
  };
}
