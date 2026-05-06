import { NavLink } from 'react-router-dom';
import { Home, Hash, Trophy, MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@core/utils/cn';

const items = [
  { to: '/home', icon: Home, key: 'home' as const },
  { to: '/entries', icon: Hash, key: 'myNumbers' as const },
  { to: '/challenges', icon: Trophy, key: 'challenges' as const },
  { to: '/profile', icon: MoreHorizontal, key: 'more' as const },
];

export function BottomTabBar() {
  const { t } = useTranslation();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/90 backdrop-blur-xl border-t border-ink-100 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4 max-w-md mx-auto">
        {items.map(({ to, icon: Icon, key }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                isActive ? 'text-brand-700' : 'text-ink-500 hover:text-ink-900',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'flex items-center justify-center size-9 rounded-2xl transition-all',
                    isActive
                      ? 'bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-[0_8px_18px_-6px_rgba(124,58,237,0.55)] -translate-y-0.5'
                      : 'text-ink-500',
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <span>{t(`nav.${key}`)}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
