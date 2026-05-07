import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell3D, Globe3D } from '@shared/components/Icon3D';
import { Avatar } from '@shared/components/Avatar';
import { useAuth } from '@shared/hooks/useAuth';
import { useUIStore } from '@stores/ui.store';
import { setLanguage } from '@core/i18n';
import { useUnreadCount } from '@features/notifications/services/notification.service';

interface PageMeta {
  titleKey: string;
  descriptionKey?: string;
}

const ROUTE_META: Array<{ match: (p: string) => boolean; meta: PageMeta }> = [
  { match: (p) => p === '/' || p.startsWith('/home'),       meta: { titleKey: 'nav.home' } },
  { match: (p) => p.startsWith('/entries'),                  meta: { titleKey: 'entries.title',       descriptionKey: 'entries.subtitle' } },
  { match: (p) => p.startsWith('/draws/results'),            meta: { titleKey: 'draws.resultsTitle',  descriptionKey: 'draws.resultsSubtitle' } },
  { match: (p) => p.startsWith('/draws/live'),               meta: { titleKey: 'draws.liveTitle' } },
  { match: (p) => p.startsWith('/draws/'),                   meta: { titleKey: 'draws.detailTitle' } },
  { match: (p) => p.startsWith('/challenges/'),              meta: { titleKey: 'challenges.detailTitle' } },
  { match: (p) => p.startsWith('/challenges'),               meta: { titleKey: 'challenges.title',    descriptionKey: 'challenges.subtitle' } },
  { match: (p) => p.startsWith('/referral/history'),         meta: { titleKey: 'referral.historyTitle' } },
  { match: (p) => p.startsWith('/referral'),                 meta: { titleKey: 'referral.title',      descriptionKey: 'referral.subtitle' } },
  { match: (p) => p.startsWith('/prizes'),                   meta: { titleKey: 'prizes.title',        descriptionKey: 'prizes.subtitle' } },
  { match: (p) => p.startsWith('/notifications/preferences'), meta: { titleKey: 'notifPrefs.title',   descriptionKey: 'notifPrefs.subtitle' } },
  { match: (p) => p.startsWith('/settings/notifications'),   meta: { titleKey: 'notifPrefs.title',    descriptionKey: 'notifPrefs.subtitle' } },
  { match: (p) => p.startsWith('/notifications'),            meta: { titleKey: 'notifications.title' } },
  { match: (p) => p.startsWith('/profile'),                  meta: { titleKey: 'profile.title',       descriptionKey: 'profile.subtitle' } },
  { match: (p) => p.startsWith('/more'),                     meta: { titleKey: 'more.title',          descriptionKey: 'more.subtitle' } },
  { match: (p) => p.startsWith('/support/disputes/new'),     meta: { titleKey: 'disputes.submitTitle',  descriptionKey: 'disputes.submitSubtitle' } },
  { match: (p) => p.startsWith('/support/disputes'),         meta: { titleKey: 'disputes.historyTitle', descriptionKey: 'disputes.historySubtitle' } },
];

function resolveMeta(pathname: string): PageMeta {
  return ROUTE_META.find((r) => r.match(pathname))?.meta ?? { titleKey: 'common.appName' };
}

export function MobileTopActions() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const lang = useUIStore((s) => s.language);
  const setStoreLanguage = useUIStore((s) => s.setLanguage);
  const { data: unreadCount = 0 } = useUnreadCount();

  const isHome = pathname === '/' || pathname === '/home';
  const meta = resolveMeta(pathname);

  const toggleLanguage = () => {
    const next = lang === 'en' ? 'ar' : 'en';
    setStoreLanguage(next);
    setLanguage(next);
  };

  return (
    <div className="lg:hidden px-4 pt-4">
      <div
        className="relative overflow-hidden rounded-3xl px-5 py-5 text-white shadow-[0_18px_44px_-18px_rgba(0,49,46,0.55)]"
        style={{ background: 'linear-gradient(135deg, #00C6A7 0%, #00766A 60%, #00312E 100%)' }}
      >
        {/* Action row — left: language, right: bell + avatar in a single subtle pill */}
        <div className="relative flex items-center justify-between gap-2 mb-5">
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={t('common.language')}
            className="relative inline-flex items-center justify-center transition-transform duration-150 active:scale-90"
          >
            <Globe3D size={36} />
            <span className="absolute -bottom-1 -end-1 inline-flex h-4 min-w-5 items-center justify-center rounded-full bg-gold-400 px-1 text-[9px] font-black text-ink-900 ring-2 ring-teal-700 tabular-nums">
              {lang === 'en' ? 'AR' : 'EN'}
            </span>
          </button>

          <div className="flex items-center gap-3 rounded-full bg-white/10 ring-1 ring-white/15 ps-2.5 pe-1.5 py-1.5 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => navigate('/notifications')}
              aria-label={t('nav.notifications')}
              className="relative inline-flex items-center justify-center transition-transform duration-150 active:scale-90"
            >
              <Bell3D size={28} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -end-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 text-[9px] font-black text-white px-1 ring-2 ring-teal-700 tabular-nums">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              aria-label={t('nav.profile')}
              className="relative inline-flex items-center justify-center transition-transform duration-150 active:scale-90"
            >
              <Avatar name={user?.fullName} src={user?.avatarUrl} size="md" />
            </button>
          </div>
        </div>

        <div className="relative flex items-center gap-4">
          <div className="relative shrink-0">
            <span className="absolute inset-0 -z-10 rounded-2xl bg-gold-300/25 blur-xl scale-110" />
            <img
              src="/brand/fawz-mark.png"
              alt="FAWZ"
              className="size-[72px] drop-shadow-[0_6px_14px_rgba(10,15,14,0.45)]"
            />
          </div>
          <div className="min-w-0 flex-1 leading-snug">
            {isHome ? (
              <>
                <p className="text-[10px] uppercase tracking-[0.22em] text-gold-200 font-bold mb-0.5">
                  {t('home.welcomeBack')}
                </p>
                <p className="text-xs text-white/75 mb-1">{t('home.brandTagline')}</p>
                <h1 className="text-xl font-black leading-tight truncate">
                  {user?.fullName ?? t('home.playerFallback')}
                </h1>
              </>
            ) : (
              <>
                <h1 className="text-xl font-black leading-tight">{t(meta.titleKey)}</h1>
                {meta.descriptionKey && (
                  <p className="text-xs text-white/80 leading-snug mt-1">{t(meta.descriptionKey)}</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
