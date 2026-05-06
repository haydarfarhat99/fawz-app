import { ArrowRight, UserPlus, Sparkles } from 'lucide-react';
import { LuckClover3D } from '@shared/components/Icon3D';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '@stores/ui.store';
import { Button } from '@shared/components/Button';
import { formatNumber } from '@core/utils/formatters';
import { cn } from '@core/utils/cn';

interface NonWinnerOverlayProps {
  remainingEntries: number;
  onInvite: () => void;
  onViewResults: () => void;
}

export function NonWinnerOverlay({ remainingEntries, onInvite, onViewResults }: NonWinnerOverlayProps) {
  const { t } = useTranslation();
  const lang = useUIStore((s) => s.language);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/95 via-ink-900/95 to-ink-950/97 backdrop-blur-xl" />

      <FloatingSparkles />

      <div className="absolute -top-24 start-1/3 size-72 rounded-full bg-brand-500/30 blur-3xl animate-float" />
      <div className="absolute -bottom-24 end-1/3 size-72 rounded-full bg-info-500/20 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

      <div className="relative w-full max-w-md text-center text-white animate-scale-in">
        <div className="relative mx-auto mb-5">
          <div className="absolute inset-0 -z-10 blur-3xl bg-success-400/40 rounded-full" />
          <div
            className="mx-auto inline-block"
            style={{ animation: 'bounce-soft 2s ease-in-out infinite' }}
          >
            <LuckClover3D size={120} />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">
          {t('draws.goodLuckNextTime')}
        </h1>
        <p className="text-white/70 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
          {t('draws.youHaveEntries', {
            count: remainingEntries,
            formatted: formatNumber(remainingEntries, lang),
          })}
        </p>

        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3 text-start">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-ink-900 icon-3d">
              <UserPlus className="size-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-white">{t('draws.boostYourChances')}</div>
              <div className="text-xs text-white/60 mt-0.5">{t('draws.inviteFriendsForEntries')}</div>
            </div>
            <Sparkles className="size-4 text-gold-300 shrink-0" />
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <Button variant="gold" size="xl" fullWidth onClick={onInvite} iconStart={<UserPlus className="size-5" />}>
            {t('draws.inviteFriends')}
          </Button>
          <button
            type="button"
            onClick={onViewResults}
            className="inline-flex items-center justify-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors py-2"
          >
            {t('draws.viewFullResults')}
            <ArrowRight className="size-4 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}

function FloatingSparkles() {
  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'absolute size-1 rounded-full',
            i % 3 === 0 ? 'bg-brand-300' : i % 3 === 1 ? 'bg-info-300' : 'bg-white/60',
          )}
          style={{
            insetInlineStart: `${(i * 13 + 7) % 100}%`,
            top: `${(i * 17 + 11) % 100}%`,
            opacity: 0.6,
            boxShadow: '0 0 8px currentColor',
            animation: `float ${3 + (i % 3)}s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
