import { useEffect, useState } from 'react';
import { Share2, ArrowRight } from 'lucide-react';
import { Trophy3D } from '@shared/components/Icon3D';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '@stores/ui.store';
import { Button } from '@shared/components/Button';
import { useCountUp } from '@shared/hooks/useCountUp';
import { formatFawzNumber, formatNumber } from '@core/utils/formatters';
import { cn } from '@core/utils/cn';
import { Confetti } from './Confetti';
import type { WinnerTier } from '../types/draw.types';

interface WinnerOverlayProps {
  tier: WinnerTier;
  prizeIqd: number;
  fawzNumber: string;
  onShare: () => void;
  onViewResults: () => void;
}

export function WinnerOverlay({ tier, prizeIqd, fawzNumber, onShare, onViewResults }: WinnerOverlayProps) {
  const { t } = useTranslation();
  const lang = useUIStore((s) => s.language);
  const tierLabel = t(`draws.tier_${tier}` as const);
  const counted = useCountUp(prizeIqd, { durationMs: 1600, delayMs: 400 });
  const [shimmerOn, setShimmerOn] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setShimmerOn(true), 1500);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-gold-700/95 via-brand-900/95 to-ink-950/97 backdrop-blur-xl" />
      <Confetti count={120} />

      <div className="absolute -top-32 start-1/4 size-96 rounded-full bg-gold-400/40 blur-3xl animate-pulse-glow" />
      <div className="absolute -bottom-32 end-1/4 size-96 rounded-full bg-brand-400/40 blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />

      <div className="relative w-full max-w-md text-center text-white animate-scale-in">
        <div className="mx-auto mb-5 relative">
          <div className="absolute inset-0 -z-10 blur-3xl bg-gold-400/70 rounded-full animate-pulse-glow" />
          <div
            className="mx-auto inline-block"
            style={{ animation: 'trophy-pop 1s cubic-bezier(0.16, 1, 0.3, 1), bounce-soft 1.4s 1s infinite' }}
          >
            <Trophy3D size={144} />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-gold-200 text-xs font-bold mb-3">
          <span>{tierLabel}</span>
        </div>

        <h1
          className={cn(
            'text-4xl md:text-5xl font-black mb-1 tracking-tight bg-clip-text text-transparent',
            'bg-gradient-to-r from-white via-gold-200 to-white',
          )}
          style={{
            backgroundSize: '200% 100%',
            animation: shimmerOn ? 'shimmer-text 2.4s linear infinite' : undefined,
          }}
        >
          🎉 {t('draws.youWon')}
        </h1>
        <p className="text-white/70 text-sm mb-6">{t('draws.creditedToWallet')}</p>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 mb-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)]">
          <div className="text-[10px] uppercase tracking-[0.2em] text-gold-300 font-bold mb-2">
            {t('draws.prizeAmount')}
          </div>
          <div className="text-5xl md:text-6xl font-black text-gradient-gold leading-none mb-3 tabular-nums">
            {formatNumber(counted, lang)}
          </div>
          <div className="text-gold-300 font-semibold mb-4">{t('currency.iqd')}</div>
          <div className="border-t border-white/15 pt-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold mb-1.5">
              {t('draws.yourNumber')}
            </div>
            <div dir="ltr" className="text-2xl font-bold tabular-nums text-white">
              {formatFawzNumber(fawzNumber)}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <Button variant="gold" size="xl" fullWidth onClick={onShare} iconStart={<Share2 className="size-5" />}>
            {t('draws.shareWin')}
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
