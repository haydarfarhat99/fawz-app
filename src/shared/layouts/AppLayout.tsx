import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomTabBar } from './BottomTabBar';
import { MobileTopActions } from './MobileTopActions';
import { OfflineBanner } from '@shared/components/OfflineBanner';
import { ShariaDisclosureModal } from '@features/onboarding/components/ShariaDisclosureModal';
import { useUIStore } from '@stores/ui.store';

const SHARIA_KEY = 'fawz.consent.sharia';

export function AppLayout() {
  const mobileSidebarOpen = useUIStore((s) => s.mobileSidebarOpen);
  const closeMobileSidebar = useUIStore((s) => s.closeMobileSidebar);
  const openMobileSidebar = useUIStore((s) => s.openMobileSidebar);
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
      <Sidebar open={mobileSidebarOpen} onClose={closeMobileSidebar} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header onMenuClick={openMobileSidebar} />
        <MobileTopActions />
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
