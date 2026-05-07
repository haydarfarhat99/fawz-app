import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OfflineBanner } from '@shared/components/OfflineBanner';
import { Globe3D } from '@shared/components/Icon3D';
import { useUIStore } from '@stores/ui.store';
import { setLanguage } from '@core/i18n';

const AUTH_BG = '#0A0F0E radial-gradient(ellipse 90% 70% at 30% 20%, #00312E 0%, #0A0F0E 70%) no-repeat fixed';

export function AuthLayout() {
  const { t } = useTranslation();
  const lang = useUIStore((s) => s.language);
  const setStoreLanguage = useUIStore((s) => s.setLanguage);

  const toggleLanguage = () => {
    const next = lang === 'en' ? 'ar' : 'en';
    setStoreLanguage(next);
    setLanguage(next);
  };

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
        <button
          type="button"
          onClick={toggleLanguage}
          aria-label={t('common.language')}
          className="relative inline-flex items-center justify-center transition-transform duration-150 active:scale-90 hover:scale-105"
        >
          <Globe3D size={44} />
          <span className="absolute -bottom-1 -end-1 inline-flex h-4 min-w-5 items-center justify-center rounded-full bg-gold-400 px-1 text-[9px] font-black text-ink-900 ring-2 ring-ink-900 tabular-nums">
            {lang === 'en' ? 'AR' : 'EN'}
          </span>
        </button>
      </div>

      <div className="relative flex min-h-dvh items-start lg:items-center justify-center px-4 pt-10 pb-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
