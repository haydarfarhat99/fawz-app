import { Outlet } from 'react-router-dom';
import { OfflineBanner } from '@shared/components/OfflineBanner';
import { DataSourceToggle } from '@shared/components/DataSourceToggle';

export function AuthLayout() {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(ellipse at 30% 20%, #00312E 0%, #0A0F0E 70%)' }}
      />
      <div className="absolute -top-40 -end-40 size-[28rem] rounded-full bg-teal-500/20 blur-[120px] animate-float" />
      <div className="absolute -bottom-40 -start-40 size-[28rem] rounded-full bg-fawzgold-400/10 blur-[120px] animate-float" style={{ animationDelay: '2s' }} />

      <OfflineBanner />

      <div className="absolute top-4 end-4 z-20">
        <DataSourceToggle />
      </div>

      <div className="relative flex min-h-dvh items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
