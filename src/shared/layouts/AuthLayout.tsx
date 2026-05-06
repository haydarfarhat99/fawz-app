import { Outlet } from 'react-router-dom';
import { Logo } from '@shared/components/Logo';
import { OfflineBanner } from '@shared/components/OfflineBanner';

export function AuthLayout() {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="absolute inset-0 -z-10 gradient-mesh" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-50/40 via-transparent to-gold-50/40" />

      <div className="absolute -top-32 -end-32 size-96 rounded-full bg-brand-300/30 blur-3xl animate-float" />
      <div className="absolute -bottom-32 -start-32 size-96 rounded-full bg-gold-300/30 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <OfflineBanner />

      <div className="relative flex min-h-dvh items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <Logo size="lg" />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
