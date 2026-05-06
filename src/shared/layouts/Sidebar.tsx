import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home,
  Hash,
  Trophy,
  Tv,
  Gift,
  UserPlus,
  Bell,
  User,
  LifeBuoy,
} from 'lucide-react';
import { cn } from '@core/utils/cn';
import { Logo } from '@shared/components/Logo';

const items = [
  { to: '/home', icon: Home, key: 'home' as const },
  { to: '/draws/results', icon: Tv, key: 'draws' as const },
  { to: '/entries', icon: Hash, key: 'myNumbers' as const },
  { to: '/challenges', icon: Trophy, key: 'challenges' as const },
  { to: '/referral', icon: UserPlus, key: 'referral' as const },
  { to: '/prizes', icon: Gift, key: 'prizes' as const },
  { to: '/notifications', icon: Bell, key: 'notifications' as const },
  { to: '/profile', icon: User, key: 'profile' as const },
  { to: '/support/disputes', icon: LifeBuoy, key: 'support' as const },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { t } = useTranslation();
  return (
    <>
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-ink-900/40 backdrop-blur-sm z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          'fixed lg:sticky top-0 z-50 lg:z-10 h-dvh lg:h-screen w-72 shrink-0',
          'bg-white border-e border-ink-100 transition-transform duration-300',
          'lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full lg:!translate-x-0',
        )}
      >
        <div className="px-6 h-16 flex items-center border-b border-ink-100">
          <Logo size="md" />
        </div>
        <nav className="px-3 py-5 space-y-0.5 overflow-y-auto h-[calc(100%-4rem)]">
          {items.map(({ to, icon: Icon, key }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-brand-50 to-brand-100/60 text-brand-700 shadow-sm'
                    : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'flex items-center justify-center size-8 rounded-lg transition-colors',
                      isActive
                        ? 'bg-gradient-to-br from-brand-500 to-brand-700 text-white'
                        : 'bg-ink-100 text-ink-600',
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span>{t(`nav.${key}`)}</span>
                  {isActive && (
                    <span className="ms-auto size-1.5 rounded-full bg-brand-500" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
