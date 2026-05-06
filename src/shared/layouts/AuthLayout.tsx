import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { OfflineBanner } from '@shared/components/OfflineBanner';
import { DataSourceToggle } from '@shared/components/DataSourceToggle';

const AUTH_BG = '#0A0F0E radial-gradient(ellipse 90% 70% at 30% 20%, #00312E 0%, #0A0F0E 70%) no-repeat fixed';

export function AuthLayout() {
  useEffect(() => {
    const prevBody = document.body.style.background;
    const prevHtml = document.documentElement.style.background;
    document.body.style.background = AUTH_BG;
    document.documentElement.style.background = '#0A0F0E';
    return () => {
      document.body.style.background = prevBody;
      document.documentElement.style.background = prevHtml;
    };
  }, []);

  return (
    <div className="relative min-h-dvh">
      <div className="fixed -top-40 -end-40 size-[28rem] rounded-full bg-teal-500/20 blur-[120px] animate-float pointer-events-none" />
      <div className="fixed -bottom-40 -start-40 size-[28rem] rounded-full bg-gold-400/10 blur-[120px] animate-float pointer-events-none" style={{ animationDelay: '2s' }} />

      <OfflineBanner />

      <div className="fixed top-4 end-4 z-20">
        <DataSourceToggle variant="3d" />
      </div>

      <div className="relative flex min-h-dvh items-start lg:items-center justify-center px-4 pt-10 pb-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
