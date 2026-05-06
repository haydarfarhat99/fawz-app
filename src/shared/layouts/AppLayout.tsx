import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomTabBar } from './BottomTabBar';
import { OfflineBanner } from '@shared/components/OfflineBanner';
import { ShariaDisclosureModal } from '@features/onboarding/components/ShariaDisclosureModal';

const SHARIA_KEY = 'fawz.consent.sharia';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shariaOpen, setShariaOpen] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(SHARIA_KEY) === 'true';
    if (!accepted) {
      const timer = window.setTimeout(() => setShariaOpen(true), 1200);
      return () => window.clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-dvh flex bg-transparent">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <OfflineBanner />
        <main className="flex-1 pb-20 lg:pb-0">
          <Outlet />
        </main>
        <BottomTabBar />
      </div>
      <ShariaDisclosureModal
        open={shariaOpen}
        onAccept={() => {
          localStorage.setItem(SHARIA_KEY, 'true');
          setShariaOpen(false);
        }}
        onDismiss={() => setShariaOpen(false)}
      />
    </div>
  );
}
