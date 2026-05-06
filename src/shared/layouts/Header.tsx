import { LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@shared/hooks/useAuth';
import { useUIStore } from '@stores/ui.store';
import { setLanguage } from '@core/i18n';
import { Avatar } from '@shared/components/Avatar';
import { Logo } from '@shared/components/Logo';
import { Bell3D, Globe3D, Beaker3D } from '@shared/components/Icon3D';
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
  const dataSource = useUIStore((s) => s.dataSource);
  const toggleDataSource = useUIStore((s) => s.toggleDataSource);
  const { data: unreadCount = 0 } = useUnreadCount();

  const toggleLanguage = () => {
    const next = language === 'en' ? 'ar' : 'en';
    setStoreLanguage(next);
    setLanguage(next);
  };

  return (
    <header className="hidden lg:block sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-teal-100">
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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleDataSource}
            aria-label={t('common.dataSource.label')}
            title={
              dataSource === 'real'
                ? t('common.dataSource.tooltipReal')
                : t('common.dataSource.tooltipMock')
            }
            className="relative inline-flex items-center justify-center transition-transform duration-150 active:scale-90 hover:scale-105"
          >
            <Beaker3D size={36} />
            <span
              className="absolute -bottom-0.5 -end-0.5 inline-flex h-3.5 min-w-3.5 items-center justify-center rounded-full px-1 text-[8px] font-black ring-2 ring-white tabular-nums"
              style={
                dataSource === 'real'
                  ? { background: '#10b981', color: 'white' }
                  : { background: '#FFC94D', color: '#1a1a1a' }
              }
            >
              {dataSource === 'real' ? 'L' : 'M'}
            </span>
          </button>
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={t('common.language')}
            className="relative inline-flex items-center justify-center transition-transform duration-150 active:scale-90 hover:scale-105"
          >
            <Globe3D size={36} />
            <span className="absolute -bottom-0.5 -end-0.5 inline-flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-fawzgold-400 px-1 text-[9px] font-black text-ink-900 ring-2 ring-white tabular-nums">
              {language === 'en' ? 'AR' : 'EN'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/notifications')}
            aria-label={t('nav.notifications')}
            className="relative inline-flex items-center justify-center transition-transform duration-150 active:scale-90 hover:scale-105"
          >
            <Bell3D size={36} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -end-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 text-[10px] font-black text-white px-1 ring-2 ring-white tabular-nums">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            aria-label={t('nav.profile')}
            className="ms-1 inline-flex items-center justify-center rounded-full transition-transform duration-150 active:scale-90 hover:scale-105"
          >
            <Avatar name={user?.fullName} src={user?.avatarUrl} size="md" />
          </button>
          <button
            type="button"
            onClick={logout}
            className="hidden md:inline-flex size-10 items-center justify-center rounded-xl text-ink-500 hover:bg-danger-50 hover:text-danger-600 transition-colors ms-1"
            aria-label={t('common.logout')}
          >
            <LogOut className="size-5 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </header>
  );
}
