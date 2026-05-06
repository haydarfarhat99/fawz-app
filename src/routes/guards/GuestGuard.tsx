import { Navigate } from 'react-router-dom';
import { useAuth } from '@shared/hooks/useAuth';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';

interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isHydrated } = useAuth();
  if (!isHydrated) return <LoadingOverlay visible label="Loading…" />;
  if (isAuthenticated) return <Navigate to="/home" replace />;
  return <>{children}</>;
}
