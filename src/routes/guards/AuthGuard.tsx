import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@shared/hooks/useAuth';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isHydrated } = useAuth();
  const location = useLocation();

  if (!isHydrated) {
    return <LoadingOverlay visible label="Loading…" />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}
