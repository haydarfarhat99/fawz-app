import { Bell, LogOut, Languages, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@shared/hooks/useAuth';
import { useUIStore } from '@stores/ui.store';
import { setLanguage } from '@core/i18n';
import { Avatar } from '@shared/components/Avatar';
import { Logo } from '@shared/components/Logo';
import { useUnreadCount } from '@features/notifications/services/notification.service';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const language = useUIStore((s) => s.language);
  const setStoreLanguage = useUIStore((s) => s.setLanguage);
  const { data: unreadCount = 0 } = useUnreadCount();

  const toggleLanguage = () => {
    const next = language === 'en' ? 'ar' : 'en';
    setStoreLanguage(next);
    setLanguage(next);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-ink-100">
      <div className="flex items-center justify-between gap-3 h-16 px-4 md:px-6">
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              className="lg:hidden inline-flex size-10 items-center justify-center rounded-xl hover:bg-ink-100 transition-colors"
              aria-label="Menu"
            >
              <Menu className="size-5" />
            </button>
          )}
          <Logo size="md" />
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex h-10 items-center gap-1.5 px-3 rounded-xl text-sm font-medium text-ink-700 hover:bg-ink-100 transition-colors"
            aria-label={t('common.language')}
          >
            <Languages className="size-4" />
            <span>{language === 'en' ? 'AR' : 'EN'}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/notifications')}
            className="relative inline-flex size-10 items-center justify-center rounded-xl text-ink-700 hover:bg-ink-100 transition-colors"
            aria-label={t('nav.notifications')}
          >
            <Bell className="size-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -end-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-br from-danger-500 to-danger-600 text-[10px] font-black text-white px-1 ring-2 ring-white tabular-nums">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="inline-flex items-center gap-2 rounded-xl px-1.5 py-1 hover:bg-ink-100 transition-colors"
          >
            <Avatar name={user?.fullName} src={user?.avatarUrl} size="sm" />
          </button>
          <button
            type="button"
            onClick={logout}
            className="hidden md:inline-flex size-10 items-center justify-center rounded-xl text-ink-500 hover:bg-danger-50 hover:text-danger-600 transition-colors"
            aria-label={t('common.logout')}
          >
            <LogOut className="size-5 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </header>
  );
}
